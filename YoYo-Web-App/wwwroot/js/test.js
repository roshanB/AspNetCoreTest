"use strict";

var YoYoTestModule = (function (jQuery, global) {

    function handleStartTest() {
        if (!isTestInProgress && !global.isTestStopped && !global.isTestEnded) {
            startTest();
        }
    }

    function handleAthleteWarn() {
        let athId = jQuery(this).closest('[data-athid]').attr('data-athid');
        global.currentTestStatus.athletes[athId].isWarned = true;
        jQuery(this).text('Warned').attr('disabled', 'disabled');
    }

    function handleAthleteStop() {
        let athId = jQuery(this).closest('[data-athid]').attr('data-athid');
        global.currentTestStatus.athletes[athId].isStopped = true;
        let anyRunningAthl = Object.values(global.currentTestStatus.athletes).some(ath => !ath.isStopped);
        global.isTestStopped = !anyRunningAthl;
        if (global.isTestStopped) {
            testWorker.postMessage({ cmd: 'stop_test' });
        }
        isTestInProgress = !global.isTestStopped;

        let athleteScore;
        if (global.currentTestStatus.isShuttleFinished) {
            athleteScore = getResult(global.currentShuttle);
        }
        else {
            let previousShuttle = global.currentShuttleCounter > 1 ? global.testDataMap[global.currentShuttleCounter - 1] : null;
            athleteScore = previousShuttle ? getResult(previousShuttle) : 'NA';
        }
        global.currentTestStatus.athletes[athId].result = athleteScore;

        let divHandleTestRow = $testDivsHandleTest.filter((data, div) => div.getAttribute("data-athid") === athId);
        divHandleTestRow.find('.warn').hide();
        divHandleTestRow.find('.stop').hide();
        divHandleTestRow.find('.results select').show().val(athleteScore);
    }

    function getResult(shuttle) {
        return shuttle.speedLevel + '-' + shuttle.shuttleNo;
    }

    function handleEndTest() {
        isTestInProgress = false;
        $stopBtns.hide();
        $warnBtns.hide();
        $resultsSelects.show();

        Object.keys(global.currentTestStatus.athletes).forEach(key => {
            if (!global.currentTestStatus.athletes[key].isStopped) {
                global.currentTestStatus.athletes[key].isStopped = true;
                global.currentTestStatus.athletes[key].result = getResult(global.currentShuttle);
                let divHandleTestRow = $testDivsHandleTest.filter((data, div) => div.getAttribute("data-athid") === key);
                divHandleTestRow.find('.results select').val(global.currentTestStatus.athletes[key].result);
            }
        });
        $btnSubmitResult.show();
    }

    function percentageToDegrees(percentage) {
        return percentage / 100 * 360;
    }

    function updateProgressBar(percentCompleted) {
        if (percentCompleted <= 50) {
            $progressRight.css('transform', 'rotate(' + percentageToDegrees(percentCompleted) + 'deg)');
        } else {
            $progressRight.css('transform', 'rotate(180deg)')
            $progressLeft.css('transform', 'rotate(' + percentageToDegrees(percentCompleted - 50) + 'deg)');
        }
    }

    function updateUI(percentCompleted, speedLevel, shuttleNo, speed, passedMMSS, distanceCovered, nextShuttleIn) {
        updateProgressBar(percentCompleted);
        $spnLevel.text(speedLevel);
        $spnShuttleNo.text(shuttleNo);
        $spnSpeed.text(speed);
        $spnTotalTime.text(passedMMSS);
        $spnTotalDistance.text(distanceCovered);
        $spnNextShuttle.text(nextShuttleIn);
    }

    function runTest() {

        var millsPassed = 100,
            ranShuttleForMS = 100,
            distanceCovered = 0,
            justRanLastHundred = false, // when consumed, athlete had ran his last 100 MS of current shuttle
            levelTimeMS = parseFloat(this.currentShuttle.levelTime) * 1000,
            isWorker = this.constructor.name === 'DedicatedWorkerGlobalScope';

        return function () {

            if (this.isTestStopped) {
                clearInterval(this.intervalObj);
                if (isWorker) {
                    postMessage({ cmd: 'end_test' });
                }
                else {
                    handleEndTest();
                }
                return;
            }

            var passedMilsDt = new Date(millsPassed),
                passedMMSS = passedMilsDt.toISOString().substr(14, 5),
                isShuttleFinished = levelTimeMS === ranShuttleForMS;


            if (this.nextShuttle && this.nextShuttle.startTime === passedMMSS) {
                //start a new shuttle
                isShuttleFinished = false;
                ranShuttleForMS = 100;
                justRanLastHundred = false;
                this.currentShuttleCounter++;
                this.currentShuttle = this.nextShuttle;
                this.nextShuttle = this.testDataMap[this.currentShuttleCounter + 1];

                if (isWorker) {
                    postMessage({
                        cmd: 'next_shuttle',
                        currentShuttleCounter: this.currentShuttleCounter,
                        currentShuttle: this.currentShuttle, nextShuttle: this.nextShuttle
                    });
                }

                levelTimeMS = parseFloat(this.currentShuttle.levelTime) * 1000;
            }
            else {
                if (!isShuttleFinished) {
                    let shuttleSpeedMMS = (this.currentShuttle.speed * 1000) / 3600000;
                    // Note: In schema for second shuttle, shuttleSpeedMMS * levelTimeMS = 41.66666666666667
                    // which is inconsistent, coz shuttle is 40m long, hence the following check
                    if ((distanceCovered + (shuttleSpeedMMS * 100)) > +this.currentShuttle.accumulatedShuttleDistance) {
                        //Don't add the distance in distance covered, as shuttle distance is already covered
                    } else {
                        distanceCovered += (shuttleSpeedMMS * 100);
                    }

                    justRanLastHundred = levelTimeMS - ranShuttleForMS === 100;
                    ranShuttleForMS += 100;
                } else {
                    if (justRanLastHundred) {
                        distanceCovered = +this.currentShuttle.accumulatedShuttleDistance;
                        justRanLastHundred = false;
                    }
                    this.isTestEnded = (!this.nextShuttle && millsPassed === this.totalTestTimeMS) || this.isTestStopped;
                }
            }

            if (millsPassed % 1000 === 0 || this.isTestEnded) {

                if (this.nextShuttle) {
                    var nextShuttleStartMMSS = this.nextShuttle.startTime,
                        nextShuttleStartMMSSSplit = nextShuttleStartMMSS.split(':'),
                        passedMMSSSplit = passedMMSS.split(':'),
                        nextShuttleIn = ((new Date(0, 0, 0, 0, nextShuttleStartMMSSSplit[0], nextShuttleStartMMSSSplit[1]) -
                            new Date(0, 0, 0, 0, passedMMSSSplit[0], passedMMSSSplit[1])) / 1000),
                        txtNextShuttleIn = '00:' + (nextShuttleIn < 10 ? '0' + nextShuttleIn + ' s' : nextShuttleIn + ' s');
                }
                else {
                    txtNextShuttleIn = 'NA';
                }

                let percentCompleted = (millsPassed / this.totalTestTimeMS) * 100;

                if (isWorker) {
                    postMessage({
                        cmd: 'update_ui', percentCompleted, speedLevel: currentShuttle.speedLevel,
                        shuttleNo: currentShuttle.shuttleNo, speed: currentShuttle.speed,
                        passedMMSS, distanceCovered: Math.floor(distanceCovered),
                        nextShuttleIn: txtNextShuttleIn
                    });
                } else {
                    updateUI(percentCompleted, currentShuttle.speedLevel,
                        currentShuttle.shuttleNo, currentShuttle.speed, passedMMSS, Math.floor(distanceCovered), txtNextShuttleIn);
                }

                /*
                console.log(
                    ' Mills passed: ' + millsPassed
                    + ' | Level: ' + this.currentShuttle.speedLevel
                    + ' | Shuttle: ' + this.currentShuttle.shuttleNo
                    + ' | Speed: ' + this.currentShuttle.speed
                    + ' | Next Shuttle In: ' + nextShuttleIn + 's'
                    + ' | Total Time: ' + passedMMSS
                    + ' | Total Distance: ' + Math.floor(distanceCovered) + 'm'
                    + ' | Percentage Completed: ' + percentCompleted + '%');*/

                this.currentTestStatus.isShuttleFinished = isShuttleFinished;
                if (isWorker) {
                    postMessage({ cmd: 'is_shuttle_finished', isShuttleFinished });
                }

                if (this.isTestEnded) {
                    clearInterval(this.intervalObj);
                    if (isWorker) {
                        postMessage({ cmd: 'end_test' });
                    } else {
                        handleEndTest();
                    }
                    return;
                }
            }
            millsPassed += 100;
        }
    }

    function startTest() {
        isTestInProgress = true;
        $stopBtns.show();
        $warnBtns.show();
        $startButton.hide();
        $testStatusData.show();

        if (testWorker) {
            testWorker.postMessage({ cmd: 'start_test', runTest: JSONfn.stringify(runTest) });

            testWorker.onmessage = function (e) {
                switch (e.data.cmd) {
                    case 'end_test':
                        global.isTestEnded = true;
                        handleEndTest();
                        testWorker.terminate();
                        break;
                    case 'next_shuttle':
                        global.currentShuttleCounter = e.data.currentShuttleCounter;
                        global.currentShuttle = e.data.currentShuttle;
                        global.nextShuttle = e.data.nextShuttle;
                        break;
                    case 'is_shuttle_finished':
                        global.currentTestStatus.isShuttleFinished = e.data.isShuttleFinished;
                        break;
                    case 'update_ui':
                        const { percentCompleted, speedLevel, shuttleNo, speed, passedMMSS, distanceCovered, nextShuttleIn } = e.data;
                        updateUI(percentCompleted, speedLevel, shuttleNo, speed, passedMMSS, distanceCovered, nextShuttleIn);
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            global.intervalObj = setInterval(runTest.bind(global)(), 100);
        }
    }

    global.testDataMap = undefined;
    global.currentShuttle = undefined;
    global.nextShuttle = undefined;
    global.isTestStopped = undefined;
    global.currentShuttleCounter = undefined;
    global.isTestEnded = undefined;
    global.currentTestStatus = {
        athletes: {}
    };
    global.totalTestTimeMS = undefined;

    var $testStatus,
        $spnNextShuttle,
        $spnTotalTime,
        $spnTotalDistance,
        isTestInProgress,
        $progressLeft,
        $progressRight,
        $stopBtns,
        $warnBtns,
        $testDivsHandleTest,
        $resultsSelects,
        $startButton,
        $testStatusData,
        $spnLevel,
        $spnShuttleNo,
        $spnSpeed,
        $btnSubmitResult,
        testWorker;

    return {
        loadTestData: function (testData) {
            global.testDataMap = testData.reduce((acc, curr, idx) => { acc[++idx] = curr; return acc; }, {});
        },
        init: function (options) {
            $testStatus = jQuery(options.testStatus);
            $spnNextShuttle = jQuery(options.spnNextShuttle);
            $spnTotalTime = jQuery(options.spnTotalTime);
            $spnTotalDistance = jQuery(options.spnTotalDistance);
            $progressLeft = jQuery('.progress-left .progress-bar');
            $progressRight = jQuery('.progress-right .progress-bar');
            $stopBtns = jQuery(options.stop);
            $warnBtns = jQuery(options.warn);
            $testDivsHandleTest = jQuery('#frmTest .handle-test');
            $resultsSelects = jQuery('#frmTest select');
            $startButton = jQuery(options.startButton);
            $testStatusData = jQuery(options.testStatusData);
            $spnLevel = jQuery(options.spnLevel);
            $spnShuttleNo = jQuery(options.spnShuttleNo);
            $spnSpeed = jQuery(options.spnSpeed);
            $btnSubmitResult = jQuery(options.btnSubmitResult);

            $testStatus.bind('click', handleStartTest);

            $stopBtns.bind('click', handleAthleteStop);
            $warnBtns.bind('click', handleAthleteWarn);

            global.currentShuttleCounter = 1;
            global.currentShuttle = global.testDataMap[global.currentShuttleCounter];
            global.nextShuttle = global.testDataMap[global.currentShuttleCounter + 1];

            let lastShuttleCommTimeSplit = global.testDataMap[Object.keys(global.testDataMap).length].commulativeTime.split(':');
            global.totalTestTimeMS = ((parseInt(lastShuttleCommTimeSplit[0] !== '00' ? lastShuttleCommTimeSplit[0] : 0) * 60 * 1000) + (parseInt(lastShuttleCommTimeSplit[1]) * 1000));


            jQuery("[data-athid]").toArray().reduce((acc, curr) => {
                global.currentTestStatus.athletes[curr.getAttribute('data-athid')] = { isWarned: false, isStopped: false, result: '' };
                return global.currentTestStatus.athletes;
            }, {});

            if (options.useWorker) {
                testWorker = new Worker("js/test_worker.js");
                testWorker.postMessage({
                    cmd: 'init_test',
                    testDataMap: global.testDataMap,
                    currentShuttle: global.currentShuttle,
                    nextShuttle: global.nextShuttle,
                    currentShuttleCounter: global.currentShuttleCounter,
                    currentTestStatus: global.currentTestStatus,
                    totalTestTimeMS: global.totalTestTimeMS
                });
            }
        }
    }

})($, window);

$(document).ready(function () {

    fetch('http://localhost:5000/api/test/gettestdata')
        .then(response => response.json())
        .then(testData => {
            YoYoTestModule.loadTestData(testData);
            YoYoTestModule.init({
                testStatus: '#divProgress',
                spnNextShuttle: '#spnNextShuttle',
                spnTotalTime: '#spnTotalTime',
                spnTotalDistance: '#spnTotalDist',
                warn: '.warn',
                stop: '.stop',
                startButton: '#test-status-start-button',
                testStatusData: '#test-status-data',
                spnLevel: '#spnLevel',
                spnShuttleNo: '#spnShuttleNo',
                spnSpeed: '#spnSpeed',
                btnSubmitResult: '#btnSubmitResult',
                useWorker: typeof (Worker) !== "undefined"
            });
        });
});
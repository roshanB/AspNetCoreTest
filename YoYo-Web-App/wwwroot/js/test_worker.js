importScripts('../lib/JSONfn/JSONfn.js');

var testDataMap,
    currentShuttle,
    nextShuttle,
    isTestStopped,
    currentShuttleCounter,
    isTestEnded,
    currentTestStatus,
    totalTestTimeMS;

self.onmessage = function (e) {
    switch (e.data.cmd) {
        case 'init_test':
            const { testDataMap, currentShuttle, nextShuttle, currentShuttleCounter, currentTestStatus, totalTestTimeMS } = e.data;
            
            self.testDataMap = testDataMap;
            self.currentShuttle = currentShuttle;
            self.nextShuttle = nextShuttle;
            self.currentShuttleCounter = currentShuttleCounter;
            self.currentTestStatus = currentTestStatus;
            self.totalTestTimeMS = totalTestTimeMS;

            break;
        case 'start_test':            
            const runTest = JSONfn.parse(e.data.runTest);
            this.intervalObj = setInterval(runTest.bind(this)(), 100);            
            break;
        case 'stop_test':
            self.isTestStopped = true;
        default:
            break;
    }
}
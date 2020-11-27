using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using YoYoTest.Business.Athletes;
using YoYoTest.Business.Common.Interfaces;
using YoYoTest.Business.Common.Vms;

namespace YoYo_Web_App.Controllers
{
    public class TestController : Controller
    {
        private readonly ITestService _testService;
        private readonly IAthleteService _athleteService;

        public TestController(ITestService testService, IAthleteService athleteService)
        {
            _testService = testService;
            _athleteService = athleteService;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _testService.GetDataForTest());
        }

        [HttpPost]
        public IActionResult Result(ICollection<AthleteDto> athleteResults)
        {
            return View("../Athletes/Index", _athleteService.SaveAthletsResults(athleteResults));
        }

        public IActionResult Error()
        {
            return View(new ErrorVm { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

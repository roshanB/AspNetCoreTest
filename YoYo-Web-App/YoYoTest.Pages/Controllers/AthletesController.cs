using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using YoYoTest.Business.Common.Interfaces;

namespace YoYo_Web_App.YoYoTest.Pages.Controllers
{
    public class AthletesController : Controller
    {
        private readonly IAthleteService _athleteService;
        public AthletesController(IAthleteService athleteService)
        {
            _athleteService = athleteService;
        }
        public async Task<IActionResult> Index()
        {
            return View(await _athleteService.GetAthletes());
        }
    }
}
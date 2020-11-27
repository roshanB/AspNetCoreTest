

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YoYoTest.Business.Common.Interfaces;

namespace YoYo_Web_App.YoYoTest.API.Controllers
{
    [Route("api/test/")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ITestService _testService;
        public TestController(ITestService testService)
        {
            _testService = testService;
        }

        [HttpGet]
        [Route("GetTestData")]
        public async Task<ActionResult> GetTestData()
        {
            var result = await _testService.GetTestSchema();
            return new OkObjectResult(result.TestSchema);
        }
    }
}
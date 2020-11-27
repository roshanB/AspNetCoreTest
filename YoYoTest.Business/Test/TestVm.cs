using System;
using System.Collections.Generic;
using System.Text;
using YoYoTest.Business.Athletes;

namespace YoYoTest.Business.Test
{
    public class TestVm
    {
        public IEnumerable<AthleteDto> Athletes { get; set; }

        public IEnumerable<string> Results { get; set; }
    }
}

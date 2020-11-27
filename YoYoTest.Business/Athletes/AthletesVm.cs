using System;
using System.Collections.Generic;
using System.Text;

namespace YoYoTest.Business.Athletes
{
    public class AthletesVm
    {
        public IList<AthleteDto> Athletes { get; set; } = new List<AthleteDto>();
    }
}

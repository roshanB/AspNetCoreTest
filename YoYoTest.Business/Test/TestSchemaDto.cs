using System;
using System.Collections.Generic;
using System.Text;
using YoYoTest.Business.Common.Mappings;
using YoYoTest.Domain.Entities;

namespace YoYoTest.Business.Test
{
    public class TestSchemaDto : IMapFrom<YoYoTest.Domain.Entities.TestSchema>
    {
        public int AccumulatedShuttleDistance { get; set; }

        public int SpeedLevel { get; set; }

        public int ShuttleNo { get; set; }

        public string Speed { get; set; }

        public decimal LevelTime { get; set; }

        public string CommulativeTime { get; set; }

        public string StartTime { get; set; }

        public decimal ApproxVo2Max { get; set; }
    }
}

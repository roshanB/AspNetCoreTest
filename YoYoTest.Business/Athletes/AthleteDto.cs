using System;
using System.Collections.Generic;
using System.Text;
using YoYoTest.Business.Common.Mappings;
using YoYoTest.Domain.Entities;

namespace YoYoTest.Business.Athletes
{
    public class AthleteDto : IMapFrom<Athlete>
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Result { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace YoYoTest.Domain.Entities
{
    public class Athlete
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Result { get; set; }
    }
}

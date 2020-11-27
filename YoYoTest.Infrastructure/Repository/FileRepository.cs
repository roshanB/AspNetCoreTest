using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using YoYoTest.Business.Common.Interfaces;
using YoYoTest.Domain.Entities;

namespace YoYoTest.Infrastructure.Repository
{
    public class FileRepository : IRepository
    {
        public async Task<IEnumerable<TestSchema>> GetTestSchema()
        {
            var strJsonTestSchema = await System.IO.File.ReadAllTextAsync("./Files/fitnessrating_beeptest.json");
            var lstTestSchema = JsonConvert.DeserializeObject<IEnumerable<TestSchema>>(strJsonTestSchema);
            return lstTestSchema;
        }

        public async Task<IEnumerable<Athlete>> GetAthletes()
        {
            var strJsonAthletes = await System.IO.File.ReadAllTextAsync("./Files/athletes.json");
            var athletes = JsonConvert.DeserializeObject<IEnumerable<Athlete>>(strJsonAthletes);
            return athletes;
        }

        public bool SaveAthletesResults(IEnumerable<Athlete> athletesResults)
        {
            // Save athletes results...
            return true;
        }
    }
}

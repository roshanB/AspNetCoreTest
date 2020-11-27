using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using YoYoTest.Domain.Entities;

namespace YoYoTest.Business.Common.Interfaces
{
    public interface IRepository
    {
        Task<IEnumerable<TestSchema>> GetTestSchema();

        Task<IEnumerable<Athlete>> GetAthletes();

        bool SaveAthletesResults(IEnumerable<Athlete> athletesResults);
    }
}

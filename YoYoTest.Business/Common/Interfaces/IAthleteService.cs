using System.Collections.Generic;
using System.Threading.Tasks;
using YoYoTest.Business.Athletes;

namespace YoYoTest.Business.Common.Interfaces
{
    public interface IAthleteService
    {
        Task<AthletesVm> GetAthletes();

        AthletesVm SaveAthletsResults(ICollection<AthleteDto> athletesResult);
    }
}

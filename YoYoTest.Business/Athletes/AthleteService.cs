using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YoYoTest.Business.Common.Interfaces;
using YoYoTest.Domain.Entities;

namespace YoYoTest.Business.Athletes
{
    public class AthleteService : IAthleteService
    {
        private readonly IRepository _repository;
        private readonly IMapper _mapper;
        
        public AthleteService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<AthletesVm> GetAthletes()
        {
            return new AthletesVm()
            {
                Athletes = _mapper.Map<IList<AthleteDto>>(await _repository.GetAthletes())
            };   
        }

        public AthletesVm SaveAthletsResults(ICollection<AthleteDto> athletesResult)
        {
            var entAthletes = new List<Athlete>();
            athletesResult.ToList().ForEach(athleteResult => {
                entAthletes.Add(new Athlete() { Id = athleteResult.Id, Result = athleteResult.Result });
            });
            _repository.SaveAthletesResults(entAthletes);
            return new AthletesVm() { Athletes = athletesResult.ToList() };
        }
    }
}

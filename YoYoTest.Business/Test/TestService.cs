using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YoYoTest.Business.Athletes;
using YoYoTest.Business.Common.Interfaces;
using YoYoTest.Domain.Entities;

namespace YoYoTest.Business.Test
{
    class TestService : ITestService
    {
        private readonly IRepository _repository;
        private readonly IMapper _mapper;
        public TestService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<TestSchemaVm> GetTestSchema()
        {
            return new TestSchemaVm() {
                TestSchema = _mapper.Map<IEnumerable<TestSchemaDto>>(await _repository.GetTestSchema())
            };
        }

        public async Task<TestVm> GetDataForTest()
        {
            var testVm = new TestVm();
            var athletes = _repository.GetAthletes();
            var testSchema = _repository.GetTestSchema();

            await Task.WhenAll(athletes, testSchema).ConfigureAwait(false);

            testVm.Athletes = _mapper.Map<IEnumerable<AthleteDto>>(athletes.Result);
            testVm.Results = testSchema.Result.Select(ts => string.Format("{0}-{1}", ts.SpeedLevel, ts.ShuttleNo));
            
            return testVm;
        }
    }
}

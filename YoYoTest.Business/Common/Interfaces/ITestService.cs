

using System.Threading.Tasks;
using YoYoTest.Business.Test;

namespace YoYoTest.Business.Common.Interfaces
{
    public interface ITestService
    {
        Task<TestSchemaVm> GetTestSchema();

        Task<TestVm> GetDataForTest();
    }
}

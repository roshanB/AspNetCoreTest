using System;

namespace YoYoTest.Business.Common.Vms
{
    public class ErrorVm
    {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}

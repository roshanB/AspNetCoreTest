using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using YoYoTest.Business.Common.Interfaces;
using YoYoTest.Infrastructure.Repository;

namespace YoYoTest.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddTransient<IRepository, FileRepository>();
            return services;
        }
    }
}

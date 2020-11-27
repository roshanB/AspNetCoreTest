using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using YoYoTest.Business.Athletes;
using YoYoTest.Business.Common.Interfaces;
using YoYoTest.Business.Test;

namespace YoYoTest.Business
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusiness(this IServiceCollection services)
        {
            services.AddTransient<IAthleteService, AthleteService>();
            services.AddTransient<ITestService, TestService>();
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            return services;
        }
    }
}

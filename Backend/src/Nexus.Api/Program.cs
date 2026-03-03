using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Nexus.Api.Configuration;

namespace Nexus.Api;

public class Program
{
    public static void Main(string[] args)
    {
        DotEnvLoader.Load();
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}

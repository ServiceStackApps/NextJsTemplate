using Microsoft.EntityFrameworkCore;
using MyApp.Data;

[assembly: HostingStartup(typeof(MyApp.ConfigureDb))]

namespace MyApp
{
    public class ConfigureDb : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder) => builder
            .ConfigureServices((context, services) => {
                var connStr = context.Configuration.GetConnectionString("DefaultConnection") 
                              ?? "DataSource=:memory:";
                services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseSqlite(connStr));
            });
    }
}

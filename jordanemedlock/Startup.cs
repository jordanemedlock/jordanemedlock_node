using jordanemedlock.DbContexts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using System;

namespace jordanemedlock
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            var connection = @"server=localhost;database=fourpersonchess;user=jordanemedlock;password=somepassword";

            services.AddDbContext<GameContext>(
                options => options.UseMySql(connection)
            ); 

            

            // services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            

            UpdateDatabase(app);

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();


            // app.UseEndpoints(endpoints =>
            // {
            //     endpoints.MapControllerRoute(
            //         name: "default",
            //         pattern: "{controller}/{action=Index}/{id?}");
            //     // endpoints.MapHub<FPCSignalHub>("/fpc-signal-hub");
            // });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (true) // dev
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private void UpdateDatabase(IApplicationBuilder application) {
            using (var serviceScope = application.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope()) {
                using (var context = serviceScope.ServiceProvider.GetService<GameContext>()) {
                    Console.WriteLine("*** Migrating Database ***");
                    GameContextInitializer.Initialize(context);
                }
            }
        }
    }
}

using Funq;
using ServiceStack;
using MyApp.ServiceInterface;

namespace MyApp;

public class AppHost : AppHostBase
{
    public AppHost() : base("MyApp", typeof(MyServices).Assembly) {}

    public override void Configure(Container container)
    {
        RawHttpHandlers.Add(ApiHandlers.Json("/api/{Request}"));

        SetConfig(new HostConfig {

        });

        Plugins.Add(new SharpPagesFeature());
//#if DEBUG
        Plugins.Add(new CorsFeature(allowOriginWhitelist:new[]{ "http://localhost:3000" }));
//#endif
    }
}
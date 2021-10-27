using System;
using ServiceStack;
using NextJsTemplateApi.ServiceModel;

namespace NextJsTemplateApi.ServiceInterface
{
    public class MyServices : Service
    {
        public object Any(Hello request)
        {
            return new HelloResponse { Result = $"Hello, {request.Name}!" };
        }
    }
}

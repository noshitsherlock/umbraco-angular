using System.Web.Http.Filters;

namespace UmbracoTest.Services
{
    public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response != null)
            {   
                if(actionExecutedContext.Response.RequestMessage.RequestUri.Host.ToLower() == "localhost")
                    actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            }

            base.OnActionExecuted(actionExecutedContext);
        }
    }
}
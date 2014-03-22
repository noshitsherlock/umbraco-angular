***
# umbraco-angular
***

The project is all about using umbraco CMS only for content and consuming it from a different site built in what ever solution.
More than once have I come across the situation where I wan't to use a different frontend than the one that comes with umbraco.

I recently worked on a project that used nopcommerce (http://nopcommerce.com/) as the e-commerce platform. Since nopcommerce is
a commerce solution it does not contain any good CMS support and in todays market you have to very dynamic and change all the time so some kind
of CMS is a must! Or else, you are doing it wrong ;)

***

***
### Start
***
####AngularJS
Include angular.js and the umbraco-angular.js file (see example html).

Start by creating your application and injecting the umbraco-angular module and configuring it.

/scripts/app/app.js
```javascript
var app = angular.module("app", ['umbraco.angular']);

app.config(function (UmbracoAngularProvider) {
    UmbracoAngularProvider.setApiEndpoint("http://localhost:PORT/umbraco/api/nodeapi/");
});

```

Example controller.

/scripts/app/controllers/index.js
```javascript
app.controller("indexController", [
    '$scope', '$sce', 'UmbracoAngular', function($scope, $sce, UmbracoAngular) {
        $scope.view = {};

        $scope.GetNodeByUrl = function (url) {
            UmbracoAngular.GetNodeByUrl(url).then(function (response) {
                var data = response.data;

                if (data.StatusMessage.Success) {
                    var property = UmbracoAngular.GetProperty("aboutTitle", data);                
                    var image = UmbracoAngular.GetProperty("bannerBackgroundImage", data);

                    $scope.view.BodyText = $sce.trustAsHtml(property.Value);
                    $scope.view.Title = data.Name;
                    $scope.view.Image = $sce.trustAsHtml(data.HostName + image.Value);
                } else {
                    $scope.view.BodyText = $sce.trustAsHtml("<p>" + data.StatusMessage.Message + "</p>");
                }
            });
        };
    }
]);
```

Example html.

/index.html
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
</head>
<body ng-app="app">
    <div ng-controller="indexController" ng-init="GetNodeByUrl('/')">
        <h2 ng-bind="view.Title"></h2>
        <div class="body" ng-bind-html="view.BodyText"></div>
        <img src="{{view.Image}}" />
    </div>

    <!--Angular-->
    <script src="Scripts/angular.js"></script>

    <!--App-->
    <script src="Scripts/app/app.js"></script>

    <!--Controllers-->
    <script src="Scripts/app/controllers/index.js"></script>

    <!--Plugins-->
    <script src="Scripts/umbraco.angular.js"></script>
</body>
</html>
```

####Umbraco
For testing, create a new VS solution (I called it UmbracoTest) and download/install the umbraco cms nuget package. Then when the installation is complete install the umbraco txt starter kit
to have something to start with. In my example below I have used that starter kit. I created a folder called services to put my UmbracoApiController in.

When you inherit from UmbracoApiController, the default route is http://site/umbraco/api/{nameofcontoller}/{method}/{param}, ex http://localhost:PORT/umbraco/api/nodeapi/getnodedata/1070

/Services/NodeApiController.cs
```c#
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using umbraco;
using umbraco.NodeFactory;
using Umbraco.Web.WebApi;
using UmbracoTest.Services.Models;

namespace UmbracoTest.Services
{
    [AllowCrossSiteJson]
    public class NodeApiController : UmbracoApiController
    {       
        /// <summary>
        /// Gets the umbraco node by id
        /// </summary>
        public HttpResponseMessage GetNodeData(int id)
        {
            var node = new Node(id);

            if (node.Id == 0)
                return NodeNotFound();
            

            var viewNode = ViewNode.Create(node);

            return JsonResponse(viewNode);
        }

        /// <summary>
        /// Gets the umbraco node by url, example : /about        
        /// </summary>
        public HttpResponseMessage GetNodeByUrl(string url)
        {
            var node = uQuery.GetNodeByUrl(url);

            //we don't want the root node, use GetNodeData for that
            if (node.Id == 0 || node.Id == -1)
                return NodeNotFound();

            var viewNode = ViewNode.Create(node);

            return JsonResponse(viewNode);
        }

        /// <summary>
        /// Create response object
        /// </summary>
        private HttpResponseMessage JsonResponse(object obj)
        {
            return new HttpResponseMessage
            {
                Content = JsonContent(obj),                
            };
        }

        /// <summary>
        /// Serialize object to json
        /// </summary>
        private StringContent JsonContent(object obj)
        {
            return new StringContent(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json");
        }

        /// <summary>
        /// Node not found response
        /// </summary>
        private HttpResponseMessage NodeNotFound()
        {
            return JsonResponse(new ViewNode()
            {
                StatusMessage = new StatusMessage { Success = false, Message = "Node not found" }
            });
        }
    }
}
```

Also allow CORS. This need to be modified if you wan't to allow any other hosts than localhost.
/Services/AllowCrossSiteJsonAttribute.cs
```c#
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
```

Other needed classes.

/Services/Models/ViewNode.cs
```c#
using System.Collections.Generic;
using System.Web;
using umbraco.interfaces;
using umbraco.NodeFactory;

namespace UmbracoTest.Services.Models
{
    public class ViewNode
    {
        public int TemplateId { get; set; }
        public int Id { get; set; }
        public int Level { get; set; }
        public string Name { get; set; }
        public string NiceUrl { get; set; }
        public IProperty BodyText { get; set; }
        public StatusMessage StatusMessage { get; set; }
        public List<IProperty> Properties { get; set; }
        public string HostName { get; set; }

        public static ViewNode Create(Node node)
        {
            

            return new ViewNode
            {
                NiceUrl = node.NiceUrl,
                TemplateId = node.template,
                Name = node.Name,
                Level = node.Level,
                Id = node.Id,
                Properties = node.PropertiesAsList,
                StatusMessage = new StatusMessage { Success = true },
                HostName = GetHostname()
            };
        }

        private static string GetHostname()
        {
            if (HttpContext.Current == null)
                return "";

            return HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority;
        }
    }    
}
```

/Services/Models/StatusMessage.cs
```c#
namespace UmbracoTest.Services.Models
{
    /// <summary>
    /// Object that indicates if the node was found or not.
    /// </summary>
    public class StatusMessage
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
```

***
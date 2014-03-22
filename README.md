***
# umbraco-angular
***

The project is all about using umbraco CMS only for content and consuming it from a different site built in what ever solution.

***

***
### Start
***
Umbraco
For testing, create a new VS solution and download/install the umbraco cms nuget package. Then when installation is complete install the umbraco txt starter kit
to have something to start with. In my example below I have used that starter kit.

AngularJS
Include angular.js and the umbraco-angular.js file (see example html).

Start by creating your application and injecting the umbraco-angular module and configuring it.

/scripts/app/app.js
```javascript
var app = angular.module("app", ['umbraco.angular']);

app.config(function (UmbracoAngularProvider) {
    UmbracoAngularProvider.setApiEndpoint("URL OF THE UMBRACO_NODE_API_CONTROLLER");
});

```

Example controller.
/scripts/app/controllers/index.js
```javascript
app.controller("indexController", ['$scope', '$sce', 'UmbracoAngular', function ($scope, $sce, UmbracoAngular) {
    $scope.view = {};

    $scope.GetNodeData = function (id) {
        UmbracoAngular.GetNodeData(id).then(function (response) {
            var data = response.data;

            if (data.StatusMessage.Success) {
                var property = UmbracoAngular.GetProperty("bodyText", data);

                $scope.view.BodyText = $sce.trustAsHtml(property.Value);
                $scope.view.Title = data.Name;
            } else {
                $scope.view.BodyText = $sce.trustAsHtml("<p>" + data.StatusMessage.Message + "</p>");
            }
        });
    };

    $scope.GetNodeByUrl = function (url) {
        UmbracoAngular.GetNodeByUrl(url).then(function (response) {
            var data = response.data;

            if (data.StatusMessage.Success) {
                var property = UmbracoAngular.GetProperty("bodyText", data);

                $scope.view.BodyText = $sce.trustAsHtml(property.Value);
                $scope.view.Title = data.Name;
            } else {
                $scope.view.BodyText = $sce.trustAsHtml("<p>" + data.StatusMessage.Message + "</p>");
            }
        });
    };
}
]);
```

Example html
/index.html
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
</head>
<body ng-app="app">
    <!--<div ng-controller="indexController" ng-init="GetNodeData(1070)">-->
    <div ng-controller="indexController" ng-init="GetNodeByUrl('/about')">
        <h2 ng-bind="view.Title"></h2>
        <div class="body" ng-bind-html="view.BodyText"></div>
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

***
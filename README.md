***
# umbraco-angular
***

The project is all about using umbraco CMS only for content and consuming it from a different site built in what ever solution.

***

***
### Start
***
AngularJS
Start by creating your application and injecting the umbraco-angular module and configuring it.

app.js
'''javascript
var app = angular.module("app", ['umbraco.angular']);

app.config(function (UmbracoAngularProvider) {
    UmbracoAngularProvider.setApiEndpoint("URL OF THE UMBRACO_NODE_API_CONTROLLER");
});

'''

***
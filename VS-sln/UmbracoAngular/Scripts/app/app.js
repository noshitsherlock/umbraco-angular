var app = angular.module("app", ['umbraco.angular']);

app.config(function (UmbracoAngularProvider) {
    UmbracoAngularProvider.setApiEndpoint("http://localhost:57451/umbraco/api/nodeapi/getnodedata/");
});
app.controller("storesController", [
    '$scope', '$sce', 'UmbracoAngular', function ($scope, $sce, UmbracoAngular) {
        $scope.view = {};
        $scope.view.stores = [];

        $scope.init = function() {
            UmbracoAngular.GetNodeByUrl("/stockholm").then(function(response) {
                var data = response.data;

                if (data.StatusMessage.Success) {
                    //$scope.view.stores = data.Children;
                    for (i = 0; i < data.Children.length; i++) {
                        var store = {
                            id: data.Children[i].Id,
                            area: UmbracoAngular.GetProperty("area", data.Children[i]).Value,
                            address: UmbracoAngular.GetProperty("address", data.Children[i]).Value,
                            postalAddress: UmbracoAngular.GetProperty("postaladress", data.Children[i]).Value,
                            url: UmbracoAngular.GetProperty("url", data.Children[i]).Value,
                            location: { ob: UmbracoAngular.GetProperty("locationOb", data.Children[i]).Value, pb: UmbracoAngular.GetProperty("locationPb", data.Children[i]).Value }
                        };

                        $scope.view.stores.push(store);
                    }
                }
            });
        }

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
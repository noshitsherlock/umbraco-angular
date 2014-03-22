app.controller("indexController", [
    '$scope', '$sce', 'UmbracoAngular', function($scope, $sce, UmbracoAngular) {
        $scope.view = {};

        $scope.GetNodeData = function(id) {
            UmbracoAngular.GetNodeData(id).then(function(response) {
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

        $scope.GetNodeByUrl = function(url) {
            UmbracoAngular.GetNodeByUrl(url).then(function(response) {
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
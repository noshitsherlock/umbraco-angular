app.controller("indexController", ['$scope', '$sce', 'UmbracoAngular', function($scope, $sce, UmbracoAngular) {
    $scope.view = {};

    $scope.GetNodeData = function (id) {
        UmbracoAngular.GetNodeData(id).then(function (response) {
            var data = response.data;

            if (data.StatusMessage.Success) {
                var property = UmbracoAngular.GetProperty("bodyText", data);
                $scope.view.BodyText = $sce.trustAsHtml(property.Value);
            } else {
                $scope.view.BodyText = $sce.trustAsHtml("<p>" + data.StatusMessage.Message + "</p>");
            }
        });
    };
}
]);
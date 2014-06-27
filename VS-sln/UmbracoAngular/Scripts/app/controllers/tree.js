app.controller("treeController", [
    '$scope', '$sce', 'UmbracoAngular', function($scope, $sce, UmbracoAngular) {
        $scope.view = {};

        $scope.GetTree = function() {
            UmbracoAngular.GetNodeData(-1).then(function(response) {
                var data = response.data;

                if (data.StatusMessage.Success) {
                    $scope.view.Tree = data;
                }
            });
        }
    }
]);
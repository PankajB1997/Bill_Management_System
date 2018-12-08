(function (app) {
    "use strict";

    app.controller("RemoveController", RemoveController);

    RemoveController.$inject = ["$location", "$routeParams", "toaster", "RepositoryService"];

    function RemoveController($location, $routeParams, toaster, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};
        vm.remove = remove;
        vm.cancel = cancel;

        repository.getBill(id).then(function (result) {
            vm.model = result.data;
        });

        function remove() {
            // toaster.pop("wait", "Removing...");

            repository.deleteBill(id).then(function (result) {
                // toaster.pop("success", "The contact was removed successfully");

                $location.path("/");
            });
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

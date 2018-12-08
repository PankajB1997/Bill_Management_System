(function (app) {
    "use strict";

    app.controller("ContactRemoveController", ContactRemoveController);

    ContactRemoveController.$inject = ["$location", "$routeParams", "toaster", "RepositoryService"];

    function ContactRemoveController($location, $routeParams, toaster, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};
        vm.remove = remove;
        vm.cancel = cancel;

        repository.getContact(id).then(function (result) {
            vm.model = result.data;
        });

        function remove() {
            // toaster.pop("wait", "Removing...");

            repository.deleteContact(id).then(function (result) {
                // toaster.pop("success", "The contact was removed successfully");

                $location.path("/");
            });
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("contactManager"));

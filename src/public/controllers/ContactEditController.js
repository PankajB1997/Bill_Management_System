(function (app) {
    "use strict";

    app.controller("ContactEditController", ContactEditController);

    ContactEditController.$inject = ["$routeParams", "$location", "toaster", "RepositoryService"];

    function ContactEditController($routeParams, $location, toaster, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};
        vm.save = save;
        vm.cancel = cancel;

        repository.getContact(id).then(function (result) {
            vm.model = result.data;
        });

        function save() {
            // toaster.pop("wait", "Saving...");

            repository.updateContact(id, vm.model).then(function (result) {
                // toaster.pop("success", "The changes were saved successfully");

                $location.path("/contact/details/" + id);
            });
        };

        function cancel() {
            $location.path("/contact/details/" + id);
        };
    };
})(angular.module("contactManager"));

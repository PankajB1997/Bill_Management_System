(function (app) {
    "use strict";

    app.controller("AddController", AddController);

    AddController.$inject = ["$location", "toaster", "RepositoryService"];

    function AddController($location, toaster, repository) {
        var vm = this;

        vm.model = {};

        vm.save = save;
        vm.cancel = cancel;

        function save() {
            // toaster.pop("wait", "Saving...");

            repository.createBill(vm.model).then(function (result) {
                // toaster.pop("success", "The contact was saved successfully");

                $location.path("/");
            });
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

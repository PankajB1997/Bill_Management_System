(function (app) {
    "use strict";

    app.controller("EditController", EditController);

    EditController.$inject = ["$routeParams", "$location", "toaster", "RepositoryService"];

    function EditController($routeParams, $location, toaster, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};
        vm.save = save;
        vm.cancel = cancel;

        repository.getBill(id).then(function (result) {
            vm.model = result.data;
        });

        function save() {
            // toaster.pop("wait", "Saving...");

            repository.updateBill(id, vm.model).then(function (result) {
                // toaster.pop("success", "The changes were saved successfully");

                $location.path("/bill/details/" + id);
            });
        };

        function cancel() {
            $location.path("/bill/details/" + id);
        };
    };
})(angular.module("billManager"));

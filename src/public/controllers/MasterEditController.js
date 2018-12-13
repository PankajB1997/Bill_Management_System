(function (app) {
    "use strict";

    app.controller("MasterEditController", MasterEditController);

    MasterEditController.$inject = ["$routeParams", "$location", "toaster", "RepositoryService"];

    function MasterEditController($routeParams, $location, toaster, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};

        repository.getSpecificMasterData(id).then(function (result) {
            vm.model = result.data;
        });

        vm.save = save;
        vm.cancel = cancel;

        function save() {
            repository.updateMasterData(id, vm.model).then(function (result) {
                $location.path("/bill/add-master");
            });
        };

        function cancel() {
            $location.path("/bill/add-master");
        };
    };
})(angular.module("billManager"));

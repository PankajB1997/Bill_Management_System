(function (app) {
    "use strict";

    app.controller("MasterController", MasterController);

    MasterController.$inject = ["$location", "toaster", "RepositoryService"];

    function MasterController($location, toaster, repository) {
        var vm = this;

        vm.master = {};

        repository.getMasterData().then(function (result) {
            vm.master = result.data;
        });

        vm.model = {};

        vm.save = save;
        vm.cancel = cancel;

        function save() {
            repository.addNewMasterData(vm.model).then(function (result) {
                $location.path("/bill/add-master");
            });
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

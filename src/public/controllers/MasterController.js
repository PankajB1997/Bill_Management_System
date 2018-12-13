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

        vm.edit = edit;
        vm.remove = remove;
        vm.save = save;
        vm.clear = clear;
        vm.cancel = cancel;

        function edit(id) {
            $location.path("/bill/add-master/" + id);
        }

        function remove(id) {
            repository.deleteMasterData(id).then(function (result) {
                $location.path("/bill/add-master");
                repository.getMasterData().then(function (result) {
                    vm.master = result.data;
                });
            });
        }

        function save() {
            repository.addNewMasterData(vm.model).then(function (result) {
                $location.path("/bill/add-master");
                repository.getMasterData().then(function (result) {
                    vm.master = result.data;
                });
            });
        };

        function clear() {
            vm.model = {};
            // $location.path("/");
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

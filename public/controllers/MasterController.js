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

        repository.getGSTRate().then(function (res) {
            vm.gstRate = res.data.gstRate;
        });

        vm.model = {};

        vm.edit = edit;
        vm.remove = remove;
        vm.save = save;
        vm.clear = clear;
        vm.cancel = cancel;
        vm.updateGSTRate = updateGSTRate;

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

        function updateGSTRate() {
            repository.updateGSTRate({ gstRate: vm.gstRate }).then(function (result) {
                $location.path("/");
            });
        }

        function save() {
            repository.addNewMasterData(vm.model).then(function (result) {
                $location.path("/bill/add-master");
                vm.model = {};
                vm.model.vendorName = result.data.vendorName;
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

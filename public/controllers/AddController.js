(function (app) {
    "use strict";

    app.controller("AddController", AddController);

    AddController.$inject = ["$location", "toaster", "RepositoryService"];

    function AddController($location, toaster, repository) {
        var vm = this;

        vm.model = {};

        vm.save = save;
        vm.cancel = cancel;

        vm.vendorNames = [];
        vm.vendorItemCodes = [];
        vm.hoCodes = [];
        vm.itemDescriptions = [];
        vm.billTos = [
            { label: "---Select---", disabled: true },
            { label: "Vision World Pvt. Ltd." },
            { label: "Specs World Pvt. Ltd." },
            { label: "The Himalaya Optical Company" },
            { label: "Himalaya Vision Crafter Pvt. Ltd." }
        ];
        repository.getMasterData().then(function (result) {
            for (var row in result.data) {
                if (vm.vendorNames.includes(result.data[row]["vendorName"]) == false) {
                    vm.vendorNames.push(result.data[row]["vendorName"]);
                }
                if (result.data[row]["vendorItemCode"] && vm.vendorItemCodes.includes(result.data[row]["vendorItemCode"]) == false) {
                    vm.vendorItemCodes.push(result.data[row]["vendorItemCode"]);
                }

                if (result.data[row]["hoCode"] && vm.hoCodes.includes(result.data[row]["hoCode"]) == false) {
                    vm.hoCodes.push(result.data[row]["hoCode"]);
                }

                if (vm.itemDescriptions.includes(result.data[row]["itemDescription"]) == false) {
                    vm.itemDescriptions.push(result.data[row]["itemDescription"]);
                }
            }
            vm.vendorNames.sort();
            for (var val in vm.vendorNames) {
                vm.vendorNames[val] = { label: vm.vendorNames[val] };
            }
            vm.vendorNames.unshift({ label: "---Select---", "disabled": true });
            vm.model.vendorName = vm.vendorNames[0].label;
            vm.vendorItemCodes.sort();
            for (var val in vm.vendorItemCodes) {
                vm.vendorItemCodes[val] = { label: vm.vendorItemCodes[val] };
            }
            vm.vendorItemCodes.unshift({ label: "---Select---", "disabled": true });
            vm.model.vendorItemCode = vm.vendorItemCodes[0].label;
            vm.hoCodes.sort();
            for (var val in vm.hoCodes) {
                vm.hoCodes[val] = { label: vm.hoCodes[val] };
            }
            vm.hoCodes.unshift({ label: "---Select---", "disabled": true });
            vm.model.hoCode = vm.hoCodes[0].label;
            vm.itemDescriptions.sort();
            for (var val in vm.itemDescriptions) {
                vm.itemDescriptions[val] = { label: vm.itemDescriptions[val] };
            }
            vm.itemDescriptions.unshift({ label: "---Select---", "disabled": true });
            vm.model.itemDescription = vm.itemDescriptions[0].label;
            vm.model.billTo = vm.billTos[0].label;
        });

        function save() {
            repository.createBill(vm.model).then(function (result) {
                $location.path("/");
            });
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

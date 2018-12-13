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
        vm.billTos = [ "Vision World Pvt. Ltd.", "Specs World Pvt. Ltd.", "The Himalaya Optical Company", "Himalaya Vision Crafter Pvt. Ltd." ];

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
            vm.vendorItemCodes.sort();
            vm.hoCodes.sort();
            vm.itemDescriptions.sort();
        });

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

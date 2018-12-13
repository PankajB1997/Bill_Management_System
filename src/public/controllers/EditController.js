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

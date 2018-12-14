(function (app) {
    "use strict";

    app.controller("AddController", AddController);

    AddController.$inject = ["$location", "toaster", "RepositoryService"];

    function AddController($location, toaster, repository) {
        var vm = this;

        vm.model = {};
        vm.model.items = [];

        repository.getGSTRate().then(function (res) {
            vm.gstRate = parseFloat(res.data.gstRate);
        });

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
        vm.billingUnits = [
            { label: "---Select---", disabled: true },
            { label: "" },
            { label: "BOX" }
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
            vm.hoCodes.sort();
            for (var val in vm.hoCodes) {
                vm.hoCodes[val] = { label: vm.hoCodes[val] };
            }
            vm.hoCodes.unshift({ label: "---Select---", "disabled": true });
            vm.itemDescriptions.sort();
            for (var val in vm.itemDescriptions) {
                vm.itemDescriptions[val] = { label: vm.itemDescriptions[val] };
            }
            vm.itemDescriptions.unshift({ label: "---Select---", "disabled": true });
            vm.model.billTo = vm.billTos[0].label;
            vm.tempHoCode = vm.hoCodes[0].label;
            vm.tempVendorItemCode = vm.vendorItemCodes[0].label;
            vm.tempProduct = vm.itemDescriptions[0].label;
            vm.tempBillingUnit = vm.billingUnits[0].label;
        });

        vm.addRow = function () {
            var find = {};
            if (vm.tempHoCode) {
                find.hoCode = vm.tempHoCode;
            }
            else if (vm.tempVendorItemCode) {
                find.vendorItemCode = vm.tempVendorItemCode;
            }
            else {
                find.itemDescription = vm.tempProduct;
            }
            repository.getOriginalItemRate(find).then(function(result) {
                vm.model.items.push({
                    itemDescription: result.data[0].itemDescription,
                    quantity: parseFloat(vm.tempQuantity),
                    billingUnit: vm.tempBillingUnit,
                    rate: parseFloat(vm.tempRate),
                    billing: parseFloat(vm.tempQuantity)*parseFloat(vm.tempRate),
                    gst: (vm.gstRate/100.0)*(parseFloat(vm.tempQuantity)*parseFloat(vm.tempRate)),
                    billAmount: (parseFloat(vm.tempQuantity)*parseFloat(vm.tempRate)) + ((vm.gstRate/100.0)*(parseFloat(vm.tempQuantity)*parseFloat(vm.tempRate))),
                    rateDifference: parseFloat(vm.tempRate) - parseFloat(result.data[0].negotiatedRate),
                    claimAmount: parseFloat(vm.tempQuantity) * (parseFloat(vm.tempRate) - parseFloat(result.data[0].negotiatedRate)),
                    remove: false
                });
                vm.tempHoCode = vm.hoCodes[0].label;
                vm.tempVendorItemCode = vm.vendorItemCodes[0].label;
                vm.tempProduct = vm.itemDescriptions[0].label;
                vm.tempBillingUnit = vm.billingUnits[0].label;
                vm.tempQuantity = "";
                vm.tempRate = "";
            });
        }

        vm.removeRow = function () {
            var retainedItems = [];
            for(var product in vm.model.items) {
                if (vm.model.items[product].remove == false) {
                    retainedItems.push(vm.model.items[product]);
                }
            }
            vm.model.items = retainedItems;
        }

        function save() {
            vm.model.totalBillAmount = 0.0;
            vm.model.totalClaimAmount = 0.0;
            for(var item in vm.model.items) {
                vm.model.totalBillAmount += vm.model.items[item].billAmount;
                vm.model.totalClaimAmount += vm.model.items[item].claimAmount;
            }
            if (vm.model.modeOfPayment && vm.model.instrumentNo) {
                vm.model.paymentStatus = "Paid";
            }
            else {
                vm.model.paymentStatus = "Unpaid";
            }
            repository.createBill(vm.model).then(function (result) {
                $location.path("/");
            });
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

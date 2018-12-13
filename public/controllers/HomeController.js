(function (app) {
    "use strict";

    app.controller("HomeController", HomeController);

    HomeController.$inject = ["$location", "toaster", "RepositoryService"];

    function preprocessor(objArray) {
        var resArray = [];
        var properties = ["billNo", "billDate", "vendorName", "billTo", "totalBillAmount", "totalClaimAmount", "modeOfPayment", "instrumentNo", "paymentStatus"];
        var propertyLabels = ["BILL NO.", "BILL DATE", "VENDOR NAME", "BILL TO", "TOTAL BILL AMOUNT", "TOTAL CLAIM AMOUNT", "MODE OF PAYMENT", "INSTRUMENT NO.", "PAYMENT STATUS"];
        var itemProperties = ["itemDescription", "quantity", "billingUnit", "rate", "billing", "gst", "billAmount", "rateDifference", "claimAmount"];
        var itemPropertyLabels = ["PRODUCT", "QTY", "BILLING UNIT", "RATE", "BILLING", "GST", "BILL AMOUNT", "RATE DIFF", "CLAIM AMT"];

        for(var row in objArray) {
            var bill = {};
            for(var i=0; i<properties.length; i++) {
                bill[propertyLabels[i]] = objArray[row][properties[i]];
            }
            for(var product in objArray[row].items) {
                for(var j=0; j<itemProperties.length; j++) {
                    bill[itemPropertyLabels[i]] = objArray[row].items[product][itemProperties[i]];
                }
                resArray.push(bill);
            }
        }

        return resArray;
    }

    function ConvertToCSV(objArray) {
        objArray = preprocessor(objArray);
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";
        for (var index in objArray[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '')
                    line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    function HomeController($location, toaster, repository) {
        var vm = this;
        vm.bills = [];
        vm.search = {};

        repository.getBills(vm.search).then(function (result) {
            vm.bills = result.data;
        });

        vm.vendorNames = [];
        vm.vendorItemCodes = [];
        vm.hoCodes = [];
        vm.itemDescriptions = [];
        vm.billTos = [
            { label: "Billed To", disabled: true },
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
            vm.vendorNames.unshift({ label: "Vendor Name", "disabled": true });
            vm.search.vendorName = vm.vendorNames[0].label;
            vm.vendorItemCodes.sort();
            for (var val in vm.vendorItemCodes) {
                vm.vendorItemCodes[val] = { label: vm.vendorItemCodes[val] };
            }
            vm.vendorItemCodes.unshift({ label: "Vendor Item Code", "disabled": true });
            vm.hoCodes.sort();
            for (var val in vm.hoCodes) {
                vm.hoCodes[val] = { label: vm.hoCodes[val] };
            }
            vm.hoCodes.unshift({ label: "H.O. Code", "disabled": true });
            vm.itemDescriptions.sort();
            for (var val in vm.itemDescriptions) {
                vm.itemDescriptions[val] = { label: vm.itemDescriptions[val] };
            }
            vm.itemDescriptions.unshift({ label: "Item Description", "disabled": true });
            vm.search.billTo = vm.billTos[0].label;
        });

        vm.add = function () {
            $location.path("/bill/add/");
        };

        vm.addMaster = function () {
            $location.path("/bill/add-master/");
        };

        vm.search = function () {
            var searchString = {};
            searchString.billNo = vm.search.billNo;
            searchString.billStartDate = vm.search.billStartDate;
            searchString.billEndDate = vm.search.billEndDate;
            searchString.vendorName = vm.search.vendorName;
            searchString.billTo = vm.search.billTo;
            if (searchString.vendorName == "Vendor Name") {
                searchString.vendorName = null;
            }
            if (searchString.billTo == "Billed To") {
                searchString.billTo = null;
            }
            repository.getBills(searchString).then(function (result) {
                vm.bills = result.data;
            });
        };

        vm.clearSearch = function() {
            vm.search.billNo = null;
            vm.search.billStartDate = null;
            vm.search.billEndDate = null;
            vm.search.vendorName = "Vendor Name";
            vm.search.billTo = "Billed To";
            repository.getBills({}).then(function (result) {
                vm.bills = result.data;
            });
        }

        vm.exportToExcel = function () {
            var searchString = {};
            searchString.billNo = vm.search.billNo;
            searchString.billStartDate = vm.search.billStartDate;
            searchString.billEndDate = vm.search.billEndDate;
            searchString.vendorName = vm.search.vendorName;
            searchString.billTo = vm.search.billTo;
            if (searchString.vendorName == "Vendor Name") {
                searchString.vendorName = null;
            }
            if (searchString.billTo == "Billed To") {
                searchString.billTo = null;
            }
            repository.getBills(searchString).then(function (result) {
                var csvData = ConvertToCSV(result.data);
                var a = document.createElement("a");
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                // TODO: Make sure data appears in a presentable manner inside the csv
                var blob = new Blob([csvData], { type: 'text/csv' });
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = 'results.csv';
                a.click();
            });
        };

        vm.details = function (id) {
            $location.path("/bill/details/" + id);
        };

        vm.remove = function (id) {
            $location.path("/bill/remove/" + id);
        };

        vm.downloadClaim = function (id) {
            repository.getBill(id).then(function (result) {
                const doc = new jsPDF();
                doc.text("Bill No.: " + result.data["billNo"], 10, 10);
                doc.text("Bill Date: " + result.data["billDate"], 10, 20);
                doc.text("Vendor Name: " + result.data["vendorName"], 10, 30);
                doc.text("Billed To: " + result.data["billTo"], 10, 40);
                doc.text("Total Bill Amount: " + result.data["totalBillAmount"], 10, 50);
                doc.text("Total Claim Amount: " + result.data["totalClaimAmount"], 10, 60);
                doc.save(result.data["vendorName"] + ".pdf");
            });
        };
    };
})(angular.module("billManager"));

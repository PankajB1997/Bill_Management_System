(function (app) {
    "use strict";

    app.controller("HomeController", HomeController);

    HomeController.$inject = ["$location", "toaster", "RepositoryService"];

    function preprocessor(objArray) {
        //TODO: Need to preprocess data to make it suitable for appearance in Excel
        
        return objArray;
    }

    function ConvertToCSV(objArray) {
        objArray = preprocessor(objArray);
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";
        var properties = ["billNo", "billDate", "vendorName", "billTo"];
        for (var index in properties) {
            row += properties[index] + ',';
        }
        row = row.slice(0, -1);
        str += row + '\r\n';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in properties) {
                if (line != '')
                    line += ',';
                line += array[i][properties[index]];
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
        vm.add = function () {
            $location.path("/bill/add/");
        };
        vm.addMaster = function () {
            $location.path("/bill/add-master/");
        }
        vm.search = function () {
            repository.getBills(vm.search).then(function (result) {
                vm.bills = result.data;
            });
        };
        vm.exportToExcel = function () {
            repository.getBills(vm.search).then(function (result) {
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
        }
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
                doc.save(result.data["vendorName"] + ".pdf");
            });
        }
    };
})(angular.module("billManager"));

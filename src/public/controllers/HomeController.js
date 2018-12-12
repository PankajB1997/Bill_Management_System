(function (app) {
    "use strict";

    app.controller("HomeController", HomeController);

    HomeController.$inject = ["$location", "toaster", "RepositoryService"];

    function HomeController($location, toaster, repository) {
        var vm = this;

        vm.bills = [];

        vm.search = {};

        // toaster.pop("wait", "Loading bills...");

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

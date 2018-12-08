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
    };
})(angular.module("billManager"));

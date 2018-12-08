(function (app) {
    "use strict";

    app.controller("DetailsController", DetailsController);

    DetailsController.$inject = ["$routeParams", "$location", "RepositoryService"];

    function DetailsController($routeParams, $location, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};
        vm.edit = edit;
        vm.cancel = cancel;

        repository.getBill(id).then(function (result) {
            vm.model = result.data;
        });

        function edit() {
            $location.path("/bill/edit/" + id);
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("billManager"));

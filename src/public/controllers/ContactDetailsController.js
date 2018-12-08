(function (app) {
    "use strict";

    app.controller("ContactDetailsController", ContactDetailsController);

    ContactDetailsController.$inject = ["$routeParams", "$location", "RepositoryService"];

    function ContactDetailsController($routeParams, $location, repository) {
        var vm = this;

        var id = $routeParams.id;

        vm.model = {};
        vm.edit = edit;
        vm.cancel = cancel;

        repository.getContact(id).then(function (result) {
            vm.model = result.data;
        });

        function edit() {
            $location.path("/contact/edit/" + id);
        };

        function cancel() {
            $location.path("/");
        };
    };
})(angular.module("contactManager"));

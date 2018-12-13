var module = angular.module("billManager", [
    "ngRoute",
    "ngAnimate",
    "toaster"
]);

(function (app) {
    app.config(function ($routeProvider) {
        var base = "/views/";

        $routeProvider
            .when("/", {
                templateUrl: base + "bill/index.html",
                controller: "HomeController",
                controllerAs: "vm"
            })
            .when("/bill/add", {
                templateUrl: base + "bill/add.html",
                controller: "AddController",
                controllerAs: "vm"
            })
            .when("/bill/add-master", {
                templateUrl: base + "master/index.html",
                controller: "MasterController",
                controllerAs: "vm"
            })
            .when("/bill/add-master/:id", {
                templateUrl: base + "master/edit.html",
                controller: "MasterEditController",
                controllerAs: "vm"
            })
            .when("/bill/details/:id", {
                templateUrl: base + "bill/details.html",
                controller: "DetailsController",
                controllerAs: "vm"
            })
            .when("/bill/edit/:id", {
                templateUrl: base + "bill/edit.html",
                controller: "EditController",
                controllerAs: "vm"
            })
            .when("/bill/remove/:id", {
                templateUrl: base + "bill/remove.html",
                controller: "RemoveController",
                controllerAs: "vm"
            });
    });
})(angular.module("billManager"));

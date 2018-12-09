(function (app) {
    "use strict";

    app.service("RepositoryService", RepositoryService);

    RepositoryService.$inject = ["$log", "$http"];

    function RepositoryService($log, $http) {
        var svc = this;

        var apiUrl = "/api";

        svc.getBills = getBills;
        svc.getBill = getBill;
        svc.createBill = createBill;
        svc.updateBill = updateBill;
        svc.deleteBill = deleteBill;

        function getBills(fields) {
            var queryString = [];

            if (fields.pageSize) {
                queryString.push("pageSize=" + fields.pageSize);
            }

            if (fields.vendorName) {
                queryString.push("vendorName=" + fields.vendorName);
            }

            var url = [apiUrl, "bill"].join("/");

            var fullUrl = queryString.length == 0 ? url : [url, "?", queryString.join("&")].join("");

            return $http.get(fullUrl);
        };

        function getBill(id) {
            return $http.get([apiUrl, "bill", id].join("/"));
        };

        function createBill(model) {
            return $http.post([apiUrl, "bill"].join("/"), model);
        };

        function updateBill(id, model) {
            return $http.put([apiUrl, "bill", id].join("/"), model);
        };

        function deleteBill(id) {
            return $http.delete([apiUrl, "bill", id].join("/"));
        };
    };
})(angular.module("billManager"));

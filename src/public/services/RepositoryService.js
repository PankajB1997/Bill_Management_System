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
        svc.getMasterData = getMasterData;
        svc.addNewMasterData = addNewMasterData;
        svc.deleteMasterData = deleteMasterData;

        function getBills(fields) {
            var queryString = [];

            if (fields.pageSize) {
                queryString.push("pageSize=" + fields.pageSize);
            }

            if (fields.vendorName) {
                queryString.push("vendorName=" + fields.vendorName);
            }

            if (fields.billTo) {
                queryString.push("billTo=" + fields.billTo);
            }

            if (fields.billNo) {
                queryString.push("billNo=" + fields.billNo);
            }

            if (fields.billStartDate) {
                queryString.push("billStartDate=" + fields.billStartDate.replace("/", "-").replace("/", "-"));
            }

            if (fields.billEndDate) {
                queryString.push("billEndDate=" + fields.billEndDate.replace("/", "-").replace("/", "-"));
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

        function getMasterData() {
            return $http.get([apiUrl, "master"].join("/"));
        };

        function addNewMasterData(model) {
            return $http.post([apiUrl, "master"].join("/"), model);
        };

        function deleteMasterData(id) {
            return $http.delete([apiUrl, "master", id].join("/"));
        };
    };
})(angular.module("billManager"));

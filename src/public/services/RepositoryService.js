(function (app) {
    "use strict";

    app.service("RepositoryService", RepositoryService);

    RepositoryService.$inject = ["$log", "$http"];

    function RepositoryService($log, $http) {
        var svc = this;

        var apiUrl = "/api";

        svc.getContacts = getContacts;
        svc.getContact = getContact;
        svc.createContact = createContact;
        svc.updateContact = updateContact;
        svc.deleteContact = deleteContact;

        function getContacts(fields) {
            var queryString = [];

            if (fields.pageSize) {
                queryString.push("pageSize=" + fields.pageSize);
            }

            if (fields.firstName) {
                queryString.push("firstName=" + fields.firstName);
            }

            if (fields.middleName) {
                queryString.push("middleName=" + fields.middleName);
            }

            if (fields.lastName) {
                queryString.push("lastName=" + fields.lastName);
            }

            var url = [apiUrl, "contact"].join("/");

            var fullUrl = queryString.length == 0 ? url : [url, "?", queryString.join("&")].join("");

            return $http.get(fullUrl);
        };

        function getContact(id) {
            return $http.get([apiUrl, "contact", id].join("/"));
        };

        function createContact(model) {
            return $http.post([apiUrl, "contact"].join("/"), model);
        };

        function updateContact(id, model) {
            return $http.put([apiUrl, "contact", id].join("/"), model);
        };

        function deleteContact(id) {
            return $http.delete([apiUrl, "contact", id].join("/"));
        };
    };
})(angular.module("contactManager"));

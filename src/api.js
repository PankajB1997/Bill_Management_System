function api (app) {
    var mongojs = require("mongojs");

    var db = mongojs("billManager", ["bills"]);

    days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    app.get("/api/bill", function (request, response) {
        var pageSize = request.query.pageSize ? parseInt(request.query.pageSize) : 1000;
        var vendorName = request.query.vendorName;
        var billTo = request.query.billTo;

        var find = {};

        if (vendorName) {
            find.vendorName = new RegExp(vendorName, "i");
        }
        if (billTo) {
            find.billTo = new RegExp(billTo, "i");
        }

        var fields = {
            vendorName: 1,
            billTo: 1
        };

        var result = db.bills.find(find, fields).sort({ "date": -1 }).limit(pageSize, function (err, docs) {
            response.json(docs);
        });
    });

    app.get("/api/bill/:id", function (request, response) {
        var id = request.params.id;

        db.bills.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            fulldate = new Date(doc["date"]);
            day = days[fulldate.getDay()];
            date = fulldate.getDate();
            month = months[fulldate.getMonth()];
            year = fulldate.getFullYear();
            hours = fulldate.getHours();
            minutes = fulldate.getMinutes();
            seconds = fulldate.getSeconds();
            ampm = (hours >= 12) ? "PM" : "AM";
            hours = (hours > 12) ? hours - 12 : (hours == 0 ? 12 : hours);
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            doc["date"] = day + ", " + date + "-" + month + "-" + year + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;
            response.json(doc);
        });
    });

    app.post("/api/bill", function (request, response) {
        date = new Date(Date.now());
        request.body["date"] = date.toISOString();
        db.bills.insert(request.body, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.put("/api/bill/:id", function (request, response) {
        var id = request.params.id;

        db.bills.findAndModify({
            query: {
                _id: mongojs.ObjectId(id)
            },
            update: {
                $set: {
                    vendorName: request.body.vendorName,
                    billTo: request.body.billTo
                }
            },
            new: true
        }, function (err, doc) {
            response.json(doc);
        });
    });

    app.delete("/api/bill/:id", function (request, response) {
        var id = request.params.id;

        db.bills.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.get("/api/master", function (request, response) {
        // TODO
        response.json({});
    });

    app.post("/api/master", function (request, response) {
        // TODO
        response.json({});
    });
};

module.exports = api;

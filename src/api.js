function api (app) {
    var mongojs = require("mongojs");

    var db = mongojs("contactManager", ["contacts"]);

    days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    app.get("/api/contact", function (request, response) {
        var pageSize = request.query.pageSize ? parseInt(request.query.pageSize) : 1000;
        var firstName = request.query.firstName;
        var middleName = request.query.middleName;
        var lastName = request.query.lastName;

        var find = {};

        if (firstName) {
            find.firstName = new RegExp(firstName, "i");
        }

        if (middleName) {
            find.middleName = new RegExp(middleName, "i");
        }

        if (lastName) {
            find.lastName = new RegExp(lastName, "i");
        }

        var fields = {
            firstName: 1,
            middleName: 1,
            lastName: 1,
            phone: 1,
            email: 1
        };

        var result = db.contacts.find(find, fields).sort({ "date": -1 }).limit(pageSize, function (err, docs) {
            response.json(docs);
        });
    });

    app.get("/api/contact/:id", function (request, response) {
        var id = request.params.id;

        db.contacts.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
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
            doc["date"] = day + ", " + date + "-" + month + "-" + year + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;
            response.json(doc);
        });
    });

    app.post("/api/contact", function (request, response) {
        date = new Date(Date.now());
        request.body["date"] = date.toISOString();
        db.contacts.insert(request.body, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.put("/api/contact/:id", function (request, response) {
        var id = request.params.id;

        db.contacts.findAndModify({
            query: {
                _id: mongojs.ObjectId(id)
            },
            update: {
                $set: {
                    firstName: request.body.firstName,
                    middleName: request.body.middleName,
                    lastName: request.body.lastName,
                    phone: request.body.phone,
                    email: request.body.email
                }
            },
            new: true
        }, function (err, doc) {
            response.json(doc);
        });
    });

    app.delete("/api/contact/:id", function (request, response) {
        var id = request.params.id;

        db.contacts.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
                console.log("Error: " + err);

            response.json(doc);
        });
    });
};

module.exports = api;

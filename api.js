function api (app) {
    var mongojs = require("mongojs");

    var db = mongojs("pankajb:PankajB1997@ds117128.mlab.com:17128/heroku_knfwsjjr", ["bills", "billsMaster"]);

    days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    app.get("/api/bill", function (request, response) {
        var pageSize = request.query.pageSize ? parseInt(request.query.pageSize) : 1000;

        var find = {};

        if (request.query.vendorName) {
            find.vendorName = new RegExp(request.query.vendorName, "i");
        }

        if (request.query.billTo) {
            find.billTo = new RegExp(request.query.billTo, "i");
        }

        if (request.query.billNo) {
            find.billNo = new RegExp(request.query.billNo, "i");
        }

        if (request.query.billStartDate || request.query.billEndDate) {
            find.billDate = {};
            if (request.query.billStartDate) {
                var billDMYS = request.query.billStartDate.split("-");
                var billStartDate = new Date(billDMYS[2], billDMYS[1]-1, billDMYS[0]);
                find.billDate.$gte = billStartDate;
            }
            if (request.query.billEndDate) {
                var billDMYE = request.query.billEndDate.split("-");
                var billEndDate = new Date(billDMYE[2], billDMYE[1]-1, billDMYE[0]);
                find.billDate.$lte = billEndDate;
            }
        }

        var result = db.bills.find(find).sort({ "billDate": -1 }).limit(pageSize, function (err, docs) {
            // for (var i = 0; i < docs.length; i++) {
            //     docs[i]["billDate"] = docs[i]["billDate"].toISOString();
            // }
            // docs.sort(function(a, b) {
            //     a = new Date(a.billDate);
            //     b = new Date(b.billDate);
            //     return a>b ? -1 : a<b ? 1 : 0;
            //     // return b - a;
            // });
            // console.log(docs);
            // for (var i = 0; i < docs.length; i++) {
            //     docs[i]["billDate"] = new Date(docs[i]["billDate"]);
            // }
            for (var i = 0; i < docs.length; i++) {
                if (docs[i]["billDate"]) {
                    day = (docs[i]["billDate"].getDate() < 10) ? "0" + docs[i]["billDate"].getDate() : docs[i]["billDate"].getDate();
                    month = ((docs[i]["billDate"].getMonth() + 1) < 10) ? "0" + (docs[i]["billDate"].getMonth() + 1) : (docs[i]["billDate"].getMonth() + 1);
                    docs[i]["billDate"] = day + "/" + month + "/" + docs[i]["billDate"].getFullYear();
                }
            }
            response.json(docs);
        });
    });

    app.get("/api/bill/:id", function (request, response) {
        var id = request.params.id;

        db.bills.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            // fulldate = new Date(doc["date"]);
            // day = days[fulldate.getDay()];
            // date = fulldate.getDate();
            // month = months[fulldate.getMonth()];
            // year = fulldate.getFullYear();
            // hours = fulldate.getHours();
            // minutes = fulldate.getMinutes();
            // seconds = fulldate.getSeconds();
            // ampm = (hours >= 12) ? "PM" : "AM";
            // hours = (hours > 12) ? hours - 12 : (hours == 0 ? 12 : hours);
            // hours = (hours < 10) ? "0" + hours : hours;
            // minutes = (minutes < 10) ? "0" + minutes : minutes;
            // seconds = (seconds < 10) ? "0" + seconds : seconds;
            // doc["date"] = day + ", " + date + "-" + month + "-" + year + ", " + hours + ":" + minutes + ":" + seconds + " " + ampm;
            if (doc["billDate"]) {
                day = (doc["billDate"].getDate() < 10) ? "0" + doc["billDate"].getDate() : doc["billDate"].getDate();
                month = ((doc["billDate"].getMonth() + 1) < 10) ? "0" + (doc["billDate"].getMonth() + 1) : (doc["billDate"].getMonth() + 1);
                doc["billDate"] = day + "/" + month + "/" + doc["billDate"].getFullYear();
            }
            response.json(doc);
        });
    });

    app.post("/api/bill", function (request, response) {
        date = new Date(Date.now());
        request.body["date"] = date.toISOString();
        if (request.body["billDate"]) {
            var billDMY = request.body["billDate"].split("/");
            request.body["billDate"] = new Date(billDMY[2], billDMY[1]-1, billDMY[0]);
        }
        db.bills.insert(request.body, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.put("/api/bill/:id", function (request, response) {
        var id = request.params.id;
        if (request.body["billDate"]) {
            var billDMY = request.body["billDate"].split("/");
            request.body["billDate"] = new Date(billDMY[2], billDMY[1]-1, billDMY[0]);
        }
        db.bills.findAndModify({
            query: {
                _id: mongojs.ObjectId(id)
            },
            update: {
                $set: {
                    vendorName: request.body.vendorName,
                    billTo: request.body.billTo,
                    billNo: request.body.billNo,
                    billDate: request.body.billDate,
                    items: request.body.items,
                    totalBillAmount: request.body.totalBillAmount,
                    totalClaimAmount: request.body.totalClaimAmount,
                    modeOfPayment: request.body.modeOfPayment,
                    instrumentNo: request.body.instrumentNo,
                    paymentStatus: request.body.paymentStatus
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
        var find = {};

        if (request.query.hoCode) {
            find.hoCode = new RegExp(request.query.hoCode, "i");
        }

        if (request.query.vendorItemCode) {
            find.vendorItemCode = new RegExp(request.query.vendorItemCode, "i");
        }

        if (request.query.itemDescription) {
            find.itemDescription = new RegExp(request.query.itemDescription, "i");
        }
        
        db.billsMaster.find(find).sort({ "hoCode": 1 }, function (err, docs) {
            response.json(docs);
        });
    });

    app.get("/api/master/:id", function (request, response) {
        var id = request.params.id;

        db.billsMaster.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.post("/api/master", function (request, response) {
        db.billsMaster.insert(request.body, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.delete("/api/master/:id", function (request, response) {
        var id = request.params.id;

        db.billsMaster.remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc);
        });
    });

    app.put("/api/master/:id", function (request, response) {
        var id = request.params.id;

        db.billsMaster.findAndModify({
            query: {
                _id: mongojs.ObjectId(id)
            },
            update: {
                $set: {
                    vendorName: request.body.vendorName,
                    vendorItemCode: request.body.vendorItemCode,
                    hoCode: request.body.hoCode,
                    itemDescription: request.body.itemDescription,
                    negotiatedRate: request.body.negotiatedRate
                }
            },
            new: true
        }, function (err, doc) {
            response.json(doc);
        });
    });

    app.get("/api/gst", function (request, response) {
        db.gst.find({}, function (err, doc) {
            if (err)
                console.log("Error: " + err);
            response.json(doc[0]);
        });
    });

    app.post("/api/gst", function (request, response) {
        db.gst.remove({}, function(err, doc) {
            if (err)
                console.log("Error: " + err);
            db.gst.insert(request.body, function (err, doc) {
                if (err)
                    console.log("Error: " + err);
                response.json(doc[0]);
            });
        });
    });
};

module.exports = api;

var mongojs = require("mongojs");
var db = mongojs("billManager", ["bills"]);

var limit = 5;

var vendorNames = ["PISPL", "AURO SALES", "CL INDIA", "COLOR EYES", "DNG", "EAGLE VISION", "FAIR VISION", "J&J", "LAJRT ENTERPRISES"];

var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
};

var getRandomItem = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};

for (var i = 0; i < limit; i++) {
    var vendorName = getRandomItem(vendorNames);

    var item = {
        vendorName: vendorName
    };

    date = new Date(Date.now());
    item["date"] = date.toISOString();

    console.log("Inserting new row...");

    db.bills.insert(item, function (err, doc) {
        if (err) {
            console.log(err);
        }
    });
}

console.log("Done!")
// process.exit(0)

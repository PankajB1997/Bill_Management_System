var mongojs = require("mongojs");
var db = mongojs("billManager", ["bills"]);

var limit = 10;

var vendorNames = ["PISPL", "AURO SALES", "CL INDIA", "COLOR EYES", "DNG", "EAGLE VISION", "FAIR VISION", "J&J", "LAJRT ENTERPRISES"];
var billTos = ["Vision World Pvt. Ltd.", "Specs World Pvt. Ltd.", "The Himalaya Optical Company", "Himalaya Vision Crafter Pvt. Ltd."];
var billNos = ["L4641", "L4642", "L4643", "L4644", "L4645", "L4646", "L4647", "L4648", "L4649", "L4650"];

var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
};

var getRandomItem = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};

for (var i = 0; i < limit; i++) {
    var vendorName = getRandomItem(vendorNames);
    var billTo = getRandomItem(billTos);
    var billNo = billNos[i % billNos.length];

    var item = {
        vendorName: vendorName,
        billTo: billTo,
        billNo: billNo
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

var mongojs = require("mongojs");
var db = mongojs("pankajb:PankajB1997@ds117128.mlab.com:17128/heroku_knfwsjjr", ["bills", "billsMaster"]);

var limit = 10;

var vendorNames = ["PISPL", "AURO SALES", "CL INDIA", "COLOR EYES", "DNG", "EAGLE VISION", "FAIR VISION", "J&J", "LAJRT ENTERPRISES"];
var billTos = ["Vision World Pvt. Ltd.", "Specs World Pvt. Ltd.", "The Himalaya Optical Company", "Himalaya Vision Crafter Pvt. Ltd."];
var billNos = ["L4641", "L4642", "L4643", "L4644", "L4645", "L4646", "L4647", "L4648", "L4649", "L4650"];
var billDates = ["08/09/2018", "04/04/2018", "05/02/2017", "13/10/2018", "05/10/2018", "12/12/2018", "14/09/2018", "26/04/2018", "25/11/2018", "01/01/2018"];

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
    var billDate = billDates[i % billDates.length].split("/");
    // var billDate = getRandomItem(billDates).split("/");
    billDate = new Date(billDate[2], billDate[1]-1, billDate[0]);

    var item = {
        vendorName: vendorName,
        billTo: billTo,
        billNo: billNo,
        billDate: billDate
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

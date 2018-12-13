var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use((req, res, next) => {

  // -----------------------------------------------------------------------
  // authentication middleware

  const auth = { login: 'BILL_MGNT', password: 'BILL_MGNT_2' }

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (!login || !password || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="401"') // change this
    res.status(401).send('Authentication required.') // custom message
    return
  }

  // -----------------------------------------------------------------------
  // Access granted...
  next()

})

var rest = require("./api");
var api = new rest(app);

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running on port!");
});

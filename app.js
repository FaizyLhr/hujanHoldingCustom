let express = require("express");


require("dotenv").config();

// Create global app object
let app = express();
var allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:4300",
  "http://localhost:3000",
  "http://134.122.23.88"
];

require("./server/app-config")(app);

// const http = require('http').Server(app);

// finally, let's start our server...
let server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + server.address().port);
});


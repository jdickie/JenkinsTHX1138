var express = require('express');
var eventRoutes = require(__dirname + "/src/routes/event");
var status = require(__dirname + "/src/routes/status");

var app = express();
var statusRoutes = new status();

// Parsing application/json
app.use(express.json());
// Handles liveness and readiness probes for k8s
app.get('/status', statusRoutes.getStatus);
// for handling Events, including challenges
app.post('/events', eventRoutes.postRoute);


app.listen(3000);
console.log("Listening on port 3000");
console.log(__dirname);
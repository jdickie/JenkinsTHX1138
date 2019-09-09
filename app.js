var express = require('express');
var eventRoutes = require(__dirname + "/src/routes/event");
var status = require(__dirname + "/src/routes/status");
var interactive = require(__dirname + "/src/routes/interactive");

var app = express();
var statusRoutes = new status();

// Parsing application/json
app.use(express.json());
// Slack has mixed url-form-encoded values and other endpoints with JSON. Enabling x-www-form-urlencoded here
app.use(express.urlencoded({ extended: true }));

// Handles liveness and readiness probes for k8s
app.get('/status', statusRoutes.getStatus);
// for handling Events, including challenges
app.post('/events', eventRoutes.postRoute);
// for handling Interactions
app.post('/interactive', interactive.routeInteraction);


app.listen(3000);
console.log("App ready to go...");

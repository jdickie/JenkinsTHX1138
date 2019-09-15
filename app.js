const express = require('express');
const eventRoutes = require(__dirname + "/src/routes/event");
const status = require(__dirname + "/src/routes/status");
const interactive = require(__dirname + "/src/routes/interactive");
const appMention = require(`${__dirname}/src/handlers/appMention`);
const { createEventAdapter } = require('@slack/events-api');
const Config = require('config');
const SIGNING_SECRET = Config.get('slack.signing');

// Creating event adapter with signing secret
// @see https://github.com/slackapi/node-slack-sdk
const slackEvents = createEventAdapter(SIGNING_SECRET);
slackEvents.on('app_mention', appMention.processMention);
// For now, doing this generic error handler
slackEvents.on('error', (error) => {
    console.log('Error: slackEvents', error);
});
 
var app = express();
var statusRoutes = new status();

// Parsing application/json
app.use(express.json());
// Slack has mixed url-form-encoded values and other endpoints with JSON. Enabling x-www-form-urlencoded here
app.use(express.urlencoded({ extended: true }));
// for handling Events, including challenges
app.use('/events', slackEvents.expressMiddleware());

// Handles liveness and readiness probes for k8s
app.get('/status', statusRoutes.getStatus);
// for handling Interactions
app.post('/interactive', interactive.routeInteraction);


app.listen(3000);
console.log("App ready to go...");

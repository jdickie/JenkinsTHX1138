const express = require('express');
const eventRoutes = require(__dirname + "/src/routes/event");
const status = require(__dirname + "/src/routes/status");
const interactive = require(__dirname + "/src/routes/interactive");
const appMention = require(`${__dirname}/src/handlers/appMention`);
const { createEventAdapter } = require('@slack/events-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
const Config = require('config');
const SIGNING_SECRET = Config.get('slack.signing');

// Creating event adapter with signing secret
// @see https://github.com/slackapi/node-slack-sdk
const slackEvents = createEventAdapter(SIGNING_SECRET);
slackEvents.on('app_mention', appMention.processMention);
slackEvents.on('challenge')
// For now, doing this generic error handler
slackEvents.on('error', (error) => {
    console.log('Error: slackEvents', error);
});

// Slack interaction handler
const slackInteractions = createMessageAdapter(SIGNING_SECRET);
slackInteractions.action({
    actionId: 'pickajob'
}, (payload, respond) => {
    const channel = payload.channel.id,
        actions = payload.actions;
        // Determine action from action_id, then process    
        for(const action of actions) {
            console.log('info: parsing action', JSON.stringify(action));
            if(action.action_id === 'pickajob') {
                slackTalker.sendTextToChannel(channel, "Fetching job info...\n");
                interactive.jobInfo().then((servername, list, channel) => {
                    slackTalker.sendJobData(servername, list, channel);
                }).catch(err => {
                    console.log("Error", err);
                    slackTalker.sendTextToChannel(channel, "Oops! Something went wrong");
                });
                break;
            }
        }
    return {
        text: "Fetching job info...\n"
    };  
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
app.use('/interactive', slackInteractions.requestListener());


app.listen(3000);
console.log("App ready to go...");

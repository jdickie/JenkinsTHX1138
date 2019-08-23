var appMention = require(__dirname + "/../handlers/appMention");
var slackTalker = require(__dirname + "/slackTalker");
var helpMessage = require(__dirname + "/../handlers/helpMessage");

class eventReader {
    constructor() {}

    sendToHandler(json) {
        try {
            if (!json.event) {
                console.log("found no event type inside json body", json);
            }
            const eventBody = json.event;
            switch (eventBody.type) {
                case "app_mention":
                    appMention.processMention(json);
                    break;
                default:
                    console.log("Unrecognized event", eventBody.type);
                    slackTalker.sendTextToChannel(eventBody.channel, "Sorry, I'm not programmed to understand that.\nLet me get you my instructions...")
                    helpMessage.helpMessage(eventBody.channel);
            }
        } catch(e) {
            console.log("Error", e);
        }
    }
}

module.exports = new eventReader();
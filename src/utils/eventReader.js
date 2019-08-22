var appMention = require(__dirname + "/../handlers/appMention");
var slackTalker = require(__dirname + "/slackTalker");

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
                    slackTalker.sendMessageToChannel(eventBody.channel, "Well this is embarassing. I haven't been fully programmed yet...Check back later?");
            }
        } catch(e) {
            console.log("Error", e);
        }
    }
}

module.exports = new eventReader();
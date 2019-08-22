var slackTalker = require(__dirname + "/../utils/slackTalker");

class appMention {
    constructor() {}

    processMention(json) {
        console.log("processMention called ", json);
        let eventJSON = json.event;
        let text = eventJSON.text;
        
        var channel = eventJSON.channel;
        slackTalker.sendMessageToChannel(channel, "Test");
    }
}

module.exports = new appMention();

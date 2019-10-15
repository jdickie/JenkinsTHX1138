var slackTalker = require(__dirname + "/../utils/slackTalker");

/**
 * For each type of handler, list out the usage here.
 */
const availableCommands = [
    {
        key: "`list jobs <server>`",
        value: "Provides available options to choose from to get more info about jobs. e.g. `list jobs jenkins`"
    },
    {
        key: "`help`",
        value: "displays this message"
    }
]

class helpMessage {
    constructor() {}

    helpMessage(channel, user) {
        slackTalker.sendTextWithFieldsToUser({
            channel: channel, 
            user: user, 
            text: "Here are a list of available commands:", 
            fields: availableCommands});
    }
}

module.exports = new helpMessage();
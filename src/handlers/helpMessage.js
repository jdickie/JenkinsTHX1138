var slackTalker = require(__dirname + "/../utils/slackTalker");

/**
 * For each type of handler, list out the usage here.
 */
const availableCommands = [
    {
        key: "`info jobs <server>`",
        value: "Scrapes some information from a given server e.g. `info jobs jenkins`"
    },
    {
        key: "`help`",
        value: "displays this message"
    }
]

class helpMessage {
    constructor() {}

    helpMessage(channel) {
        slackTalker.sendTextWithFieldsToChannel(channel, "Here are a list of available commands:", availableCommands);
    }
}

module.exports = new helpMessage();
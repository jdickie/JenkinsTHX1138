var slackTalker = require(__dirname + "/../utils/slackTalker");
var jenkinsinstance = require(__dirname + "/../jenkins/jenkinsinstance");
var helpMessage = require(__dirname + "/helpMessage");

const jobListRegex = /list jobs[\s]*([A-z\-]+)\b/;
const jobSearchRegex = /.*\s(find|is)(.*)/;
const helpRegex = /\bhelp\b/;
const LIST_INTENT = "LIST_INTENT";
const HELP_INTENT = 'HELP_INTENT';
const SEARCH_INTENT = 'SEARCH_INTENT';
let self = null;
class appMention {
    constructor() {
        self = this;
    }

    processMention(eventJSON, respond) {
        const channel = eventJSON.channel,
            user = eventJSON.user;
        self.determineIntent(eventJSON.text).then((intent) => {
            if (intent === null) {
                slackTalker.sendTextToChannel(channel, 
                    "Sorry, I didn't understand that.\nLet me get you my instructions...\n\n")
                helpMessage.helpMessage(channel);
                return;
            }
            switch(intent.intent) {
                case LIST_INTENT:
                    slackTalker.sendJobOptions(intent.data, channel, user);
                    break;
                case SEARCH_INTENT:
                    const data = this.searchJob(intent.jobToFind);
                    if (!data) {
                        slackTalker.sendTextToChannel("Sorry, didn't find anything", channel, user);
                        return;
                    }
                    slackTalker.sendJobOptions(data, channel, user);
                    break;
                case HELP_INTENT:
                default:
                    helpMessage.helpMessage(channel, user);
                    break;
            }
        }).catch(err => {
            console.log('Error', err);
            helpMessage.helpMessage(channel, user);
        });
    }

    determineIntent(userMessage) {
        return new Promise((respond, reject) => {
            let results = userMessage.match(jobListRegex);
            if (results !== null && results.length) {
                const instance = new jenkinsinstance(results[1]);
                if (instance === null) {
                    console.log("Jenkinsinstance returned null");
                    reject("No intent found");
                }
                const jobData = instance.getServerJobList();
                respond({
                    intent: LIST_INTENT,
                    servername: results[1],
                    data: jobData
                });
            }
            results = userMessage.match(jobSearchRegex);
            if (results !== null && results.length) {
                respond({
                    intent: SEARCH_INTENT,
                    jobToFind: results[2]
                });
            }
            results = userMessage.match(helpRegex);
            if (results !== null && results.length) {
                respond({
                    intent: HELP_INTENT
                });
            }
            reject("No intent found");
        });
    }


    /**
     * Uses searchText to look for groups, servers, or job names
     * @param {string} searchText 
     */
    searchJob(searchText) {
        const instance = new jenkinsinstance('jenkins');
        const foundGroups = instance.searchGroups(searchText);
        if (foundGroups.length) {
            return foundGroups;
        } 
        const foundServers = instance.searchServers(searchText);
        if (foundServers.length) {
            return foundServers;
        }
        return null;
    }
}

module.exports = new appMention();

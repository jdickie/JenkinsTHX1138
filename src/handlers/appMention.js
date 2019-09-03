var slackTalker = require(__dirname + "/../utils/slackTalker");
var jenkinsinstance = require(__dirname + "/../jenkins/jenkinsinstance");
var helpMessage = require(__dirname + "/helpMessage");

const jobListRegex = /list jobs[\s]*([A-z\-]+)\b/;
const jobSearchRegex = /find job[\s]+(.*)/;
const helpRegex = /\bhelp\b/;
const JOB_INTENT = "JOB_DATA";
const LIST_INTENT = "LIST_INTENT";
const HELP_INTENT = 'HELP_INTENT';
const SEARCH_INTENT = 'SEARCH_INTENT';
class appMention {
    constructor() {}

    processMention(json) {
        console.log("processMention called ", json);
        let eventJSON = json.event;
        const channel = eventJSON.channel;
        this.determineIntent(eventJSON.text).then(intent => {
            if (intent === null) {
                slackTalker.sendTextToChannel(channel, 
                    "Sorry, I didn't understand that.\nLet me get you my instructions...\n\n")
                helpMessage.helpMessage(channel);
                return;
            }
            switch(intent.intent) {
                case LIST_INTENT:
                    slackTalker.sendJobOptions(intent.servername, intent.data, channel);
                    break;
                case SEARCH_INTENT:

                case HELP_INTENT:
                default:
                    helpMessage.helpMessage(channel);
                    break;
            }
        }).catch(err => console.log('Error', err));
    }

    async determineIntent(userMessage) {
        let results = userMessage.match(jobListRegex);
        if (results !== null && results.length) {
            const instance = new jenkinsinstance(results[1]);
            if (instance === null) {
                console.log("Jenkinsinstance returned null");
                return null;
            }
            const jobData = await instance.getServerJobList();
            console.log('info', jobData);
            return {
                intent: LIST_INTENT,
                servername: results[1],
                data: jobData
            }
        }
        results = userMessage.match(jobSearchRegex);
        if (results !== null && results.length) {
            return {
                intent: SEARCH_INTENT,
                jobToFind: results[1]
            }
        }
        results = userMessage.match(helpRegex);
        if (results !== null && results.length) {
            return {
                intent: HELP_INTENT
            }
        }
        return null;
    }


    /**
     * Uses searchText to look for groups, servers, or job names
     * @param {string} searchText 
     */
    searchJob(searchText) {
        const instance = new jenkinsinstance('jenkins');
        const foundGroups = instance.searchGroups(searchText);
        if (foundGroups.length) {
            
        }
    }
}

module.exports = new appMention();

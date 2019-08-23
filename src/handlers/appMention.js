var slackTalker = require(__dirname + "/../utils/slackTalker");
var jenkinsinstance = require(__dirname + "/../jenkins/jenkinsinstance");
var helpMessage = require(__dirname + "/helpMessage");

const jobDataRegex = /info jobs[\s]*([A-z\-]+)\b/;
const helpRegex = /\bhelp\b/;
const JOB_INTENT = "JOB_DATA";
const HELP_INTENT = 'HELP_INTENT';
class appMention {
    constructor() {}

    processMention(json) {
        console.log("processMention called ", json);
        let eventJSON = json.event;
        const channel = eventJSON.channel;
        this.determineIntent(eventJSON.text).then(intent => {
            console.log('info intent', intent);
            if (intent === null) {
                slackTalker.sendTextToChannel(channel, 
                    "Sorry, I'm not programmed to understand that.\nLet me get you my instructions...")
                helpMessage.helpMessage(channel);
                return;
            }
            switch(intent.intent) {
                case JOB_INTENT:
                    slackTalker.sendJobData(intent.servername, intent.data, channel);
                    break;
                case HELP_INTENT:
                default:
                    helpMessage.helpMessage(channel);
                    break;
            }
        }).catch(err => console.log('Error', err));
    }

    async determineIntent(userMessage) {
        let results = userMessage.match(jobDataRegex);
        if (results !== null && results.length) {
            console.log(`Searching for ${results[1]}`);
            const instance = new jenkinsinstance(results[1]);
            if (instance === null) {
                console.log("Jenkinsinstance returned null");
                return null;
            }
            const jobData = await instance.getServerJobList();
            console.log('info', jobData);
            return {
                intent: JOB_INTENT,
                servername: results[1],
                data: jobData
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
}

module.exports = new appMention();

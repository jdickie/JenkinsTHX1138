const jenkinsinstance = require(`${__dirname}/../jenkins/jenkinsinstance`);
const slackTalker = require(`${__dirname}/../utils/slackTalker`);
/**
 * Handles interactions from Slack
 */
class interactive {
    /**
     * 
     * @param {Object} payload - Payload object from Slack
     */
    handleInteraction(payload) {
        const channel = payload.channel.id;
        const actions = payload.actions;
        // Determine action from action_id, then process    
        for(const action of actions) {
            console.log('info: parsing action', JSON.stringify(action));
            switch(action.action_id) {
                case 'pickajob':
                    this.jobInfo(channel, action.selected_option.value);
                    break;
                default:
                    // do nothing
                    break;
            }
        }
    }

    async jobInfo(channel, value) {
        // Value should be <servername>|job path
        const pieces = value.match(/([A-z\-]+)\|(.*)/);
        const servername = pieces[1];
        const jobPath = pieces[2];
        console.log(`server: ${servername} path: ${jobPath}`);
        const instance = new jenkinsinstance(servername);
        const data = await instance.getJobInfo(jobPath); 
        let list = [];
        list.push({
            "key": "Job",
            "value": `*${data.displayName}*`
        });
        list.push({
            "key": `Last Build : ${data.lastBuild.number}`,
            "value": `<${data.lastBuild.url}|Go to Build Page on ${this.serverName}>`
        });
        slackTalker.sendJobData(servername, list, channel);
    }
}

module.exports = new interactive();
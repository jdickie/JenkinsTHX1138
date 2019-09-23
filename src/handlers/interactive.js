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
                    slackTalker.sendTextToChannel(channel, "Fetching job info...\n");
                    this.jobInfo(channel, action.selected_option.value);
                    break;
                default:
                    // do nothing
                    break;
            }
        }
    }

    jobInfo(channel, value) {
        return new Promise((resolve, reject) => {
            try {
                // Value should be <servername>|job path
                const pieces = value.match(/([A-z\-]+)\|(.*)/);
                const servername = pieces[1];
                const jobPath = pieces[2];

                const instance = new jenkinsinstance(servername);
                const data = await instance.getJobInfo(jobPath); 
                let list = [];
                list.push({
                    "key": "Job",
                    "value": `*${data.displayName}*`
                });
                const lastBuildData = await instance.getBuildInfo(jobPath, data.lastBuild.number);

                list.push({
                    "key": `Last Build : ${data.lastBuild.number}`,
                    "value": `<${data.lastBuild.url}|Go to Build Page on ${servername}>\nResult: ${lastBuildData.result}`
                });
                const timestampRaw = new Date(lastBuildData.timestamp * 1000);
                let extraInfo = `*Time started*:\n ${timestampRaw.getHours()}:${timestampRaw.getMinutes()}:${timestampRaw.getSeconds()}`;

                if(lastBuildData.subBuilds) {
                    extraInfo += "\nJobs called by this job:\n";
                    lastBuildData.subBuilds.forEach(subB => {
                        const subBUrl = `${instance.getJenkinsBaseUrl()}/${subB.url}`;
                        extraInfo += `<${subBUrl}|${subB.jobName}> Result: ${subB.result}\n`;
                    });
                    list.push({
                        "key": 'More info',
                        "value": extraInfo
                    });
                }
                resolve(servername, list, channel);
            } 
            catch (err)
            {
                reject(err);
            }
        });
    }
}

module.exports = new interactive();
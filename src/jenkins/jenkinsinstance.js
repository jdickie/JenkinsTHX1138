var jenkins = require('jenkins');
var Config = require('config');

class jenkinsinstance {
    /**
     * Name should correspond to a key entry under "jenkins" in the config json.
     * @param {string} name 
     */
    constructor(name) {
        try {
            let url = Config.get(`jenkins.${name}.url`);
            this.serverName = name;
            this.jenkinsInstance = jenkins({
                baseUrl: url
            });
            //this.logInfo();
        } catch(e) {
            console.log("Error", e);
            return null;
        }
    }

    logInfo() {
        this.jenkinsInstance.info({depth: 1}, function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(data);
        });
    }

    /**
     * Return back a list of keyword-named jobs that are set up in the config.
     */
    async getServerJobList() {
        var self = this;
        let list = [];
        var jobs = Config.get(`jenkins.${this.serverName}.jobs`);
        for (const job of jobs) {
            list.push({
                key: job.displayName,
                value: job.path
            });
        }
        return list;
    }

    getJobInfo(jobPath) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.jenkinsInstance.job.get(jobPath, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = jenkinsinstance;
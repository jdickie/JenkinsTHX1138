var jenkins = require('jenkins');
var Config = require('config');

class jenkinsinstance {
    /**
     * Name should correspond to a key entry under "jenkins" in the config json.
     * @param {string} name 
     */
    constructor(name) {
        try {
            this.hostname = Config.get(`jenkins.${name}.hostname`);
            const user = Config.get(`jenkins.${name}.user`);
            const password = Config.get(`jenkins.${name}.password`);
            let url = `http://${user}:${password}@${this.hostname}`;
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

    getJenkinsBaseUrl() {
        return `http://${this.hostname}`;
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
            console.log(`Checking job info for ${jobPath}`);
            self.jenkinsInstance.job.get(jobPath, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    getBuildInfo(jobPath, buildNumber) {
        var self = this;
        return new Promise(function(resolve, reject) {
           self.jenkinsInstance.build.get(jobPath, buildNumber, function(err, data) {
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
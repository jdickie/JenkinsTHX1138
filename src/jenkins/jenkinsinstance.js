var jenkins = require('jenkins');

class jenkinsinstance {
    constructor(url) {
        this.jenkinsInstance = jenkins({
            baseUrl: url
        });
    }

    logInfo() {
        console.log("Jenkins info", this.jenkinsInstance.info());
    }
}

module.exports = jenkinsinstance;
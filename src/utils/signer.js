const Config = require('config'),
CryptoJS = require('crypto-js');

const version = 'v0';
const signingKey = Config.get('slack.signing');

class signer {
    /**
     * 
     * @param {Request} req - Request object ExpressJS
     * @returns {boolean}
     */
    verify(req) {
        if (!req.get('X-Slack-Signature')) {
            throw new Error('No slack signature found');
        }
        const compare = req.get('X-Slack-Signature'), 
            hash = this.computeHashFromRequest(req);
        console.log("compare", compare);
        console.log("hash", hash);
        return (compare === hash);
    }

    /**
     * 
     * @param {Request} req - Request object ExpressJS
     */
    computeHashFromRequest(req) {
        try {
            const body = JSON.stringify(req.body),
            timestamp = req.get('X-Slack-Request-Timestamp');
            const hmac = CryptoJS.HmacSHA256(`${version}:${timestamp}:${body}`, signingKey);
            const hmac64 = CryptoJS.enc.Base64.stringify(hash);

        } catch (err) {
            console.log("Error hashing", err);
            throw err;
        }
    }

    checkTimestamp(timestamp) {

    }
}

module.exports = new signer();
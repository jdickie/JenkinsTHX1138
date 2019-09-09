const Config = require('config');

const version = 'v0';

class signer {
    sign(req) {
        if (!req.get('X-Slack-Signature')) {
            throw new Error('No slack signature found');
        }
    }

    computeHashFromRequest(req) {
        const body = JSON.stringify(req.body),
        timestamp = req.get('X-Slack-Request-Timestamp');
        return `${version}:${timestamp}:${body}`
    }
}

module.exports = new signer();
var Config = require('config');
var rp = require('request-promise');
const baseUrl = "https://slack.com/api/";

class slackTalker {
    async sendMessageToChannel(channel, message) {
        if (!message.channel) {
            message.channel = channel;
        }
        var url = baseUrl + "chat.postMessage";
        var token = Config.get('slack.token');
        await this.sendMessage(message, url, token);
    }

    sendMessage(message, url, token) {
        return rp({
            url: url,
            method: "POST",
            json: true,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: message
        }).then(function(response) {
            console.log("info", response);
        }).catch(function(err) {
            console.log("Error", err);
        });
    }
    
    sendTextToChannel(channel, text) {
        this.sendMessageToChannel(channel, {
            text: text
        });
    }

    sendTextWithFieldsToChannel(channel, text, fields) {
        let message = {
            text: text
        }
        message.blocks = [];
        message.blocks.push(this.createSection(text, fields));
        console.log('info', JSON.stringify(message));
        this.sendMessageToChannel(channel, message);
    }

    sendJobData(name, data, channel) {
        let message = {
            text: `Job information from *${name}*`,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Here's information on builds I'm programmed to look for on: ${name}.npr.org.`
                    }
                }
            ]
        }
        if (data.length) {
            message.blocks.push(this.createSection("*More info*", data));
        }
        this.sendMessageToChannel(channel, message);
    }

    createSection(header, fields) {
        let block = {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: header
            }
        }
        block.fields = [];
        console.log('info', fields);
        for (const field of fields) {
            block.fields.push({
                type: "mrkdwn",
                text: `*${field.key}*`
            });
            block.fields.push({
                type: "mrkdwn",
                text: field.value
            });
        }   
        return block;
    }

    createButton() {
        
    }
}

module.exports = new slackTalker();
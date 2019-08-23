var Config = require('config');
var rp = require('request-promise');
const baseUrl = "https://slack.com/api/";

class slackTalker {
    /**
     * @param {string} channel 
     * @param {string} message 
     */
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

    sendJobOptions(name, data, channel) {
        let staticOptions = []
        for (const job of data) {
            staticOptions.push({
                text: {
                    type: 'plain_text',
                    text: job.key
                },
                value: `${name}|${job.value}`
            });
        }
        let message = {
            text: `Which job on ${name} do you want info on?`,
            blocks: [
                {
                    type: 'section',
                    block_id: "joblist",
                    text: {
                        type: "plain_text",
                        text: `What job from ${name} do you want more info on? I can check out the following:`
                    },
                    accessory: {
                        action_id: "pickajob",
                        type: "static_select",
                        placeholder: {
                            type: 'plain_text',
                            text: "Pick a job name,\nI'll come back with data."
                        },
                        options: staticOptions
                    }
                }
            ]
        }
        

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

    createButton(title) {
        var button = {
            type: 'button',
            text: {
                type: "plain_text",
                text: title
            }
        }
    }
}

module.exports = new slackTalker();
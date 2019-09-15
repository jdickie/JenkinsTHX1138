var Config = require('config'),
    { WebClient } = require('@slack/web-api'),
    rp = require('request-promise');
const baseUrl = "https://slack.com/api/",
    SLACK_TOKEN = Config.get('slack.token');
const web = new WebClient(SLACK_TOKEN);

/**
 * Uses the Slack Node SDK WebClient to broker messages to Slack. This doesn't
 * require message signing.
 */
class slackTalker {
    /**
     * @param {string} channel 
     * @param {string} message 
     */
    async sendMessageToChannel(channel, message, user) {
        if (!message.channel) {
            message.channel = channel;
        }
        if (user) {
            message.user = user;
            web.chat.postEphemeral(message);
        } else {
            web.chat.postMessage(message);
        }
    }

    sendMessage(message, url, token) {
        console.log(`Sending to ${url}`);
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
        web.chat.postMessage({
            channel: channel,
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

    sendJobOptions(data, channel, user) {
        let staticOptions = []
        for (const job of data) {
            staticOptions.push({
                text: {
                    type: 'plain_text',
                    text: job.key
                },
                value: `${job.server}|${job.value}`
            });
        }
        let message = {
            text: "Here's a list of jobs found",
            blocks: [
                {
                    type: 'section',
                    block_id: "joblist",
                    text: {
                        type: "plain_text",
                        text: 'Searched around and found the following.\nPick a job to get more info:'
                    },
                    accessory: {
                        action_id: "pickajob",
                        type: "static_select",
                        placeholder: {
                            type: 'plain_text',
                            text: "Pick a job"
                        },
                        options: staticOptions
                    }
                }
            ]
        }
        this.sendMessageToChannel(channel, message, user);
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
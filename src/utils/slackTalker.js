var Config = require('config');
var rp = require('request-promise');
const baseUrl = "https://slack.com/api/";

class slackTalker {
    sendMessageToChannel(channel, message) {
        var url = baseUrl + "chat.postMessage";
        var token = Config.get('slack.token');
        rp({
            url: url,
            method: "POST",
            json: true,
            headers: {
                Authorization: "Bearer " + token
            },
            body: {
               channel: channel,
               text: message.replace(" ", "%20")
            }
        }).then(function(response) {
            console.log("Sent message", response);
        }).catch(function(err) {
            console.log("Error sending message to slack", err);
        });
    }
}

module.exports = new slackTalker();
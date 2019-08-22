var eventReader = require(__dirname + "/../utils/eventReader");

class eventRoutes {
    constructor() {}
    /**
     * Per Slack Events API docs, there should be a JSON body with
     * challenge and token sent to this endpoint. This sends the challenge back
     * @see https://api.slack.com/events-api#request_url_configuration__amp__verification
     * 
     * @param {} req 
     * @param {*} res 
     * @param {function} next 
     */
    postRoute(req, res, next) {
        try {
            let eventJSON = req.body;

            if (eventJSON.type === "url_verification") {
                res.json({
                    "challenge": eventJSON.challenge
                });
                next();
            } else if (eventJSON.type === "event_callback") {
                res.status(200);
                res.send();
                next();
                eventReader.sendToHandler(eventJSON);
            }
        } catch(e) {
            console.log("Error:", e);
        }
        
    }
}

module.exports = new eventRoutes();
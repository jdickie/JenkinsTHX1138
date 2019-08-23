const interactiveHandler = require(`${__dirname}/../handlers/interactive`);
class interactiveRoutes {
    routeInteraction(req, res, next) {
        if (req && req.body && req.body['payload']) {
            const payload = JSON.parse(req.body['payload']);
            // Have to respond to slack right away and then send back responses
            // later. We have a response_callback uri to use for the latter.
            res.status(204);
            next();
            interactiveHandler.handleInteraction(payload);
            
        } else {
            console.log('Invalid interaction request made');
            res.status(500);
            next()
        }
    }
}

module.exports = new interactiveRoutes();
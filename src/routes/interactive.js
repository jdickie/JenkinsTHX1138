const interactiveHandler = require(`${__dirname}/../handlers/interactive`);
class interactiveRoutes {
    routeInteraction(req, res, next) {
        if (req && req.body && req.body['payload']) {
            const payload = JSON.parse(req.body['payload']);
            // Have to respond to slack right away and then send back responses
            // later. We have a response_callback uri to use for the latter.
            res.status(200);
            next();
            interactiveHandler.handleInteraction(payload);
        } else {
            console.log('Invalid interaction request made');
            res.status(500);
            next()
        }
    }

    routeInteractionTest(req, res, next) {
        if (!req.body.token || req.body.token !== "test") {
            res.status(500);
            next();
            return;
        }
        res.status(200);
        interactiveHandler.handleInteraction({
            channel: {
                id: "CJS8VKWJY"
            },
            actions: [
                {
                    action_id: 'pickajob',
                    selected_option: {
                        value: 'jenkins|Stage1/Build_And_Deploy_Seamus'
                    }
                }
            ]
        });
        next();
    }
}

module.exports = new interactiveRoutes();
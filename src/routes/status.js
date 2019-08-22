class statusRoutes {
    constructor() {};

    getStatus(req, res, next) {
        res.status(200).json({
            'status': 'launched'
        });
        next();
    }
}

module.exports = statusRoutes;
const logger = require('../utils/logger');

module.exports = {
    logErrors: function (err, req, res, next) {
        logger.error(err.stack);
        next(err);
    },
    clientErrorHandler: function (err, req, res, next) {
        if (req.xhr) {
            res.status(500).send({ error: 'Something went wrong!' });
        } else {
            next(err);
        }
    },
    errorHandler: function (err, req, res, next) {
        res.status(500);
        res.render('error', { error: err });
    }
}
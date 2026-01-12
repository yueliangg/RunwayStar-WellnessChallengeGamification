module.exports.withMessage = function(message, status) {
    return function (req ,res ,next) {
        res.locals.message = message;
        if (status) res.locals.status = status;
        next();
    };
};

module.exports.sendResponse = function(req,res) {
    const status = res.locals.status || 200;
    const message = res.locals.message || 'Success';

    const data = res.locals.data;
    res.status(status).json(res.locals.data);
};

/* 
need to add this in routes 

const { withMessage, sendResponse } = require('../../middleware/response');

withMessage("All Users fetched successfully", 200),
sendResponse 
*/


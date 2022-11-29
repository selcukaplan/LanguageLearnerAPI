

const {StatusCodes} = require('http-status-codes');
const ResponseController = require('../controllers/responseController');

async function errorHandlerMiddleware (error,request,response,next) {
    let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return response.status(statusCode).json(ResponseController.getErrorResponse(error));

}

module.exports = errorHandlerMiddleware;

const {StatusCodes} = require('http-status-codes');

class ResponseController {

    static getErrorResponse(error) {
        return {
            isDone: false,
            errorStatus: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
            error : error.message || error
        }

    }

    static getDataResponse(data) {
        return {
            isDone: true,
            data
        }
    }

}

module.exports = ResponseController;
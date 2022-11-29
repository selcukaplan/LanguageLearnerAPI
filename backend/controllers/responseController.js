

class ResponseController {

    static getErrorResponse(error) {
        return {
            isDone: false,
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
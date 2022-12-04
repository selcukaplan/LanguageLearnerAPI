

class ResponseController {

    static createResponseError(error) {
        return {
            isDone: false,
            error : error.message || error
        }

    }

    static createResponseData(data) {
        return {
            isDone: true,
            data
        }
    }

}

module.exports = ResponseController;
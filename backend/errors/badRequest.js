

const HTTPError = require('./HTTPError');
const { StatusCodes } = require('http-status-codes');


class BadRequest extends  HTTPError {

    constructor(message) {
        super(message,StatusCodes.BAD_REQUEST);
    }
}

module.exports = BadRequest;
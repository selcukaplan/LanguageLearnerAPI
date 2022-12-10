


const HTTPError = require('./HTTPError');
const { StatusCodes } = require('http-status-codes');


class UnAuthenticated extends  HTTPError {

    constructor(message) {
        super(message,StatusCodes.UNAUTHORIZED);
    }
}

module.exports = UnAuthenticated;
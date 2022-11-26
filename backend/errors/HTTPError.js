

class HTTPError extends Error {

    #statusCode;

    constructor(message,statusCode) {
        super(message);
        this.#statusCode=statusCode;
    }

    getStatusCode() {
        return this.#statusCode;
    }
}

module.exports= HTTPError;
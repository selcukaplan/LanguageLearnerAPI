


import {HTTPError} from "./HTTPError";

import {StatusCodes} from "http-status-codes";


export default class UnAuthenticated extends  HTTPError {

    constructor(message: string) {
        super(message,StatusCodes.UNAUTHORIZED);
    }
}

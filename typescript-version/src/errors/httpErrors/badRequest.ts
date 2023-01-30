

import {StatusCodes} from "http-status-codes";
import {HTTPError} from "./HTTPError";


export default class BadRequest extends  HTTPError {

    constructor(message: string) {
        super(message,StatusCodes.BAD_REQUEST);
    }
}


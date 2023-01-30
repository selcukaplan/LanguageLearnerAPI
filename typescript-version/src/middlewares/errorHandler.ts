
import {NextFunction, Request, Response} from "express";

import {StatusCodes} from "http-status-codes";

import {HTTPError} from "../errors/httpErrors/HTTPError";

import ResponseService from "../services/responseService";

  async function errorHandlerMiddleware (error: Error,request: Request,response: Response,next: NextFunction) {
    let statusCode : number;
    if (error instanceof HTTPError) {
        statusCode =error.statusCode;
    } else {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return response.status(statusCode).json(ResponseService.createResponseError(error));
}

export default errorHandlerMiddleware;

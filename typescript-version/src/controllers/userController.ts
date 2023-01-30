
import {Request, Response, NextFunction} from "express";

import User, {IUser} from "../models/user";

import {StatusCodes} from "http-status-codes";

import ResponseService, {ResponseData} from "../services/responseService";

import AuthorizationService, {AuthenticatedRequest} from "../services/authorizationService";

import UnAuthenticated from "../errors/httpErrors/unAuthenticated";

export interface UserPayload  {
    userId: string;
}

export default class UserController {

    private static userModel: User;

    /*
    static fetchUserIdFromRequest(request : Request) {
        const userId=request.headers.authorization;
        if (!userId) {
            throw new Error('Authentication was not provided!');
            //throw new UnAuthenticated('Authentication was not provided!');
        }
        return userId;
    }
    */

    static async signUpUser(request: Request,response: Response,next: NextFunction) {
        try {
            const newUser = await UserController.userModel.signUp(request.body);
            const newUserToken = await UserController.createToken(newUser._id);
            const responseData = ResponseController.createResponseData(newUserToken)
            return response.status(StatusCodes.CREATED).json(responseData);
        } catch (error) {
            next(error);
        }
    }





}
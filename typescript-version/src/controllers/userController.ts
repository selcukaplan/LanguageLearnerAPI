
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

    static fetchUserIdFromRequest(request : AuthenticatedRequest): string {
        const payload : object | string | undefined = request.payload;
        if (typeof payload === 'string' || !payload) {
            throw new UnAuthenticated("Invalid payload!");
        }
        const userId =(payload as UserPayload)['userId'];
        if (!userId) {
            throw new UnAuthenticated('Authentication was not provided!');
        }
        return userId;
    }


    static async signUpUser(request: Request,response: Response,next: NextFunction) {
        try {
            const newUser: IUser = await UserController.userModel.signUp(request.body);
            const newUserToken: string = AuthorizationService.createToken({userId : newUser._id});
            const responseData: ResponseData<string> = ResponseService.createResponseData(newUserToken);
            return response.status(StatusCodes.CREATED).json(responseData);
        } catch (error) {
            next(error);
        }
    }





}
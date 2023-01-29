
import {Request, Response, NextFunction} from "express";

import jwt,{Secret,JwtPayload} from "jsonwebtoken";

import User, {IUser} from "../models/user";


class UserController {

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
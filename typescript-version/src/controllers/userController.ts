
import {Request, Response, NextFunction} from "express";

import User, {IUser} from "../models/user";

import {StatusCodes} from "http-status-codes";

import ResponseService, {ResponseData} from "../services/responseService";

import AuthorizationService, {AuthenticatedRequest} from "../services/authorizationService";

import UnAuthenticated from "../errors/httpErrors/unAuthenticated";

import BadRequest from "../errors/httpErrors/badRequest";

export interface UserPayload  {
    userId: string;
}

export default class UserController {

    private static userModel: User=new User();

    protected static fetchUserIdFromRequest(request : AuthenticatedRequest
    ): string {
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

    static async loginUser(request: Request,response: Response,next: NextFunction) {
        try {
            const user: IUser =await UserController.userModel.login(request.body.email,request.body.password);
            const userToken: string=AuthorizationService.createToken({userId : user._id});
            const responseData: ResponseData<string> =ResponseService.createResponseData(userToken);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getUsersHasSameForeignLanguages(request: Request, response: Response, next: NextFunction) {
        try {
            const currentUserId = UserController.fetchUserIdFromRequest(request as AuthenticatedRequest);
            const otherUsers : Array<IUser> = await UserController.userModel.getUsersWithSameForeignLanguages(currentUserId);
            const responseData = ResponseService.createResponseData(otherUsers);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getUsers(request: Request,response: Response,next : NextFunction) {
        try {
            const users: Array<IUser> = await UserController.userModel.getAllUsers();
            const responseData = ResponseService.createResponseData(users);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getFriendsOfUser(request: Request
                                  ,response: Response,next: NextFunction) {
        try {
            const currentUserId = UserController.fetchUserIdFromRequest(request as AuthenticatedRequest);
            const friendsOfUser: Array<String> =await UserController.userModel.getFriends(currentUserId);
            const responseData = ResponseService.createResponseData(friendsOfUser);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }


    static async updateUser(request: Request
                            ,response: Response,next: NextFunction) {
        try {
            const userBody=request.body;
            const currentUserId=UserController.fetchUserIdFromRequest(request as AuthenticatedRequest);
            const newUserInfo: IUser = await UserController.userModel.updateUser(currentUserId, userBody);
            const responseData=ResponseService.createResponseData(newUserInfo)
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

    static async addFriendToUser(request: Request
                                 , response: Response, next: NextFunction) {
        try {
            const newFriendId=request.params.friendId;
            if (!newFriendId) {throw new BadRequest('Friend id is not found in the request')};
            const currentUserId=UserController.fetchUserIdFromRequest(request as AuthenticatedRequest);
            const updatedUser: IUser =await UserController.userModel.addFriendToUser(currentUserId, newFriendId);
            const responseData=ResponseService.createResponseData(updatedUser);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async removeFriendFromUser(request: Request
                                      ,response: Response,next: NextFunction) {
        try {
            const friendId=request.params.friendId;
            if (!friendId) {throw new BadRequest('Friend id is not found in the request')};
            const currentUserId=UserController.fetchUserIdFromRequest(request as AuthenticatedRequest);
            const updatedUser: IUser=await UserController.userModel.removeFriendFromUser(currentUserId,friendId);
            if (!updatedUser) {throw new BadRequest('Remove friend operation is not successful!')}
            const responseData=ResponseService.createResponseData(updatedUser);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

}


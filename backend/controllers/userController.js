
const {StatusCodes} = require('http-status-codes');
const User = require('../models/user');
const ResponseController = require('./responseController');
const jwt=require('jsonwebtoken');
const {UnAuthenticated} = require("../errors");

class UserController {

    static #user=new User();

     static async #createToken(userInfo) {
         return await jwt.sign({userInfo}, process.env.JWT_SECRET,
             {expiresIn: process.env.JWT_LIFETIME}
         );

     }

     static #getUserId(request) {
         const userId=request.user;
         if (!userId) {
             throw new UnAuthenticated('Authentication was not provided!');
         }
         return userId;
     }

    static async signUpUser(request,response,next) {
         try {
             const newUser = await UserController.#user.signUp(request.body);
             const newUserToken = await UserController.#createToken(newUser.id);
             const responseData = ResponseController.getDataResponse(newUserToken)
             response.status(StatusCodes.CREATED).json(responseData);
         } catch (error) {
             next(error);
         }
    }

    static async loginUser(request,response,next) {
         try {
             const user=await UserController.#user.login(request.body);
             const userToken=await UserController.#createToken(user.id);
             const responseData=ResponseController.getDataResponse(userToken);
             response.status(StatusCodes.OK).json(responseData);
         } catch (error) {
             next(error);
         }

    }

    static async getUsersWithSameForeignLanguages(request,response,next) {
         try {
                const currentUserId = UserController.#getUserId(request);
                // Todo: foreign languages will be stored as a map in the database
                const currentUser=await UserController.#user.getModel()
                    .findById(currentUserId);
                const currentUserForeignLanguages = currentUser.foreignLanguages;
                const otherUsers=await UserController.#user.getModel()
                    .find({'foreignLanguages' : { $in : currentUserForeignLanguages}, "_id" : { $ne : currentUserId}});
                const responseData = ResponseController.getDataResponse(otherUsers);
                response.status(StatusCodes.OK).json(responseData);
         } catch (error) {
             next(error);
         }
    }

    static async getFriendsOfUser(request,response,next) {
        try {
            const currentUserId = UserController.#getUserId(request);
            const friendsOfUser=await UserController.#user.getModel()
                .findById(currentUserId).select('friends');
            const responseData = ResponseController.getDataResponse(friendsOfUser);
            response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getUsers(request,response,next) {
         try {
             const users = await UserController.#user.getModel().find();
             const responseData = ResponseController.getDataResponse(users);
             response.status(StatusCodes.OK).json(responseData);
         } catch (error) {
             next(error);
         }
    }


    static async updateUser(request,response,next) {
         try {
             const currentUserId=UserController.#getUserId(request);
             const newUserInfo=request.body;
             if (!UserController.#user.isSubSetOfDefinitions(newUserInfo)) {
                 throw new BadRequest('User body is not valid!');
             }
             const oldUserInfo= await UserController.#user.getModel()
                 .findByIdAndUpdate(currentUserId,newUserInfo);
             const responseData=ResponseController.getDataResponse(oldUserInfo)
             return response.status(StatusCodes.OK).json(responseData);
         } catch (error) {
             next(error);
         }

    }

    static async addFriendsToUser(request,response,next) {
         try {
             const newFriendId=request.params.friendId;
             if (!newFriendId) {throw new BadRequest('Friend id is not found in the request')};
             const currentUserId=UserController.#getUserId(request);
             const currentUser=await UserController.#user.getModel().findById(currentUserId).select('friends');
             currentUser.friends.push(newFriendId);
             const updatedUser=await UserController.#user.getModel().findByIdAndUpdate(currentUserId,currentUser);
             const responseData=ResponseController.getDataResponse(updatedUser);
             return response.status(StatusCodes.OK).json(responseData);
         } catch (error) {
             next(error);
         }
    }





}

module.exports = UserController;
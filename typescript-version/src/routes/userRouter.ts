
import {Router} from "express";

import UserController from "../controllers/userController";

import AuthorizationService from "../services/authorizationService";

const userRouter: Router = Router();

userRouter.post('/signup', UserController.signUpUser);

userRouter.post('/login', UserController.loginUser);

userRouter.get('/foreignLanguages', [AuthorizationService.authenticateHTTPRequest,UserController.getUsersHasSameForeignLanguages]);

userRouter.get('/friends',[AuthorizationService.authenticateHTTPRequest,UserController.getFriendsOfUser]);

userRouter.get('/', [UserController.getUsers]);

userRouter.patch('/update',[AuthorizationService.authenticateHTTPRequest,UserController.updateUser]);

userRouter.patch('/addFriend/:friendId',[AuthorizationService.authenticateHTTPRequest,UserController.addFriendToUser]);

userRouter.patch('/removeFriend/:friendId',[AuthorizationService.authenticateHTTPRequest,UserController.removeFriendFromUser]);

export default userRouter;
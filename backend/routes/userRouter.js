
const express=require('express');

const UserController=require('../controllers/userController');

const {authenticateTheUserForHTTP} = require('../middlewares/authentication');

const userRouter = express.Router();

userRouter.post('/signup', UserController.signUpUser);

userRouter.post('/login', UserController.loginUser);

userRouter.get('/foreignLanguages', [authenticateTheUserForHTTP,UserController.getUsersHasSameForeignLanguages]);

userRouter.get('/friends',[authenticateTheUserForHTTP,UserController.getFriendsOfUser]);

userRouter.get('/', [UserController.getUsers]);

userRouter.patch('/update',[authenticateTheUserForHTTP,UserController.updateUser]);

userRouter.patch('/addFriend/:friendId',[authenticateTheUserForHTTP,UserController.addFriendToUser]);

userRouter.patch('/removeFriend/:friendId',[authenticateTheUserForHTTP,UserController.removeFriendFromUser]);

module.exports=userRouter;
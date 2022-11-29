
const express=require('express');

const UserController=require('../controllers/userController');

const authenticateTheUser = require('../middlewares/authentication');

const userRouter = express.Router();

userRouter.post('/signup', UserController.signUpUser);

userRouter.post('/login', UserController.loginUser);

userRouter.get('/ForeignLanguages', [authenticateTheUser,UserController.getUsersWithSameForeignLanguages]);

userRouter.get('/friends',[authenticateTheUser,UserController.getFriendsOfUser]);

userRouter.get('/', [authenticateTheUser,UserController.getUsers]);

module.exports=userRouter;
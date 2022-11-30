
const express=require('express');

const UserController=require('../controllers/userController');

const authenticateTheUser = require('../middlewares/authentication');

const userRouter = express.Router();

userRouter.post('/signup', UserController.signUpUser);

userRouter.post('/login', UserController.loginUser);

userRouter.get('/foreignLanguages', [authenticateTheUser,UserController.getUsersHasSameForeignLanguages]);

userRouter.get('/friends',[authenticateTheUser,UserController.getFriendsOfUser]);

userRouter.get('/', [UserController.getUsers]);

userRouter.patch('/update',[authenticateTheUser,UserController.updateUser]);

module.exports=userRouter;
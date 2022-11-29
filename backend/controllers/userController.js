
const {StatusCodes} = require('http-status-codes');
const User = require('../models/user');
const ResponseController = require('./responseController');
const jwt=require('jsonwebtoken');

class UserController {

    static #user=new User();

     static async #createToken(userInfo) {
         return await jwt.sign({userInfo}, process.env.JWT_SECRET,
             {expiresIn: process.env.JWT_LIFETIME}
         );

     }

    static async signUpUser(request,response,next) {
         try {
             const newUser = await UserController.#user.signUp(request.body);
             const newUserToken = await UserController.#createToken(newUser._id);
             const responseData = ResponseController.getDataResponse(newUserToken)
             response.status(StatusCodes.CREATED).json(responseData);
         } catch (error) {
             next(error);
         }
    }

}

module.exports = UserController;
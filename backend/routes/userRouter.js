
const express=require('express');

const UserController=require('../controllers/userController');


class UserRouter {

    static #router=express.Router();

    static addRequestHandlerToPostRouter(path,requestHandler) {
        UserRouter.#router.post(path,requestHandler);

    }
    static getRouter() {
        return UserRouter.#router;
    }

}

UserRouter.addRequestHandlerToPostRouter('/signup', UserController.signUpUser);

module.exports=UserRouter;
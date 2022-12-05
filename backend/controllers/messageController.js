


const {StatusCodes} = require('http-status-codes');
const Message = require('../models/message');
const ResponseController = require('./responseController');
const UserController = require("./userController");
const {BadRequest} = require("../errors");

class MessageController {

    //Todo: all return statements coming from the database will be checked for whether they returned error or not

    static #message=new Message();


    static async createMessage(request, response, next) {
        try {
            const senderId=UserController.fetchUserIdFromRequest(request);
            const messageBody=request.body; // Todo: message body will be checked
            const newMessage=await MessageController.#message.getModel().create({...messageBody,senderId});
            const responseData = ResponseController.createResponseData(newMessage);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getMessagesOfConversation(request, response, next) {
        try {
            const conversationId= request.params.conversationId;
            const messagesOfConversation = await MessageController.#message.getModel().find({conversationId});
            const responseData = ResponseController.createResponseData(messagesOfConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async removeMessage(request,response,next) {
        try {
            const senderId=UserController.fetchUserIdFromRequest(request);
            const messageId=request.params.messageId;
            const removedMessage=await MessageController.#message.getModel()
                .findOneAndDelete({senderId, _id : messageId});
            const responseData=ResponseController.createResponseData(removedMessage);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

}

module.exports = MessageController;
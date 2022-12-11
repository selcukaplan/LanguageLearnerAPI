


const {StatusCodes} = require('http-status-codes');
const Message = require('../models/message');
const ResponseController = require('./responseController');
const UserController = require("./userController");

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


    static async getMessagesWithOffsetPagination(request, response, next) {
        try {
            const conversationId = request.params.conversationId;
            const {page = 1, limit = 5} = request.query;
            const skipCount = (page - 1) * limit;
            const messagesOfConversation = await MessageController.#message.getModel()
                .find({conversationId})
                .limit(limit)
                .skip(skipCount)
                .sort({'createdAt' : -1})
            if (!messagesOfConversation) {throw new BadRequest('messages of conversation is not found!')}
            const totalMessages = await MessageController.#message.getModel().countDocuments({conversationId});
            const totalPages = Math.ceil(totalMessages / limit);
            const paginationInfo = {
                messagesOfConversation,
                totalPages,
                currentPage: Number(page)
            }
            const responseData = ResponseController.createResponseData(paginationInfo);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }


    static async getMessagesWithDateCursorPagination(request, response, next) {
        try {
            const conversationId = request.params.conversationId;
            const {limit = 5, next = Date.now()} = request.query;
            let nextCursorTimeStamp = next;
            const messagesOfConversation = await MessageController.#message.getModel()
                .find({conversationId, createdAt : {$lte : new Date(Number(nextCursorTimeStamp))}})
                .limit(Number(limit) + 1)
                .sort({createdAt : -1})
            nextCursorTimeStamp=-1;
            const isFinished=messagesOfConversation.length === 1;
            if (!isFinished) {
                const lastElement = messagesOfConversation[messagesOfConversation.length - 1];
                nextCursorTimeStamp = lastElement && new Date(lastElement.createdAt).getTime();
                messagesOfConversation.pop();
            }
            const paginationInfo = {
                messagesOfConversation,
                currentLimit : limit,
                isFinished,
                nextCursorTimeStamp
            }
            const responseData = ResponseController.createResponseData(paginationInfo);
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
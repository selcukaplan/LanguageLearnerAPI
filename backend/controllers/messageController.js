


const {StatusCodes} = require('http-status-codes');
const Message = require('../models/message');
const ResponseController = require('./responseController');
const UserController = require("./userController");
const {BadRequest} = require("../errors");

class MessageController {

    static #message=new Message();


    static async createMessage(request, response, next) {
        try {
            const senderId=UserController.fetchUserIdFromRequest(request);
            const messageBody={...request.body,senderId};
            if (!MessageController.#message.areRequiredDefinitionKeysMatched(messageBody)) {
                throw new BadRequest('Message body is not valid!');
            }
            const newMessage=await MessageController.#message.getModel().create(messageBody);
            if (!newMessage) {throw new BadRequest('Message could not be created!')};
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
            if (!messagesOfConversation) {throw new BadRequest('messages of conversation is not found!')}
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
            if (!messagesOfConversation) {throw new BadRequest('messages of conversation is not found!')}
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
            if (!messageId) {throw new BadRequest('message id is not found!')}
            const removedMessage=await MessageController.#message.getModel()
                .findOneAndDelete({senderId, _id : messageId});
            if (!removedMessage) {throw new BadRequest('message could not be removed!')}
            const responseData=ResponseController.createResponseData(removedMessage);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

}

module.exports = MessageController;



const {StatusCodes} = require('http-status-codes');
const Conversation = require('../models/conversation');
const ResponseController = require('./responseController');
const UserController = require("./userController");
const {BadRequest} = require("../errors");

class ConversationController {

    //Todo: all return statements coming from the database will be checked for whether they returned error or not

    static #conversation=new Conversation();


    static async createConversation(request, response, next) {
        try {
            const membersBody=request.body;
            if (!ConversationController.#conversation.areRequiredKeysMatched(membersBody)) {
                throw BadRequest('Conversation body is not valid!');
            }
            const newConversation=await ConversationController.#conversation.getModel().create(membersBody);
            const responseData = ResponseController.getDataResponse(newConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getConversationOfMembers(request,response,next) {
        try {
            const currentMemberId=UserController.getUserId(request);
            const anotherMembersId= request.body;
            const conversation = await ConversationController.#conversation.getModel().find({"members" : [...anotherMembersId,currentMemberId]});
            const responseData = ResponseController.getDataResponse(conversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async addMembersToConversation(request,response,next) {
        try {
            const conversationId=request.params.conversationId;
            const newMembers = request.body;
            if (!ConversationController.#conversation.isSubSetOfDefinitions(newMembers)) {
                throw BadRequest('Members body is not valid');
            }
            const updatedConversation=await CommentController.#conversation.getModel()
                .findByIdAndUpdate(conversationId,{$push : {"members" : newMembers}});
            const responseData=ResponseController.getDataResponse(updatedConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

    static async removeMembersFromConversation(request,response,next) {
        try {
            const conversationId=request.params.conversationId;
            const deletedMembers = request.body;
            if (!ConversationController.#conversation.isSubSetOfDefinitions(deletedMembers)) {
                throw BadRequest('Members body is not valid');
            }
            const updatedConversation=await CommentController.#conversation.getModel()
                .findByIdAndUpdate(conversationId,{ $pull : {"members" : newMembers}});
            const responseData=ResponseController.getDataResponse(updatedConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

//TODO: conversation router will be added and all controller methods will be tested

}

module.exports = CommentController;
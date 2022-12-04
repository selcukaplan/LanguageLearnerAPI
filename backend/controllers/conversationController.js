


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
            const newMembers = request.body.members;
            const updatedConversation=await ConversationController.#conversation.getModel()
                .findByIdAndUpdate(conversationId,{$push : {$each : {"members" : newMembers}}});
            const responseData=ResponseController.createResponseData(updatedConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

    static async removeMembersFromConversation(request,response,next) {
        try {
            const conversationId=request.params.conversationId;
            const deletedMembers= request.body.members;
            const updatedConversation=await ConversationController.#conversation.getModel()
                .findByIdAndUpdate(conversationId,{ $pull : {"members" :  {$in : deletedMembers}}});
            const responseData=ResponseController.createResponseData(updatedConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

//TODO: conversation router will be added and all controller methods will be tested

}

module.exports = CommentController;
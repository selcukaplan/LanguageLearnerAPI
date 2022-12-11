


const {StatusCodes} = require('http-status-codes');
const Conversation = require('../models/conversation');
const ResponseController = require('./responseController');
const UserController = require("./userController");
const {BadRequest} = require("../errors");

class ConversationController {

    static #conversation=new Conversation();


    static async createConversation(request, response, next) {
        try {
            const membersBody=request.body;
            if (!ConversationController.#conversation.areRequiredDefinitionKeysMatched(membersBody)) {
                throw new BadRequest('Members body is not valid!');
            }
            const newConversation=await ConversationController.#conversation.getModel().create(membersBody);
            if (!newConversation) {throw new BadRequest('conversation could not created!')};
            const responseData = ResponseController.createResponseData(newConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async getConversationOfMembers(request,response,next) {
        try {
            const currentMemberId=UserController.fetchUserIdFromRequest(request);
            const anotherMembersId= request.body.members;
            if (!anotherMembersId) {throw new BadRequest('another members are not found!')};
            const conversation = await ConversationController.#conversation.getModel().find({"members" : {$all : [...anotherMembersId,currentMemberId]}});
            if (!conversation) {throw new BadRequest('conversation is not found!')};
            const responseData = ResponseController.createResponseData(conversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async addMembersToConversation(request,response,next) {
        try {
            const conversationId=request.params.conversationId;
            const newMembers = request.body.members;
            if (!newMembers || !conversationId) {throw new BadRequest('conversation definitions are not valid!')};
            const updatedConversation=await ConversationController.#conversation.getModel()
                .findByIdAndUpdate(conversationId,{$push : {"members": {$each : newMembers}}}); //TODO: will check
            if (!updatedConversation) {throw new BadRequest('conversation could not be updated!')};
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
            if (!deletedMembers || !conversationId) {throw new BadRequest('conversation definitions are not valid!')};
            const updatedConversation=await ConversationController.#conversation.getModel()
                .findByIdAndUpdate(conversationId,{ $pull : {"members" :  {$in : deletedMembers}}});
            //Todo: if members length smaller than two, conversation  will  be deleted automatically
            if (!updatedConversation) {throw new BadRequest('conversation could not be updated!')};
            const responseData=ResponseController.createResponseData(updatedConversation);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = ConversationController;
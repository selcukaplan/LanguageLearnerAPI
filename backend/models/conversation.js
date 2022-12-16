
const MongoDBCollection=require('./mongoDBCollection');
const {BadRequest} = require("../errors");

class Conversation extends  MongoDBCollection{

    static #conversationName="Conversation";

    static #conversationDefinitions = {
        members: { //TODO: ref will be added for population
            // TODO: Index property can be added to decrease complexity
            //TODO: hash set can be used because members are unique
            type:Array,
            required: true,
            validate:  [Conversation.#hasTwoMembers,"At least two members must exist"]
        }
    }

    static #hasTwoMembers(arr) { // Todo: could be generic method for all mongoDB collections
        return arr.length >= 2;

    }

    constructor(collectionName=Conversation.#conversationName,
                collectionDefinitions = Conversation.#conversationDefinitions) {
        super(collectionName,collectionDefinitions);
    }

    async addMembersToConversation(conversationId,newMembers) {
       const updatedConversation =await this.getModel()
           .findByIdAndUpdate(conversationId,{$push : {"members": {$each : newMembers}}});
        if (!updatedConversation) {throw new BadRequest('conversation could not be updated!')}
        return updatedConversation;

    }

    async removeMembersFromConversation(conversationId,removedMembers) {
        await this.getModel()
            .findByIdAndUpdate(conversationId,{ $pull : {"members" :  {$in : removedMembers}}});

    }



}

module.exports = Conversation;
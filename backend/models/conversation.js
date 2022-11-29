
const MongoDBCollection=require('mongoDBCollection');

class Conversation extends  MongoDBCollection{

    static #conversationName="Conversation";

    static #conversationDefinitions = {
        members: {
            // TODO: Index property can be added to decrease complexity
            type:Array,
            required:true
        }
    }
    constructor(collectionName=Conversation.#conversationName,
                collectionDefinitions = Conversation.#conversationDefinitions) {
        super(collectionName,collectionDefinitions);
    }
}

module.exports = Conversation;

const MongoDBCollection=require('mongoDBCollection');

class Conversation extends  MongoDBCollection{

    static #modelName="Conversation";

    static #conversationDefinitions = {
        members: {
            // TODO: Index property can be added to decrease complexity
            type:Array,
            required:true
        }
    }
    constructor() {
        super(Conversation.#modelName,Conversation.#conversationDefinitions);
    }
}

module.exports = Conversation;
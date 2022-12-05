
const MongoDBCollection=require('./mongoDBCollection');

class Message extends  MongoDBCollection{

    static #messageName="Message";

    static #messageDefinitions = {
        senderId: {
            type:String,
            required:true
        },
        conversationId : {
            type:String,
            required:true
        },
        text : {
            type:String,
            required:true
        }
    }

    constructor(collectionName=Message.#messageName,collectionDefinitions = Message.#messageDefinitions) {
        super(collectionName,collectionDefinitions);
    }
}

module.exports = Message;
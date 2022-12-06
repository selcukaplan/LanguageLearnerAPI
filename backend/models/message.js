
const MongoDBCollection=require('./mongoDBCollection');

class Message extends  MongoDBCollection{

    static #messageName="Message";

    static #messageDefinitions = {
        senderId: { //TODO: ref will be added for population
            type:String,
            required:true
        },
        conversationId : { //TODO: ref will be added for population
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

const MongoDBCollection=require('mongoDBCollection');

class Message extends  MongoDBCollection{

    static #modelName="Message";

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

    constructor() {
        super(Message.#modelName,Message.#messageDefinitions);

    }

}

module.exports = Message;
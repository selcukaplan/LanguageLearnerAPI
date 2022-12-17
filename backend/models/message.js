
const MongoDBCollection=require('./mongoDBCollection');
const {BadRequest} = require("../errors");

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


    async getMessagesWithDateCursorPagination(conversationId,limit ,next) {
        let nextCursorTimeStamp = next;
        const messagesOfConversation = await this.getModel()
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
        return paginationInfo;
    }

    async getMessagesWithOffsetPagination(conversationId,page,limit) {
        const skipCount = (page - 1) * limit;
        const messagesOfConversation = await this.getModel()
            .find({conversationId})
            .limit(limit)
            .skip(skipCount)
            .sort({'createdAt' : -1})
        if (!messagesOfConversation) {throw new BadRequest('messages of conversation is not found!')}
        const totalMessages = await this.getModel().countDocuments({conversationId});
        const totalPages = Math.ceil(totalMessages / limit);
        const paginationInfo = {
            messagesOfConversation,
            totalPages,
            currentPage: Number(page)
        }
        return paginationInfo;

    }


    async createMessage(senderId,conversationId,text) {
        const newMessage =await this.getModel().create({senderId,conversationId,text})
        return newMessage;
    }

    async removeMessage(messageId,userId) {
       const removedMessage = await this.getModel()
            .findOneAndDelete({userId, _id : messageId});
       return removedMessage;
    }
}

module.exports = Message;
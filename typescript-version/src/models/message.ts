import MongoDBCollection from "./mongoDBcollection";


export interface IMessage {

    senderId: number;
    conversationId: number;
    text:string;
    createdAt:Date;
    updatedAt:Date;

}

export interface PaginationInfoCursorTimeStamp {
    messagesOfConversation: Array<IMessage>;
    limit: number;
    isFinished: boolean;
    nextCursorTimeStamp: number;

}

export interface PaginationInfoOffset {
    messagesOfConversation: Array<IMessage>;
    totalPages: number;
    currentPage: number;


}

export default class Message extends  MongoDBCollection<IMessage>{

    private static messageName="Message";

    private static messageDefinitions = {
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

    constructor(messageName=Message.messageName,messageDefinitions = Message.messageDefinitions) {
        super(messageName,messageDefinitions);
    }


    async getMessagesWithDateCursorPagination(conversationId: number,limit: number ,next: number) :  Promise<PaginationInfoCursorTimeStamp>  {
        let nextCursorTimeStamp: number = next;
        const messagesOfConversation: Array<IMessage> = await this.getModel()
            .find({conversationId, createdAt : {$lte : new Date(Number(nextCursorTimeStamp))}})
            .limit(Number(limit) + 1)
            .sort({createdAt : -1})
        if (!messagesOfConversation) {throw Error('messages of conversation are not found!')}
        nextCursorTimeStamp=-1;
        const isFinished=messagesOfConversation.length === 1;
        if (!isFinished) {
            const lastElement: IMessage = messagesOfConversation[messagesOfConversation.length - 1];
            nextCursorTimeStamp = new Date(lastElement.createdAt).getTime();
            messagesOfConversation.pop();
        }
        const paginationInfo: PaginationInfoCursorTimeStamp = {
            messagesOfConversation,
            limit,
            isFinished,
            nextCursorTimeStamp
        }
        return paginationInfo;
    }



    async getMessagesWithOffsetPagination(conversationId: number,page: number,limit: number): Promise<PaginationInfoOffset> {
        const skipCount: number = (page - 1) * limit;
        const messagesOfConversation: Array<IMessage> = await this.getModel()
            .find({conversationId})
            .limit(limit)
            .skip(skipCount)
            .sort({createdAt : -1})
        if (!messagesOfConversation) {throw Error('messages of conversation is not found!')}
        const totalMessages: number = await this.getModel().countDocuments({conversationId});
        const totalPages: number = Math.ceil(totalMessages / limit);
        const paginationInfo= {
            messagesOfConversation,
            totalPages,
            currentPage:page
        }
        return paginationInfo;

    }


    async createMessage(senderId: number,conversationId: number,text: string): Promise<IMessage> {
        const newMessage: IMessage =await this.getModel().create({senderId,conversationId,text})
        return newMessage;
    }

    async removeMessage(messageId: number,userId: number) : Promise<IMessage | null> {
       const removedMessage: (IMessage | null) = await this.getModel()
            .findOneAndDelete({userId, _id : messageId});
       return removedMessage;
    }
}
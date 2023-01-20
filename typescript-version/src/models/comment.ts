import MongoDBCollection from "./mongoDBcollection";


interface IComment {
    senderId: number;
    receiverId: number;
    text: string;
    createdAt:Date;
    updatedAt:Date;
}

class Comment extends  MongoDBCollection<IComment>{

   static #commentName="Comment";

    static #commentDefinitions = {

        senderId: { //TODO: ref will be added for population
            type:String,
            required:true
        },
        receiverId : {
            type:String,
            required:true
        },
        text : {
            type:String,
            required:true
        }
    }

    constructor(collectionName=Comment.#commentName,collectionDefinitions = Comment.#commentDefinitions) {
        super(collectionName,collectionDefinitions);
    }


    async getCommentsOfReceiver(receiverId : number) : Promise<Array<IComment>> {
        const comments : Array<IComment> = await this.getModel().find({receiverId});
        return comments;

    }

    async createComment(senderId: number,receiverId: number,text: string): Promise<IComment> {
        const newComment: IComment = await this.getModel().create({senderId,receiverId,text});
        return newComment;

    }

    async removeComment(commentId: number) : Promise<IComment> {
        const removedComment: (IComment | null) = await this.getModel().findOneAndDelete({_id : commentId});
        if (!removedComment) {
            throw Error('comment is not deleted!');
        }
        return removedComment;
    }

    async updateComment(commentId: number,commentBody: object) : Promise<IComment> {
        if (!this.isSubSetOfDefinitions(commentBody)) {
            throw new Error('comment body is not valid!');
        }
        const updatedComment : (IComment | null) = await this.getModel().findOneAndUpdate({_id : commentId}, commentBody, {new : true});
        if (!updatedComment) {
            throw new Error('comment is not updated!');
        }
        return updatedComment
    }

}

module.exports = Comment;
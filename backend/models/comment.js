
const MongoDBCollection=require('./mongoDBCollection');

class Comment extends  MongoDBCollection{

   static #commentName="Comment";

    static #commentDefinitions = {
        senderId: {
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

    isCommentBodyValid(commentBody) {
        return this.areRequiredKeysMatched(commentBody);
    }

}

module.exports = Comment;

const MongoDBCollection=require('mongoDBCollection');

class Comment extends  MongoDBCollection{

   #commentName="Comment";

    #commentDefinitions = {
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

}

module.exports = Comment;
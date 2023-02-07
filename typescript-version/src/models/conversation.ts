import MongoDBCollection from "./mongoDBcollection";

import {Types} from "mongoose";


interface IConversation {
    members: Array<Types.ObjectId>;
    createdAt:Date;
    updatedAt:Date;
    
}

class Conversation extends  MongoDBCollection<IConversation>{

    private static conversationName="Conversation";

    //Todo: when conversation is removed, all messages belong to it must also  be removed.

    private static conversationDefinitions = {
        members: {
            //TODO: map could be used to store unique members
            type: [Types.ObjectId],
            ref: "User",
            required: true,
            validate: {
                validator : Conversation.hasTwoMembers, // Todo: will be checked
                message : "At least two members must exist"
            }
            //[Conversation.hasTwoMembers,"At least two members must exist"]
        }
    }

    private static hasTwoMembers (arr: Array<Types.ObjectId>) : boolean {
        return arr.length >= 2;

    }

    constructor(conversationName=Conversation.conversationName,
                conversationDefinitions = Conversation.conversationDefinitions) {
        super(conversationName,conversationDefinitions);
    }

    async createConversation(members: Array<number>) {
        const newConversation : (IConversation | null)  =await this.getModel().create({members});
        if (!newConversation) {
            throw new Error('Conversation is not created');
        }
        return newConversation;
    }

    async getConversation(members: Array<number>): Promise<IConversation> {
        const conversation : (IConversation | null) = await this.getModel().findOne({"members" : {$all : members}});
        // assertion => only one conversation should be found!
        if (!conversation) {
            throw new Error('conversation  is not found!');
        }
        return conversation;

    }

    async addMembersToConversation(conversationId: number, newMembersList: Array<number>) : Promise<IConversation>{
        //Todo: check members exist, before pushing them
       const updatedConversation :  (IConversation | null) =await this.getModel()
           .findByIdAndUpdate(conversationId,{$push : {"members": {$each : newMembersList}}});
        if (!updatedConversation) {throw new Error('conversation could not be updated!')}
        return updatedConversation;

    }

    async removeMembersFromConversation(conversationId: number,removedMembersList: Array<number>) : Promise<IConversation> {
        const updatedConversation : (IConversation | null) = await this.getModel()
            .findByIdAndUpdate(conversationId,{ $pull : {"members" :  {$in : removedMembersList}}});
        if (!updatedConversation) {
            throw new Error('no members are removed from the conversation');
        }
        return updatedConversation;
    }


}

module.exports = Conversation;
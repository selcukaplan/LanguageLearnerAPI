
const express=require('express');

const ConversationController = require('../controllers/conversationController');

const authenticateTheUser = require('../middlewares/authentication');

const commentRouter = express.Router();

//TODO: some routes don't need to authenticate the user. It could be removed

commentRouter.post('/', [authenticateTheUser,ConversationController.createConversation]);

commentRouter.get('/', [authenticateTheUser, ConversationController.getConversationOfMembers]);

commentRouter.patch('/addMember/:conversationId', [authenticateTheUser, ConversationController.addMembersToConversation]);

commentRouter.patch('/removeMember/:conversationId',[authenticateTheUser,ConversationController.removeMembersFromConversation]);

module.exports=commentRouter;
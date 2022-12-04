
const express=require('express');

const ConversationController = require('../controllers/conversationController');

const authenticateTheUser = require('../middlewares/authentication');

const commentRouter = express.Router();

commentRouter.post('/', [authenticateTheUser,ConversationController.createConversation]);

commentRouter.get('/', [authenticateTheUser, ConversationController.getConversationOfMembers]);

commentRouter.patch('/addMember/:conversationId', [authenticateTheUser, ConversationController.addMembersToConversation]);

commentRouter.patch('/removeMember/:conversationId',[authenticateTheUser,ConversationController.removeMembersFromConversation]);

module.exports=commentRouter;
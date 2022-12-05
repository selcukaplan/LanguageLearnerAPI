
const express=require('express');

const MessageController=require('../controllers/messageController');

const authenticateTheUser = require('../middlewares/authentication');

const messageRouter = express.Router();

messageRouter.post('/', [authenticateTheUser,MessageController.createMessage]);

messageRouter.get('/:conversationId', [MessageController.getMessagesOfConversation]);

messageRouter.delete('/:messageId',[authenticateTheUser,MessageController.removeMessage]);

module.exports=messageRouter;
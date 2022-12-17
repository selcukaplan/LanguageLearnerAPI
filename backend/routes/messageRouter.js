
const express=require('express');

const MessageController=require('../controllers/messageController');

const {authenticateTheUserForHTTP} = require('../middlewares/authentication');

const messageRouter = express.Router();

messageRouter.post('/', [authenticateTheUserForHTTP,MessageController.createMessage]);

messageRouter.get('/:conversationId', [MessageController.getMessagesOfConversation]);

messageRouter.get('/:conversationId/pagination/offset', [MessageController.getMessagesWithOffsetPagination]);

messageRouter.get('/:conversationId/pagination/cursor', [MessageController.getMessagesWithDateCursorPagination]);

messageRouter.delete('/:messageId',[authenticateTheUserForHTTP,MessageController.removeMessage]);

module.exports=messageRouter;
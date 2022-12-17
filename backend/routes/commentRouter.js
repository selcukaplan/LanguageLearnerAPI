
const express=require('express');

const CommentController=require('../controllers/commentController');

const {authenticateTheUserForHTTP} = require('../middlewares/authentication');

const commentRouter = express.Router();

commentRouter.post('/:receiverId', [authenticateTheUserForHTTP,CommentController.createComment]);

commentRouter.get('/:userId', [authenticateTheUserForHTTP, CommentController.getCommentsOfUser]);

commentRouter.patch('/:commentId', [authenticateTheUserForHTTP, CommentController.updateComment]);

commentRouter.delete('/:commentId',[authenticateTheUserForHTTP,CommentController.removeComment]);

module.exports=commentRouter;
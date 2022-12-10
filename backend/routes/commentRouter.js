
const express=require('express');

const CommentController=require('../controllers/commentController');

const authenticateTheUser = require('../middlewares/authentication');

const commentRouter = express.Router();

commentRouter.post('/:receiverId', [authenticateTheUser,CommentController.createComment]);

commentRouter.get('/:userId', [authenticateTheUser, CommentController.getCommentsOfUser]);

commentRouter.patch('/:commentId', [authenticateTheUser, CommentController.updateComment]);

commentRouter.delete('/:commentId',[authenticateTheUser,CommentController.removeComment]);

module.exports=commentRouter;
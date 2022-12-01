
const express=require('express');

const CommentController=require('../controllers/commentController');

const authenticateTheUser = require('../middlewares/authentication');

const commentRouter = express.Router();

commentRouter.post('/:receiverId', [authenticateTheUser,CommentController.createComment]);

commentRouter.get('/:userId', [CommentController.getCommentsOfUser]);

commentRouter.delete('/:commentId',[authenticateTheUser,CommentController.removeComment]);

module.exports=commentRouter;
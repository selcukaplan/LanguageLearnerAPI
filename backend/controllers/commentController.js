


const {StatusCodes} = require('http-status-codes');
const Comment = require('../models/comment');
const ResponseController = require('./responseController');
const UserController = require("./userController");
const {BadRequest} = require("../errors");

class CommentController {

    //Todo: all return statements coming from the database will be checked for whether they returned error or not

    static #comment=new Comment();


    static async getCommentsOfUser(request, response, next) {
        try {
            const currentUserId = request.params.userId;
            const commentsOfUser=await CommentController.#comment.getModel().find({receiverId : currentUserId});
            const responseData = ResponseController.getDataResponse(commentsOfUser);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async createComment(request,response,next) {
        try {
            const senderId = UserController.getUserId(request);
            const receiverId=request.params.receiverId;
            const commentBody = {senderId,receiverId,...request.body};
            if (!CommentController.#comment.isCommentBodyValid(commentBody)) {
                throw new BadRequest('Comment body is not valid!');
            }
            const newComment=await CommentController.#comment.getModel().create({...commentBody});
            const responseData=ResponseController.getDataResponse(newComment);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

    static async removeComment(request,response,next) {
        try {
            const senderId = UserController.getUserId(request);
            const commentId=request.params.commentId;
            const deletedComment=await CommentController.#comment.getModel().findByIdAndDelete({senderId, _id : commentId});
            const responseData=ResponseController.getDataResponse(deletedComment);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    //TODO: update comment will be added





}

module.exports = CommentController;
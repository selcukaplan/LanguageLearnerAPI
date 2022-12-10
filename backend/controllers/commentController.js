


const {StatusCodes} = require('http-status-codes');
const Comment = require('../models/comment');
const ResponseController = require('./responseController');
const UserController = require("./userController");
const {BadRequest} = require("../errors");

class CommentController {

    //Todo: all return statements coming from the database will be checked for whether they returned error or not

    //Todo: update queries return the previous state of  documents which is not wanted.
    // Better approach should be found to get the updated state of  documents

    static #comment=new Comment();


    static async getCommentsOfUser(request, response, next) {
        try {
            const currentUserId = request.params.userId;
            const commentsOfUser=await CommentController.#comment.getModel().find({receiverId : currentUserId});
            const responseData = ResponseController.createResponseData(commentsOfUser);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    static async createComment(request,response,next) {
        try {
            const senderId = UserController.fetchUserIdFromRequest(request);
            const receiverId=request.params.receiverId;
            const commentBody = {senderId,receiverId,...request.body};
            if (!CommentController.#comment.areRequiredDefinitionKeysMatched(commentBody)) {
                throw new BadRequest('Comment body is not valid!');
            }
            const newComment=await CommentController.#comment.getModel().create({...commentBody});
            if (!newComment) {throw new BadRequest('Create operation could not completed!')}
            const responseData=ResponseController.createResponseData(newComment);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }

    static async removeComment(request,response,next) {
        try {
            const senderId = UserController.fetchUserIdFromRequest(request);
            const commentId=request.params.commentId;
            if (!commentId) {throw new BadRequest('Comment id is not found!')}
            const deletedComment=await CommentController.#comment.getModel().findOneAndDelete({senderId, _id : commentId});
            if (!deletedComment) {throw new BadRequest('Delete operation could not completed!')}
            const responseData=ResponseController.createResponseData(deletedComment);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }
    }


    static async updateComment(request,response,next) {
        try {
            const commentBody = request.body;
            if (!CommentController.#comment.isSubSetOfDefinitions(commentBody)) {
                throw new BadRequest('Comment body is not valid!');
            }
            const senderId = UserController.fetchUserIdFromRequest(request);
            const commentId = request.params.commentId;
            if (!commentId) {throw new BadRequest('Comment id is not found!')}
            const updatedComment = await CommentController.#comment.getModel()
                .findOneAndUpdate({senderId, _id: commentId}, commentBody);
            if (!updatedComment) {throw new BadRequest('Update operation could not completed!')}
            const responseData = ResponseController.createResponseData(updatedComment);
            return response.status(StatusCodes.OK).json(responseData);
        } catch (error) {
            next(error);
        }

    }



}

module.exports = CommentController;
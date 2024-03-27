import express from "express";
import {CommentsModel, createComment, deleteComment, existingComment, getAllComments} from "../models/comment_model";
import ArticleModel from "../models/article_model";

/**
 * @swagger
 * /comments/createComments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: "1234567890"  # Example comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *                 example: "Joy Irra"
 *               email:
 *                 type: string
 *                 example: "joy.iras@example.com"
 *               content:
 *                 type: string
 *                 example: "This is a new comment."
 *     responses:
 *       '200':
 *         description: Comment sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment sent Successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1234567890"  # Example comment ID
 *                     names:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     content:
 *                       type: string
 *                       example: "This is a new comment."
 *       '400':
 *         description: Comment already sent or error creating comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Your comment already sent !"
 */
export const createComments = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params
        const {names, email, content} = req.body;
        const isExist = await existingComment(content);

        if (isExist) {
            res.status(400).json({
                status: 400,
                message: "Your comment already sent !",
            })
            return;
        }
        const newComment = await createComment({
            names, email, content
        }, id);

        await ArticleModel.findByIdAndUpdate(
            id,
            {$push: {comments: newComment._id}},
            {new: true}
        );
        res.status(200).json({
            status: 201,
            success: true,
            message: "Comment sent Successfully",
            user: newComment,
        });
    } catch (error: any) {
        console.log(`HERE IS COMMENT REGISTER ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comment]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1234567890"  # Example comment ID
 *                       names:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       content:
 *                         type: string
 *                         example: "This is a comment."
 *       '400':
 *         description: Error fetching comments or no comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "No comment found !"
 */
export const getComments = async (req: express.Request, res: express.Response) => {
    try {
        const comments = await getAllComments();
        if (!comments) {
            res.status(400).json({
                status: 400,
                message: "No comment found !",
            });
            return;
        }
        res.status(200).json({"success": true, "comments": comments})
    } catch (error: any) {
        console.log(`HERE IS BLOG Get comments ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

/**
 * @swagger
 * /comments/removeComment/{id}:
 *   delete:
 *     summary: Remove a comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *           example: "1234567890"  # Example comment ID
 *     responses:
 *       '200':
 *         description: Comment removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Comment removed successfully"
 *       '400':
 *         description: Comment not found or error removing comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Comment not found !"
 */

export const removeComment = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params

        const del = await deleteComment(id);

        if (!del) {
            res.status(400).json({
                status: 400,
                message: "Comment not found !",
            });
            return;
        }

        // Delete the comment
        await CommentsModel.findByIdAndDelete(id);

        // Update the associated article's comments array
        await ArticleModel.updateOne(
            {_id: del.article},
            {$pull: {comments: id}}
        );
        return res.status(200).json({"status": 200, "message": "Comment removed successfully"}).end()
    } catch (error: any) {
        console.log(`HERE IS BLOG delete comment ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
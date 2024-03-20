import express from "express";
import {createComment, existingComment, getAllComments, getSingleComment} from "../models/comment_model";

export const createComments = async (req: express.Request, res: express.Response) => {
    try {
        const {names, email, content} = req.body;
        const isExist = await existingComment(content);

        if (isExist) {
            res.status(400).json({
                status: 400,
                message: "Your comment already sent !",
            });
            return;
        }
        const newComment = await createComment({
            names, email, content
        });
        console.log(newComment)
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
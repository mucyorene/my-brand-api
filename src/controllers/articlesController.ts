import express from "express";
import {
    allBlogs,
    checkArticleExistence,
    createArticles,
    deleteSingleArticle, getSingleArticle, updateBlogArticle,
} from "../models/article_model";

export const createBlogArticle = async (req: express.Request, res: express.Response) => {
    try {
        const {title, body, thumbnail = "No Image uploaded yet"} = req.body;

        const isExist = await checkArticleExistence(title);

        if (isExist) {
            res.status(400).json({
                status: 400,
                message: "Article already there !",
            });
            return;
        }

        const newArticle = await createArticles({
            title, body, thumbnail
        });
        res.status(200).json({
            status: 201,
            success: true,
            message: " Article created Successfully",
            user: newArticle,
        });
    } catch (error: any) {
        console.log(`HERE IS BLOG REGISTER ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

export const getArticles = async (req: express.Request, res: express.Response) => {
    try {
        const articles = await allBlogs();
        res.status(200).json({"success": true, "articles": articles})
    } catch (error: any) {
        console.log(`HERE IS BLOG Get articles ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
export const remoteSingleArticles = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params
        const del = await deleteSingleArticle(id);
        if (!del) {
            res.status(400).json({
                status: 400,
                message: "Article not found !",
            });
            return;
        }
        return res.status(200).json({"status": 200, "message": "Article removed successfully"}).end()
    } catch (error: any) {
        console.log(`HERE IS BLOG Get articles ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

export const getSingleBlog = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params
        const singleArticle = await getSingleArticle(id)
        if (!singleArticle) {
            res.status(400).json({"status": 200,})
            return;
        }
        res.status(200).json({"status": 200, "message": "Article found", "article": singleArticle})
    } catch (error: any) {
        console.log(`Error on getting single article: ${error.message}`)
    }
}

export const updateArticle = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {title, body} = req.body;
        const findArticle = await getSingleArticle(id);
        if (!findArticle) {
            res.status(401).json({
                status: 400,
                message: "Article not found !",
            });
            return;
        }
        const updateArticle = await updateBlogArticle(id, {title, body})
        if (updateArticle) {
            res.status(200).json({
                status: 201,
                success: true,
                message: " Article updated Successfully",
                user: findArticle,
            });
        }
    } catch (error: any) {
        console.log(`HERE IS UPDATE ERROR: ${error}`)
        res.status(401).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
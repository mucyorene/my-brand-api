import express from "express";
import {
    allBlogs,
    checkArticleExistence,
    createArticles,
    deleteSingleArticle, getSingleArticle, updateBlogArticle,
} from "../models/article_model";

/**
 * @swagger
 * tags:
 *   name: Blog Articles
 *   description: API endpoints for managing blog articles
 */

/**
 * @swagger
 * /my-brand/blog/create:
 *   post:
 *     summary: Create a new blog article
 *     tags: [Blog Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog article
 *               body:
 *                 type: string
 *                 description: The content/body of the blog article
 *               thumbnail:
 *                 type: string
 *                 description: URL of the article's thumbnail image (optional)
 *     responses:
 *       '201':
 *         description: Successful creation of a new blog article
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
 *                   example: Article created Successfully
 *                 articles:
 *                   $ref: '#/components/schemas/Article'
 *       '400':
 *         description: Bad request or article already exists
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
 *                   example: Article already there !
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Sample Title
 *         body:
 *           type: string
 *           example: Sample body content
 *         thumbnail:
 *           type: string
 *           example: https://example.com/thumbnail.jpg
 */
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
            articles: newArticle,
        });
    } catch (error: any) {
        console.log(`HERE IS BLOG REGISTER ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
/**
 * @swagger
 * tag:
 *   name:Articles
 * /articles/getBlogs:
 *   get:
 *     summary: Get all articles
 *     tags: [Blog Articles]
 *     description: Retrieve a list of all articles
 *     responses:
 *       '200':
 *         description: A successful response with the list of users
 *       '500':
 *          description: Internal server error
 *     examples:
 */
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
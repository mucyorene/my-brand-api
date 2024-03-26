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
 *                 example: The title of the blog article
 *               body:
 *                 type: string
 *                 example: The content/body of the blog article
 *               thumbnail:
 *                 type: string
 *                 example: No image yet
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
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Blog Articles]
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
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Article one"
 *                       content:
 *                         type: string
 *                         example: "This is a sample article content."
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


/**
 * @swagger
 * /articles/removeSingleArticle/{id}:
 *   delete:
 *     summary: Delete a single article by ID
 *     tags: [Blog Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *           example: "1234567890"  # Example article ID
 *     responses:
 *       '200':
 *         description: Article deleted successfully
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
 *                   example: Article removed successfully
 *       '400':
 *         description: Article not found
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
 *                   example: Article not found !
 */

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


/**
 * @swagger
 * /articles/getSingleArticle/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blog Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Blog ID
 *         schema:
 *           type: string
 *           example: "1234567890"  # Example blog ID
 *     responses:
 *       '200':
 *         description: Blog found successfully
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
 *                   example: Article found
 *                 article:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1234567890"  # Example article ID
 *                     title:
 *                       type: string
 *                       example: "Sample Blog"
 *                     content:
 *                       type: string
 *                       example: "This is a sample blog content."
 *       '400':
 *         description: Blog not found
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
 *                   example: Article not found
 */
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

/**
 * @swagger
 * /articles/editBlogArticle/{id}:
 *   put:
 *     summary: Update an article by ID
 *     tags: [Blog Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Article ID
 *         schema:
 *           type: string
 *           example: "1234567890"  # Example article ID
 *       - in: body
 *         name: body
 *         description: Updated article data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Updated Title"
 *             body:
 *               type: string
 *               example: "Updated content of the article"
 *     responses:
 *       '200':
 *         description: Article updated successfully
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
 *                   example: Article updated Successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1234567890"  # Example article ID
 *                     title:
 *                       type: string
 *                       example: "Updated Title"
 *                     body:
 *                       type: string
 *                       example: "Updated content of the article"
 *       '400':
 *         description: Article not found
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
 *                   example: Article not found !
 */
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
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import {createUser, editUserModel, getUserByEmail, getUserById, removeUser, users} from "../models/user_model"

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to users
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *                 example: MUCYO Rene
 *               email:
 *                 type: string
 *                 example: renemucyo1@gmail.com
 *               password:
 *                 type: string
 *                 example: Mucyo@98765432
 *             required:
 *               - names
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User created successfully
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
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     names:
 *                       type: string
 *                       example: Rene MUCYO
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 */

export const register = async (req: express.Request, res: express.Response,) => {
    try {
        const {names, email, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        if (!email || !names || !password) {
            return res.sendStatus(400)
        }
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            res.status(400).json({
                status: 400,
                message: "Email already taken",
            });
            return;
        }
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = await createUser({
            names,
            email,
            password: hashPassword
        });
        res.status(200).json({
            status: 201,
            success: true,
            message: " User created Successfully",
            user: newUser,
        });
    } catch (error: any) {
        console.log(`HERE IS ERROR: ${error}`)
        // Send the error message to the client
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

/**
 * @swagger
 * /auth/edit/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - names
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User information updated successfully
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
 *                   example: User information updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     names:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 */
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params
        const {names, email, password} = req.body;
        const salt = await bcrypt.genSalt(10);
        if (!email || !names || !password) {
            return res.sendStatus(401).json({"message": "Do not skipp"})
        }
        const hashPassword = await bcrypt.hash(password, salt)
        const updateUser = await editUserModel(id, {
            names,
            email,
            password: hashPassword
        });
        if (updateUser) {
            res.status(200).json({
                status: 201,
                success: true,
                message: " User information updated Successfully",
                user: updateUser,
            });
        }
    } catch (error: any) {
        console.log(`HERE IS UPDATE ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: renemucyo1@gmail.com
 *               password:
 *                 type: string
 *                 example: Mucyo@123456
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '400':
 *         description: Invalid request
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
 *                   example: You're missing email or password
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 */
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            res.status(400).json({"status": 400, "message": "You're missing email or password"})
            return;
        }
        const isUserExist = await getUserByEmail(email)
        const checkPassword = await bcrypt.compare(password, (isUserExist?.password || ""))
        if (!isUserExist) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
            return;
        }
        if (!checkPassword) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "Wrong password",
            });
            return;
        }

        // Here is token
        const token = jwt.sign(
            {_id: isUserExist?._id, email: isUserExist?.email},
            "mucyorene",
            {
                expiresIn: "10d",
            }
        );

        // send the response
        res.status(200).json({
            status: 200,
            success: true,
            message: "Logged in successfully",
            token: token,
        });

    } catch (error: any) {
        console.log(`HERE IS LOGIN ERROR: ${error.message}`)
    }
}
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all users
 *     responses:
 *       '200':
 *         description: A successful response with the list of users
 */
export const getUsers = async (req: express.Request, res: express.Response) => {

    try {
        const userInfo = await users();
        res.status(200).json({"success": true, "userInfo": userInfo})
    } catch (error: any) {
        console.log(`Get user: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User found successfully
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
 *                   example: User found successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 12345
 *                     names:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       '400':
 *         description: User not found
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
 *                   example: User not found
 */
export const retrieveSingleUser = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id
        const singleUser = await getUserById(id);
        if (!singleUser) {
            res.status(400).json({
                status: 400,
                message: "User not found",
            });
            return;
        }
        return res.status(200).json({"status": 200, "message": "User found successfully", "user": singleUser}).end()
    } catch (error: any) {
        console.log(`Error on getting single user: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

/**
 * @swagger
 * /removeUser/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: "1234567890"  # Example user ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
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
 *                   example: User deleted successfully
 *       '400':
 *         description: User not found
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
 *                   example: User not found
 */
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const rmUser = await removeUser(id);
        if (!rmUser) {
            res.status(400).json({
                status: 400,
                message: "User not found",
            });
            return;
        }
        return res.status(200).json({"status": 200, "message": "User deleted successfully"})
    } catch (error: any) {
        console.log(`Delete user: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
        return;
    }
}
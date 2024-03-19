import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import {createUser, editUserModel, getUserByEmail, getUserById, removeUser, users} from "../models/user_model"
import {updateArticle} from "./articlesController";

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
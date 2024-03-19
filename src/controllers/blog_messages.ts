import express, {request} from "express";
import {createMessage} from "../models/message_model";

export const saveMessages = async (req: express.Request, res: express.Response) => {
    try {
        const {names, email, content} = req.body;
        if (!names || !email || !content) {
            console.log("One is messing")
            return res.sendStatus(400)
        }
        const message = await createMessage({names, email, content})
        return res.sendStatus(200).json(message).end()
    } catch (error) {
        console.log(`Here is the error: ${error}`)
        return res.sendStatus(400)
    }
}
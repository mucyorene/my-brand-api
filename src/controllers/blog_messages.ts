import express, {request} from "express";
import {
    createMessage,
    deleteMessage,
    existingMessage,
    getMessages,
    getSingleMessage,
    updateStatus
} from "../models/message_model";

export const saveMessages = async (req: express.Request, res: express.Response) => {
    try {
        const {names, email, message} = req.body;
        if (!names || !email || !message) {
            return res.sendStatus(400)
        }
        const isExist = await existingMessage(message);

        if (isExist) {
            res.status(400).json({
                status: 400,
                message: "You already sent this message !",
            });
            return;
        }
        const sendMessage = await createMessage({names, email, message})
        return res.status(200).json({"message": "Thanks for contacting us !"}).end()
    } catch (error) {
        console.log(`Here is the error: ${error}`)
        return res.sendStatus(400)
    }
}
export const getAllMessages = async (req: express.Request, res: express.Response) => {
    try {
        const messages = await getMessages();
        res.status(200).json({"success": true, "messages": messages})
    } catch (error: any) {
        console.log(`HERE IS BLOG Get articles ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
export const removeMessage = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id
        const findMessage = await getSingleMessage(id);
        if (!findMessage) {
            res.status(400).json({
                "status": 400,
                "message": "Message not found!",
            })
        }
        const deleteM = await deleteMessage(id);
        res.status(200).json({"success": true, "messages": "Message deleted successfully"})
    } catch (error: any) {
        console.log(`HERE IS BLOG Delete message ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}

export const updateMessageStatus = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id
        const {status} = req.body;
        const findMessage = await getSingleMessage(id);
        if (!findMessage) {
            res.status(400).json({
                "status": 400,
                "message": "Message not found!",
            })
        }
        const update = await updateStatus(id, {status})
        res.status(200).json({"success": true, "messages": "Message status updated successfully"})
    } catch (error: any) {
        console.log(`HERE IS BLOG Update message ERROR: ${error}`)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        });
    }
}
import express, {request} from "express";
import {
    createMessage,
    deleteMessage,
    existingMessage,
    getMessages,
    getSingleMessage,
    updateStatus
} from "../models/message_model";


/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Operations related to users
 */


/**
 * @swagger
 * /contact/sendMessage:
 *   post:
 *     summary: Saving visitors messages
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *                 example: "Paul RWIGEMA"
 *               email:
 *                 type: email
 *                 example: paulrwigema@gmail.com
 *               message:
 *                 type: string
 *                 example: Hello, hope this message finds you well
 *     responses:
 *       '201':
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thanks for contacting us !
 *       '400':
 *         description: Error happened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message not sent
 *       '404':
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The url is not found
 *
 * */
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

/**
 * @swagger
 * /contact/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
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
 *                   example: Success
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: "Hello, this is a message."
 *                       sender:
 *                         type: string
 *                         example: "Alex NZI"
 *       '400':
 *         description: Error fetching messages
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
 *                   example: Error fetching messages
 */
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

/**
 * @swagger
 * /contact/removeContactMessage/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *           example: "434JKJ23K2K3K4"  # Example message ID
 *     responses:
 *       '200':
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: success
 *                 messages:
 *                   type: string
 *                   example: "Message deleted successfully"
 *       '400':
 *         description: Message not found or error deleting message
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
 *                   example: Message not found or error deleting message
 */
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

/**
 * @swagger
 * /contact/updateMessage/{id}:
 *   put:
 *     summary: Update message status by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *           example: "1234567890"
 *       - in: body
 *         name: body
 *         description: Updated message status
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "read"  # Example status update
 *     responses:
 *       '200':
 *         description: Message status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: string
 *                   example: "Message status updated successfully"
 *       '400':
 *         description: Message not found
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
 *                   example: Message not found !
 */
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
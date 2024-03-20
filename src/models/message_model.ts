import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    names: {type: String, required: true, maximum: Number},
    email: {type: String, required: true, maximum: Number},
    message: {type: String, required: true}
})
export const MessageModel = mongoose.model("Messages", MessageSchema)
export const getMessages = () => MessageModel.find()
export const existingMessage = (message: String) => MessageModel.findOne({message: message})
export const createMessage = (values: Record<any, any>) => new MessageModel(values).save().then((message) => message.toObject());
export const deleteMessage = (id: string) => MessageModel.findOneAndDelete({_id: id});
const updateMessageStatus = (id: string, status: Record<any, any>) => MessageModel.findByIdAndUpdate(id, status)
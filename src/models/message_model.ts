import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    names: {type: String, required: true, maximum: Number},
    email: {type: String, required: true, maximum: Number},
    status: {type: String, default: "Pending"},
    message: {type: String, required: true}
})
export const MessageModel = mongoose.model("Messages", MessageSchema)
export const getMessages = () => MessageModel.find()
export const existingMessage = (message: string) => MessageModel.findOne({message: message})
export const createMessage = (values: Record<any, any>) => new MessageModel(values).save().then((message) => message.toObject());
export const deleteMessage = (id: string) => MessageModel.findOneAndDelete({_id: id});
export const getSingleMessage = (id: string) => MessageModel.findById(id)
export const updateStatus = (id: string, status: Record<any, any>) => MessageModel.findByIdAndUpdate({_id: id}, status)
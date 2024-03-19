import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    names: {type: String, required: true, maximum: Number},
    email: {type: String, required: true, maximum: Number},
    sessionToken: {type: String, required: true}
})
export const MessageModel = mongoose.model("Messages", MessageSchema)
export const messages = () => MessageModel.find()
export const createMessage = (values: Record<any, any>) => new MessageModel(values).save().then((message) => message.toObject());
const deleteMessage = (id: string) => MessageModel.findOneAndDelete({_id: id});
const updateMessageStatus = (id: string, status: Record<any, any>) => MessageModel.findByIdAndUpdate(id, status)
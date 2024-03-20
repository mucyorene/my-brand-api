import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    names: {type: String, required: true, maximum: Number},
    email: {type: String, required: true, maximum: Number},
    content: {type: String, required: true}
})

export const CommentsModel = mongoose.model("Comments", CommentSchema)
export const getComments = () => CommentsModel.find()
export const existingComment = (content: String) => CommentsModel.findOne({content: content})
export const createComment = (values: Record<any, any>) => new CommentsModel(values).save().then((message) => message.toObject());
export const deleteComment = (id: string) => CommentsModel.findOneAndDelete({_id: id});
export const getSingleComment = (id: String) => CommentsModel.findById(id)
export const updateStatus = (id: string, status: Record<any, any>) => CommentsModel.findByIdAndUpdate({_id: id}, status)
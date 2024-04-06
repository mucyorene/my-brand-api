import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    names: {type: String, required: true, maximum: Number},
    email: {type: String, required: true, maximum: Number},
    content: {type: String, required: true},
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Articles'}
}, {timestamps: true})

export const CommentsModel = mongoose.model("Comments", CommentSchema)
export const getAllComments = () => CommentsModel.find()
export const existingComment = (content: string) => CommentsModel.findOne({content: content})
export const createComment = (values: Record<any, any>, id: string) => new CommentsModel({
    ...values,
    article: id
}).save().then((message) => message.toObject());
export const deleteComment = (id: string) => CommentsModel.findOneAndDelete({_id: id});
export const getSingleComment = (id: string) => CommentsModel.findById(id)
export const updateStatus = (id: string, status: Record<any, any>) => CommentsModel.findByIdAndUpdate({_id: id}, status)
export default CommentsModel
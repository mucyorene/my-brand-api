import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    thumbnail: {type: String}
})
export const ArticleModel = mongoose.model("Articles", ArticleSchema)
export const allBlogs = () => ArticleModel.find()
export const checkArticleExistence = (title: String) => ArticleModel.findOne({title: title});
export const getSingleArticle = (id: String) => ArticleModel.findOne()
export const createArticles = (values: Record<any, any>) => new ArticleModel(values).save().then((article) => article.toObject())
export const deleteSingleArticle = (id: String) => ArticleModel.findOneAndDelete({_id: id})
export const updateBlogArticle = (id: String, values: Record<any, any>) => ArticleModel.findOneAndUpdate(
    {_id: id},
    values
)

import express from "express";
import {deleteUser, getUsers, login, register, retrieveSingleUser, updateUser} from "../controllers/authentication";
import {
    createBlogArticle,
    getArticles,
    getSingleBlog,
    remoteSingleArticles,
    updateArticle
} from "../controllers/articlesController";
import {authenticatedUser} from "../helpers/helper";
import {getAllMessages, removeMessage, saveMessages, updateMessageStatus} from "../controllers/blog_messages";
import {createComments, getComments, removeComment} from "../controllers/comments_controller";

const router = express.Router()
export const getUser = router.get('/users', authenticatedUser, getUsers)
export const registerUser = router.post("/auth/register", register)
export const editBlogUser = router.put("/auth/edit/:id", authenticatedUser, updateUser)
export const loginUser = router.post("/auth/login", login)
export const retrieveUser = router.get("/users/:id", authenticatedUser, retrieveSingleUser)
export const removeUserRoute = router.delete("/removeUser/:id", authenticatedUser, deleteUser)

//Articles endpoints
export const createNewArticle = router.post("/my-brand/blog/create", authenticatedUser, createBlogArticle)
export const getAllBlogArticles = router.get("/articles", getArticles)
export const getSingleBlogArticle = router.get("/articles/getSingleArticle/:id", getSingleBlog)
export const remoteSingleArticle = router.delete("/articles/removeSingleArticle/:id", authenticatedUser, remoteSingleArticles)
export const editArticle = router.put("/articles/editBlogArticle/:id", authenticatedUser, updateArticle)

//Contact messages
export const sendMessage = router.post("/contact/sendMessage", saveMessages)
export const getContactMessages = router.get("/contact/getMessages", authenticatedUser, getAllMessages)
export const removeContactMessage = router.get("/removeContactMessage/:id", authenticatedUser, removeMessage)
export const updateContactMessage = router.put("/contact/updateMessage/:id", authenticatedUser, updateMessageStatus)

//Comments
export const saveComment = router.post("/comments/createComments", createComments)
export const retrieveAllComments = router.get("/comments/retrieveAllComments", getComments)
export const removeComments = router.delete("/comments/removeComment/:id", authenticatedUser, removeComment)
export default router;
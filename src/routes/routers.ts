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

const router = express.Router()
export const getUser = router.get('/getUser', authenticatedUser, getUsers)
export const registerUser = router.post("/auth/register", register)
export const editBlogUser = router.put("/auth/edit/:id", authenticatedUser, updateUser)
export const loginUser = router.post("/auth/login", login)
export const retrieveUser = router.get("/getSingleUser/:id", authenticatedUser, retrieveSingleUser)
export const removeUserRoute = router.delete("/removeUser/:id", authenticatedUser, deleteUser)

//Articles endpoints
export const createNewArticle = router.post("/createBlogArticle", authenticatedUser, createBlogArticle)
export const getAllBlogArticles = router.get("/articles/getBlogs", getArticles)
export const getSingleBlogArticle = router.get("/articles/getSingleArticle/:id", getSingleBlog)
export const remoteSingleArticle = router.delete("/articles/removeSingleArticle/:id", authenticatedUser, remoteSingleArticles)
export const editArticle = router.put("/articles/editBlogArticle/:id", authenticatedUser, updateArticle)
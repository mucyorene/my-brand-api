import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import {
    createNewArticle,
    getAllBlogArticles,
    getUser,
    loginUser,
    registerUser,
    remoteSingleArticle,
    removeUserRoute,
    retrieveUser,
    getSingleBlogArticle,
    editArticle,
    editBlogUser,
    getContactMessages,
    removeContactMessage,
    updateContactMessage,
    saveComment, retrieveAllComments
} from "./routes/routers";
import {connection} from "./db/connection";

dotenv.config()
const app: Application = express();

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
        credentials: true,
    })
);
dotenv.config()
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.listen(8080, () => {
    connection()
    console.log(`APP IS RUNNING ON : 8080: http://localhost:8080/`)
})
app.use(getUser, registerUser, loginUser, createNewArticle, getAllBlogArticles,
    remoteSingleArticle, removeUserRoute, retrieveUser, getSingleBlogArticle, editArticle, editBlogUser, getContactMessages, removeContactMessage, updateContactMessage, saveComment, retrieveAllComments)
import express, {Application, Express} from "express";
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
    saveComment, retrieveAllComments, removeComments
} from "./routes/routers";
import {connection} from "./db/connection";
import swaggerDoc from "./utils/swagger";
import {App} from "supertest/types";

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
app.use("/", (req: express.Request, res: express.Response, next) => {
    return res.status(200).json({"message": "Hi, i'm my-brand-project"})
})
app.use(getUser, registerUser, loginUser, createNewArticle, getAllBlogArticles,
    remoteSingleArticle, removeUserRoute, retrieveUser, getSingleBlogArticle, editArticle, editBlogUser, getContactMessages, removeContactMessage, updateContactMessage, saveComment, retrieveAllComments, removeComments)
export const servers = app.listen(8080, () => {
    connection();
    swaggerDoc(app, 8080);
    console.log(`APP IS RUNNING ON : 8080: http://localhost:8080/`)
})
export default app
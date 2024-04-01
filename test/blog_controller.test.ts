import request from "supertest";
import mongoose from "mongoose";
import app from "../src/server"; // Assuming your Express app is exported from '../app'
import {UserModel} from "../src/models/user_model";
import ArticleModel from "../src/models/article_model";
import CommentsModel from "../src/models/comment_model";

const articleId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();
const commentId = new mongoose.Types.ObjectId();
jest.setTimeout(50000)

describe("Article tests", () => {
    let server: any;
    beforeAll(async () => {

        await ArticleModel.create({
            title: "Lorem test article",
            body: "This is a test blog",
            thumbnail: "No test article"
        });

        await CommentsModel.create({
            _id: new mongoose.Types.ObjectId,
            names: "Names i Test",
            email: "test@email.article",
            content: "Content comment",
            article: articleId
        });

        await UserModel.create({
            _id: userId,
            names: "Test User",
            email: "renemucyo1@gmail.com",
            password: "Mucyo@123",
        });
    });

    afterAll(async () => {
        await ArticleModel.deleteMany();
        await CommentsModel.deleteMany();
        await UserModel.deleteMany();
        await mongoose.disconnect();
    });

    describe("GET /articles", () => {
        it("should return all blogs", async () => {
            const res = await request(app).get("/articles");
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
        }, 15000); // Set a timeout of 15000 ms (15 seconds) for this test
    });

    describe("GET /comments", () => {
        it("should return all comments", async () => {
            const comments = await request(app).get("/comments")
            expect(comments.statusCode).toBe(200)
        });
    });
});
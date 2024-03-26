import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app, {servers} from "../src/server";
import {ArticleModel} from "../src/models/article_model";
import {CommentsModel} from "../src/models/comment_model";

dotenv.config();

jest.setTimeout(30000);

const request = supertest(app);

const articlesId = new mongoose.Types.ObjectId;
const MONGO_URL: string = process.env.MONGO_URL!;
beforeAll(async () => {
    await ArticleModel.create({
        _id: articlesId,
        title: "Lorem test article",
        body: "This is a test blog",
        thumbnail: "No test article"
    });

    await CommentsModel.create({
        _id: new mongoose.Types.ObjectId,
        names: "Comment name test",
        email: "test@email.article",
        content: "Content comment"
    });
});

afterEach(async () => {
    servers.close();
});
afterAll(async () => {
    await ArticleModel.deleteMany();
    await CommentsModel.deleteMany();
    await mongoose.disconnect();
    await mongoose.connection.close();
})

describe("GET /api/articles/get", () => {
    it("should return all articles", async () => {
        const articles = await request.get("/articles/getBlogs")
        expect(articles.status).toBe(200)
    });
});

describe("GET /articles/getSingleArticle/:id", () => {
    it("should return single article specified article", async () => {
        console.log(articlesId)
        const res = await request.get(`/articles/getSingleArticle/${articlesId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toHaveProperty("title", "Lorem test article");
    });
});


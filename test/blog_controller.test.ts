import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app, {servers} from "../src/server";
import {ArticleModel} from "../src/models/article_model";
import {CommentsModel} from "../src/models/comment_model";
import {it} from "node:test";

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
        const articles = await request.get("/articles")
        expect(articles.status).toBe(200)
    });
});

describe("GET /users", () => {
    it("should return all users", async () => {
        const users = await request.get("/users")
        expect(users.status).toBe(200)
    });
});

describe("GET /articles/getSingleArticle/:id", () => {
    it("should return single article specified article", async () => {
        const res = await request.get(`/articles/getSingleArticle/${articlesId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toHaveProperty("title", "Lorem test article");
    });
});

describe("POST /api/blogs", () => {
    it("should create a new blog", async () => {
        const newBlog = {
            title: "New Test Blog",
            content: "This is a new test blog",
        };
        const res = await request.post("/api/blogs").send(newBlog);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("title", newBlog.title);
        expect(res.body).toHaveProperty("content", newBlog.content);
    });
});
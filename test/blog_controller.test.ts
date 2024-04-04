import request from "supertest";
import mongoose from "mongoose";
import app from "../src/server"; // Assuming your Express app is exported from '../app'
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
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe("GET /articles", () => {
        it("should return all blogs", async () => {
            const res = await request(app).get("/articles");
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
        }, 15000); // Set a timeout of 15000 ms (15 seconds) for this test
    });

    describe('GET /articles/getSingleArticle/:id', () => {
        it('should fetch a blog by id', async () => {
            const blogId = "660ae38024e28bdde7baefb7";
            const res = await request(app).get(`/articles/getSingleArticle/${blogId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Object);
        });
    });

    describe("GET /comments", () => {
        it("should return all comments", async () => {
            const comments = await request(app).get("/comments")
            expect(comments.statusCode).toBe(200)
        });
    });

    describe("POST /api/auth", () => {
        it("should return 400 if user already exists", async () => {
            const existingUser = {
                names: "Test User",
                email: "newtestuser@example.com",
                password: "password",
            };
            const res = await request(app)
                .post("/auth/register")
                .send(existingUser);
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("message", "Email already taken");
        });
    });

    describe("DELETE /articles/removeSingleArticle/:id", () => {
        it("should delete an existing blog after logging in", async () => {
            const userCredentials = {
                email: "newtestuser@example.com",
                password: "password",
            };

            // Login to get the authentication token
            const loginRes = await request(app)
                .post("/auth/login")
                .send(userCredentials);

            // Extract the authentication token from the login response
            const authToken = loginRes.body.token;

            // Use the authentication token to delete the blog
            const blogId = "660af249ca109c4fa6c2b075";
            const res = await request(app)
                .delete(`/articles/removeSingleArticle/${blogId}`)
                .set("Authorization", `Bearer ${authToken}`);

            // Check if the article was deleted successfully
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message", "Article removed successfully");
        });


        it("should return 404 if blog not found", async () => {
            const userCredential = {
                email: "newtestuser@example.com",
                password: "password",
            };

            // Login to get the authentication token
            const loginRes = await request(app)
                .post("/auth/login")
                .send(userCredential);

            // Extract the authentication token from the login response
            const authToken = loginRes.body.token;
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/articles/removeSingleArticle/${nonExistentId}`).set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("message", "Article not found !");
        });
    });


    describe("DELETE /comments/removeComment/:id", () => {
        it("should delete an article", async () => {

            const userCredentials = {
                email: "newtestuser@example.com",
                password: "password",
            };

            // Login to get the authentication token
            const loginRes = await request(app)
                .post("/auth/login")
                .send(userCredentials);

            // Extract the authentication token from the login response
            const authToken = loginRes.body.token;

            console.log(authToken)

            const commentId = "660af340e93f3ff4dfd26469";

            const res = await request(app).delete(
                `/comments/removeComment/${commentId}`
            ).set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("message", "Comment removed successfully");
        });

        it("should return 400 if comment not found", async () => {

            const userCredentials = {
                email: "newtestuser@example.com",
                password: "password",
            };

            // Login to get the authentication token
            const loginRes = await request(app)
                .post("/auth/login")
                .send(userCredentials);

            // Extract the authentication token from the login response
            const authToken = loginRes.body.token;

            console.log(authToken)

            const nonExistentCommentId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(
                `/comments/removeComment/${nonExistentCommentId}`
            ).set("Authorization", `Bearer ${authToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("message", "Comment not found !");
        });
    });

});
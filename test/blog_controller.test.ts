import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app, {servers} from "../src/server";

dotenv.config();

jest.setTimeout(30000);

const request = supertest(app);

const MONGO_URL: string = process.env.MONGO_URL!;
beforeAll(async () => {
    servers;
    await mongoose.connect(MONGO_URL);
});
afterEach(async () => {
    servers.close();
});
afterAll(async () => {
    await mongoose.connection.close();
});

describe("GET /api/articles/get", () => {
    it("should return all articles", async () => {
        return request
            .get("/articles/getBlogs")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});
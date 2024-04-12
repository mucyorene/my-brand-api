import express, {Application} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import {connection} from "./db/connection";
import routers from "./routes/routers";
import swaggerSpec from "./utils/swagger";
import {v2 as cloudinary} from 'cloudinary';

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routers);

cloudinary.config({
    cloud_name: 'dlk9cc42v',
    api_key: '379388661179819',
    api_secret: 'P_bwxCEeH3H4d78WWVnJqgpdkmA'
});


(async () => {
    try {
        await connection();
        const server = app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.log(`Error starting server: ${error}`);
    }
})();

// Add an error handler for the express app
app.on("error", (error) => {
    console.error(`An error occurred on the server:\n${error}`);
});

export default app
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


export default app
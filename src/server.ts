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
app.use(routers)
export const servers = app.listen(2000, () => {
    connection();
    // swaggerDoc(app, 8080);
    console.log(`APP IS RUNNING ON : 2000: http://localhost:2000/`)
})
export default app
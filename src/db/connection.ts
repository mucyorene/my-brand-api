import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connection = async () => {
    mongoose.Promise = global.Promise; // Set Mongoose to use global Promise
    const mongoURL: any = process.env.MONGO_URL;
    try {
        console.log("Connected to the Database");
        await mongoose.connect(mongoURL);
    } catch (error) {
        console.log(`ERROR HERE: ${error}`);
        throw error; // Re-throw the error to handle it outside this function if needed
    }
};
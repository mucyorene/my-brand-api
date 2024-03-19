import mongoose from "mongoose";
import process from "process";

export const connection = () => {
    mongoose.Promise = Promise;
    const mongoURL: any = process.env.MONGO_URL;
    mongoose.connect(mongoURL).then(() => {
        console.log("Connected to the Database")
    }).catch((error) => {
        console.log(`ERROR HERE: ${error}`)
    })
    mongoose.connection.on('error', (error: Error) => console.log(error))
}
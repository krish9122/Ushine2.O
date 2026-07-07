import mongoose from "mongoose";
import { DB_name } from "../constains.js";

const connectDb = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`database connected successfully to db host :${db.connection.host}`)
    } catch (error) {
        console.error("failed to connect to database", error);
        throw error;
        process.exit(1);
    }
}

export default connectDb;
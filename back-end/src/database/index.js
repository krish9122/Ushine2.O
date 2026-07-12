import dns from "node:dns"; 
import mongoose from "mongoose";
import { DB_name } from "../constains.js";

const connectDb = async () => {
    try {
        // Check if MONGODB_URI is defined in the environment variables
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        // Set custom DNS servers if provided in the environment variables, otherwise use default DNS servers
        const dnsServers = process.env.MONGODB_DNS_SERVERS //here
            ? process.env.MONGODB_DNS_SERVERS.split(",").map((server) => server.trim()).filter(Boolean)
            : ["8.8.8.8", "1.1.1.1"];

        // Set the DNS servers for the Node.js process
        dns.setServers(dnsServers);

        // Connect to the MongoDB database using Mongoose
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_name,
        });

        console.log(`database connected successfully to db host: ${db.connection.host}`);
    } catch (error) {
        console.error("failed to connect to database", error);
        throw error;
    }
}

export default connectDb;

import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/index.js";

dotenv.config({
    path: "./.env"
});

const app = express();
const PORT = process.env.PORT || 8000;

connectDb();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
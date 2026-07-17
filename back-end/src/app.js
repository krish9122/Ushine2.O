import express from "express";
import userRouter from "./routes/user.rout.js";
import adminRouter from "./routes/admin.rout.js";
import cookiesparser from "cookie-parser";
import cors from "cors";
 
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));

app.use(cookiesparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter); 

// error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    const errors = err.errors || [];

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
});

export default app;

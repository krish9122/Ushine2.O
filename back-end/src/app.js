import express from "express";
import userRouter from "./routes/user.rout.js";
import adminRouter from "./routes/admin.rout.js";
 
const app = express();

app.use(express.json());

//routers
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

export default app;

import { Router } from "express";
import userRegistration from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(userRegistration);
export default userRouter;

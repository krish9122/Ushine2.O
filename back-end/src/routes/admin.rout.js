import { Router } from "express";
import {adminLogin, adminLogout} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const adminRouter = Router();
adminRouter.route("/login").post(adminLogin);
adminRouter.route("/logout").post(verifyJWT, adminLogout);
export default adminRouter;

import { Router } from "express";
import {
    adminCreation,
    adminLogin,
    adminLogout,
    adminChangePassword,
    changeAdminName
}
    from "../controllers/admin.controller.js";
import verifyJWT from "../middlewares/auth.js";

const adminRouter = Router();
adminRouter.route("/newAdminRegister").post(adminCreation);
adminRouter.route("/login").post(adminLogin);
adminRouter.route("/logout").post(verifyJWT, adminLogout);
adminRouter.route("/change-password").post(verifyJWT, adminChangePassword);
adminRouter.route("/change-name").post(verifyJWT, changeAdminName);

export default adminRouter;

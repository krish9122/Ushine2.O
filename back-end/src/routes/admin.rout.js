import { Router } from "express";
import {
    adminCreation,
    adminLogin,
    adminLogout,
    adminChangePassword,
    changeAdminName,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    getBookingsWithMessages,
    deleteBooking,
    getDashboardStats,
    passwordReset,
    handleVerifiedOtp,
    newPassword,
}
    from "../controllers/admin.controller.js";
import verifyJWT from "../middlewares/auth.js";

const adminRouter = Router();
adminRouter.route("/newAdminRegister").post(adminCreation);
adminRouter.route("/login").post(adminLogin);
adminRouter.route("/logout").post(verifyJWT, adminLogout);
adminRouter.route("/change-password").post(verifyJWT, adminChangePassword);
adminRouter.route("/change-name").post(verifyJWT, changeAdminName);
adminRouter.route("/bookings").get(verifyJWT, getAllBookings);
adminRouter.route("/bookings/message").get(verifyJWT, getBookingsWithMessages);
adminRouter.route("/bookings/:id").get(verifyJWT, getBookingById);
adminRouter.route("/bookings/:id/status").patch(verifyJWT, updateBookingStatus);
adminRouter.route("/bookings/:id").delete(verifyJWT, deleteBooking);
adminRouter.route("/dashboard").get(verifyJWT, getDashboardStats);
adminRouter.route("/resetPassword").post(passwordReset);
adminRouter.route("/verifyOtp").post( handleVerifiedOtp);
adminRouter.route("/newPassword").post(newPassword);


export default adminRouter;

import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";
import { Admin } from "../model/admin.model.js";
import { ApiError } from "../utils/ApiError.js";

// method to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (adminId) => {
    const admin = await Admin.findById(adminId);
    const accessTokens = admin.generateAccessTokens();
    const refreshTokens = admin.generateRefreshTokens();

    admin.refreshToken = refreshTokens;
    await admin.save({ validateBeforeSave: false });

    return { accessTokens, refreshTokens };
};

// onetime admin register
const adminCreation = asyncHandlers(async (req, res) => {

    //extracting data from request body
    const { username, gmail, password } = req.body;

    //validation
    if (!username || !gmail || !password) {
        throw new ApiError(400, "please provide all credientials");
    }

    //checking if admin already exists
    const existingAdmin = await Admin.findOne({ role: 'admin' });

    if (existingAdmin) {
        throw new ApiError(400, "Admin already exists");
    }

    //creating new admin
    const newAdmin = await Admin.create({
        username,
        gmail,
        password,
        role: "admin"
    })
    await newAdmin.save();

    return res.status(201).json(new ApiResponse(201, null, "Admin created successfully"));
})


// admin login controller
const adminLogin = asyncHandlers(async (req, res) => {
    const { username, gmail, password } = req.body;

    //extracting data from request body
    if ((!username && !gmail) || !password) {
        throw new ApiError(400, "Please provide username or gmail, and password");
    }

    // finding admin by username or gmail
    const queryConditions = [];
    if (username) queryConditions.push({ username });
    if (gmail) queryConditions.push({ gmail });

    const admin = await Admin.findOne({ $or: queryConditions });

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }
    // comparing password
    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is not correct");
    }

    // generating access and refresh tokens
    const { accessTokens, refreshTokens } = await generateAccessAndRefreshTokens(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    // setting cookies for access and refresh tokens
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .cookie("refreshTokens", refreshTokens, cookieOptions)
        .cookie("accessTokens", accessTokens, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    refreshTokens,
                    accessTokens,
                },
                "Admin logged in successfully"
            )
        );
});

// admin logout controller
const adminLogout = asyncHandlers(async (req, res) => {
    const admin = await Admin.findById(req.admin?._id).select("-password -refreshToken");

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    admin.refreshToken = null;
    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .clearCookie("refreshTokens")
        .clearCookie("accessTokens")
        .json(new ApiResponse(200, null, "Admin logged out successfully"));
});

//change admin password
const adminChangePassword = asyncHandlers(async (req, res) => {

    //takng data from req.body
    const { oldPassword, newPassword } = req.body;

    //validation
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "provide all credientials");
    }

    //finding admin
    const admin = await Admin.findById(req.admin._id).select("-refreshToken");

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    // comparing old password
    const isOldPasswordCorrect = await admin.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
        throw new ApiError(400, "Old password is not correct");
    }

    // updating password
    admin.password = newPassword;
    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password changed successfully"));
});

//change admin name
const changeAdminName = asyncHandlers(async (req, res) => {

    //taking data from req.body
    const { newAdminName } = req.body;

    //validation
    if (!newAdminName) {
        throw new ApiError(400, "provide new admin name");
    }

    //finding admin
    const admin = await Admin.findById(req.admin._id).select("-password -refreshToken");

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    // updating admin name
    admin.name = newAdminName;
    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Admin name updated successfully"));
});
export { adminCreation, adminLogin, adminLogout, adminChangePassword, changeAdminName };


import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";
import { Admin } from "../model/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// method to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (adminId) => {
    const admin = await Admin.findById(adminId);
    const accessTokens = admin.generateAccessTokens();
    const refreshTokens = admin.generateRefreshTokens();

    admin.refreshToken = refreshTokens;
    await admin.save({ validateBeforeSave: false });

    return { accessTokens, refreshTokens };
};

// admin login controller
const adminLogin = asyncHandlers(async (req, res) => {
    const { username, gmail, password } = req.body;

    //extracting data from request body
    if (!username || !gmail || !password) {
        throw new ApiError(400, "Please provide all required fields");
    }

    // finding admin by username or gmail
    const admin = await Admin.findOne({ $or: [{ username }, { gmail }] });

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
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("refreshTokens", refreshTokens, options)
        .cookie("accessTokens", accessTokens, options)
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

const adminLogout = asyncHandlers(async (req, res) => {
    try {
        const tokens = req.cookies?.refreshTokens || req.header("authorization")?.replace("Bearer ", "");
        if (!tokens) {
            throw new ApiError(401, "No refresh token provided");
        }

        const decoded = jwt.verify(tokens, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded?._id).select("-password -refreshToken");

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
    } catch (error) {
        throw new ApiError(401, error?.message);
    }
});

export { adminLogin, adminLogout };


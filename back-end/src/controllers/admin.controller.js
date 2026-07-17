import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";
import { Admin } from "../model/admin.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

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
    const existingAdmin = await Admin.findOne({role: 'admin'});

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
    admin.username = newAdminName;
    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Admin name updated successfully"));
});

// Get bookings with optional pagination and filters.
// Example: /bookings?page=1&limit=10&status=pending&category=haircut
const getAllBookings = asyncHandlers(async (req, res) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
    const { status, category } = req.query;
    const filter = {};

    if (status) {
        if (!User.schema.path("status").enumValues.includes(status)) {
            throw new ApiError(400, "Invalid booking status");
        }
        filter.status = status;
    }

    if (category) {
        if (!User.schema.path("category").enumValues.includes(category)) {
            throw new ApiError(400, "Invalid booking category");
        }
        filter.category = category;
    }

    const [bookings, totalBookings] = await Promise.all([
        User.find(filter)
            .sort({ date: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    return res.status(200).json(new ApiResponse(200, {
        bookings,
        pagination: {
            page,
            limit,
            totalBookings,
            totalPages: Math.ceil(totalBookings / limit),
        },
    }, "Bookings fetched successfully"));
});

//
const getBookingById = asyncHandlers(async (req, res) => {

    //fetching data from req.params
    const { id } = req.params;

    //validation
    if(!id)
    {
        throw new ApiError(400,"there is no id");
    }

    //checkinng id exist or not
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking id");
    }

    //checking booking 
    const booking = await User.findById(id).select("-email" , "-phone_no");
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

const updateBookingStatus = asyncHandlers(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking id");
    }

    if (!status || !User.schema.path("status").enumValues.includes(status)) {
        throw new ApiError(400, "Provide a valid booking status");
    }

    //here
    const booking = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(new ApiResponse(200, booking, "Booking status updated successfully"));
});

const deleteBooking = asyncHandlers(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid booking id");
    }

    const booking = await User.findByIdAndDelete(id);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "Booking deleted successfully"));
});

const getDashboardStats = asyncHandlers(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [totalBookings, statusCounts, todaysBookings] = await Promise.all([
        User.countDocuments(),
        User.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        User.find({ date: { $gte: startOfToday, $lt: startOfTomorrow } }).sort({ date: 1 }),
    ]);

    const bookingsByStatus = Object.fromEntries(
        statusCounts.map(({ _id, count }) => [_id, count])
    );

    return res.status(200).json(new ApiResponse(200, {
        totalBookings,
        bookingsByStatus,
        todaysBookings,
    }, "Dashboard statistics fetched successfully"));
});

export {
    adminCreation,
    adminLogin,
    adminLogout,
    adminChangePassword,
    changeAdminName,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    getDashboardStats,
};


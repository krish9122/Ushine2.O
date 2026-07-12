import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
    },

    gmail: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
        default: "",
    },
}, { timestamps: true });

// password hashing before saving the admin document only if the password field is modified.
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// comparing password
adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generating access token
adminSchema.methods.generateAccessTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            gmail: this.gmail,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// generate refresh token
adminSchema.methods.generateRefreshTokens = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Admin = mongoose.model("Admin", adminSchema);

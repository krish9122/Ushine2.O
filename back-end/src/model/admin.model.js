import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
    },

    gmail: {
        type: String,
        tolowercase: true,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
        unique: true, 
    },
});
export const Admin = mongoose.model("Admin", adminSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    phone_no: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
        enum: ["haircut", "color", "treatment", "other"],
    },

    message: {
        type: String,
        required: false,
        maxlength: 500,
    },

})

export const User = mongoose.model('User', userSchema);
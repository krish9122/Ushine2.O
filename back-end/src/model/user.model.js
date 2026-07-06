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
    
    password: {
        type: String,
        required: true,
        minlength: 6,
    }

})
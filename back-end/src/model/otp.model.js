import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
    otpHash: {
        type: String,
        required: true,
    },

    gmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    }
});

// Hash the OTP before it is stored. The plain OTP is only sent by email.
otpSchema.pre("save", async function () {
    if (!this.isModified("otpHash")) {
        return;
    }
    this.otpHash = await bcrypt.hash(this.otpHash, 10);
});

otpSchema.methods.compareOtp = async function (otp) {
    return bcrypt.compare(String(otp), this.otpHash);
};

export const Otp = mongoose.model("Otp", otpSchema);

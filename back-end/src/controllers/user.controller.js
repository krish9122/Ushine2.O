import asyncHandlers from "../utils/asyncHandlers";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";


//user registration controller
//1.taking user input from the request body
//2.validating the input
//
const userRegistration = asyncHandlers(async (req, res, next) => {

    //taking user input from the request body
    const { username, email, phone_no, category, message } = req.body;

    //validating the input
    if (!username || !email || !phone_no || !category) {
        return new ApiError(400, "please provide all required fields");
    }

    
})
import asyncHandlers from "../utils/asyncHandlers.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//user registration controller
//1.taking user input from the request body
//2.validating the input
//3.checking if the user already exists
//4.creating a new user
const userRegistration = asyncHandlers(async (req, res, next) => {

    //taking user input from the request body
    const { username, email, phone_no, category, date, message } = req.body;

    //validating the input
    if (!username || !email || !phone_no || !category || !date) {
        return new ApiError(400, "please provide all required fields");
    }

    //checking if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone_no }] });

    if (existingUser) {
        return new ApiError(409, "user with email or phone number already exists");
    }

    //creating a new user
    const newUser = await User.create({
        username,
        email, 
        phone_no,
        category,
        date,
        message
    });

    //sending respomse
    return res.
    status(201)
    .json(new ApiResponse(201, "user registered successfully" ));

})

export default userRegistration;

// import dotenv from "dotenv";
// import connectDb from "../database/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const adminLogin = async (req, res) => {
    return res
        .status(501)
        .json(new ApiResponse(501, null, "admin login is not implemented yet"));
};

export default adminLogin;

// //admin login controller
// const adminLogin = async (req, res) => {

//     //taking admin input from the request body
//     const { username , gmail , password } = req.body;

//     //validating the input
//     if(!username || !gmail || !password){
//         return new ApiError(400, "please provide all required fields");
//     }

//     //checking if the admin exist 
//     const admin = await Admin.findone({ username, gmail});

//     if(!admin){
//         return new ApiError(404, "admin not found");
//     }

//     //checking if the password is correct

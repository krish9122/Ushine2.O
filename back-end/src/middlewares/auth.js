// this middleware is used to verify the JWT token and attach the user to the request object if the token is valid. It will be used in protected routes to ensure that only authenticated users can access those routes.

import asyncHandler from "../utils/asyncHandlers.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { Admin } from "../model/admin.model.js"

const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        //taking the token from the cookies or the Authorization header
        const token = req.cookies?.accessTokens || req.header("Authorization")?.replace("Bearer ", "")
        // Add JWT verification logic here
        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided")
        }

        // Verify the token and extract the user information
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // Find the admin in the database based on the decoded token information
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")

        if (!admin) {

            throw new ApiError(401, "Unauthorized: Invalid token")
        }

        req.admin = admin
        next()
    }
    catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: Invalid token")
    }
});

export default verifyJWT;
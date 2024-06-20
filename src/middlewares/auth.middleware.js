const User = require("../models/user.model")
const asyncHandler =  require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token)
            throw new ApiError(401, "Unauthorize Request!");
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshTokens")
    
        if(!user)
            throw new ApiError(401, "Invalid Access Token!");
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Ivalid access Token");
    }
})

module.exports = verifyJWT
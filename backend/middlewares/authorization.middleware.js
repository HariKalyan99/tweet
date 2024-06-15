import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const validateAuthorization = async(request, response, next) => {
    try {
        const token = request.cookies.jwt;

        if(!token) {
            return response.status(404).json({error: "Unauthorized: No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        if(!decoded){
            return response.status(401).json({message: "Unauthorized: Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return response.status(404).json({error: "User not found"})
        }

        request.user = user;
        next();
    } catch (error) {
        console.log("Error in validateAuthorization middleware", error.message)
        return response.status(500).json({error: "Internal Server Error"})
    }
}
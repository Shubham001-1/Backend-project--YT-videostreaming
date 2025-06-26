import cookieParser from "cookie-parser";
import express from "express";
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

    const verifyJWT = asyncHandler(async(req,_,next)=>{
        try {  const token =req.cookies?.AccessToken || req.header("authorisation")?.replace("Bearer","")  
    
    
    if(!token){
        throw new ApiError(401,"unauthorised error") ;
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken")
    
    
    
    if(!user){
        throw new ApiError(401,"invalid access token") 
    }
    req.user = user;
    next() ;
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}

})

export {verifyJWT} ;


import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const generateRefreshTokenandAccesstoken = async(userid) =>{
    const user =await User.findById(userid) ;
    const refreshtoken =await user.generateRefreshToken()
    const accesstoken =await user.generateAccessToken()
     user.refreshtoken = refreshtoken ;
    await user.save({validateBeforeSave:false})
    return {refreshtoken,accesstoken} ;
}
  // get user details from frontend
     // validation - not empty
     // check if user already exists: username, email
     // check for images, check for avatar
     // upload them to cloudinary, avatar
     // create user object - create entry in db
     // remove password and refresh token field from response
     // check for user creation
     // return res
const registerUser = asyncHandler(async (req, res) => {
    //get detail 
    const {username, email, password,fullname} = req.body;
    console.log(username,email) ;
    if(
        [username,email,password,fullname].some((feild)=>feild.trim()==="")
    ){
        throw new ApiError(400,"fill all the details ")
    }
 
//validation
const existingUser = await User.findOne({
    $or: [{email},{username}]
})
if(existingUser){
    throw new ApiError(400,"user already exists")
}
//check for images
const avatar = req.files?.avatar[0]?.path
const coverimage = req.files?.coverimage[0]?.path
if(!avatar){
    throw new ApiError(400,"please upload the avatar image")
}
//upload to coloudinary
const avatar1 = await uploadOnCloudinary(avatar) ;
const coverimage1 =await  uploadOnCloudinary(coverimage) ;


const user =await User.create(
    {
        username,
        fullname ,
        email,
        avatar:avatar1.url,
        coverimage:coverimage1?.url || '',
        password
    }
)
const createduser = await User.findById(user._id).select("-password -refreshtoken") 
if(!createduser){
    throw new ApiError(404,"something went wrong while registring the user")
}
return res.status(200).json(
    new ApiResponse(200,createduser,"user created")
)
}) 
const loginUser = asyncHandler(async (req, res) => {
//get the credentials from user
//check if the user exists
//give him authorisation


 const {email , username , password} = req.body ;
console.log(email) ;
if(!email && !username){
    throw new ApiError(400,"fill the email or username")
}
const existingUser = await User.findOne({
    $or: [{email},{username}]
})
if(!existingUser){
    throw new ApiError(400,"user does not exists")
}

//password - check 
if(await bcrypt.compare(password,existingUser.password)){

}
else{
    throw new ApiError(401,"invalid password")
}

const {accesstoken,refreshtoken} =await generateRefreshTokenandAccesstoken(existingUser._id) ;
const options = {
    httpOnly : true ,
    secure : true 
}
return res.status(200).cookie("refreshtoken" , refreshtoken , options).cookie("AccessToken",accesstoken,options).json(
    new ApiResponse(200,{user : existingUser,accesstoken,refreshtoken},"user logged in")
)
})
const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(req.user._id,
    {
        $set : {
            accesstoken : undefined,
        }
    }
   )
   const options = {
    httpOnly: true,
    secure: true
}
  return res.status(200).clearCookie("AccessToken", options).clearCookie("refreshtoken", options).json(new ApiResponse(200, {}, "User logged Out"))

})
const refreshAccesstoken = asyncHandler(async (req, res) => {
    const inrefreshtoken = req.cookies.refreshtoken ; 
    if(!inrefreshtoken){
    throw new ApiError(401,"no refresh token")
    }
    const decoded = jwt.verify(inrefreshtoken,process.env.REFRESH_TOKEN_SECRET) ;
    const user = await User.findById(decoded._id) ;
    if(!user){
        throw new ApiError(401,"user does not exists")
    }
    if(inrefreshtoken !== user.refreshtoken){
        throw new ApiError(401,"invalid refresh token")
    }
    const {accesstoken,refreshtoken} =await generateRefreshTokenandAccesstoken(user._id) ;
const options = {
    httpOnly : true ,
    secure : true 
}
return res.status(200).cookie("refreshtoken" , refreshtoken , options).cookie("AccessToken",accesstoken,options).json(
    new ApiResponse(200,{user : user,accesstoken,refreshtoken},"refreshed refresh token")
)

})
const changeUserPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user =await User.findById(req.user?._id) ;
    if(!await bcrypt.compare(oldPassword,user.password)){
        throw new ApiError(401,"old password is incorrect")
    }
    user.password = newPassword ;
    await user.save({validateBeforeSave:true}) ;
    return res.status(200).json(new ApiResponse(200, {}, "password changed"))
})
const updateAccountDetails = asyncHandler(async (req,res)=>{
    const {username,email} = req.body ;
    
    const user =User.findByIdAndUpdate(req.user._id,{
        $set : {
            username ,
            email 
        }
    },
    {new:true}
    ).select("-password")
    return res.status(200).json(new ApiResponse(200,"details updated"))
})
const updateAvatar = asyncHandler(async (req, res) => {
    const avatar = req.files?.avatar[0]?.path
    if(!avatar){
        throw new ApiError(400,"please upload the avatar image")
    }
    //upload to coloudinary
    const avatar1 = await uploadOnCloudinary(avatar) ;
    if(!avatar1){
        throw new ApiError(400,"avatar upload failed")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: { avatar:avatar1.url },
    })
    return res.status(200).json(new ApiResponse(200,"Avatar updated"))

})
export {registerUser,loginUser,logoutUser,changeUserPassword,updateAccountDetails,refreshAccesstoken,updateAvatar} ;
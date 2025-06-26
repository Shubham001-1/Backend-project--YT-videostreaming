import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import {logoutUser} from '../controllers/user.controller.js'
import {refreshAccesstoken} from '../controllers/user.controller.js'
import {updateAvatar} from '../controllers/user.controller.js'
import {changeUserPassword} from '../controllers/user.controller.js'
import {updateAccountDetails} from '../controllers/user.controller.js'
const UserRouter = Router() ;
const regUser = UserRouter.route("/register").post(upload.fields([{name :"avatar" ,maxCount :1
},{name :"coverimage" ,maxCount :1}]),registerUser)

const userlogin = UserRouter.route("/login").post(loginUser)
const userlogout = UserRouter.route("/logout").post(verifyJWT,logoutUser) ;
const refreshtoken = UserRouter.route("/refreshtoken").post(refreshAccesstoken) ;
const changepassword = UserRouter.route("/changepassword").post(verifyJWT,changeUserPassword) ;
const updateavatar = UserRouter.route("/updateavatar").post(verifyJWT,upload.fields([{name :"avatar" ,maxCount :1}]),updateAvatar) ;
const updateaccount = UserRouter.route("/updateaccount").post(verifyJWT,updateAccountDetails)
export {regUser,userlogin,userlogout,UserRouter,refreshtoken,updateavatar,changepassword,updateaccount} ;
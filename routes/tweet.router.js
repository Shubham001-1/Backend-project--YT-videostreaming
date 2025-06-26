import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createTweet} from "../controllers/tweet.controller.js";
import {updateTweet} from "../controllers/tweet.controller.js";
import {deleteTweet} from "../controllers/tweet.controller.js";
import {getUserTweets} from "../controllers/tweet.controller.js";
const tweetrouter = Router()
tweetrouter.route("/createTweet").post(verifyJWT,createTweet) ;

tweetrouter.route("/updateTweet/:tweetid").patch(verifyJWT,updateTweet) ;
tweetrouter.route("/deleteTweet/:tweetid").delete(verifyJWT,deleteTweet) ;
tweetrouter.route("/getUserTweets/:userId").get(getUserTweets) ;
export {tweetrouter} ;
import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const likerouter = Router();
likerouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likerouter.route("/toggle/v/:videoId").post(toggleVideoLike);
likerouter.route("/toggle/c/:commentId").post(toggleCommentLike);
likerouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
likerouter.route("/videos").get(getLikedVideos);

export  {likerouter} ;
import { Router } from "express";
import{ publishAVideo} from  "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getVideoById} from "../controllers/video.controller.js";
import {updateVideo} from "../controllers/video.controller.js";
import {deleteVideo} from "../controllers/video.controller.js";
import {togglePublishStatus} from "../controllers/video.controller.js";
import {getAllVideos} from "../controllers/video.controller.js";






const videorouter = Router();

videorouter.route("/p").get((req,res)=>{
res.send(200,"ok") ;
})
videorouter.route("/publishAVideo").post(verifyJWT,upload.fields([{name:"video",maxCount:1},{name:"thumbnail",maxCount:1}]),publishAVideo) ;
//
videorouter.route("/getVideoById/:videoId").get(getVideoById)
videorouter.route("/updateVideo/:videoId").patch(verifyJWT,upload.fields([{name:"thumbnail",maxCount:1}]),updateVideo) ; 
videorouter.route("/deleteVideo/:videoId").delete(verifyJWT,deleteVideo)
videorouter.route("/togglePublishStatus/:videoId").patch(verifyJWT,togglePublishStatus) ;
videorouter.route("/getAllVideos").get(getAllVideos);

export {videorouter} ;
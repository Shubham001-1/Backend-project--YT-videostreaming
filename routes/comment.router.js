import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";
import {updateComment} from "../controllers/comment.controller.js";
import {deleteComment} from "../controllers/comment.controller.js"; 
import {getVideoComments} from "../controllers/comment.controller.js"; 
const commentrouter = Router() ;



commentrouter.route("/addComment").post(verifyJWT,addComment)
commentrouter.route("/updateComment/:commentid").patch(verifyJWT,updateComment)
commentrouter.route("/deleteComment/:commentid").delete(verifyJWT,deleteComment)
commentrouter.route("/getVideoComments/:videoId").get(getVideoComments)

export {commentrouter} ;
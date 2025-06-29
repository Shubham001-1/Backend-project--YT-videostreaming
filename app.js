import express from "express" ;
import cookieParser from "cookie-parser";
import cors from "cors";
import { url } from "inspector";
const app = express();
app.use(cors(
    {origin : process.env.CORS_ORIGIN} 
));
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:'true',limit:'16kb'}))
app.use(cookieParser());


//import routes

import { UserRouter } from "./routes/user.router.js";
import { videorouter } from "./routes/video.router.js";
import {tweetrouter} from "./routes/tweet.router.js";
import {subscriptionrouter} from "./routes/subscription.router.js";
import { commentrouter } from "./routes/comment.router.js";
import {likerouter} from "./routes/like.router.js";
import {playlistrouter} from "./routes/playlist.router.js";
import {dashboardrouter} from "./routes/dashboard.router.js";
import {healthcheckrouter} from "./routes/healthcheck.router.js";
//routes declaration 
app.use("/api/v1/user" , UserRouter) 
app.use("/api/v1/video",videorouter)
app.use("/api/v1/tweet",tweetrouter)
app.use("/api/v1/subscription",subscriptionrouter)
app.use("/api/v1/comment",commentrouter)
app.use("/api/v1/like",likerouter)
app.use("/api/v1/playlist",playlistrouter)
app.use("/api/v1/dashboard",dashboardrouter)
app.use("/api/v1/healthcheck",healthcheckrouter)




export {app} ;
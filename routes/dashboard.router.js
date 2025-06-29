import { Router } from "express";


const dashboardrouter = Router() ;

import {getChannelStats} from "../controllers/dashboard.controller.js";
import {getChannelVideos} from "../controllers/dashboard.controller.js";
dashboardrouter.route("/getChannelStats/:channelId").get(getChannelStats) ;
dashboardrouter.route("/getChannelVideos/:channelId").get(getChannelVideos) ;

export {dashboardrouter} ;
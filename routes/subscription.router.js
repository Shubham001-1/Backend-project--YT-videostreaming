import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {toggleSubscription} from "../controllers/subscription.controller.js";
import {getUserChannelSubscribers} from "../controllers/subscription.controller.js";
import {getSubscribedChannels} from "../controllers/subscription.controller.js";
const subscriptionrouter = Router() ;


subscriptionrouter.route("/toggleSubscription/:channelId").post(verifyJWT,toggleSubscription) ;
subscriptionrouter.route("/getUserChannelSubscribers/:channelId").get(getUserChannelSubscribers) ;
subscriptionrouter.route("/getSubscribedChannels").get(verifyJWT,getSubscribedChannels) ;


export {subscriptionrouter} ;
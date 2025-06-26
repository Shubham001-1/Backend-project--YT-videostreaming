import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { subscription } from "../models/subscriptions.model.js"
import ApiError from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from "../utils/asyncHandler.js"



const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId){
        throw new ApiError(200,"channelId is req") 
    }
    const userId = req.user._id ;
    //const user = User.findById(userId) ;
    const aggregation = [
    {
        $match :{
            channel : new mongoose.Types.ObjectId(channelId),
           subscriber : new mongoose.Types.ObjectId(userId)
        }
    }
    ]
    const result = await subscription.aggregatePaginate(aggregation) ;
    //console.log(result) ;
    if(result.totalDocs!=0){
    const docid = result.docs[0]._id.toString() ;
    const result2 = await subscription.findByIdAndDelete(docid) ;
    return res.status(200).json({
  success: true,
  message: "channel unsubscribed successfully",
  data: result2, 
});
    }
    else{
    const subs = await subscription.create({
        channel : channelId ,
        subscriber :userId
    })
    return res.status(200).json({
  success: true,
  message: "cahnnel subscribed successfully",
  data: subs, 
});
}
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId){
        throw new ApiError(400,"channelId is required")
    }
    const aggregation = [
        {
            $match : {
            channel : new mongoose.Types.ObjectId(channelId) 
                    }
        },{
            $lookup : {
            from : "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscriber"
            }
        },
        { $unwind : "$subscriber"},

        {
    $project: {
      channel:1,
      "subscriber._id": 1,
      "subscriber.username": 1,
      "subscriber.avatar": 1
    }
 }
    
    ]
    const options = {
  page: 1,
  limit: 10,

};
     const result = await subscription.aggregatePaginate(aggregation,options) ;
     console.log(result) ;
      return res.status(200).json({
  success: true,
  message: "subscribers fetched successfully",
  data: result, 
});
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const userId = req.user._id ;
    const aggregation = [
        {$match : {
        subscriber :new  mongoose.Types.ObjectId(userId) 
        }},
        {
            $lookup : {
            from : "users",
            localField: "channel",
            foreignField: "_id",
            as: "channels"
            }
        },
        //{ $unwind : "$channels"},

        {
    $project: {
      subscriberId:1,
      "channels._id": 1,
      "channels.username": 1,
      "channels.avatar": 1
    }
 }
    
]      
 const options = {
  page: 1,
  limit: 10,

};
     const result = await subscription.aggregatePaginate(aggregation,options) ;
     console.log(result) ;
      return res.status(200).json({
  success: true,
  message: "subscribed channels fetched successfully",
  data: result, 
});

    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
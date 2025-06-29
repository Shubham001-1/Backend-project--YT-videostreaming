import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import { subscription } from "../models/subscriptions.model.js"
import {Like} from "../models/like.model.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params 
    const total_subscribers = await subscription.countDocuments({channel : channelId}) ;
    const total_videos = await Video.countDocuments({owner :channelId }) ;
    const total_views = await  Video.aggregate([
        {$match:{
         owner : channelId
        }},
        {
         $group :{
            _id : null ,
            totalViews: { $sum: "$views" }
         }   
        }]
    )
    const total_likes =  await Like.aggregate([
        {
            $match : {
                video :{$exists : true}
            }
        },
        {$lookup:{
            from : "videos",
            localField : "video",
            foreignField : "_id", 
            as : "video_info"
            
        }},
          {
    $unwind: "$video_info"
  },
        {$match:{
         "video_info.owner" : new mongoose.Types.ObjectId(channelId)
        }},
        { $count: "totalLikes" }
          ])
        

    return res.status(200).json({
    success: true,
    message: "details fetched succesfully",
    data: {total_views,total_videos,total_subscribers,total_likes}
});

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    const video =await Video.aggregatePaginate([
       { $match :{
        owner :new mongoose.Types.ObjectId(channelId)
       }}
    ])
      return res.status(200).json({
    success: true,
    message: "details fetched succesfully",
    data: video
});
})

export {
    getChannelStats, 
    getChannelVideos
    }
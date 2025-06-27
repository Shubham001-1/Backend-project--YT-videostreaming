import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import ApiError from '../utils/ApiError.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id ;
    const like =await Like.findOne({video:new mongoose.Types.ObjectId(videoId),likedBy:new mongoose.Types.ObjectId(userId)})
   // console.log(like) ;
    if(like!=null){
    const result1 = await Like.deleteOne({ _id: like._id });
    return res.status(200).json({
  success: true,
  message: "unlike video succesfully",
  data: result1, 
});
    }
    else{
      const result2 =  await Like.create({
            video :videoId ,
            likedBy : userId
        })
        return res.status(200).json({
  success: true,
  message: "like video succesfully",
  data: result2, 
});
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
        
    const userId = req.user._id ;
    const like =await Like.findOne({comment:new mongoose.Types.ObjectId(commentId),likedBy:new mongoose.Types.ObjectId(userId)})
   // console.log(like) ;
    if(like!=null){
    const result1 = await Like.deleteOne({ _id: like._id });
    return res.status(200).json({
  success: true,
  message: "unliked comment succesfully",
  data: result1, 
});
    }
    else{
      const result2 =  await Like.create({
            comment :commentId ,
            likedBy : userId
        })
        return res.status(200).json({
  success: true,
  message: "liked comment succesfully",
  data: result2, 
});
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
     const userId = req.user._id ;
    const like =await Like.findOne({tweet:new mongoose.Types.ObjectId(tweetId),likedBy:new mongoose.Types.ObjectId(userId)})
   // console.log(like) ;
    if(like!=null){
    const result1 = await Like.deleteOne({ _id: like._id });
    return res.status(200).json({
  success: true,
  message: "unliked tweet succesfully",
  data: result1, 
});
    }
    else{
      const result2 =  await Like.create({
            tweet :tweetId ,
            likedBy : userId
        })
        return res.status(200).json({
  success: true,
  message: "liked tweet succesfully",
  data: result2, 
});
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
     const userId = req.user._id ;
     const aggregation = [
     {   $match:{
            likedBy : new mongoose.Types.ObjectId(userId),
            video: { $ne: null }
        }},
        
           { $lookup:{
                from : "videos",
                localField: "video",
                foreignField: "_id",
                as: "video_info"
            }},
            { 
                "$unwind" : "$video_info"
            },
        {
            $project : {
                likedBy :1 ,
                "video_info.title" : 1 ,
                "video_info.thumbnail" :1 ,
                "video_info.owner" :1
            }
        }
     ]
     const options = {
        page : 1 || page ,
        limit : 10 || limit
     }
    const result = await Like.aggregatePaginate(aggregation,options)
     return res.status(200).json({
  success: true,
  message: "liked videos fetched succesfully",
  data: result, 
});

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import ApiError from '../utils/ApiError.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw new ApiError(400,"videoId is req")
    }

    const aggregation = [
       { $match:{
         "video" : new mongoose.Types.ObjectId(videoId) 
        }
    } ,{
        $lookup : {
            from : "users",
            localField: "owner",
            foreignField: "_id",
            as: "commentator"
        }
    },
    {
        "$unwind" : "$commentator"
    },
    {
         $project: {
       
      "content" : 1 ,
      "commentator._id": 1,
      "commentator.username": 1,
      "commentator.avatar": 1
    }
    }
        
    ]
    const options = {
        page ,
        limit
    }
const result =await Comment.aggregatePaginate(aggregation,options)

return res.status(200).json({
  success: true,
  message: "Comment fetched succesfully",
  data: result, 
});
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content,videoId} = req.body
    const userId = req.user._id ;
     if (!content || !videoId) {
   
    throw new ApiError(400,"Content and videoId are required");
  }
    const result = await Comment.create(
        {
            content,
            video:videoId,
            owner:userId
        }
    )
return res.status(200).json({
  success: true,
  message: "Comment posted succesfully",
  data: result, 
});

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
     const {newcontent} = req.body
     const {commentid} = req.params 
    const userId = req.user._id ;
     if (!newcontent || !commentid) {
   
    throw new ApiError(400,"Content and videoId are required");
  }
const comment = await Comment.findById(commentid)

if(!comment || comment.owner.toString() != userId){
    throw new ApiError(400,"unauthorised access");
}

comment["content"] = newcontent ;

comment.save() ; 
return res.status(200).json({
  success: true,
  message: "Comment updated succesfully",
  data: comment, 
});
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
     
     const {commentid} = req.params 
    const userId = req.user._id ;
     if ( !commentid) {
   
    throw new ApiError(400,"Content is required");
  }
const comment = await Comment.findById(commentid)

if(!comment || comment.owner.toString() != userId){
    throw new ApiError(400,"unauthorised access");
}

const comment1 = await Comment.findByIdAndDelete(commentid)


return res.status(200).json({
  success: true,
  message: "Comment deleted succesfully",
  data: comment1, 
});
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
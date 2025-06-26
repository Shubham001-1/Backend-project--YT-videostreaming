import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import ApiError from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { upload } from "../middlewares/multer.middleware.js";



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy="views", sortType="asc", userId } = req.query ;
    //TODO: get all videos based on query, sort, pagination
    //user->video 
    const matchstage = {} ;
    if(query){
        matchstage.$or = [

           { title : {$regex:query ,$options:"i" }},
           { description :{$regex:query ,$options:"i" }}
        
        ] ;
    }
     if (userId) {
  matchstage.owner = userId;
}
    const aggregation = [
        {$match:matchstage},
        {$lookup : {
            from : "users" ,
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    }, 
       {$unwind : "$owner"},
        {
    $project: {
      title: 1,
      description: 1,
      videoFile: 1,
      thumbnail: 1,
      views: 1,
      createdAt: 1,
      "owner._id": 1,
      "owner.username": 1,
      "owner.avatar": 1
    }
 }
    ]
const sortStage = {
  [sortBy]: sortType === "asc" ? 1 : -1
};
const options = {
  page: parseInt(page),
  limit: parseInt(limit),
  sort: sortStage
};
const result = await  Video.aggregatePaginate(aggregation,options) ;
return res.status(200).json({
  success: true,
  message: "Videos fetched successfully",
  data: result.docs,
  pagination: {
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page,
    limit: result.limit,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage
  }
});
 

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body ;
    
    if(!title || !description) {
throw new ApiError(400,"fill all the details ")   
 }
    // TODO: get video, upload to cloudinary, create video
    const photopath = req.files?.thumbnail[0]?.path ;
    const videopath = req.files?.video[0]?.path
    if(!videopath){
        return new ApiError(400, "Video is required")
    }
    const video1 = await uploadOnCloudinary(videopath)
    const thumb = await uploadOnCloudinary(photopath)
    const video2 =  await Video.create({
        title,
        description,
        videoFile:video1.url,
        owner : req.user._id,
        duration : 60 ,
        thumbnail:thumb.url
    })
   return res.status(200).json({
  success: true,
  message: "Video uploaded successfully",
  data: video2, // optional: send saved video data
});
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
if(!videoId){
    throw new ApiError(400, "Video id is required");
}
const video1 = await Video.findById(videoId) 
if(!video1){
    throw new ApiError(400, "Video not found");
}
return res.status(200).json({
    success: true,
     message: "Video found successfully",
    data: video1
    })
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
        throw new ApiError(400, "Video id is required");
    }
    const photopath = req.files?.thumbnail[0]?.path ;
    const video1 =await Video.findById(videoId) ;
    if(!video1){
         throw new ApiError(200,"video not found") ;
    }
   
    if(req.user._id.toString() != video1.owner.toString()){
        throw new ApiError(200,"Unauthorised access") ;
    }
    const allowed_updates = ["title","description","thumbnail"]  ;
    for(let i=0;i<allowed_updates.length;i++){
        if(req.body[allowed_updates[i]]  ){
            
            video1[allowed_updates[i]] = req.body[allowed_updates[i]] ;
        }
            else if(allowed_updates[i]== "thumbnail" && photopath){
                
               
                const thumbnail1 = await  uploadOnCloudinary(photopath) ;
                video1[allowed_updates[i]] = thumbnail1.url ;
                }
                
            }
        
    
     await video1.save();

    return res.status(200).json({
    success: true,
     message: "Video updated successfully",
    data: video1 
    })

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError(400,"pleease send the video id") ;
    }
    const video = await Video.findById(videoId);
    if (!video) {
    throw new ApiError(404, "Video not found");
    }
    const video1 = await Video.findByIdAndDelete(videoId) ;
     return res.status(200).json({
    success: true,
     message: "Video deleted successfully",
    data: video1 
    })

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     if(!videoId){
        throw new ApiError(400,"pleease send the video id") ;
    }
    const video = await Video.findById(videoId);
    if (!video) {
    throw new ApiError(404, "Video not found");
    }
    video["isPublished"] = !video["isPublished"]
    await video.save() 
     return res.status(200).json({
    success: true,
     message: "Video published status toggled successfully",
    data: video 
    })
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
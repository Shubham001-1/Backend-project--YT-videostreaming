import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(400, "name and description are required")
    }

    if(name.length < 3 || name.length > 50){
        throw new ApiError(400, "Playlist name must be between 3 and 50 characters")
    }
    if(description.length < 5 || description.length > 200){
        throw new ApiError(400, "Playlist description must be between 5 and 200 characters")
    }
    const result = await Playlist.create({
     name ,
     description,
     owner: req.user._id
    })
    res.status(201).json({
        success: true,
        message: "Playlist created successfully",
        data: result
    })

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id;

const result =await Playlist.find({ owner: req.user._id }).populate("videos");
/*
const aggregation = [
  {
    $match: {
      owner: new mongoose.Types.ObjectId(userId) 
    }
  },
  {
    $lookup: {
      from: "videos",          
      localField: "videos",
      foreignField: "_id",
      as: "video_info"
    }
  },
  {
    $project: {
      name: 1,
      description: 1,
      createdAt: 1,
      "video_info.title": 1,
      "video_info.thumbnail": 1,
      "video_info._id": 1
    }
  }
] 
const result  = await Playlist.aggregatePaginate(aggregation) ;*/
  res.status(200).json({
    success: true,
    message: "User playlists fetched successfully",
    data: result
  });

    
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400,"playlistId is req")
    }
    const playlist =await Playlist.findById(playlistId) ;
    if(!playlist){
        throw new ApiError(400,"Playlist not found")
    }
      res.status(201).json({
        success: true,
        message: "Playlist found successfully",
        data: playlist
    })


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
    throw new ApiError(400,"PlaylisId and videoId is req ")
    }
    const playlist = await Playlist.findById(playlistId) ;
    if(!playlist){
        throw new ApiError(400,"Playlsit not found") 
    }
    const video = await Video.findById(videoId) ;
    if(!video){
        throw new ApiError(400,"video not found") 
    }
    const result = await playlist.videos.push(videoId)
    playlist.save()
    res.status(201).json({
        success: true,
        message: "video added to playlist successfully",
        data: result
    })

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
       const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
    throw new ApiError(400,"PlaylistId and videoId is req ")
    }
    const playlist = await Playlist.findById(playlistId) ;
    if(!playlist){
        throw new ApiError(400,"Playlist not found") 
    }
    const video = await Video.findById(videoId) ;
    if(!video){
        throw new ApiError(400,"video not found") 
    }
    const result = await playlist.videos.remove(new mongoose.Types.ObjectId(videoId))
    playlist.save()
    res.status(201).json({
        success: true,
        message: "video removed from playlist successfully",
        data: result
    })

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
     if(!playlistId ){
    throw new ApiError(400,"PlaylisId is req ")
    }
    await Playlist.findByIdAndDelete(playlistId) ;
    res.status(201).json({
        success: true,
        message: "playlist deleted successfully",
    })
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!playlistId){
    throw new ApiError(400,"Playlist not found") 
    }  
    const playlist =await Playlist.findByIdAndUpdate(playlistId,{
         ...(name && { name }),
         ...(description && { description })
    },
    { new: true, 
    runValidators: true})  
      res.status(201).json({
        success: true,
        message: "playlist updated successfully",
        data : playlist
    })
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
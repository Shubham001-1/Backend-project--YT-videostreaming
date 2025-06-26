import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import ApiError from '../utils/ApiError.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet  1.get input from req
    //2.crate dcoum

    const {content} = req.body ;
    console.log(content) ;
    if(!content){
        throw new ApiError(200,"content is empty") ;
    }
    const tweet =await Tweet.create({
        content ,
        owner : req.user._id 
    })

     return res.status(200).json({
  success: true,
  message: "tweet uploaded successfully",
  data: tweet, 
});
    

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
        const {userId }= req.params 

     const  page = 1, limit = 10  
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 } // Newest first
    };
    if(!userId){
        throw new ApiError(200,"userid is req") ;
    }
    const aggregation = [
       { $match : {
         owner : new mongoose.Types.ObjectId(userId)
        }
    }
    ] 
const tweets = await Tweet.aggregatePaginate(aggregation,options)
return res.status(200).json({
        success: true,
        message: "User tweets fetched successfully",
        data: {
            tweets: tweets.docs,
            pagination: {
                total: tweets.totalDocs,
                pages: tweets.totalPages,
                page: tweets.page,
                limit: tweets.limit
            }
        }
    });
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetid} = req.params ;
    const {newcontent} = req.body ;
    if(!newcontent){
        throw new ApiError(200,"newcontent is needed") 
    }
    
    if(!tweetid){
        throw new ApiError(200,"tweet id is needed") 
    }
    const tweet =await Tweet.findById(tweetid) ;
    if(!tweet){
        throw new ApiError(200,"tweet is not found") 
    }
   // console.log(tweet) ;
    if(tweet.owner.toString() != req.user._id.toString()){
        throw new ApiError(200,"Unauthorised access") ;
    }
   tweet.content = newcontent;
   tweet.save() ;
   return res.status(200).json({
    success: true,
     message: "tweet updated successfully",
    data: tweet 
    })
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetid} = req.params 
    if(!tweetid){
         throw new ApiError(200,"tweet id is needed") 
    }
    const tweet = await Tweet.findByIdAndDelete(tweetid) ;
     return res.status(200).json({
    success: true,
     message: "tweet deleted successfully",
    data: tweet 
    })
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
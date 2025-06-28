import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const playlistrouter = Router() ;


import {createPlaylist} from "../controllers/playlist.controller.js";
import {getPlaylistById} from "../controllers/playlist.controller.js";
import {addVideoToPlaylist} from "../controllers/playlist.controller.js";
import {removeVideoFromPlaylist} from "../controllers/playlist.controller.js";
import {updatePlaylist} from "../controllers/playlist.controller.js";
import {getUserPlaylists} from "../controllers/playlist.controller.js";
import {deletePlaylist} from "../controllers/playlist.controller.js";

playlistrouter.route("/createPlaylist").post(verifyJWT,createPlaylist) ;
playlistrouter.route("/getPlaylistById/:playlistId").get(verifyJWT,getPlaylistById) ;
playlistrouter.route("/addVideoToPlaylist/:playlistId/:videoId").post(verifyJWT,addVideoToPlaylist) ;
playlistrouter.route("/removeVideoFromPlaylist/:playlistId/:videoId").post(verifyJWT,removeVideoFromPlaylist) ;
playlistrouter.route("/updatePlaylist/:playlistId").patch(verifyJWT,updatePlaylist) ;
playlistrouter.route("/getUserPlaylists").get(verifyJWT,getUserPlaylists) ;
playlistrouter.route("/deletePlaylist/:playlistId").delete(verifyJWT,deletePlaylist) ;

export {playlistrouter} ;

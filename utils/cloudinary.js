import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config'
import fs from 'fs';


    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:639583894254957, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });
 

const uploadOnCloudinary = async (filepath) => {
    try {
        if(!filepath) return NULL;
        const uploadres = await cloudinary.uploader.upload(filepath,{resource_type :'auto'})
        fs.unlinkSync(filepath) ;
        console.log("file uploaded succesfully",uploadres.url) ;
        return uploadres ;
    } catch (error) {
        fs.unlinkSync(filepath) ;
        console.log("Error uploading file to cloudinary",error);
        return NULL ;
    }
}

    export {uploadOnCloudinary} ; 

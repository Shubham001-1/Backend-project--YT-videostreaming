
import mongoose from "mongoose"
import {DB_NAME} from "../constants.js" ;
import express from "express" ;


const app = express() ;
const connect_db =async()=>{
try {
    
   const connection_instance = await mongoose.connect(process.env.MONGODB_URI , {dbName :DB_NAME})
   console.log("connected to database", connection_instance.connection?.host) ;
    
}
 catch (error) {
    console.error(`❌ Unable to connect to MongoDB: ${error.message}`);

}
}

export default connect_db /*
import mongoose from "mongoose";
import dotenv from "dotenv";
import {DB_NAME} from "../constants.js" ;
 // Load environment variable

const connect_db = async () => {
  try {
    const connection_instance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME
    });

    console.log("✅ Successfully connected to MongoDB!");
    console.log("🔍 Connection details:", connection_instance);
    console.log("🌍 Host:", connection_instance.connection?.host || "Undefined");

  } catch (err) {
    console.error(`❌ Unable to connect to MongoDB: ${err.message}`);
  }
};

export default connect_db;
*/
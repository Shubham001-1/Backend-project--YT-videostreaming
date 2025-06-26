import mongoose , {Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new Schema(
   { username : {
        type: String,
        required: true,
        unique : true ,
        trim: true ,
        index : true ,
        lowercase:true   
    } ,
    email : {
        type: String,
        required: true,
        unique : true ,
        trim: true ,
        lowercase : true 
    },
    fullname : {
        type: String,
        required: true ,
        trim: true ,
        index : true
    },
    avatar : {
        type: String,
    },
    coverimage : {
        type: String,
    },
    watchhistory : 
        [
            {
                type: Schema.Types.ObjectId ,
                ref : 'video'
            }
        ],
    password : {
        type: String ,
        required : true 
    },
    refreshtoken : {
        type : String ,
    }
    
},
{
    timestamps: true
}

)
userSchema.pre("save",async function (next){
if(!this.isModified("password")){
    next() ;
}
else{
    this.password = await bcrypt.hash(this.password,12)
    next();
}
}) 
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
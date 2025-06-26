import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subschema = new mongoose.Schema({
    channel :{
        type :Schema.Types.ObjectId ,
        ref : 'User'
    },
    subscriber :{
       type :Schema.Types.ObjectId ,
        ref : 'User'
    }},{
        timestamps :true
    }
    
)
subschema.plugin(mongooseAggregatePaginate) ;
export const subscription = mongoose.model('subscription', subschema);
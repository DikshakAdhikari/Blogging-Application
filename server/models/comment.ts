import mongoose, { Schema, Types } from "mongoose";

const commentSchema= new mongoose.Schema({
    comments:{
        type:String,
        required:true
    },
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'user'
    }

},{timestamps:true})

const comment= mongoose.model('comment',commentSchema)

export default comment
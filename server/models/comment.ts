import mongoose, { Types } from "mongoose";

const commentSchema= new mongoose.Schema({
    comments:{
        type:String,
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'blog'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

},{timestamps:true})

const comment= mongoose.model('comment',commentSchema)

export default comment
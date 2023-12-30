import mongoose, { Schema } from "mongoose";

const blogSchema= new mongoose.Schema({
    imageUrl:{
        type:String,
        required:false
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
       type: Schema.Types.ObjectId,
       ref:'user',
       required:true 
    }
},{timestamps:true})

const blog= mongoose.model('blog',blogSchema)
export default blog
import mongoose from "mongoose";

const connectDb= async()=>{
    try{
        const db= await mongoose.connect('mongodb://localhost:27017/blog')
        console.log('Connected to DB');
        
    }catch(err){
        console.log(err);
        
    }
}

export default connectDb
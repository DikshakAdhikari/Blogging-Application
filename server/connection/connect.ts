import mongoose from "mongoose";

const connectDb= async()=>{
    try{
        //@ts-ignore
        const db= await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to DB');
        
    }catch(err){
        console.log(err);
        
    }
}

export default connectDb
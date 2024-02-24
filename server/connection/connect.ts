import mongoose from "mongoose"
export const mongooseConnect = async()=> {
    try{
        if(process.env.MONGO_URI){
       await mongoose.connect(process.env.MONGO_URI)
       console.log('Connected Successfully');
        }
       
    }catch(err){
        console.log('Db Error' + err);
        
    }
    
}
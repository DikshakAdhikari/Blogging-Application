import mongoose from "mongoose"
export const mongooseConnect = async()=> {
    try{
        if(process.env.MONGO_URI){
       await mongoose.connect("mongodb+srv://ddikshakk:galatHai@cluster0.p9bcrjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
       console.log('Connected Successfully');
        }
       
    }catch(err){
        console.log('Db Error' + err);
        
    }
    
}
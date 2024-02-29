import mongoose from "mongoose"
export const mongooseConnect = async()=> {
    try{
        if(process.env.DATABASE_URL){
            
       await mongoose.connect(process.env.DATABASE_URL)
       console.log('Connected Successfully');
        }
       
    }catch(err){
        console.log('Db Error' + err);
        
    }
    
}
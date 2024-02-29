import mongoose from "mongoose"
export const mongooseConnect = async()=> {
    try{
        if(process.env.DATABASE_URL){
            console.log(process.env.DATABASE_URL);
            
       await mongoose.connect(process.env.DATABASE_URL)
       console.log('Connected Successfully');
        }else{
            console.log("MONOOOOOO");
            
        }
       
    }catch(err){
        console.log('Db Error' + err);
        
    }
    
}
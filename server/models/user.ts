import mongoose, { Model,Document } from "mongoose";
import { createHmac , randomBytes } from "crypto";
import { generateToken } from "../services/auth";

interface IUser extends Document{ //We are extending to  Document type bcz n Mongoose, the isModified function is used to check if a particular field in a document has been modified. This function is available on individual documents (instances of a Mongoose model) and is used to determine whether a field has been changed since the document was loaded or saved
    fullName: string;
    email:string;
    password:string;
    role:string;
    salt:string;
}

interface UserModel extends Model<IUser> {
    matchPasswordAndGiveToken(userId:string, email:string, role:string, password:string):Promise<IUser | null>
}

const userSchema= new mongoose.Schema<IUser,UserModel>({
    fullName:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['NORMAL','ADMIN'],
        default:'NORMAL'
    
    },
    salt:{
        type:String,
       
    },
    
    
},{timestamps:true})

userSchema.pre<IUser>('save', function (next){
    const user= this;
    if(!user.isModified("password")) {return}
    const secret= randomBytes(17).toString()
    const hashedPassword = createHmac('sha256', secret).update(user.password).digest('hex');
    this.salt = secret
    this.password = hashedPassword
    next()
})


userSchema.static('matchPasswordAndGiveToken', async function(userId , email, role , password){
    const user= await this.findOne({email})
    if(!user){
        throw new Error('User not found')
    }
    const secret= user.salt
    const hashedPassword= user.password
    const hashingPassword= createHmac('sha256', secret).update(password).digest('hex');
    if(hashedPassword !== hashingPassword){
        return null
    }

    const token = generateToken(userId,email,role)
    return token

})

const user= mongoose.model<IUser,UserModel>('user', userSchema)

export default user
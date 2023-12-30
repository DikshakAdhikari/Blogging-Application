import jwt from 'jsonwebtoken'

export const generateToken = (userId:string , email:string, role:string)=> {
    const payload = {
        id:userId,
        email:email,
        role:role
    }
    if(!process.env.SECRET_KEY){
        return 
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:'1h'})
    //console.log(token);
    
    return token
}
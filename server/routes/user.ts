import express from 'express'
import user from '../models/user'
import { verifyJwt } from '../middlewares/veriftJwt'
import { getObjectUrl, putObject } from '../services/aws-client'

const userRouter= express.Router()


userRouter.post('/', async (req,res)=> {
    try{
        const {fullName, email, password, filename, contentType } = req.body
        const img = `https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-${filename}`
        const  userDetails = await user.create({
            fullName, email, password, imageUrl:img
        });
       userDetails.save()
        res.json('user saved successfully!')  
    }catch(err){
        res.json(err);
    }
} )

userRouter.post('/signin', async (req, res)=> {
    try{   
        const {email, password} = req.body
        const isValidUser = await user.findOne({email})
        if(!isValidUser){
            return res.status(403).json('Such user does not exists!')
        }
        const token = await user.matchPasswordAndGiveToken(isValidUser._id, email ,isValidUser.role, password)
        if(!token){
            throw new Error('Invalid user')
        }
        
         res.json(token)
    }catch(err){
        res.status(403).json(err)
    }
})

userRouter.post('/picture' , async (req,res)=> {
    try{
        const {filename, contentType}= req.body;
        const url= await putObject(`image-${filename}`, contentType);
        res.json(url)
        
        
    }catch(err){
        res.json(err)
    }
} )

userRouter.get('/:id', verifyJwt, async(req,res)=> {
    try{    
        const getUser = await user.findById(req.params.id)
        if(getUser){
            return res.json(req.headers['userId'])
        }
        return res.status(402).json("Such user with userId does not exists!")
    }catch(err){
        res.status(404).json(err)
    }
})



export default userRouter


import express from 'express'
import user from '../models/user'
import { generateToken } from '../services/auth'
import { verifyJwt } from '../middlewares/veriftJwt'

const userRouter= express.Router()

userRouter.post('/' , async (req, res)=> {
    try{
        const {fullName, email, password, role} = req.body
        const isUserExists = await user.findOne({fullName, email})
        if(isUserExists){ 
            return res.json('User already exists!')
        }
        const data= await user.create({
            fullName , email, password, role
        })
        data.save()
        res.send('User created successfully!')
    }catch(err){
        res.status(403).json(err)
    }
})

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
        res.cookie('token', token, { secure: true, httpOnly: false, path: '/' });
         res.json(isValidUser)
    }catch(err){
        res.status(403).json(err)
    }
})


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


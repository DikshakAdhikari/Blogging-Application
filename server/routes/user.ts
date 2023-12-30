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
        res.cookie('token', token, { secure: true, httpOnly: false, path: '/' });
         res.send('Cookie has been sent!')
    }catch(err){
        res.status(403).json(err)
    }
})

userRouter.get('/k', verifyJwt, async(req,res)=> {
    const id= req.headers['userId']
    const rolee= req.headers['role']
    const token = req.cookies['token']
        console.log(token);
    const obj={
        id, rolee, token
    }
    res.send(obj)
} )

export default userRouter


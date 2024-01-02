import express from 'express'
import { verifyJwt } from '../middlewares/veriftJwt'
import comment from '../models/comment'
const commentRouter= express.Router()


commentRouter.post('/:blogId/:userId', async(req,res)=> {
    try{
     const {comments} = req.body
     const postComment= await comment.create({
        comments , blogId: req.params.blogId , userId: req.params.userId
    })
    await postComment.save()
    res.status(200).json('Comment successfully made!')
    }catch(err){
        res.status(403).json(err)
    }
    
})


commentRouter.get('/:blogId', async(req,res)=> {
    try{
        const userComments = await comment.find({blogId: req.params.blogId})
        res.json(userComments)
    }catch(err){
        res.status(403).json(err)
    }
})


export default commentRouter
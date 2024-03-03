import express from 'express'
import { verifyJwt } from '../middlewares/veriftJwt'
import blog from '../models/blog'
import { putObject } from '../services/aws-client'
const blogRouter= express.Router()



blogRouter.get('/blogs', verifyJwt,async(req,res)=> {
    try{
        const limit= req.query.limit
        const page= req.query.page 
        const searchText= req.query.search || ""        
        
        if(!req.query.sort){
            req.query.sort = 'title'
        }
        
        let sort= req.query.sort || 'title'
       
        
        if(!limit || !page ){
            return
        }
         const limitNumber= +limit || 5 //converting string to number
         const pageNumber= +page-1 || 0
         let skipDocuments= pageNumber*limitNumber
            //console.log("skip", skipDocuments);
            
         if(typeof req.query.sort === 'string'){
             sort= req.query.sort.split(",")
         }

         let sortBy:any= {}
         //@ts-ignore
         if(sort[1]){
            //@ts-ignore
            sortBy[sort[0]]= sort[1]
         }else{
            //@ts-ignore
            sortBy[sort[0]]= "asc"
         }
         //console.log(sortBy); //{ title: 'asc' } or {title: 'desc'}
         let content:any=[]
         if(searchText != ""){
            skipDocuments=0;
             content= await blog.find({title:{$regex:searchText , $options:"i"}}).skip(skipDocuments).limit(limitNumber).collation({ locale: 'en', strength: 2 }).sort(sortBy).populate('createdBy')
             

         }else{
            content= await blog.find({title:{$regex:searchText , $options:"i"}}).skip(skipDocuments).limit(limitNumber).collation({ locale: 'en', strength: 2 }).sort(sortBy).populate('createdBy')
         }
         //console.log(content); 
         const docsCount= await blog.countDocuments({
            title: {$regex:searchText , $options:'i'}
         })  
         //console.log(docsCount);
         
         res.json({
            content,
            docsCount,
            limit:limitNumber
         })
    }catch(err){
        res.status(403).json(err)
    }
})

blogRouter.post('/', verifyJwt ,  async(req,res)=> {
    try{
        const {title , description, filename, contentType}= req.body
        
         const userId= req.headers['userId']
         
        const data = await blog.create({
            imageUrl: `https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-${filename}`,
            title: title,
            description: description,
            createdBy: userId,
        })
        await data.save()
        
    res.json('Blog successfully uploaded!')
        
    }catch(err){
        res.json(err)
    }
});



blogRouter.post('/picture' , async (req,res)=> {
    try{
        const {filename, contentType}= req.body;
        const url= await putObject(`image-${filename}`, contentType);
        res.json(url)   
        
    }catch(err){
        res.json(err)
    }
} )


blogRouter.put('/update/:blogId', verifyJwt, async (req,res)=> {
    try{
        const {title , description, filename, contentType}= req.body   
        console.log(title, description, filename, contentType);
          
        const UserId= req.headers['userId']
        const img = `https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-${filename}`;
        console.log(img);
        

             const updateBlog = await blog.findByIdAndUpdate(req.params.blogId ,{
             title: title,
             description: description,
             createdBy: UserId,
             imageUrl: img
            } );
            console.log(updateBlog);
            
            res.json('Blog updated successfully!')
    }catch(err){
        res.status(403).json
    }
})


blogRouter.get('/userBlog', verifyJwt, async(req,res)=> {
    try{
        const userBlogs= await blog.find({createdBy:req.headers['userId']}).sort({updatedAt:"desc"})
        res.json(userBlogs)
        
    }catch(err){
        res.status(403).json(err)

    }
})

blogRouter.get('/user/:blogId', async (req,res)=> {
    try{
        const userName= await blog.findOne({_id:req.params.blogId}).populate('createdBy')
        res.json(userName)
    }catch(err){
        res.status(403).json(err)
    }
})

blogRouter.delete('/remove/:blogId', verifyJwt, async (req,res)=> {
    try{
        const blogToDelete= await blog.findOneAndDelete({_id:req.params.blogId})      
        res.json('blog deleted successful!')
        
    }catch(err){
        res.status(403).json(err)
    }
})



export default blogRouter
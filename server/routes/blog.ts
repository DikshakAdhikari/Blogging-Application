import express from 'express'
import { verifyJwt } from '../middlewares/veriftJwt'
import multer from 'multer'
import blog from '../models/blog'
import path from 'path'
const blogRouter= express.Router()

blogRouter.get('/blogs', verifyJwt,async(req,res)=> {
    try{
        const limit= req.query.limit
        const page= req.query.page 
        const searchText= req.query.search || ""        
        console.log(searchText);
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
             content= await blog.find({title:{$regex:searchText , $options:"i"}}).skip(skipDocuments).limit(limitNumber).collation({ locale: 'en', strength: 2 }).sort(sortBy)

         }else{
            content= await blog.find({title:{$regex:searchText , $options:"i"}}).skip(skipDocuments).limit(limitNumber).collation({ locale: 'en', strength: 2 }).sort(sortBy)
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
//  blogRouter.use(express.static(path.resolve('./public/uploads/')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //console.log(req.headers['userId']);
      cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        // console.log(file.mimetype); // image/jpeg
        // const ext = file.mimetype.split("/")[1]; //jpeg
        const fileName= `${Date.now()}-${file.originalname}`
      cb(null, fileName) // .jpeg
    }
  })

  const upload = multer({ storage: storage })

blogRouter.post('/', verifyJwt , upload.single('file'), async(req,res)=> {
    try{
        const {title , description}= req.body
         const userId= req.headers['userId']
         //console.log(req.file?.filename);
         
        const data = await blog.create({
            imageUrl: `/uploads/${req.file?.filename}`,
            title: title,
            description: description,
            createdBy: userId,
        })
        await data.save()
        
    res.send('Blog successfully uploaded!')
        
    }catch(err){
        res.json(err)
    }
})



blogRouter.get('/all' , async(req, res)=> {
    try{
        const data= await blog.find().populate('createdBy')
        res.json(data)
    }catch(err){
        res.status(403).json(err)
    }
})

blogRouter.get('/:id', verifyJwt, async(req,res)=> {
    try{
        const userBlogs= await blog.find({createdBy:req.params.id}) 
        res.json(userBlogs)
        
    }catch(err){
        res.status(403).json(err)

    }
})

blogRouter.get('/user/:blogId', async (req,res)=> {
    try{
        const blogg = await blog.findOne({_id:req.params.blogId})
        res.json(blogg)
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
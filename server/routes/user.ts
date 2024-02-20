import express from 'express'
import user from '../models/user'
import { verifyJwt } from '../middlewares/veriftJwt'
import multer from 'multer'
import path from 'path'

import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const userRouter= express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        const fileName= `${Date.now()}-${file.originalname}`
      cb(null, fileName) // .jpeg
    }
  })

  const upload = multer({ storage: storage })

userRouter.post('/' , upload.single('file'), async (req, res)=> {
    try{
        
        const {fullName, email, password, role} = req.body
        const isUserExists = await user.findOne({fullName, email})
        if(isUserExists){ 
            return res.json('User already exists!')
        }
        
        if(!req.file){
            const data= await user.create({
                fullName , email, password, role
            })
            data.save()
            res.send('User created successfully!')
        }
        else{
        const data= await user.create({
            imageUrl: `/uploads/${req.file?.filename}`,
            fullName , email, password, role
        })
        data.save()
        res.send('User created successfully!')
    }
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

userRouter.post('/picture' , async (req,res)=> {
    try{
        const {filename, contentType}= req.body;
        console.log(filename, contentType);
        // //@ts-ignore
        // global.filename= filename;
        // //@ts-ignore
        // global.contentType= contentType
        const url= await putObject(`image-${filename}`, contentType);
        
        
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


const s3Client= new S3Client({
    region:"ap-south-1",
    credentials: {
        accessKeyId: 'AKIA3W66FKKVR2K4WLRL',
        secretAccessKey:'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'
    }
});

//@ts-ignore
async function getObjectUrl(key){ //This function will give a url such that we can view particular image
    const command= new GetObjectCommand({
        Bucket: 'blog.dikshak',
        Key: key,
    });

    const url= await getSignedUrl(s3Client, command); //logic for generating signed url means url containing secrets.
    return url;
}

//@ts-ignore
async function putObject(filename, contentType){
    const command= new PutObjectCommand({
        Bucket: 'blog.dikshak',
        Key: `uploads/profile-pic/${filename}`,
        ContentType: contentType
    })
    const url= await getSignedUrl(s3Client, command);
    return url;
}

async function init(){
    //@ts-ignore
    // console.log('Url for minions', await getObjectUrl(`uploads/profile-pic/image-${global.filename}`));
    //@ts-ignore
    console.log('Url for uploading', await putObject(`image-${global.filename}`, global.contentType));

}

init();

export default userRouter


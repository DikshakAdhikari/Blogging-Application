import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user'
import cookieParser from 'cookie-parser'
import blogRouter from './routes/blog'
import cors from 'cors'
import commentRouter from './routes/comment'
import { mongooseConnect } from './connection/connect'
import mongoose from 'mongoose'
dotenv.config()


const app= express()
const uri = process.env.DATABASE_URL

// Connect to MongoDB
//@ts-ignore
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Your code here, such as defining models, querying data, etc.
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  })); 
  
app.use(express.json())
app.use(cookieParser())
app.use('/user',userRouter)
app.use('/blog',blogRouter)
app.use('/comment', commentRouter)
app.use('/', (req,res)=> {
  res.send("Welcome babyy")
})

app.listen(process.env.PORT , ()=> console.log(`Server listening on port ${process.env.PORT}`))





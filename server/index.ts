import express from 'express'
import dotenv from 'dotenv'
import connectDb from './connection/connect'
import userRouter from './routes/user'
import cookieParser from 'cookie-parser'
import blogRouter from './routes/blog'
import cors from 'cors'
dotenv.config()
connectDb()

const app= express()
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  })); 
  
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public')) //It means our image will be inside public(root) folder i.e- uploads/img_name -> http://localhost:3000/uploads/img_name

app.use('/user',userRouter)
app.use('/blog',blogRouter)

app.listen(process.env.PORT , ()=> console.log(`Server listening on port ${process.env.PORT}`))





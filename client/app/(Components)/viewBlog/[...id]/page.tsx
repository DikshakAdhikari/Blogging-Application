"use client"
import React, { FC, useEffect, useState } from 'react'
import Navbar from '../../Navbar'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ProfileLogo } from '@/app/Logo'
interface pageProps{
  params: {id:string}
}

const page:FC<pageProps> = ({params}) => {
  const [blog, setBlog] = useState()
  const [comment, setComment]= useState('')
  const [getUserComments, setUserComments]=useState([])
  const [toggle, setToggle]= useState(false)
  const [commentCount, setCommentCount]= useState(0)

  
  const handleClick= async()=> {
    try{
      const res= await fetch(`http://localhost:3002/comment/${params.id[0]}/${params.id[1]}`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({"comments":comment})
      });
      if(!res.ok){
        throw new Error('Network error!');
      }
      const data= await res.json();
    }catch(err){
      console.log(err);
      
    }
  }
  useEffect(()=>{
    const fun =async()=> {
      try{
        const res= await fetch(`http://localhost:3002/blog/user/${params.id[0]}`,{
          headers:{
            'Content-Type': 'application/json'
          }
        })
        
        if(!res.ok){
          throw new Error('Network Error!')
        }
        const data= await res.json()
        setBlog(data)
        if(data){
          const res1= await fetch(`http://localhost:3002/comment/${params.id[0]}`,{
          method:"GET",
          credentials:'include',
          headers:{
            Accept: 'application/json',
            'Content-Type':'application/json'
          },
        })
        if(!res1.ok){
          throw new Error('Network connection error!')
        }
        const data1= await res1.json()
        setUserComments(data1)
        setCommentCount(data1.length)
        setToggle(!toggle)
         
        }
      }catch(err){
        console.log(err);
        
      }
    }
    fun()
  },[toggle])

  if(!blog){
    return 
  }


  return (
    <div>
      <Navbar />
      <div className=' p-5'>
        <div className='text-[2.4rem] text-red-900 mb-6 font-bold pl-5'>{blog.title}</div>
        <Image  className=' object-fill mb-5'
            src={`http://localhost:3002/${blog.imageUrl}`}
            width={400}
            height={300}
            alt="Picture of the author"
          />
         
      <pre className="text-gray-700  whitespace-pre-wrap">
        {blog.description}
      </pre>
      <div className=' flex flex-col gap-4 p-4'>
        <div className=' text-[2.4rem] font-bold text-blue-900'>Comments({commentCount})</div>
        <input className=' text-gray-700 p-3 border-[1px] rounded-lg border-gray-500' type="text" onChange={(e)=> setComment(e.target.value)}  />
        <button onClick={()=>handleClick()} className=' p-3  w-[8vw] hover:bg-orange-500 bg-green-600 text-white rounded-lg'>Post Comment</button>
      </div>
      <div className=' flex flex-col-reverse'>
        {getUserComments.map((val)=>(
          <div className='flex gap-3 items-center p-2'>
            <ProfileLogo />
            <div className=' text-[1.2rem] text-gray-700'>{val.comments}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
   
  )
}

export default page
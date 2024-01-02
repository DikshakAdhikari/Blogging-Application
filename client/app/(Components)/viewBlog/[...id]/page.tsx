"use client"
import React, { FC, useEffect, useState } from 'react'
import Navbar from '../../Navbar'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
interface pageProps{
  params: {id:string}
}

const page:FC<pageProps> = ({params}) => {
  const [blog, setBlog] = useState([])
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
      }catch(err){
        console.log(err);
        
      }
    }
    fun()
  })

  return (
    <div>
      <Navbar />
      <div>
        {params.id[0]}
      </div>
    </div>
  )
}

export default page
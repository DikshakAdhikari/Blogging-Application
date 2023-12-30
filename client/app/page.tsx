"use client"
import { useEffect, useState } from "react"
import Image from 'next/image'

export default function Home() {
  const [image, setImage]= useState<any>([])
  useEffect(()=> {
    const fun = async()=> {
      try{
        const res= await fetch('http://localhost:3001/blog/all',{
        method:"GET",
        credentials:"include", //This is very important in the case when we want to send cookies with the request
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(!res.ok){
        throw new Error('Network Error!')
      }
      // console.log(Cookies.get('token'));
      const data= await res.json()
      console.log(data[0].createdBy.fullName);
      
      setImage(data)
      
      }catch(err){
        console.log(err); 
      }   
    }
    fun()
  },[])
  return (
    
    <div className=" grid grid-cols-3 p-3">

       {image?.map((val:any)=> (
      <div>
       
       <Image
      src={`http://localhost:3001/${val.imageUrl}`}
      width={500}
      height={100}
      alt="Picture of the author"
    />
  
          {/* <img src={`http://localhost:3001/${val.imageUrl}`} alt="dsffdgfdgdfsdfsdf" />  format -> http://localhost:3001/uploads/1703846233313.2023-11-20-165834.jpg */}
          <div>{val.title}</div>
          <div>{val.description}</div>
          <div>{val.createdBy.fullName}</div>
        </div>
      ))}   
  </div>
   
      )
}

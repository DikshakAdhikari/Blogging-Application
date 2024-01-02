"use client"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Navbar from "./(Components)/Navbar"
import { useRouter } from "next/navigation"

export default function Home() {
  const [image, setImage]= useState<any>([])
  const router= useRouter()
  useEffect(()=> {
    const fun = async()=> {
      try{
        const res= await fetch('http://localhost:3002/blog/all',{
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
      //console.log(data[0].createdBy.fullName);
      setImage(data)
      
      }catch(err){
        console.log(err); 
      }   
    }
    fun()
  },[])
  return (
    <div>
    <Navbar />
    <div className=" flex justify-center h-[100%]">
  <div className=" grid grid-cols-3  p-5 gap-10">

     {image?.map((val:any)=> (
    <div className="  rounded-lg hover:scale-105 transition duration-150 border-[1px] w-[23vw] border-gray-300">   
     <Image className=" rounded-lg rounded-b-none object-fill w-full h-52"
    src={`http://localhost:3002/${val.imageUrl}`}
    width={500}
    height={100}
    alt="Picture of the author"
  />
    <div className="  p-5 flex flex-col gap-4">
        {/* <img src={`http://localhost:3002/${val.imageUrl}`} alt="dsffdgfdgdfsdfsdf" />  format -> http://localhost:3001/uploads/1703846233313.2023-11-20-165834.jpg */}
        <div className=" text-gray-700 font-semibold text-[1.4rem]">{val.title}</div>
        <button onClick={()=> router.push(`/viewBlog/${val._id}`)} className=" w-[5vw] hover:bg-red-600 bg-green-700 text-white p-3 px-5 rounded-md">View</button>
        </div>
      </div>
    ))}   
</div>
</div>
</div>
   
      )
}

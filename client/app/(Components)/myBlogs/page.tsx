"use client"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Navbar from "../Navbar"
import  Swal from 'sweetalert2'
import { DeleteLogo, EditLogo } from "@/app/Logo";
import { useRouter } from "next/navigation"
import { base_url } from "../secret"

export default function Page() {
  const [image, setImage]= useState<any>([])
  const [deleteState, setDeleteState]=useState(false)
  const router= useRouter();
  
  useEffect(()=> {
    const fun = async()=> {
      try{
        const res= await fetch(`${base_url}/blog/userBlog`,{
        method:"GET",
        credentials:"include", 
        //@ts-ignore
        headers:{
          'Content-Type': 'application/json',
          'authorization': localStorage.getItem('token')
        }
      })
      if(!res.ok){
        throw new Error('Network Error!')
      }

      const data= await res.json()
      //console.log(data);
      //console.log(data[0].createdBy.fullName);
      setImage(data)
      setDeleteState(false)
      
      }catch(err){
        console.log(err); 
      }   
    }
    fun()
  },[deleteState]);


  const handleDelete= async(blogId:string)=> {
    try{

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async(result) => {
        if (result.isConfirmed) {
          const res= await fetch(`${base_url}/blog/remove/${blogId}`,{
            method:"DELETE",
            credentials:'include',
            //@ts-ignore
            headers:{
              'Content-Type':'application/json',
              'authorization': localStorage.getItem('token')
            }
          })
          if(!res.ok){
            throw new Error('Network error while deleting');
          }
          const data= await res.json()
          if(data){
            setDeleteState(true)
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });

   
      
    }catch(err){
      console.log(err);
      
    }
  }
  return (
    <div className="  h-[100vh]">
      <Navbar />
      <div className=" flex justify-center font-bold mt-5 mb-5 text-[2rem]  text-blue-950 ">
        My Created Blogs
      </div>
      <div className=" flex justify-center">
    
    <div className=" grid grid-cols-3  p-5 gap-10">

       {image?.map((val:any)=> (
      <div className="  hover:scale-105 transition duration-150 border-[1px] w-[23vw] border-gray-300">   
       <Image className=" object-fill w-full h-52"
      src={val.imageUrl}
      width={500}
      height={100}
      alt="Picture of the author"
    />
      <div className=" bg-white   p-5 flex flex-col gap-4">
          {/* <img src={`http://localhost:3001/${val.imageUrl}`} alt="dsffdgfdgdfsdfsdf" />  format -> http://localhost:3001/uploads/1703846233313.2023-11-20-165834.jpg */}
          <div className=" text-gray-700 font-semibold text-[1.4rem]">{val.title}</div>
          <div className=" flex justify-between items-center p-2">
            <div className=" cursor-pointer" onClick={()=> router.push(`/update-blog/${val._id}`)} ><EditLogo /></div>   
          <div onClick={()=>handleDelete(val._id)} className=" cursor-pointer"><DeleteLogo /></div>
          </div>
          </div>
        </div>
      ))}   
  </div>
  </div>
  </div>
   
      )
}

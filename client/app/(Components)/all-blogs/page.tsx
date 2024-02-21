"use client"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Navbar from '../Navbar'
import { useRouter } from "next/navigation"
import Pagination from '../Pagination'
import '../styles.css'
import { base_url } from "../secret"

const Page = () => {
    const [cardData, setcardData]= useState<any>([])
    const [page , setPage]= useState(1)
    const [search, setSearch]= useState("")
    const router= useRouter()
  
    
    useEffect(()=> {
      const fun = async()=> {
   
        try{
          const res= await fetch(`${base_url}/blog/blogs?page=${page}&limit=5&sort=createdAt&search=${search}`,{
          method:"GET",
          credentials:"include", //This is very important in the case when we want to send cookies with the request
          headers:{
            'Content-Type': 'application/json'
          }
        })
        if(!res.ok){
          throw new Error('Network Error!')
        }
       
        const data= await res.json()
       console.log(data);
       
     
        setcardData(data)
        
        }catch(err){
          console.log(err); 
        }   
      }
      fun()
    },[search,page])
  
    useEffect(()=>{
      if(search != ""){
        setPage(1)
      }
    },[search])
  
    
    return (
      <div className="  h-[100vh] flex flex-col">
      <Navbar />

      <div className=" flex flex-col items-center  h-[100%] ">
         <input onChange={(e)=> setSearch(e.target.value)} className=" shadow-md m-4 mt-6 p-3 outline-none border-2 border-gray-200 text-gray-700 w-[30vw] rounded-lg" placeholder="Search Blog Title" type="text" />
         <div>
    
      {(search!=""&& cardData.length === 0) ? "Page not found" : 
      <div className=" grid grid-cols-1 md:grid-cols-3  p-5 gap-10">
       {cardData?.content?.map((val:any)=> (
      <div className="  rounded-lg hover:scale-105 transition duration-150 border-[1px] w-[23vw] border-gray-300">   
       <Image className=" rounded-lg rounded-b-none object-fill w-full h-52"
      src={val.imageUrl}
      width={400}
      height={100}
      alt="Picture of the author"
    />
      <div className=" bg-white  p-5 flex flex-col gap-4">
          {/* <img src={`${base_url}/${val.imageUrl}`} alt="dsffdgfdgdfsdfsdf" />  format -> http://localhost:3001/uploads/1703846233313.2023-11-20-165834.jpg */}
          <div className=" text-gray-700 font-semibold text-[1.4rem]">{val.title}</div>
          <button onClick={()=> router.push(`/viewBlog/${val._id}`)} className=" w-[5vw] hover:bg-red-600 bg-green-700 text-white p-3 px-5 rounded-md">View</button>
          <div className=" flex items-center justify-between gap-3">
            <div className=" flex gap-2 items-center">
        
          <img
          //@ts-ignore
          class="img"
            src={val.createdBy.imageUrl}
           
            alt="Picture of the author"
          />
        
          <div className=" italic flex items-center text-gray-500 font-bold">By- {val?.createdBy?.fullName}</div>
          </div>
          <div className=" italic text-gray-500 font-bold">{val.createdAt.split('T')[0]}</div>
          </div>
          </div>
        </div>
      ))}  
      </div> 
       }
       </div>
  </div>
  
  <div className=" flex p-3 mt-10 justify-center">
  <Pagination totalDocuments={cardData.docsCount} limit={cardData.limit} page={page} setPage={setPage} />
  </div>
  
  </div>
    )
}

export default Page

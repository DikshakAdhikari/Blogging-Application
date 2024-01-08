"use client"
import { useEffect, useState } from "react"
import Image from 'next/image'
import Navbar from "./(Components)/Navbar"
import { useRouter } from "next/navigation"
import Pagination from './(Components)/Pagination'

export default function Home() {
  const [cardData, setcardData]= useState<any>([])
  const [limit , setLimit]= useState('')
  const [page , setPage]= useState(1)
  const [search, setSearch]= useState("")
  const router= useRouter()

  
  useEffect(()=> {
    const fun = async()=> {
 
      try{
        console.log(page);
        console.log(search);
        
        const res= await fetch(`http://localhost:3002/blog/blogs?page=${page}&limit=5&sort=createdAt&search=${search}`,{
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


  return (
    <div className=" flex flex-col">
    <Navbar />
    <div className=" flex flex-col items-center  h-[100%] ">
       <input onChange={(e)=> setSearch(e.target.value)} className=" shadow-md m-4 mt-6 p-3 outline-none border-2 border-gray-200 text-gray-700 w-[30vw] rounded-lg" placeholder="Search Blog Title" type="text" />
  
    {(search!=""&& cardData.length === 0) ? "Page not found" : 
    <div className=" grid grid-cols-1 md:grid-cols-3  p-5 gap-10">
     {cardData?.content?.map((val:any)=> (
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
        <button onClick={()=> router.push(`/viewBlog/${val._id}/${val.createdBy._id}`)} className=" w-[5vw] hover:bg-red-600 bg-green-700 text-white p-3 px-5 rounded-md">View</button>
        <div className=" flex justify-between gap-3">
        <div className=" italic text-gray-500 font-bold">By- {val.createdBy.fullName}</div>
        <div className=" italic text-gray-500 font-bold">{val.createdAt.split('T')[0]}</div>
        </div>
        </div>
      </div>
    ))}  
    </div> 
     }
</div>

<div className=" flex p-3 pb-8 justify-center">
<Pagination totalDocuments={cardData.docsCount} limit={cardData.limit} page={page} setPage={setPage} />
</div>

</div>
  )
}

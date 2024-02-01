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
      <div className=" bg-gradient-to-br from-yellow-500 to-blue-500 h-[100vh] flex flex-col">
      <Navbar />
      {/* <div className="flex min-h-screen items-center justify-center bg-neutral-800">
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    { cardData?.content?.map((val,index)=> (
      <div>
    
    <div className="group relative cursor-pointer items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30">
      <div className="h-96 w-72">
    
        <Image className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125 rounded-lg rounded-b-none "
      src={`${base_url}/${val.imageUrl}`}
      width={50}
      height={100}
      alt="Picture of the author"
    />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
      <div className="absolute inset-0 flex translate-y-[60%] flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:translate-y-0">
        <h1 className="font-dmserif text-3xl font-bold text-white">{val.title}</h1>
        <p className="mb-3 text-lg italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolore adipisci placeat.</p>
        <button onClick={()=> router.push(`/viewBlog/${val._id}`)} className="rounded-full bg-neutral-900 py-2 px-3.5 font-com text-sm capitalize text-white shadow shadow-black/60">See More</button>
      </div>
    </div>
    </div>
    ))}
  </div>

</div> */}

      <div className=" flex flex-col items-center  h-[100%] ">
         <input onChange={(e)=> setSearch(e.target.value)} className=" shadow-md m-4 mt-6 p-3 outline-none border-2 border-gray-200 text-gray-700 w-[30vw] rounded-lg" placeholder="Search Blog Title" type="text" />
    
      {(search!=""&& cardData.length === 0) ? "Page not found" : 
      <div className=" grid grid-cols-1 md:grid-cols-3  p-5 gap-10">
       {cardData?.content?.map((val:any)=> (
      <div className="  rounded-lg hover:scale-105 transition duration-150 border-[1px] w-[23vw] border-gray-300">   
       <Image className=" rounded-lg rounded-b-none object-fill w-full h-52"
      src={`${base_url}/${val.imageUrl}`}
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
 
          <Image
          class="img"
            src={`${base_url}/${val?.createdBy?.imageUrl}`}
            width={80}
            height={80}
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
  
  <div className=" flex p-3 pb-8 justify-center">
  <Pagination totalDocuments={cardData.docsCount} limit={cardData.limit} page={page} setPage={setPage} />
  </div>
  
  </div>
    )
}

export default Page

"use client"
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import Navbar from '../../Navbar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import  Swal from 'sweetalert2'
import { DeleteLogo, ProfileLogo } from "@/app/Logo"
import { base_url } from "../../secret"

interface pageProps{
    params: {id:string}
  }
  
  const page:FC<pageProps> = ({params}) => {
    const [blog, setBlog] = useState()
    const [comments, setComment]= useState([])
    const [toggle, setToggle]= useState(false)
    const [title, setTitle]= useState('')
    const [description, setDescription]= useState('')
    const [image, setImage]= useState('')
    const [error, setError]= useState('')
    const router= useRouter()

  const [file, setFile] = useState<File | null>(null);
    
    const handleDelete= async(commentId)=> {
      try{
        setToggle(true)
        const res= await fetch(`${base_url}/comment/${commentId}`,{
          method:"DELETE",
          credentials:'include',
          //@ts-ignore
          headers:{
            'Content-Type':'application/json',
            'authorization': localStorage.getItem('token')
          },
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
          const res= await fetch(`${base_url}/blog/user/${params.id}`,{
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
          setTitle(data.title)
          setDescription(data.description)
          setImage(data.imageUrl)
          setBlog(data)
         
        
          if(data){
            const res1= await fetch(`${base_url}/comment/${params.id}`,{
            method:"GET",
            credentials:'include',
            //@ts-ignoresss
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json',
              'authorization': localStorage.getItem('token')
            },
          })
          if(!res1.ok){
            throw new Error('Network connection error!')
          }
          const data1= await res1.json()
          setComment(data1)
          setToggle(false)
          }
        }catch(err){
          console.log(err);
          //error handled
        }
      }
      fun()
    },[toggle])
    
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files !== null && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        const allowedExtensions = ["png", "jpeg", "jpg", "svg","webp"];
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
        if (fileExtension && allowedExtensions.includes(fileExtension)) {
          setFile(selectedFile);
          setError('')
        } else {      
          console.error("Invalid file type. Please select a .png, .jpg, or .svg file.");
          setError("Invalid file type. Please select a .png, .jpg, .svg or webp file.")
          // Optionally, you can reset the file input to clear the selection
          e.target.value = '';
        }
      }
    };
  
    const handleSubmit = async (e:FormEvent)=> {
            
      e.preventDefault()
      const formData= new FormData()
      if(file){
        //console.log(title,description,file);
        formData.append('file', file)
      }
      formData.append('title', title)
      formData.append('description', description)
      try{
        //@ts-ignore
        const res= await fetch(`${base_url}/blog/update/${blog._id}`, {
          method:"PUT",
          credentials: "include",
          //@ts-ignore
          headers:{
            "Content-Type":"application/json",
            'authorization': localStorage.getItem('token')
          },
          body:JSON.stringify({
            title, description
          })
        })
  
        if(!res.ok){
          throw new Error('Network problem while creating blog!');
        }
          const data= await res.json()        
         //console.log(data);     
          Swal.fire("Blog updated successfully!");
          router.push('/myBlogs')
 
      }catch(err){
        console.log(err);
        
      }  
    }
  
    if(!blog){
      return 
    }

    return (
      <div className=" h-[100vh]">
      <Navbar />
      <div className=" flex justify-center px-9  m-5">
      <div className=" w-[100%] flex ">
      <img className=" object-fill rounded-xl w-[40vw] h-[65vh]"
      src={image}
      alt="Picture of the author" 
    />
    </div>
      <form
      onSubmit={handleSubmit}
      className=" w-[60vw] mx-auto  p-8  bg-white rounded-lg shadow-lg"
    >
      <div className="mb-4 bg-white">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Choose File (PNG, JPEG, SVG, WEBP.)
        </label>
        <input
         required={false}
          type="file"
          id="file"
          accept=".png, .jpg, .jpeg, .svg"
          onChange={handleFileChange}
          className="mt-1 p-3 bg-white border w-full rounded-md "
        />
        {error!="" &&  <div className=" text-red-600 font-medium">{error}</div> }
      </div>
      <div className="mb-4 bg-white">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
        required
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Blog Content
        </label>
        <textarea
        required
          id="content"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter blog content"
          rows={10}
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        Submit
      </button>
    </form>
    </div>
    <div className=" ml-8 p-4">
      <div className=" text-[2.5rem] font-bold text-black">Comments</div>
      <div className=' flex flex-col-reverse'>
        {comments.map((val,index)=>(
            <div key={index} className=' flex gap-3 items-center'>
            <ProfileLogo />
          <div className='flex flex-col  justify-center p-2'>
            <div className=" flex items-center gap-3">
            <div className=' font-medium text-[1.4rem] text-blue-900'>{val?.userId?.fullName}</div>
              <div className=" cursor-pointer" onClick={()=> handleDelete(val._id)} ><DeleteLogo /></div>
            </div>
            <div className=' text-[1.2rem] text-gray-950 '>{val.comments}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
 
    </div>
     
    )
  }

  export default page
"use client"
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react"
import Navbar from '../../Navbar'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ProfileLogo } from '@/app/Logo'
import  Swal from 'sweetalert2'

interface pageProps{
    params: {id:string}
  }
  
  const page:FC<pageProps> = ({params}) => {
    const [blog, setBlog] = useState()
    const [comments, setComment]= useState('')
    const [toggle, setToggle]= useState(false)
    const [title, setTitle]= useState('')
    const [description, setDescription]= useState('')
    const [image, setImage]= useState('')
    const [error, setError]= useState('')

  const [file, setFile] = useState<File | null>(null);
    
    const handleClick= async()=> {
      try{
        
        const res= await fetch(`http://localhost:3002/comment/${params.id[0]}`,{
          method:"POST",
          credentials:'include',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({comments})
        });
        if(!res.ok){
          throw new Error('Network error!');
        }
        const data= await res.json();
        setToggle(true)
      }catch(err){
        console.log(err);
        
      }
    }
    useEffect(()=>{
      const fun =async()=> {
        try{
          const res= await fetch(`http://localhost:3002/blog/user/${params.id}`,{
            headers:{
              'Content-Type': 'application/json'
            }
          })
          
          if(!res.ok){
            throw new Error('Network Error!')
          }
          const data= await res.json()
          console.log(data);
          setTitle(data.title)
          setDescription(data.description)
          setImage(data.imageUrl)
          setBlog(data)
        
          // if(data){
          //   const res1= await fetch(`http://localhost:3002/comment/${params.id}`,{
          //   method:"GET",
          //   credentials:'include',
          //   headers:{
          //     Accept: 'application/json',
          //     'Content-Type':'application/json'
          //   },
          // })
          // if(!res1.ok){
          //   throw new Error('Network connection error!')
          // }
          // const data1= await res1.json()
          // console.log(data1);
          
           
          // }
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
        
        const res= await fetch(`http://localhost:3002/blog/update/${blog._id}`, {
          method:"PUT",
          credentials: "include",
          body:formData
        })
  
        if(!res.ok){
          throw new Error('Network problem while creating blog!');
        }
        const data= await res.json()
        
         //console.log(data);     
          Swal.fire("Blog updated successfully!");
        
      }catch(err){
        console.log(err);
        
      }  
    }
  
    if(!blog){
      return 
    }

    return (
      <div>
      <Navbar />
      <Image className=" object-fill w-full h-52"
      src={`http://localhost:3002/${image}`}
      width={500}
      height={100}
      alt="Picture of the author"
    />
      <form
      onSubmit={handleSubmit}
      className=" max-w-lg mx-auto mt-8 p-8  rounded-lg shadow-lg"
    >
      <div className="mb-4">
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
      <div className="mb-4">
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
     
    )
  }

  export default page
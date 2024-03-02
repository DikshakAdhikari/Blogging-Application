"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import Navbar from "../Navbar"
import  Swal from 'sweetalert2'
import { base_url } from "../secret";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gallery from '../../(assets)/gallery.png'

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage]= useState<any>([])
  const [error, setError]= useState('')
  const router= useRouter()
  const inputRef= useRef(null)
  const [message, setMessage]= useState('')

  const [disable, setDisable]= useState(false)

 
  useEffect(()=> {
  
    const fun = async()=> {
      try{
        const res= await fetch(`${base_url}/blog/all`,{
        method:"GET",
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
       setImage(data)

      
      }catch(err){
        console.log(err); 
      }   
    }
    fun()
  },[])


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

  const handleImageClick = ()=> {
    //@ts-ignore
    inputRef.current.click()
  }

  const handleSubmit = async (e:FormEvent)=> {
    e.preventDefault()
  
    try{
      const res= await fetch(`${base_url}/blog/`, {
        method:"POST",
        //@ts-ignore
        headers:{
          "Content-Type": "application/json",
          'authorization': localStorage.getItem('token')
        },
        body:JSON.stringify({
          title, description: content,  filename: file?.name, contentType:file?.type
        })
      })

      if(!res.ok){
        throw new Error('Network problem while creating blog!');
      }
      const data= await res.json()
      
        Swal.fire("Blog saved successfully!");
        router.push('/all-blogs')
      
    }catch(err){
      console.log(err);
      
    }  
  }

  const sendImage = async ()=> {
    // console.log(file?.name);
    // console.log(file?.type);
    try{
      const res= await fetch(`${base_url}/blog/picture`, {
        method:"POST",
        //@ts-ignore
        headers: {
          'Content-Type':"application/json",
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          filename: file?.name,
          contentType:file?.type
        })
      });
      if(!res.ok){
        throw new Error('Network problem!')
      }
      const data= await res.json()
      
      
      if(data){
        const s3PutUrl= data;

        const res2= await fetch(s3PutUrl, {
          method:"PUT",
          //@ts-ignore
          headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": file?.type
          },
          body:file
        });
        
        if(!res2.ok){
          throw new Error("Network Problem!");
        }
        
        setDisable(true)
        setMessage("Profile Picture uploaded successfully!")
        
      }else{
        setMessage("Error while uploading")
      }
      
    }catch(err){
      setDisable(false)
      setMessage("Error while uploading")
      console.log(err);
      
    }
    
    
  }
  
  return (
    <div className="flex flex-col  h-[100vh] ">
      <Navbar />
    <form
      onSubmit={handleSubmit}
      className=" max-w-2xl mx-auto mt-8 bg-white p-8 border rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Choose File (PNG, JPEG, SVG, WEBP.)
        </label>
        <div onClick={handleImageClick} className=' flex flex-col gap-5 items-center'>
          {file ? 
          //@ts-ignore
          <Image src={URL.createObjectURL(file)} class="signupImg" height={200} width={200} alt="gf" /> 
          //@ts-ignore
          : <Image src={gallery} class="signupImg" height={200} width={200} alt="gf" /> 
         }
      
        
        <input
        
        ref={inputRef}
          type="file"
          id="file"
          accept=".png, .jpg, .jpeg, .svg"
          onChange={handleFileChange}
          className="mt-1 p-3 hidden bg-white border w-full rounded-md "
        />
        
        </div>
      </div>
      <div className="mb-4">
      <div className=' flex justify-center flex-col items-center gap-2 m-3'>
        <button type="button" disabled={disable} onClick={sendImage} className={` ${disable ? ' bg-gray-500' : 'bg-cyan-500'} px-5 py-2 bg-cyan-500  rounded-sm text-white`}>Upload</button>
        
        {error!="" &&  <div className=" text-red-600 font-medium">{error}</div> }
        <div className=' text-green-700 font-medium'>{message}</div>
        </div>
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 p-3 border outline-gray-600 rounded-md w-full"
          placeholder="Enter blog content"
          cols={70}
          rows={5}
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
  );
};

export default Page
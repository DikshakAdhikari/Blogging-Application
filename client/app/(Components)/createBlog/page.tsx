"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Navbar from "../Navbar"
import  Swal from 'sweetalert2'

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage]= useState<any>([])
  const [error, setError]= useState('')

 
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
      //console.log(Cookies.get('token'));
      const data= await res.json()
      //console.log(data);
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

  const handleSubmit = async (e:FormEvent)=> {
    e.preventDefault()
    const formData= new FormData()
    if(file){
      formData.append('file', file)
    }
    formData.append('title', title)
    formData.append('description', content)

    console.log(formData);
    
    try{
      const res= await fetch('http://localhost:3002/blog/', {
        method:"POST",
        credentials: "include",
        body:formData
      })

      if(!res.ok){
        throw new Error('Network problem while creating blog!');
      }
      const data= await res.json()
      console.log(data);
      
        Swal.fire("Blog saved successfully!");
      
    }catch(err){
      console.log(err);
      
    }  
  }
  return (
    <div>
      <Navbar />
    <form
      onSubmit={handleSubmit}
      className=" max-w-lg mx-auto mt-8 p-8 border rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Choose File (PNG, JPEG, SVG, WEBP.)
        </label>
        <input
        required
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
  );
};

export default Page
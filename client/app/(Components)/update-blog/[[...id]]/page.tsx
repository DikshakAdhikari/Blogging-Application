"use client"
import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react"
import Navbar from '../../Navbar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import  Swal from 'sweetalert2'
import { DeleteLogo, ProfileLogo } from "@/app/Logo"
import { base_url } from "../../secret"
import gallery from '../../../(assets)/gallery.png'

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
    const [content, setContent] = useState("");
    const inputRef= useRef(null)
  const [message, setMessage]= useState('')

  const [disable, setDisable]= useState(false)

  const [file, setFile] = useState<File | null>(null);
     //@ts-ignore
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
          setContent(data.description)
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
    
    const handleImageClick = ()=> {
      //@ts-ignore
      inputRef.current.click()
    }
    
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
    
      try{
        //@ts-ignore
        const res= await fetch(`${base_url}/blog/update/${blog._id}`, {
          method:"PUT",
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
        
          Swal.fire("Blog updated successfully!");
          router.push('/myBlogs')
        
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
          setImage(`https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-${file?.name}`)
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
    
    //console.log(image);
    
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
          : <Image src={image} class="signupImg" height={200} width={200} alt="gf" /> 
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
        <button type="button" disabled={disable} onClick={sendImage} className={` ${disable ? ' bg-gray-500' : 'bg-cyan-500'} px-5 py-2 bg-cyan-500  rounded-sm text-white`}>Update</button>
        
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
    <div className=" ml-8 p-4">
      <div className=" text-[2.5rem] font-bold text-black">Comments</div>
      <div className=' flex flex-col-reverse'>
      
        {comments.map((val,index)=>(
            <div key={index} className=' flex gap-3 items-center'>
            <ProfileLogo />
          <div className='flex flex-col  justify-center p-2'>
            <div className=" flex items-center gap-3">
          {/* @ts-ignore */}
            <div className=' font-medium text-[1.4rem] text-blue-900'>{val?.userId?.fullName}</div> 
            {/* @ts-ignore */}
              <div className=" cursor-pointer" onClick={()=> handleDelete(val._id)} ><DeleteLogo /></div>
            </div>
            {/* @ts-ignore */}
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
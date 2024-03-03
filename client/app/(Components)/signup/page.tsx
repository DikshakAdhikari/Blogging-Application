"use client"
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import gallery from '../../(assets)/gallery.png'
import  Swal from 'sweetalert2'
import Image from 'next/image'
import Navbar from '../Navbar'
import '../styles.css'
import { base_url } from '../secret'
const Page = () => {
  const [username, setUsername]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [file, setFile] = useState<File | null>(null);
  const [error, setError]= useState('')
  const [disable, setDisable]= useState(false)

  const [message, setMessage]= useState('')

  const router= useRouter()

  const inputRef= useRef(null)

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

  const handleSignup= async(e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
     

      try{
        const res= await fetch(`${base_url}/user/`,{
          method:"POST",
          credentials:'include',
          headers:{
            'Content-Type': 'application/json'
          },
          
          body: JSON.stringify({
            fullName: username,
            email:email,
            password: password,
            filename: file?.name,
            contentType:file?.type
          })
        })
        if(!res.ok){
          throw new Error('Network connection error!')
        }
        const data= await res.json()
        
        Swal.fire("User registered successfully!");
        router.push('/login')
  
      }catch(err){
        console.log(err);
        
      }
    }
  

    const handleImageClick = ()=> {
      //@ts-ignore
      inputRef.current.click()
    }

    const sendImage = async ()=> {
      try{
        const res= await fetch(`${base_url}/user/picture`, {
          method:"POST",
          //@ts-ignore
          headers: {
            'Content-Type':"application/json",
            'authorization': localStorage.getItem('token'),
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

    //console.log(message);
    
return (
  <div className="flex flex-col  h-[100vh]">
  <Navbar />

  <div className="flex justify-center items-center h-[86vh] ">
  <div className="bg-white p-8 py-10 shadow-md rounded-md w-[26%]">
    <h2 className="text-2xl font-bold mb-6">Registration</h2>
    <form onSubmit={handleSignup}>
    <div className="mb-4">
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
        <div className=' flex justify-center flex-col items-center gap-2 m-3'>
        <button type='button' disabled={disable} onClick={sendImage} className={` ${disable ? ' bg-gray-500' : 'bg-cyan-500'} px-5 py-2 bg-cyan-500  rounded-sm text-white`}>Upload</button>
        
        {error!="" &&  <div className=" text-red-600 font-medium">{error}</div> }
        <div className=' text-green-700 font-medium'>{message}</div>
        </div>
        <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 focus:outline-none"
      >
        Register
      </button>
    </form>
  </div>
</div>
</div>
)
}

export default Page

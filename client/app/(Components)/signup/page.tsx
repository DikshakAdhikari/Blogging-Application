"use client"
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import  Swal from 'sweetalert2'
import Navbar from '../Navbar'
const Page = () => {
  const [username, setUsername]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [file, setFile] = useState<File | null>(null);
  const [error, setError]= useState('')
  const router= useRouter()

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
      const formData= new FormData()
      if(file){
        formData.append('file', file)
      }
      formData.append('fullName', username)
      formData.append('email', email)
      formData.append('password', password)

      try{
        const res= await fetch('http://localhost:3002/user/',{
          method:"POST",
          credentials:'include',
          body: formData
        })
        if(!res.ok){
          throw new Error('Network connection error!')
        }
        
        Swal.fire("User registered successfully!");
        router.push('/login')
  
      }catch(err){
        console.log(err);
        
      }
    }
  
return (
  <div>
  <Navbar />

  <div className="flex justify-center items-center h-[86vh] bg-gray-100">
  <div className="bg-white p-8 py-10 shadow-md rounded-md w-[26%]">
    <h2 className="text-2xl font-bold mb-6">Registration</h2>
    <form onSubmit={handleSignup}>
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

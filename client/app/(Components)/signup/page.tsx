"use client"
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent, } from 'react'
import Cookies from 'js-cookie'
import  Swal from 'sweetalert2'
import Navbar from '../Navbar'
const Page = () => {
  const [username, setUsername]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const router= useRouter()

  const handleSignup= async(e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      try{
        const res= await fetch('http://localhost:3002/user/',{
          method:"POST",
          credentials:'include',
          headers:{
            Accept: 'application/json',
            'Content-Type':'application/json'
          },
          //credentials: 'same-origin',
          body:JSON.stringify({fullName:username,email,password}),
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

"use client"
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent, } from 'react'
import Cookies from 'js-cookie'
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
        
        alert('User Registered Successfully')
        router.push('/login')
  
      }catch(err){
        console.log(err);
        
      }
    }
  
return (
  <div>
    <Navbar />
  <div className=' flex flex-col gap-6 justify-center  items-center h-[88vh]'>
      <div className=" text-[2rem] font-bold text-gray-800">Register</div>
    <form onSubmit={handleSignup} className=" border-[2px] border-gray-700 py-16 p-8 flex flex-col items-center gap-5" action="">
    <input required onChange={(e)=> setUsername(e.target.value)} type="text" className=" w-[30vw] border-[1px] border-gray-500 p-3"  placeholder="Username" />
       <input required onChange={(e)=> setEmail(e.target.value)} type="text" className=" w-[30vw] border-[1px] border-gray-500 p-3"  placeholder="Email" />
       <input required onChange={(e)=> setPassword(e.target.value)} type="text" className=" w-[30vw] border-[1px] border-gray-500 p-3"  placeholder="Password"/>
       <button className=" w-[10vw] bg-blue-500 p-3 rounded-lg" type="submit">Submit</button>
    </form>
    </div>
  </div>
)
}

export default Page

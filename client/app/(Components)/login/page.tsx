"use client"
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent, } from 'react'
import Cookies from 'js-cookie'

const Login = () => {
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const router= useRouter()

    const handleLogin= async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
          const res= await fetch('http://localhost:3001/user/signin',{
            method:"POST",
            credentials:'include',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            //credentials: 'same-origin',
            body:JSON.stringify({email,password}),
          })
          if(!res.ok){
            throw new Error('Network connection error!')
          }
          if(Cookies.get('token'))
          router.push('/createBlog')
    
        }catch(err){
          console.log(err);
          
        }
      }
    
  return (
    <div className=' flex flex-col gap-6 justify-center  items-center h-[88vh]'>
        <div className=" text-[2rem] font-bold text-gray-800">Login</div>
      <form onSubmit={handleLogin} className=" border-[2px] border-gray-700 py-16 p-8 flex flex-col items-center gap-5" action="">
         <input required onChange={(e)=> setEmail(e.target.value)} type="text" className=" w-[30vw] border-[1px] border-gray-500 p-3"  placeholder="Email" />
         <input required onChange={(e)=> setPassword(e.target.value)} type="text" className=" w-[30vw] border-[1px] border-gray-500 p-3"  placeholder="Password"/>
         <button className=" w-[10vw] bg-blue-500 p-3 rounded-lg" type="submit">Login</button>
      </form>

    </div>
  )
}

export default Login

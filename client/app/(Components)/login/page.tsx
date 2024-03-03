"use client"
import { useRouter } from 'next/navigation'
import React, { useState, FormEvent, } from 'react'
import Cookies from 'js-cookie'
import Navbar from '../Navbar'
import { useDispatch } from 'react-redux'
import { setUser } from '@/app/store/infoSlice'
import { base_url } from '../secret'

const Login = () => {
    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const router= useRouter()
    const dispatch= useDispatch()

    const handleLogin= async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try{
          const res= await fetch(`${base_url}/user/signin`,{
            method:"POST",
            credentials:'include',
            headers:{
              Accept: 'application/json',
              'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password}),
          })
          if(!res.ok){
            throw new Error('Network connection error!')
          }
          const data= await res.json()
    
          localStorage.setItem('token',data)
          
          dispatch(setUser(data._id))
          
          if(localStorage.getItem('token'))
          // dispatch(setUser((id:)))
          router.push('/createBlog')
    
        }catch(err){
          console.log(err);
          
        }
      }
    
  return (
    <div className="flex flex-col  h-[100vh]">
      <Navbar />
    
      <div className="flex justify-center items-center h-[86vh] ">
      <div className="bg-white p-8 py-10 shadow-md rounded-md w-[26%]">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
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
            Log In
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Login

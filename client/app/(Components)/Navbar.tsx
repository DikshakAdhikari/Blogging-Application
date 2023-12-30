"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const Navbar = () => {
  const [token, setToken]= useState<string|null>()
  const router= useRouter()
  const handleClick = ()=> {
    router.push('/login')
    
  }
  const handleLogout = ()=> {
    Cookies.remove('token')
    router.push('/')

  }

  useEffect(()=> {
    console.log(Cookies.get('token'));
    
    setToken(Cookies.get('token'))
  })

  return (
    <div className=' items-center px-10 justify-between flex gap-3 p-3 bg-blue-700'>
        <div onClick={()=> router.push('/')} className=' cursor-pointer text-[1.8rem] hover:text-yellow-500 font-semibold text-white'>Snif Blog</div>
        <div className=' items-center flex gap-5'>
          {!token ? (
            <div className=' flex gap-5'>
              <button onClick={()=> router.push('/signup')} className=' bg-green-600 text-white px-5  p-3 rounded-lg hover:bg-red-700'>Signup</button>
            <button onClick={handleClick} className=' bg-green-600 text-white px-5  p-3 rounded-lg hover:bg-red-700'>Signin</button>
            </div>
          ) : (
            <div className=' flex gap-5'>
              <button  className=' bg-green-600 text-white px-5  p-3 rounded-lg hover:bg-red-700'>Create Blog</button>
              <button onClick={handleLogout} className=' bg-green-600 text-white px-5  p-3 rounded-lg hover:bg-red-700'>Logout</button>
            </div>
          )
        }
            
        </div>
    </div>
  )
}

export default Navbar


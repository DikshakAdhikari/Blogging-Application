import React, { useEffect } from 'react'
import left from '../(assets)/left.png'
import right from '../(assets)/right.png'
import Image from 'next/image'

const Pagination = ({data, page,setPage}) => {
  // useEffect(()=> {
  //   if( data.length === 0){
  //     setPage((prev)=> {
  //       return 1
  //     })
  //   }
  // },[page])
  return (
    <div className=' flex items-center gap-4'>
      <Image onClick={()=> {
        setPage((prev)=> {
            const newPage = prev-1
            if(newPage<1){
              return 1
            }
            return newPage
        })
      }} className=' cursor-pointer' height={55} src={left} />
      <div className=' font-bold text-gray-600 text-[1.5rem]'>{page}</div>

      <Image onClick={()=> {
        setPage((prev)=> {
          if(data.length === 0){
            return prev-1
          }
            return prev+1
        })
      }} className=' cursor-pointer' height={55} src={right} />
      
    </div>
  )
}

export default Pagination

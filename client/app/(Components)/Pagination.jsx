import React, { useEffect } from 'react'
import left from '../(assets)/left.png'
import right from '../(assets)/right.png'
import Image from 'next/image'

const Pagination = ({totalDocuments, limit, page,setPage}) => {
  const totalPages=Math.ceil(totalDocuments/limit);

  useEffect(()=> {
    if(page === totalPages){
      setPage(page)
    }
  },[page])
  
  return (
    <div className=' flex items-center gap-4'>
      <Image onClick={(()=>{
        setPage((prev)=> {
          if(prev === 1){
            return prev
          }
          return prev-1
        })
        
      })} className=' cursor-pointer' height={55} src={left} />
      <div className=' font-bold text-white text-[1.6rem]'>{page}</div>

      <Image onClick={()=> {
        setPage((prev)=>{
          if(prev === totalPages){
            return prev
          }
          return prev+1
        })
      }} className=' cursor-pointer' height={55} src={right} />
      
    </div>
  )
}

export default Pagination

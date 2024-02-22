"use client"
import { useRouter } from "next/navigation";
import Navbar from "./(Components)/Navbar";

const data= [
  {
    title:'Write blog in any topic you want',
    desc:"Make your own custom blog with image and help others fulfill their queries"
  },
  {
    title:'User can add comments on the blogs',
    desc:"User can write their opinions about the blog in the comment section, or if they wanna add some insights regarding topic then can infrom the creator of blog and community about it"
  },
  {
    title:"Search support of blog",
    desc:"User can search their favourite creator blog in in fraction of seconds"
  },
  {
    title:"Creator can delete comments and blogs",
    desc:"Creator of the blog can delete comment that is not good of his community"
  }
]

export default function Home() {
  const router= useRouter()
  const sentence = 'A Blogging Application to sort every query'
  const words = sentence.split(' ');
  return (
    <div className="flex flex-col h-[100vh] bg-gradient-to-br ">
      <div className='sticky'>
        <Navbar />
      </div>

      <div className='flex-1 pt-10 p-4'>
        <div className=' flex flex-col  gap-5 items-center'>
            <div className=' font-semibold text-white  text-[2.5rem]'>
            <p>
      {words.map((word, index) => (
        <span key={index} style={word === 'Blogging' ? { color: '#AA336A' } : {}}>
          {word}{' '}
        </span>
      ))}
    </p>
         
            </div>  
            <div className=' text-white font-medium text-[1.3rem]'>A Blogging application for all dude and dudess who are willing to change the world by sharing what they got.</div>
            <div className='grid grid-cols-1 md:grid-cols-2 py-10 gap-3'>
              {data.map((value, index)=> (
                  <div className=' min-h-[30vh] p-10 bg-white flex justify-center items-center border-2 border-gray-400 rounded-xl flex-col max-w-lg' key={index}>
          
                     <div className=' flex flex-col gap-3'>
                      <div className=' text-gray-800 text-[2.2rem] flex justify-center py-4 font-bold'>{value.title}</div>
                      <div className=' text-gray-600 py-4 font-medium pb-8'>{value.desc}</div>
                      <div className=' flex justify-center'>
                      <button onClick={()=> router.push('/signup')}  className='  hover:bg-yellow-500 p-3 rounded-lg w-48 text-white font-bold bg-pink-600'>Get Started</button>
                      </div>
                      </div>
                  </div>
              ))}

            </div>
        </div>
      </div>
    </div>
  )
}

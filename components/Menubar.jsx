import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import {useSession} from 'next-auth/react'
import {HomeIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline'

const Menubar = () => {
  const {data: session} = useSession();
  const [currentSession, setCurrentSession] = useState(null);
  useEffect(() => {
        async function f(){
            if(session && session.user.accessToken){
                setCurrentSession(session.user.accessToken);
            }
        }
        f();
    },[session])

  return (
    currentSession && (<nav className="menu-bar px-6 py-4 rounded-xl bg-dark">
      <ul>
        <Link href='/' className='flex cursor-pointer gap-2 items-center my-4 text-white/75 hover:text-white font-semibold'>
          <HomeIcon className='h-5 w-5' />
          <span>Home</span>
        </Link>
        <Link href='/search' className='flex cursor-pointer gap-2 items-center my-2 text-white/75 hover:text-white font-semibold'>
          <MagnifyingGlassIcon className='h-5 w-5' />
          <span>Search</span>
        </Link>
      </ul>
    </nav>)
    
  )
}

export default Menubar
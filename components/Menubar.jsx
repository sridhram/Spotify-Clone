import React from 'react'
import {HomeIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline'

const Menubar = () => {
  return (
    <nav className="menu-bar px-6 py-4 rounded-xl bg-dark">
      <ul>
        <li className='flex cursor-pointer gap-2 items-center my-4 text-white/75 hover:text-white font-semibold'>
          <HomeIcon className='h-5 w-5' />
          <span>Home</span>
        </li>
        <li className='flex cursor-pointer gap-2 items-center my-2 text-white/75 hover:text-white font-semibold'>
          <MagnifyingGlassIcon className='h-5 w-5' />
          <span>Search</span>
        </li>
      </ul>
    </nav>
    
  )
}

export default Menubar
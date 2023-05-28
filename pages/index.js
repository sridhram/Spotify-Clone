import {useSession} from 'next-auth/react'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {  
  return (
    <>
      <main
        className={`h-screen grid grid-rows-[1fr_auto] grid-cols-[auto_1fr] p-8 gap-2 text-white ${inter.className}`}
      >
        <Sidebar />
        <section className='bg-dark rounded-xl p-4'>
          Main content
        </section>
        <Player />
      </main>
    </>
  )
}

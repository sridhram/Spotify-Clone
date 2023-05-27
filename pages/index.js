import {useSession} from 'next-auth/react'
import { Inter } from 'next/font/google'
import {useState, useEffect} from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data: session} = useSession();
  const [currentSession, setCurrentSession] = useState(null);
  const [playLists, setPlayLists] = useState(null);
  useEffect(() => {
    async function f(){
      if(session && session.user.accessToken){
        setCurrentSession(session.user.accessToken);
        const response = await fetch("https://api.spotify.com/v1/me/playlists",{
          headers:{
            Authorization:`Bearer ${session.user.accessToken}`
          }
        });
        const data = await response.json();
        setPlayLists(data.items);
      }
    }
    f();
  },[session])
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <section>{playLists ? playLists.map((playlist) => {
        return <div key={playlist.id}>{playlist.name}</div>
      }) : 'Loading...'}</section>
    </main>
  )
}

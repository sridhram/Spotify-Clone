import React, {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {PlusIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router';

const PlayList = ({id, imgUrl, name, type, owner}) => {
    const router = useRouter();
    const isSelectedPlaylist = router.query.playlistId === id;
    return(
        <Link href={`/playlist/${id}`} className={`flex gap-4 max-w-[300px] hover:bg-highlight p-2 rounded-lg ${isSelectedPlaylist && 'bg-selectedLink'}`}>
            <figure>
                <Image className='rounded-lg' src={imgUrl} alt="playlist img" width={60} height={60} />
            </figure>
            <div className='max-w-[70%] self-center'>
                <h3 className='overflow-hidden whitespace-nowrap text-ellipsis mb-1' title={name}>{name}</h3>
                <p className='text-sm text-white/75 capitalize text-ellipsis overflow-hidden whitespace-nowrap text-ellipsis' title={`${type} · ${owner}`}>{`${type} · ${owner}`}</p>
            </div>
        </Link>
    )
}

const Playlistbar = () => {

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
   currentSession && ( <section className='bg-dark rounded-xl grow overflow-auto'>
        <div className='px-4 py-2 flex items-center justify-between text-white/75 sticky top-0 bg-dark rounded-xl'>
            <h2 className="font-semibold p-2 capitalize flex gap-4 text-lg items-center"> <svg className='fill-white' role="img" height="20" width="20" aria-hidden="true" viewBox="0 0 20 20" data-encore-id="icon"><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path></svg> your library</h2>
            <button className='rounded-full w-8 h-8 hover:bg-highlight cursor-pointer flex items-center justify-center hover:text-white'><PlusIcon className='h-5 w-5 inline-block' /></button>
        </div>
        <nav className='p-4 pt-0'>
            <ul>
                {playLists ? playLists.map((playlist) => {
                    return <PlayList key={playlist.id} id={playlist.id} name={playlist.name} imgUrl={playlist.images[0].url} type={playlist.type} owner={playlist.owner.display_name}  />
                }) : 'Loading...'}
            </ul>
        </nav>
    </section>)
  )
}

export default Playlistbar
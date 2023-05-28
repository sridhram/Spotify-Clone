import React, {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image'
const PlayList = ({key, imgUrl, name, type, owner}) => {
    return(
        <li className='flex gap-4 my-2 max-w-[300px]' key={key}>
            <figure>
                <Image className='rounded-lg' src={imgUrl} alt="playlist img" width={60} height={60} />
            </figure>
            <div className='max-w-[75%] self-center'>
                <h3 className='overflow-hidden whitespace-nowrap text-ellipsis' title={name}>{name}</h3>
                <p className='text-sm text-white/75 capitalize text-ellipsis overflow-hidden whitespace-nowrap text-ellipsis' title={`${type} · ${owner}`}>{`${type} · ${owner}`}</p>
            </div>
        </li>
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
    <nav className='grow bg-dark rounded-xl p-4 overflow-auto'>
        <ul>
            {playLists ? playLists.map((playlist) => {
          return <PlayList key={playlist.id} name={playlist.name} imgUrl={playlist.images[0].url} type={playlist.type} owner={playlist.owner.display_name}  />
        }) : 'Loading...'}
        </ul>
    </nav>
  )
}

export default Playlistbar
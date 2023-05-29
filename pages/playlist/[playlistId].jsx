import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon} from '@heroicons/react/24/outline'

const playListDetails = () => {
    
    const router = useRouter();
    const playlistId = router.query.playlistId;
    const {data: session} = useSession();
    const [playlist,setPlaylist] = useState(null);

    useEffect(() => {
        async function f(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setPlaylist(data)
                console.log(data);
            }
        }
        f();
    },[session, playlistId])

    return(
        <section className=''>
            {playlist ? 
                <>
                    <section>
                        <div className='flex gap-4 '>
                            <Image alt='playlist image' className='w-48 h-48' src={playlist.images[0].url} width={190} height={190} />
                            <div className='flex flex-col gap-4 overflow-hidden whitespace-nowrap justify-end'>
                                <p className='text-sm capitalize'>{playlist.type}</p>
                                <h1 className="text-6xl font-bold overflow-hidden text-ellipsis" title={playlist.name} >{playlist.name}</h1>
                                <p className="text-white/75 text-sm overflow-hidden text-ellipsis" title={playlist.description} >{playlist.description}</p>
                                <Link className='hover:underline text-sm capitalize' href={`/user/${playlist.owner.id}`} user_name={playlist.owner.display_name}>{playlist.owner.display_name}</Link>
                            </div>
                        </div>
                    </section>
                    <section>
                        {playlist.tracks.items.map((song, index) => {
                            return(
                                <div key={song.track.id} className='flex gap-4 mb-2'>
                                    <span>{index+1}</span>
                                    {console.log(song)}
                                    {(song.track.album.images.length !== 0) ? <Image src={song.track.album.images[0].url} width={40} height={40} alt="song image" /> : <MusicalNoteIcon className='w-10 h-10' /> }
                                    <span>{song.track.name}</span>
                                    <span>{song.track.album.name}</span>
                                </div>
                            )
                        })}
                    </section>
                </>
                :
                'loading...'}
        </section>
    )
}

export default playListDetails;
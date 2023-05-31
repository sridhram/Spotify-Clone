import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon} from '@heroicons/react/24/outline'

const Queue = () => {

    const router = useRouter();
    const {data: session} = useSession();
    const [playbackQueue,setPlaybackQueue] = useState(null);

    useEffect(() => {

        async function getPlaybackQueue(){
            if(session && session.user.accessToken){
              console.log(session.user.accessToken);
                const response = await fetch('https://api.spotify.com/v1/me/player/queue',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                console.log(data);
                setPlaybackQueue(data);
            }
        }
        getPlaybackQueue();
    },[session, playbackQueue])

  return (
    <section className='mt-8 mb-4'>
        {playbackQueue ? playbackQueue.tracks.items.map((song, index) => {
            return(
                <div key={song.track.id} className=' grid grid-cols-[20px_minmax(63%,_4fr)_2fr_minmax(120px,_1fr)] gap-2 mb-2 items-center p-2 rounded-lg hover:bg-highlight'>
                    <span className='text-white/75'>{index+1}</span>
                    <section className='flex gap-2 items-center'>
                        {(song.track.album.images.length !== 0) ? <Image src={song.track.album.images[0].url} className='w-10 h-10' width={40} height={40} alt="song image" /> : <MusicalNoteIcon className='w-10 h-10' /> }
                        <div className='flex flex-col overflow-hidden whitespace-nowrap'>
                            <span>{song.track.name}</span>
                            <span className='overflow-hidden text-ellipsis text-white/75 text-sm'>{song.track.artists.map((artist, index, artists) => {
                                return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                            })}</span>
                        </div>
                    </section>
                    <Link href={`/album/${song.track.album.id}`} className='text-ellipsis overflow-hidden text-sm whitespace-nowrap text-white/75 hover:underline' title={song.track.album.name}>{song.track.album.name}</Link>
                    <span className='text-white/75 text-center text-sm'>{millisToMinutesAndSeconds(song.track.duration_ms)}</span>
                </div>
            )
        }) : 'Loading...'
      }
    </section>
  )
}

export default Queue
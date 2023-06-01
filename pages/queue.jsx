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
    function millisToMinutesAndSeconds(millis) {

        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

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
    },[session])

  return (
    <section className='mt-8 mb-4'>
    {playbackQueue ? (
        <>
            <div>
                <h3 className='text-xl font-white/75 font-semibold'>Now Playing</h3>
                <li key={playbackQueue.currently_playing.id} className=' grid grid-cols-[20px_minmax(63%,_4fr)_2fr_minmax(120px,_1fr)] gap-2 mb-2 items-center p-2 rounded-lg hover:bg-highlight'>
                    <span className='text-white/75'>1</span>
                    <section className='flex gap-2 items-center'>
                        {(playbackQueue.currently_playing.album.images.length !== 0) ? <Image src={playbackQueue.currently_playing.album.images[0].url} className='w-10 h-10' width={40} height={40} alt="song image" /> : <MusicalNoteIcon className='w-10 h-10' /> }
                        <div className='flex flex-col overflow-hidden whitespace-nowrap'>
                            <span>{playbackQueue.currently_playing.name}</span>
                            <span className='overflow-hidden text-ellipsis text-white/75 text-sm'>{playbackQueue.currently_playing.album.artists.map((artist, index, artists) => {
                                return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                            })}</span>
                        </div>
                    </section>
                    <Link href={`/album/${playbackQueue.currently_playing.album.id}`} className='text-ellipsis overflow-hidden text-sm whitespace-nowrap text-white/75 hover:underline' title={playbackQueue.currently_playing.album.name}>{playbackQueue.currently_playing.album.name}</Link>
                    <span className='text-white/75 text-center text-sm'>{millisToMinutesAndSeconds(playbackQueue.currently_playing.duration_ms)}</span>
                </li>
            </div>
            <ul>
                <h3 className='text-xl font-white/75 font-semibold'>Next From : {playbackQueue.queue[0].album.name}</h3>
                {playbackQueue.queue.map((song, index) => {
                    return(
                        <li key={song.id} className=' grid grid-cols-[20px_minmax(63%,_4fr)_2fr_minmax(120px,_1fr)] gap-2 mb-2 items-center p-2 rounded-lg hover:bg-highlight'>
                            <span className='text-white/75'>{index+2}</span>
                            <section className='flex gap-2 items-center'>
                                {(song.album.images.length !== 0) ? <Image src={song.album.images[0].url} className='w-10 h-10' width={40} height={40} alt="song image" /> : <MusicalNoteIcon className='w-10 h-10' /> }
                                <div className='flex flex-col overflow-hidden whitespace-nowrap'>
                                    <span>{song.name}</span>
                                    <span className='overflow-hidden text-ellipsis text-white/75 text-sm'>{song.album.artists.map((artist, index, artists) => {
                                        return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                                    })}</span>
                                </div>
                            </section>
                            <Link href={`/album/${song.album.id}`} className='text-ellipsis overflow-hidden text-sm whitespace-nowrap text-white/75 hover:underline' title={song.album.name}>{song.album.name}</Link>
                            <span className='text-white/75 text-center text-sm'>{millisToMinutesAndSeconds(song.duration_ms)}</span>
                        </li>
                    )})
                }
        </ul>
      </>
      )  : 'Loading...'}
    </section>
  )
}

export default Queue
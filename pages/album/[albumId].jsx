import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon, ClockIcon} from '@heroicons/react/24/outline'

const AlbumDetails = () => {
    const router = useRouter();
    const albumId = router.query.albumId;
    const {data: session} = useSession();
    const [albumDetails,setAlbumDetails] = useState(null);

    function millisToMinutesAndSeconds(millis) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    useEffect(() => {
        async function f(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setAlbumDetails(data);
            }
        }
        f();
    },[session, albumId])
  return (
    albumDetails ? (
        <aside>
        <section className='flex gap-4 items-end'>
            <Image src={albumDetails.images[0].url} alt='album image' width={190} height={190} className='w-48 h-48' />
            <div className='flex flex-col gap-4 overflow-hidden'>
                <p className='text-white/75 capitalize'>{albumDetails.type}</p>
                <h2 className='text-6xl leading-normal overflow-hidden text-ellipsis whitespace-nowrap' title={albumDetails.name}>{albumDetails.name}</h2>
                <p className='text-white/75 overflow-hidden text-ellipsis whitespace-nowrap'>{`${albumDetails.label} · ${albumDetails.total_tracks} Songs`}</p>
            </div>
        </section>
        <section className='mt-8 mb-4'>
                        <div className=' grid grid-cols-[20px_4fr_minmax(120px,_1fr)] gap-2 mb-2 items-center sticky top-[84px] bg-dark p-2 border-b-[1px] border-[hsla(0,0%,100%,.1)]'>
                            <span>#</span>
                            <span>Title</span>
                            <span className='mx-auto'><ClockIcon className='w-5 h-5' /></span>
                        </div>
                        {albumDetails.tracks.items.map((song, index) => {
                            return(
                                <div key={song.id} className=' grid grid-cols-[20px_4fr_minmax(120px,_1fr)] gap-2 mb-2 items-center p-2 rounded-lg hover:bg-highlight'>
                                    <span className='text-white/75'>{index+1}</span>
                                        <div className='flex flex-col overflow-hidden whitespace-nowrap'>
                                            <span>{song.name}</span>
                                            <span className='overflow-hidden text-ellipsis text-white/75 text-sm'>{song.artists.map((artist, index, artists) => {
                                                return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                                            })}</span>
                                        </div>
                                    <span className='text-white/75 text-center text-sm'>{millisToMinutesAndSeconds(song.duration_ms)}</span>
                                </div>
                            )
                        })}
                    </section>
    </aside>
    )
    :
    'Loading...'
  )
}

export default AlbumDetails
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon, ClockIcon} from '@heroicons/react/24/outline'

const playListDetails = () => {
    
    const router = useRouter();
    const playlistId = router.query.playlistId;
    const {data: session} = useSession();
    const [playlist,setPlaylist] = useState(null);

    function millisToMinutesAndSeconds(millis) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

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
                            {playlist.images.length === 0 ? <MusicalNoteIcon className='w-48 h-48' /> : <Image alt='playlist image' className='w-48 h-48' src={playlist.images[0].url} width={190} height={190} />}
                            <div className='flex flex-col gap-4 overflow-hidden whitespace-nowrap justify-end'>
                                <p className='text-sm capitalize'>{playlist.type}</p>
                                <h1 className="text-6xl font-bold overflow-hidden text-ellipsis leading-normal" title={playlist.name} >{playlist.name}</h1>
                                <p className="text-white/75 text-sm overflow-hidden text-ellipsis" title={playlist.description} >{playlist.description}</p>
                                <Link className='hover:underline text-sm capitalize' href={`/user/${playlist.owner.id}`} user_name={playlist.owner.display_name}>{playlist.owner.display_name}</Link>
                            </div>
                        </div>
                    </section>
                    <section className='mt-8 mb-4'>
                        <div className=' grid grid-cols-[20px_minmax(63%,_4fr)_2fr_minmax(120px,_1fr)] gap-2 mb-2 items-center sticky top-[84px] bg-dark p-2 border-b-[1px] border-[hsla(0,0%,100%,.1)]'>
                            <span>#</span>
                            <span>Title</span>
                            <span>Album</span>
                            <span className='mx-auto'><ClockIcon className='w-5 h-5' /></span>
                        </div>
                        {playlist.tracks.items.map((song, index) => {
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
                        })}
                    </section>
                </>
                :
                'loading...'}
        </section>
    )
}

export default playListDetails;
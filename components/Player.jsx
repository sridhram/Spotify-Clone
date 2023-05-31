import React, {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon,} from '@heroicons/react/24/outline'
import {PlayCircleIcon, PauseCircleIcon} from '@heroicons/react/24/solid'

const Player = () => {
    const {data: session} = useSession();
    const [currentSession, setCurrentSession] = useState(null);
    const [currentSong,setCurrentSong] = useState(null);
    const [progress_ms, setProgress_ms] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    function millisToMinutesAndSeconds(millis) {
        console.log(millis);
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    useEffect(() => {
        async function getCurrentPlayingSong(){
            if(session && session.user.accessToken){
                setCurrentSession(session);
                const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                let data = null;
                if(response.status === 200){
                    data = await response.json();
                }else{
                    getRecentlyPlayedTrack();
                    return;
                }
                setCurrentSong(data.item);
                setProgress_ms(data.progress_ms);
            }
        }

        async function getRecentlyPlayedTrack(){
            if(session && session.user.accessToken){
                const response = await fetch('https://api.spotify.com/v1/me/player/recently-played',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setCurrentSong(data.items[0].track);
            }
        }
        getCurrentPlayingSong();
    },[session])

    async  function resumeSong(){
            const response = await fetch('https://api.spotify.com/v1/me/player/play',{
                method: 'PUT',
                headers:{
                    Authorization: `Bearer ${session.user.accessToken}`,
                }
            });
            const data = await response.json();
            console.log(data);
            setIsPlaying(true);
        }

        async function pauseSong(){
            const response = await fetch('https://api.spotify.com/v1/me/player/pause',{
                method: 'PUT',
                headers:{
                    Authorization: `Bearer ${session.user.accessToken}`,
                }
            });
            const data = await response.json();
            console.log(data);
            setIsPlaying(false);
        }

  return (
    currentSession && (
    <footer className='col-span-2 py-2 grid grid-flow-col auto-cols-[33.33%]'>
        {currentSong ?
        <>
            <section className='flex gap-4'>
                {currentSong.album.images.length !== 0 ?
                    <Image src={currentSong.album.images[0].url} alt='song Image' width={56} height={56} className='w-14 h-14 rounded-lg' /> 
                :
                    <div className='w-10 h-10 border border-white/75 rounded-lg'>
                        <MusicalNoteIcon className='w-7 h-7' />
                    </div>
                }
                <div className='flex flex-col gap-1 overflow-hidden whitespace-nowrap justify-center'>
                    <Link className='text-xs hover:underline' href={`/album/${currentSong.album.id}`}>{currentSong.name}</Link>
                    <span className='overflow-hidden text-ellipsis text-white/75 text-xs'>{currentSong.artists.map((artist, index, artists) => {
                        return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                    })}</span>
                </div>
            </section>
            <section className='flex flex-col items-center gap-1 text-xs text-white/75'>
                { isPlaying ? <PauseCircleIcon onClick={pauseSong} className='w-8 h-8 cursor-pointer text-white' />  : <PlayCircleIcon onClick={resumeSong} className='w-8 h-8 cursor-pointer text-white' />}
                <div className='flex gap-2 items-center'>
                    <span>{millisToMinutesAndSeconds(progress_ms)}</span>
                    <span className='bg-white/75 w-[23vw] h-1 rounded-sm'></span>
                    <span>{millisToMinutesAndSeconds(currentSong.duration_ms)}</span>
                </div>
            </section>
            <section></section>
        </> :
        <div>Loading...</div>
        }
    </footer>)
  )
}

export default Player
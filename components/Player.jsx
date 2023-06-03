import React, {useState, useEffect, useRef} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon,} from '@heroicons/react/24/outline'
import {PlayCircleIcon, PauseCircleIcon} from '@heroicons/react/24/solid'
import {QueueListIcon} from '@heroicons/react/24/outline';

const Player = () => {
    const {data: session} = useSession();
    const [currentSession, setCurrentSession] = useState(null);
    const [currentSong,setCurrentSong] = useState(null);
    const [progress_ms, setProgress_ms] = useState(0);
    const [duration_ms, setDuration_ms] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const inputRef = useRef();

    function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

    function millisToMinutesAndSeconds(millis) {

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
                setDuration_ms(data.item.duration_ms);
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

        async function getDevicesList(){
            if(session && session.user.accessToken){
                const response = await fetch('https://api.spotify.com/v1/me/player/devices',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                console.log(data);
            }
        }
        getCurrentPlayingSong();
        getDevicesList();
    },[session])

    async  function resumeSong(){
            const response = await fetch('https://api.spotify.com/v1/me/player/play',{
                method: 'PUT',
                headers:{
                    Authorization: `Bearer ${session.user.accessToken}`,
                }
            });
            if(response.status === 204){
                setIsPlaying(true);
            }
        }

        async function pauseSong(){
            const response = await fetch('https://api.spotify.com/v1/me/player/pause',{
                method: 'PUT',
                headers:{
                    Authorization: `Bearer ${session.user.accessToken}`,
                }
            });
            if(response.status === 204){
                setIsPlaying(false);
            }
        }
        function setCurrentSongDuration(){
            const seekPercent = event.target.value;
            const currentSeek = Math.round((duration_ms * seekPercent)/100);
            sendDebouncedSeekRequest(currentSeek);
        }
        async function sendSeekRequest(seek){
            const response = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${seek}`,{
                method: 'PUT',
                headers:{
                    Authorization: `Bearer ${session.user.accessToken}`,
                }
            });
            if(response.status === 204){
                inputRef.current.value = getDurationPercentage(seek);
            }
        }

        function getDurationPercentage(time){
            return (time * 100)/duration_ms;
        }
        const sendDebouncedSeekRequest = debounce((seek) => {
            sendSeekRequest(seek);
        }, 300);

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
                    {/* <span className='bg-white/75 w-[23vw] h-1 rounded-sm'></span> */}
                    <input ref={inputRef} type="range" className='bg-white/75 w-[23vw]' min={0} max={100} value={getDurationPercentage(progress_ms)} onChange={setCurrentSongDuration} />
                    <span>{millisToMinutesAndSeconds(currentSong.duration_ms)}</span>
                </div>
            </section>
            <section className='justify-self-end self-center pr-4 cursor-pointer'>
                <Link href='/queue'> <QueueListIcon className='w-7 h-7' /></Link>
            </section>
        </> :
        <div>Loading...</div>
        }
    </footer>)
  )
}

export default Player
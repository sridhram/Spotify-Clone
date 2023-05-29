import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {MusicalNoteIcon} from '@heroicons/react/24/outline'

const ArtistDetails = () => {
    const router = useRouter();
    const {data: session} = useSession();
    const artistId = router.query.artistId;
    const [artistDetails,setArtistDetails] = useState(null);
    const [artistAlbums,setArtistAlbums] = useState(null);
    const [artistTracks,setArtistTracks] = useState(null);

    function millisToMinutesAndSeconds(millis) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    useEffect(() => {
        async function getArtistDetails(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setArtistDetails(data);
            }
        }
        async function getArtistAlbums(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                console.log(data);
                setArtistAlbums(data);
            }
        }
        async function getArtistTopTracks(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IN`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setArtistTracks(data);
            }
        }
        getArtistAlbums();
        getArtistDetails();
        getArtistTopTracks();
    },[session, artistId])

    return (
        (artistAlbums && artistDetails && artistTracks) ?
            <aside>
                <section className='flex gap-4 items-end'>
                    {artistDetails.images.length === 0 ? <MusicalNoteIcon className='w-48 h-48' /> : <Image src={artistDetails.images[0].url} alt='artist image' width={190} height={190} className='w-48 h-48 rounded-full'/>}
                    <div className='flex flex-col gap-4'>
                        <p className='text-white/75 capitalize'>{artistDetails.type}</p>
                        <h3 className='text-6xl capitalize leading-normal'>{artistDetails.name}</h3>
                        <p className='text-white/75'>{`${artistDetails.followers.total} Followers`}</p>
                    </div>
                </section>
                
                <section className='pt-8'>
                    <h3 className='font-semibold text-xl mb-4 p-2'>Popular</h3>
                    {artistTracks.tracks.map((song, index) => {
                            return(
                                <div key={song.id} className=' grid grid-cols-[20px_minmax(63%,_4fr)_2fr_minmax(120px,_1fr)] gap-2 mb-2 items-center p-2 rounded-lg hover:bg-highlight'>
                                    <span className='text-white/75'>{index+1}</span>
                                    <section className='flex gap-2 items-center'>
                                        {(song.album.images.length !== 0) ? <Image src={song.album.images[0].url} className='w-10 h-10' width={40} height={40} alt="song image" /> : <MusicalNoteIcon className='w-10 h-10' /> }
                                        <div className='flex flex-col overflow-hidden whitespace-nowrap'>
                                            <span>{song.name}</span>
                                            <span className='overflow-hidden text-ellipsis text-white/75 text-sm whitespace-nowrap'>{song.artists.map((artist, index, artists) => {
                                                return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                                            })}</span>
                                        </div>
                                    </section>
                                    <Link href={`/album/${song.album.id}`} className='text-ellipsis overflow-hidden text-sm whitespace-nowrap text-white/75 hover:underline' title={song.album.name}>{song.album.name}</Link>
                                    <span className='text-white/75 text-center text-sm'>{millisToMinutesAndSeconds(song.duration_ms)}</span>
                                </div>
                            )
                        })}
                </section>

                <h3 className='font-semibold text-xl mb-4 p-2'>Albums</h3>
                <section className='flex gap-x-6 gap-y-4 flex-wrap'>
                    {artistAlbums.items.map((album) => {
                        return(
                            <Link href={`/album/${album.id}`} key={album.id} className='flex flex-col gap-2 bg-highlight py-4 px-6 m-auto rounded-lg w-[190px] hover:bg-selectedLink'>
                                {album.images.length === 0 ? <MusicalNoteIcon className='w-36 h-36' /> : <Image src={album.images[0].url} alt='playlist image' className='w-36 h-36 m-auto rounded-lg' width={144} height={144} />}
                                <h1 className='text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis' title={album.name}>{album.name}</h1>
                                <span className='overflow-hidden text-ellipsis text-white/75 text-sm whitespace-nowrap'>{album.artists.map((artist, index, artists) => {
                                    return (<><Link key={artist.id} href={`/artist/${artist.id}`} className='inline-block hover:underline'>{`${artist.name}`}</Link>{index !== artists.length-1 ? ', ': ' '}</>)
                                })}</span>
                            </Link>
                        )
                    })}
                </section>
            </aside>
         :
        'Loading...'
    )
}

export default ArtistDetails
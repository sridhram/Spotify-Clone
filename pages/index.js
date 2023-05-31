import React, {useState, useEffect} from 'react'
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {

  const {data: session} = useSession();
  const [recentlyPlayed,setRecentlyPlayed] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [featuredPlaylists, setFeaturedPlaylists] = useState(null);

  useEffect(() => {
        async function getRecentlyPlayedTrack(){
            if(session && session.user.accessToken){
                const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=4',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setRecentlyPlayed(data);
            }
        }
        async function getTopArtists(){
            if(session && session.user.accessToken){
                const response = await fetch('https://api.spotify.com/v1/me/top/artists',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setTopArtists(data);
            }
        }
        async function getFeaturedPlaylists(){
            if(session && session.user.accessToken){
                const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists?country=IN&limit=4',{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setFeaturedPlaylists(data);
                console.log(data);
            }
        }
        getRecentlyPlayedTrack();
        getFeaturedPlaylists();
        // getTopArtists();
    },[session])

  function getArtistString(track){
    return track.track.artists.reduce((artistString,artist,index, artists) => {
      artistString += artist.name
      if(index !== artists.length-1){
        artistString += ', '
      }
      return artistString;
    },'')
  }

  return (
    (recentlyPlayed && featuredPlaylists) ? 
    (
      <>
      <aside className='p-4'>
        <section className=''>
          <h3 className='font-semibold text-2xl mb-6'>Recently Played</h3>
          <div className='flex gap-4 flex-wrap'>
            {recentlyPlayed.items.map((track) => {
              return(
                  <Link href={track.context.type === 'playlist' ? `/playlist/${track.context.uri.split(':')[2]}` : `/album/${track.context.uri.split(':')[2]}`} key={track.track.id} className='flex flex-col gap-2 bg-highlight py-4 px-6 m-auto rounded-lg w-[190px] hover:bg-selectedLink'>
                        <Image src={track.track.album.images[0].url} alt='playlist image' className='w-36 h-36 m-auto' width={144} height={144} />
                      <h1 className='text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis' title={track.track.name}>{track.track.name}</h1>
                      <span className='text-white/75 overflow-hidden whitespace-nowrap text-ellipsis' title={getArtistString(track)}>{getArtistString(track)}</span>
                  </Link>
              );
            })}
          </div>
        </section>
        <section className='pt-12'>
          <h3 className='font-semibold text-2xl mb-6'>Featured Playlists</h3>
          <div className='flex gap-4 flex-wrap'>
            {featuredPlaylists.playlists.items.map((playlist) => {
              return (
                <Link href={`/playlist/${playlist.id}`} key={playlist.id} className='flex flex-col gap-2 bg-highlight py-4 px-6 m-auto rounded-lg w-[190px] hover:bg-selectedLink'>
                  <Image src={playlist.images[0].url} alt='playlist image' className='w-36 h-36 m-auto' width={144} height={144} />
                  <h1 className='text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis' title={playlist.name}>{playlist.name}</h1>
                  <span className='text-white/75 overflow-hidden whitespace-nowrap text-ellipsis' title={playlist.description}>{playlist.description}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </aside>
    </>
    )
    :
    'Loading...'
  )
}

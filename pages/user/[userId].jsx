import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useSession} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import playListDetails from '../playlist/[playlistId]';

const UserDetails = () => {
    const router = useRouter();
    const userId = router.query.userId;
    const {data: session} = useSession();
    const [userDetails,setUserDetails] = useState(null);
    const [userPlaylists,setUserPlaylists] = useState(null);

    useEffect(() => {
        async function getUserDetails(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/users/${userId}`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setUserDetails(data)
            }
        }
        async function getUserPlaylists(){
            if(session && session.user.accessToken){
                const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                    headers:{
                        Authorization:`Bearer ${session.user.accessToken}`
                    }
                });
                const data = await response.json();
                setUserPlaylists(data)
                console.log(data);
            }
        }
        getUserDetails();
        getUserPlaylists();
    },[session, userId])
  return (
    (userDetails && userPlaylists) ?
    (
        <>
            <section className='flex gap-4'>
                <Image alt='playlist image' className='w-48 h-48 rounded-full' src={userDetails.images[0].url} width={190} height={190} />
                <div className='flex flex-col gap-4 overflow-hidden whitespace-nowrap justify-end'>
                    <p className='text-sm capitalize'>Profile</p>
                    <h1 className="text-6xl font-bold overflow-hidden text-ellipsis leading-normal" title={userDetails.display_name} >{userDetails.display_name}</h1>
                    <p className="text-white/75 text-sm overflow-hidden text-ellipsis" title={userDetails.followers.total} >{`${userDetails.followers.total} Followers`}</p>
                </div>
            </section>
            <h1 className='text-4xl font-bold pt-10 pb-6'>Public Playlists</h1>
            <section className='py-4 flex flex-wrap gap-y-4 gap-x-8'>
                {
                    userPlaylists.items.map((playlist) => {
                        return(
                            <Link href={`/playlist/${playlist.id}`} key={playlist.id} className='flex flex-col gap-2 bg-highlight py-4 px-6 m-auto rounded-lg w-[190px] hover:bg-selectedLink'>
                                <Image src={playlist.images[0].url} alt='playlist image' className='w-36 h-36 m-auto' width={144} height={144} />
                                <h1 className='text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis' title={playlist.name}>{playlist.name}</h1>
                                <Link href={`/user/${playlist.owner.id}`} className='hover:underline text-white/75'>{playlist.owner.display_name}</Link>
                            </Link>
                        );
                    })
                }
            </section>
        </>
    )
    :
    'Loading...'
  )
}

export default UserDetails
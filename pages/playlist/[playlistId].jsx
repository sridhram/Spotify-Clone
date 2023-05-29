import { useRouter } from 'next/router';

const playListDetails = () => {
    const router = useRouter();
    return(
        <div>{router.query.playlistId}</div>
    )
}

export default playListDetails;
import React from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSpotify from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time';

const Song = ({ order, track }) => {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        if (currentTrackId === track.track.id) {
            if (isPlaying) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        } else {
            spotifyApi.play({
                uris: [track.track.uri],
            });
            setCurrentTrackId(track.track.id);
            setIsPlaying(true);
        }
    };

    
    
return (
<div className="grid grid-cols-2 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-800 cursor-pointer" onClick={playSong}>
    <div className="flex space-x-4 items-center ">
    <p>{order + 1} </p>
    <img className="h-10 w-10" src={track.track.album.images[0].url} alt="" />
    <div className="flex flex-col">
        <p className='w-40 md:w-28 lg:w-64 truncate text-white'>{track.track.name}</p>
        <p className='w-40'>{track.track.artists[0].name}</p>
    </div>
    </div>
    <div className="flex items-center justify-between ml-auto md:ml-0 ">
    <p className="w-64 hidden md:inline">{track.track.album.name}</p>
    <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
    </div>
</div>
);
}

export default Song;
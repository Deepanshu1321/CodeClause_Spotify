import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

import { TbSwitch3 } from 'react-icons/tb';
import { IoChevronForwardSharp, IoChevronBackwardSharp, IoChevronBackSharp } from "react-icons/io5";
import { BsPauseCircleFill, BsPlayCircleFill } from "react-icons/bs";
import { BiRepeat } from 'react-icons/bi';
import {
  ImVolumeDecrease, ImVolumeIncrease,
} from "react-icons/im";
import { debounce } from 'lodash';

const Player = () => {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [ currentTrackId, setCurrentIdTrack ]= useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        console.log("Now Playing", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);
        
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          console.log("Now Playing", data.body);
          setIsPlaying(data.body?.is_playing);
        });


      });
    }
  }
  
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
    
  }, [currentTrackIdState, spotifyApi, session]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err)=>{});
    }, 50),
    []
  );
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);  
    }
  },[volume])


  return (
    <div className="text-gray-500 h-24 bg-gradient-to-b from-black to-gray-900 px-3 md:px-8 items-center grid grid-cols-3 text-sm md:text-base ">
      {/* left */}
      <div className="flex items-end space-x-1 md:space-x-4">
        <img
          src={songInfo?.album.images?.[0]?.url}
          alt=""
          className="h-12 md:h-16 w-12 md:w-16 object-cover"
        />
        <div className=" flex flex-col w-48 text-xs">
          <h3 className="text-white ">{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* center */}
      <div className="flex items-center justify-center space-x-4 p-0 md:p-4">
        <TbSwitch3 className="button" />
        <IoChevronBackSharp
          className="button"
          onClick={() => {
            spotifyApi.skipToPrevious();
          }}
        />

        {isPlaying ? (
          <BsPauseCircleFill
            className="button "
            onClick={() => {
              spotifyApi.pause(), setIsPlaying(false);
            }}
          />
        ) : (
          <BsPlayCircleFill
            className="button"
            onClick={() => {
              spotifyApi.play(), setIsPlaying(true);
            }}
          />
        )}
        <IoChevronForwardSharp
          className="button"
          onClick={() => {
            spotifyApi.skipToNext();
          }}
        />
        <BiRepeat
          className="button"
          onClick={() => {
            spotifyApi.setRepeat("track");
          }}
        />
      </div>

      {/* Volume*/}
      <div className="flex items-center justify-end space-x-2 md:space-x-3">
        <ImVolumeDecrease
          className="w-5 h-5 button"
          value={volume}
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28 text-[#1db954]"
          onInput={(e) => {
            spotifyApi.setVolume(e.target.value);
          }}
        />
        <ImVolumeIncrease
          className="w-5 h-5 button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { BiChevronDown } from 'react-icons/bi';
import { shuffle } from 'lodash';
import { playlistState, playlistIdState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';




const colors = [
    "from-red-500",
    "from-purple-500",
    "from-pink-500",
    "from-orange-500",
    "from-blue-500",
    "from-yellow-500",
    "from-violet-500",
    "from-lime-500",
    "from-green-500",
    "from-emerald-500",
    "from-amber-500",
    "from-teal-500",
];

function Center() {
    const { data: session } = useSession();
    const [color, setColor] = useState(null);
    const spotifyApi = useSpotify();
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const [isActive, setActive] = useState("false");

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId]);

    useEffect(() => {
        spotifyApi
            .getPlaylist(playlistId)
            .then((data) => {
                setPlaylist(data.body);
            })
            .catch((err) => console.log("Something went wrong!", err));
    }, [spotifyApi, playlistId]);

    // const handleToggle = () => {
    //   setActive(!isActive);
    // };

    return (
        <div className='text-white flex-grow h-screen overflow-y-scroll scrollbar-hide '>
            <header className='absolute top-5 right-10 '>
                <div className='flex items-center space-x-3 opacity-90 hover:opacity-70 p-1 pr-2 rounded-full cursor-pointer bg-black ' onClick={signOut}>
                    <img
                        className=' rounded-full w-9 h-9'
                        src={session?.user?.image}
                        alt='Username'
                    />

                    <h2>{session?.user?.name}</h2>
                    <BiChevronDown className='w-5 h-5' />
                </div>
            </header>

            <section className={`flex accent-lime-200 items-end space-x-7 bg-gradient-to-b to-black ${color} h-[22rem] p-8`}>
                <img src={playlist?.images?.[0]?.url} alt="" className="w-44 h-44 md:h-52 md:w-52" />
                <p className=' text-2xl md:text-4xl xl:text-6xl'> {playlist?.name} </p>
                
            </section>

            <Songs/>
        </div>
    )
}

export default Center;


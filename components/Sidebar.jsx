import { HiOutlineSearch, HiOutlineHome } from "react-icons/hi";
import { BiLibrary } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineAddCircleOutline, MdExitToApp } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";



function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists(session).then((data) => {
                setPlaylists(data.body.items);
            });
        }
    }, [session, spotifyApi]);




    return (
        <div className="text-gray-500 p-5 text-sm lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[15rem] lg:max-w-[18rem] hidden md:inline-flex">
            <div className="space-y-4 ">
                <button className="flex items-center space-x-2 hover:text-white ">
                    <HiOutlineHome className="w-6 h-6" />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white ">
                    <HiOutlineSearch className="w-6 h-6" />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white ">
                    <BiLibrary className="w-6 h-6" />
                    <p>Your Library</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900 " />

                <button className="flex items-center space-x-2 hover:text-white ">
                    <MdOutlineAddCircleOutline className="w-6 h-6" />
                    <p>Create Playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white ">
                    <AiFillHeart className="w-6 h-6" />
                    <p>Liked Songs</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900 " />

                {/* Playlist */}

                <div className="space-y-2 pb-24">
                    <h2 className="text-sm font-bold">PLAYLISTS</h2>
                    <div className="space-y-2">
                        {playlists?.map((playlist) => (
                            <p
                                key={playlist.id}
                                onClick={() => setPlaylistId(playlist.id)}
                                className="cursor-pointer hover:text-white"
                            >
                                {playlist.name}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;

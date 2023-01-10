import { FaAngleDoubleRight } from 'react-icons/fa'
import { FaLinkedinIn, FaGithub, FaTwitter } from 'react-icons/fa';
import { getProviders, signIn } from 'next-auth/react';

function Login({ providers }) {
    return (
        <div className='flex flex-col items-center bg-black w-full h-screen justify-center'>
            <div className="flex flex-col items-center bg-black w-full h-screen justify-center">
                <img className='w-72 mb-5' src="https://links.papareact.com/9xl"  alt="" />
                {Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button className="bg-[#1db954] text-white p-2 rounded-md mt-5 hover:animate-pulse"
                            onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                            Log in with {provider.name}
                        </button>

                    </div>
                ))}
            </div>

            
            <div className='flex space-x-7'>
                <a href="https://github.com/Deepanshu1321/CodeClause_SpotifyAPI_SpotifyClone.git" target="_blank noreferrer">
                    <FaGithub className="text-3xl text-white hover:animate-bounce" />
                </a>
                <a href="https://www.twitter.com/deepanshu_1321" target="_blank noreferrer">
                        <FaTwitter className="text-3xl text-white hover:animate-bounce" />
                </a>
                    <a href="https://www.linkedin.com/in/Deepanshu1321" target="_blank noreferrer">
                    <FaLinkedinIn className="text-3xl text-white hover:animate-bounce" />
                </a>
                </div>
        </div>
    );
}

export default Login;

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: {
            providers,
        },
    };
}

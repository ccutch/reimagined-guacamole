import { useSession } from "next-auth/react";
import Link from "next/link";

type NavbarProps = {
    title?: string;
    clear?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, clear = false }) => {
    const { data: sessionData } = useSession();

    return (
        <>
        {clear && <div className="w-full min-h-[84px]"></div>}
        <div className={`flex items-center px-16 py-5 w-full bg-${clear ? 'transparent' : 'white'} ${clear ? 'fixed pt-8' : 'shadow-md'}`}>
            <Link href="/" className='flex items-center'>
                <img src='https://www.made-by-connor.com/my-face.jpg' 
                    className='h-6 mr-4 rounded-full'/>
                <h4 className='font-semibold text-2xl text-gray-700'>{title || 'RidgeLine'}</h4>
            </Link>

            {sessionData?.user?.image && (
                
                <Link href="/" className='flex px-5 py-1 rounded-full items-center ml-auto cursor-pointer hover:bg-gray-100 hover:bg-opacity-60'>
                    <img src={sessionData.user.image} 
                        className='h-6 w-6 rounded-full border-2 border-white'/> 
                    <h6 className='ml-2 font-semibold text-lg text-gray-700'>My Dashboard</h6>
                </Link>
            )}
        </div>
        </>
    )
}

export default Navbar
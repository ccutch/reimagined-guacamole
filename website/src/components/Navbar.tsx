
type NavbarProps = {
    title?: string;
    clear?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, clear = false }) => {
    return (
        <>
        <div className="w-full min-h-[72px]"></div>
        <div className={`fixed flex items-center py-5 px-16 w-full bg-${clear ? 'transparent' : 'white'} ${!clear && 'shadow-md'}`}>
            <img src='https://railway.app/brand/logo-dark.png' 
                className='h-8 mr-4 rounded-full'/>
            <h4 className='font-semibold text-2xl text-gray-700'>{title || 'RidgeLine'}</h4>
        </div>
        </>
    )
}

export default Navbar
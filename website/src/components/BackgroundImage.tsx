import { useEffect, useState } from "react"

const genRandomString = () => (Math.random() + 1).toString(36).substring(7)

type BackgroundImageProps = {

}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ ...props }) => {
    const [seed, setSeed] = useState(genRandomString())
    useEffect(() => {
        const timeout = setInterval(() => {
            console.log('changing image')
            setSeed(genRandomString())
        }, 50_000)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className='h-full w-full fixed inset-0 z-[-1] bg-center bg-cover' style={{
            backgroundImage: `url(https://picsum.photos/1512/982?blur=2#${seed})`,
        }}>
            <div className='h-full w-full bg-white bg-opacity-60'/>
        </div>
    )
}

export default BackgroundImage
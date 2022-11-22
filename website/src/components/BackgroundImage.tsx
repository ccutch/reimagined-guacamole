import { useEffect, useState } from "react"

const genRandomString = () => (Math.random() + 1).toString(36).substring(7)

type BackgroundImageProps = {
    cycleTime?: number;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ cycleTime = 50_000 }) => {
    const [seed, setSeed] = useState(genRandomString())
    useEffect(() => {
        const timeout = setInterval(() => {
            console.log('changing image')
            setSeed(genRandomString())
        }, cycleTime)

        return () => clearTimeout(timeout)
    }, [cycleTime])

    return (
        <div className='h-full w-full fixed inset-0 z-[-1] bg-center bg-cover' style={{
            backgroundImage: `url(https://picsum.photos/seed/${seed}/1512/982?blur=2)`,
        }}>
            <div className='h-full w-full bg-white bg-opacity-60'/>
        </div>
    )
}

export default BackgroundImage
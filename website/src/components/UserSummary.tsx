import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const DISCORD_DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png'

const UserSummary: React.FC = () => {
    const { data } = useSession()

    const [time, setTime] = useState(new Date(Date.now()))
    useEffect(() => {
      const date = new Date()
      let interval: undefined | number | NodeJS.Timer
      const timeout = setTimeout(() => {
        interval = setInterval(() => {
          setTime(new Date())
        }, 60_000)
      }, (60 - date.getSeconds()) * 1_000)
      return () => {
        clearTimeout(timeout)
        interval && clearTimeout(interval)
      }
    }, [])

    if (!data?.user) return <div />
    
    return (
        <>
        <div className="w-80"></div>
        <div className='fixed'>
            <div className='flex flex-col items-center w-80 h-min p-10 bg-gray-50 rounded-2xl shadow-md'>
                <img src={data.user.image || DISCORD_DEFAULT_AVATAR} className="h-32 w-32 rounded-full" />
                <h4 className='mt-5 font-bold text-2xl text-gray-800'>{data.user.name}</h4>

                <h2 className='mt-32 font-bold text-5xl text-gray-600'>{format(time, 'hh:mm aa')}</h2>
                <h5 className='mt-4 text-sm text-gray-700'>{format(time, 'MMMM dd, yyyy')}</h5>
            </div>
        </div>
        </>
    )
}

export default UserSummary
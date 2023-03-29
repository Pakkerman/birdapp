import { useUser } from "@clerk/nextjs"

import Link from "next/link"
import Image from "next/image"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { GiChicken } from "react-icons/gi"

const Profile = () => {
  const { user } = useUser()

  if (!user) return null

  return (
    <Link href={`/@${user.username}`}>
      <div className="flex h-20 justify-end space-x-2 pb-4 lg:justify-start lg:pl-8">
        <div className="  flex h-full w-16 items-center justify-center lg:w-10">
          <Image
            className="rounded-full"
            src={user?.profileImageUrl}
            alt={`${user?.username}'s profile image`}
            height={48}
            width={48}
          />
        </div>
        <div className=" hidden h-full items-center justify-center p-1 lg:block">
          <div className="text-lg">{user?.username}</div>
          <div className="text-md text-slate-500">{`@${user?.username}`}</div>
        </div>
      </div>
    </Link>
  )
}

const SidePanel = () => {
  return (
    <div className=" flex h-screen flex-col px-1">
      <div className="flex h-full flex-col items-end justify-start space-y-6 py-6 lg:items-start lg:pl-8">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="flex w-16  justify-center lg:w-10">
              <GiChicken size={36} />
            </div>
            <h1 className="hidden text-xl lg:block">Bird App</h1>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="flex w-16  justify-center lg:w-10">
            <FaHashtag size={28} />
          </div>
          <h1 className="hidden text-xl lg:block">Emoji Only</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex w-16 justify-center lg:w-10">
            <FaInfo size={28} />
          </div>
          <h1 className="hidden text-xl lg:block">About</h1>
        </div>
      </div>
      <Profile />
    </div>
  )
}

export default SidePanel

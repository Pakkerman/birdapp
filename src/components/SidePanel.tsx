import { useUser, SignOutButton, UserButton } from "@clerk/nextjs"

import Link from "next/link"
import Image from "next/image"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { GiChicken } from "react-icons/gi"
import { BiLogOutCircle } from "react-icons/bi"
import { LoadingSpinner } from "./loading"

const Profile = () => {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex h-20 justify-end space-x-2 pb-4 lg:justify-start lg:pl-8">
        <div className="flex h-full w-16 items-center justify-center lg:w-10">
          <LoadingSpinner size={48} />
        </div>
      </div>
    )
  }

  if (!user || !user.username) {
    return (
      <div>
        <div className=" flex h-14 items-center justify-end space-x-2 pb-2 lg:justify-start lg:pl-8">
          <div className=" flex w-16 justify-center lg:w-10">
            <SignOutButton>
              <BiLogOutCircle size={36} />
            </SignOutButton>
          </div>
          <div className="hidden h-full pr-2 lg:flex lg:flex-col lg:items-center lg:justify-center">
            <button className="text-lg">Sign Out</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link href={`/@${user?.username}`}>
        <div className="flex h-14 items-center justify-end space-x-2 pb-2 lg:justify-start lg:pl-8">
          <div className="flex w-16 justify-center lg:w-10">
            <UserButton />
            {/* <Image
              className="rounded-full"
              src={user?.profileImageUrl}
              alt={`${user?.username}'s profile image`}
              height={36}
              width={36}
            /> */}
          </div>
          <div className="hidden h-full pr-2 lg:flex lg:flex-col lg:items-center lg:justify-center">
            <div className="text-lg">{user?.username}</div>
            <div className="text-md text-slate-500">{`@${user?.username}`}</div>
          </div>
        </div>
      </Link>
      <div className="flex h-14 items-center justify-end space-x-2 pb-2 lg:justify-start lg:pl-8">
        <div className="flex w-16 cursor-pointer justify-center lg:w-10">
          <SignOutButton>
            <BiLogOutCircle size={36} />
          </SignOutButton>
        </div>
        <div className="hidden h-full pr-2 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="text-lg">Sign Out</div>
        </div>
      </div>
    </div>
  )
}

const SidePanel = () => {
  return (
    <div className="flex h-screen flex-col px-1">
      <div className="flex h-full flex-col items-end justify-start space-y-6 py-6 lg:items-start lg:pl-8">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="flex w-16 justify-center lg:w-10">
              <GiChicken size={36} />
            </div>
            <h1 className="hidden text-xl lg:block">Bird App</h1>
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="flex w-16 justify-center lg:w-10">
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

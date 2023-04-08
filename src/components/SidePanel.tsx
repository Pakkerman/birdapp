import { useUser, SignOutButton, SignInButton, UserButton } from "@clerk/nextjs"

import Link from "next/link"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { BiLogOutCircle, BiLogInCircle } from "react-icons/bi"
import { LoadingSpinner } from "./loading"

import BirdAppIcon from "./BirdAppIcon"

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
        <SignInButton>
          <div className="flex h-14 cursor-pointer items-center justify-end space-x-2 pb-2 hover:text-violet-400 lg:justify-start lg:pl-8 ">
            <div className="flex w-16 cursor-pointer justify-center lg:w-10">
              <BiLogInCircle size={36} />
            </div>
            <div className="hidden h-full pr-2 lg:flex lg:flex-col lg:items-center lg:justify-center">
              <button className="text-lg">Sign In</button>
            </div>
          </div>
        </SignInButton>
      </div>
    )
  }

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
  const username = fullName === " " ? user.username : fullName

  return (
    <div>
      <Link href={`/@${user?.username}`}>
        <div className="flex h-14 items-center justify-end space-x-2 pb-2 lg:justify-start lg:pl-8">
          <div className="flex w-16 justify-center lg:w-10">
            <UserButton />
          </div>
          <div className="hidden h-full w-16 pr-2 lg:flex lg:flex-col lg:items-start lg:justify-start">
            <div className=" text-md truncate text-clip">{username}</div>
            <div className="text-sm  text-slate-500">{`@${user?.username}`}</div>
          </div>
        </div>
      </Link>
      <SignOutButton>
        <div className="flex h-14 cursor-pointer items-center justify-end space-x-2 pb-2 hover:text-violet-400 lg:justify-start lg:pl-8">
          <div className="flex w-16 cursor-pointer justify-center lg:w-10">
            <BiLogOutCircle size={36} />
          </div>
          <div className="hidden h-full pr-2 lg:flex lg:flex-col lg:items-center lg:justify-center ">
            <div className="text-lg">Sign Out</div>
          </div>
        </div>
      </SignOutButton>
    </div>
  )
}

const SidePanel = () => {
  return (
    <div className="hidden h-[100svh] flex-col px-1 sm:flex">
      <div className="flex h-full flex-col items-end justify-start space-y-6 py-6 lg:items-start lg:pl-8">
        <BirdAppIcon size={36} />
        <div className="flex cursor-pointer items-center space-x-2 hover:text-violet-400">
          <div className=" flex w-16 justify-center lg:w-10">
            <FaHashtag size={28} />
          </div>
          <h1 className=" hidden truncate text-clip text-lg lg:block">
            Emoji Only
          </h1>
        </div>
        <div className="flex cursor-pointer items-center space-x-2 hover:text-violet-400">
          <div className="flex w-16 justify-center lg:w-10">
            <FaInfo size={28} />
          </div>
          <h1 className="hidden text-lg lg:block">About</h1>
        </div>
      </div>
      <Profile />
    </div>
  )
}

export default SidePanel

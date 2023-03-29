import Link from "next/link"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { GiChicken } from "react-icons/gi"

const SidePanel = () => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <div className="flex h-full flex-col items-end justify-start space-y-6  py-6 lg:items-start lg:pl-8">
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
      <div className="flex items-center space-x-2 py-6 lg:pl-8">
        <div className="flex w-16  justify-center lg:w-10">
          <div className="">profile</div>
        </div>
        <div className=""></div>
      </div>
    </div>
  )
}

export default SidePanel

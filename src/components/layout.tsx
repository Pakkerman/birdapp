import type { PropsWithChildren } from "react"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { GiKiwiBird } from "react-icons/gi"

const SidePanel = () => {
  return (
    <div className="flex flex-col justify-center space-y-4 border-2 p-4">
      <div className="flex">
        <GiKiwiBird size={36} />
      </div>
      <div className="flex items-center space-x-2">
        <FaHashtag size={24} />
        <h1 className="hidden text-2xl md:block">Bird App</h1>
      </div>

      <div className="flex h-36 flex-col ">
        <div className="flex items-center space-x-2">
          <FaInfo size={24} />
          <h1 className="hidden text-2xl md:block">About</h1>
        </div>
      </div>
    </div>
  )
}

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="m-auto flex h-screen max-w-6xl">
      <div className="max-w-[250px] flex-[2_5_65px]">
        <SidePanel />
      </div>
      <div className="h-full max-w-2xl flex-[10_1_500px] overflow-y-auto border-2 border-x border-slate-600 ">
        {props.children}
      </div>
      <div className="max-w-[200px] flex-[2_5] border-2"></div>
    </main>
  )
}

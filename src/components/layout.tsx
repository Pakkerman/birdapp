import type { PropsWithChildren } from "react"

import SidePanel from "./SidePanel"

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen w-full max-w-7xl justify-center">
      <div className="max-w-[200px] flex-[1_1_50px]">
        <SidePanel />
      </div>
      <div className="h-full max-w-2xl flex-[5_1_500px] overflow-y-auto border-2 border-x border-slate-600">
        {props.children}
      </div>
      <div className="max-w-[200px] flex-[1_1]"></div>
    </main>
  )
}

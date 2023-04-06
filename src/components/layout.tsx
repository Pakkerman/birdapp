import { useState } from "react"
import type { PropsWithChildren } from "react"

import SidePanel from "./SidePanel"
import Navbar from "./Navbar"
import MobileMenu from "./MobileMenu"

const FixedNavbar = (props: any) => {
  return (
    <div className="fixed z-20 flex h-14 w-full max-w-7xl justify-center sm:h-20">
      <div className="hidden max-w-[200px] flex-[1_1] sm:block ">
        <div className="mx-1 w-16 lg:w-10"></div>
      </div>
      <div className="h-full max-w-2xl flex-[5_1_500px] overflow-y-auto border-x-[1px] border-slate-600">
        <Navbar {...props} />
      </div>
      <div className="hidden max-w-[200px] flex-[0_1] sm:block"></div>
    </div>
  )
}

export const PageLayout = (props: PropsWithChildren) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <main className="flex h-[100svh] w-full max-w-7xl justify-center">
      <FixedNavbar
        setShowMobileMenu={setShowMobileMenu}
        showMobileMenu={showMobileMenu}
      />
      <div className="z-30 hidden max-w-[200px] flex-[1_1] sm:block">
        <SidePanel />
      </div>
      <div className=" h-full max-w-2xl flex-[5_1_500px] overflow-y-auto border-x-[1px] border-slate-600">
        <div className="h-14 sm:h-20" />
        {props.children}
      </div>
      <div className="z-30 hidden max-w-[200px] flex-[0_1] sm:block"></div>
      <MobileMenu show={showMobileMenu} />
    </main>
  )
}

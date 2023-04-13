import { useState, type PropsWithChildren } from "react"

import SidePanel from "./SidePanel"
import Navbar from "./Navbar"
import MobileMenu from "./MobileMenu"
import React from "react"

// This compoent is overlaying on top of PageLayout,
// to create the navbar only on the top of the middle content section.
// All the flex values, breakpoints, are matched exactly with the PageLayout
export const FixedNavbar = (
  props: PropsWithChildren & {
    navbarTitle: string
    showMobileMenu?: boolean
    setShowMobileMenu?: (show: boolean) => void
  }
) => {
  return (
    <div className="fixed z-20 flex h-14 w-full max-w-7xl justify-center sm:h-20">
      <div className="hidden max-w-[200px] flex-[1_1] sm:block ">
        <div className="mx-1 w-16 lg:w-10"></div>
      </div>
      <div className="h-full max-w-2xl flex-[5_1_500px] overflow-y-auto border-x-[1px] border-slate-600">
        <Navbar
          navbarTitle={props.navbarTitle}
          showMobileMenu={props.showMobileMenu}
          setShowMobileMenu={props.setShowMobileMenu}
        />
      </div>
      <div className="hidden max-w-[200px] flex-[0.5_0.5] sm:block"></div>
    </div>
  )
}

export const PageLayout = (
  props: PropsWithChildren & { navbarTitle: string }
) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <main className="flex h-[100svh] w-full max-w-7xl justify-center">
      <FixedNavbar
        navbarTitle={props.navbarTitle}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      <div className="z-30 hidden max-w-[200px] flex-[1_1] sm:block">
        <SidePanel />
      </div>
      <div className=" h-full max-w-2xl flex-[5_1_500px] overflow-y-auto border-x-[1px] border-slate-600">
        <div className="h-14 sm:h-20" />
        {props.children}
      </div>
      <div className="z-30 hidden max-w-[200px] flex-[0.5_0.5] sm:block"></div>
      <div>
        {showMobileMenu && (
          <MobileMenu
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
        )}
      </div>
    </main>
  )
}

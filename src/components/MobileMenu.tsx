import { SignOutButton, UserButton } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import useUserDetails from "../hooks/useUserDetails"

import Link from "next/link"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { SlLogout } from "react-icons/sl"
import BirdAppIcon from "./BirdAppIcon"

const MobileMenuProfile = (props: {
  setShowComponent: (show: boolean) => void
}) => {
  const { fullName, username, isSignedIn } = useUserDetails()

  const handleClick = () => {
    props.setShowComponent(false)
  }

  return (
    <div className="flex w-full items-center justify-start space-y-2 ">
      {isSignedIn && (
        <div>
          <div className="group flex space-x-2">
            <div className="flex w-12 justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-[1px] border-slate-100 transition-colors hover:cursor-pointer group-hover:border-violet-400">
                <UserButton />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-md truncate text-clip group-hover:text-violet-400">
                {fullName}
              </p>
              <div className="text-sm text-slate-500">{`@${username}`}</div>
            </div>
          </div>
          <SignOutButton>
            <div
              className="group flex w-full items-center space-x-2 transition hover:cursor-pointer "
              onClick={handleClick}>
              <div className="flex w-12 items-center justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-[1px] border-slate-100 transition-colors group-hover:border-violet-400">
                  <div className="-translate-x-[2px] transition-colors group-hover:text-violet-400">
                    <SlLogout size={16} />
                  </div>
                </div>
              </div>
              <div className="transition-colors group-hover:text-violet-400">
                Sign Out
              </div>
            </div>
          </SignOutButton>
        </div>
      )}
    </div>
  )
}

const MobileMenuItems = () => {
  return (
    <section className="group flex flex-col space-y-6 ">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div className="flex w-12 justify-center">
            <BirdAppIcon size={42} />
          </div>
          <p className="custom-gradient w-24 text-xl ">Bird App</p>
        </div>
      </Link>
      <div className="flex flex-col space-y-4">
        <div className=" flex items-center space-x-2">
          <div className="flex w-12 justify-center">
            <FaHashtag size={36} />
          </div>
          <p className="w-24 text-xl">Emojis Only!</p>
        </div>
      </div>
      <Link href="/about">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex w-12 justify-center">
              <FaInfo size={36} />
            </div>
            <p className="w-24 text-xl">About</p>
          </div>
        </div>
      </Link>
    </section>
  )
}

const MobileMenuContent = (props: {
  setShowComponent: (show: boolean) => void
}) => {
  return (
    <div className=" m-6 flex h-[85svh] flex-col justify-between">
      <MobileMenuItems />
      <MobileMenuProfile {...props} />
    </div>
  )
}

const MobileMenu = (props: {
  showMobileMenu: boolean
  setShowMobileMenu: (showMobileMenu: boolean) => void
}) => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [showComponent, setShowComponent] = useState(false)

  const closeMobileMenu = useCallback(() => {
    setShowComponent(false)
    setTimeout(() => {
      props.setShowMobileMenu(!props.showMobileMenu)
    }, 100)
  }, [props])

  // Delay show comeponent to enable animation to play out
  useEffect(() => {
    const timeoutId = setTimeout(() => setShowComponent(true), 100)
    return () => clearTimeout(timeoutId)
  }, [])

  // EventListener for resizing and click aways to close mobile menu
  useEffect(() => {
    const mobileMenuClickaway = document?.querySelector(
      "#mobile-menu-clickaway"
    )

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    const handleClick = (event: MouseEvent) => {
      if (event.target !== mobileMenuClickaway) return
      closeMobileMenu()
    }
    window.addEventListener("resize", handleResize)
    window.addEventListener("click", (event) => handleClick(event))

    return () => {
      window.removeEventListener("resize", handleResize)
      window.addEventListener("click", handleClick)
    }
  }, [closeMobileMenu])

  if (windowWidth >= 768) {
    props.setShowMobileMenu(false)
    return <div></div>
  }

  return (
    <div>
      <div
        id="mobile-menu-clickaway"
        className={`fixed right-0 z-20 h-[100svh] w-full bg-zinc-900 bg-opacity-25 backdrop-blur-sm  transition sm:top-[5rem] ${
          showComponent ? "visible" : "hidden"
        }`}></div>
      <div
        className={`h1 fixed right-0 z-50 h-[100svh] w-[50%] border-l-[0.5px] border-slate-600 bg-zinc-900 transition  md:hidden ${
          showComponent ? "" : "translate-x-[100%]"
        }`}>
        <div className="flex h-12 justify-end px-4">
          <button
            className=" transition hover:scale-110"
            onClick={closeMobileMenu}>
            <AiOutlineClose size={28} />
          </button>
        </div>
        <MobileMenuContent setShowComponent={setShowComponent} />
      </div>
    </div>
  )
}

export default MobileMenu

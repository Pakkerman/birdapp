import { SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import useUserDetails from "../hooks/useUserDetails"

import Link from "next/link"
import { FaHashtag, FaInfo } from "react-icons/fa"
import { BiLogOutCircle } from "react-icons/bi"
import BirdAppIcon from "./BirdAppIcon"

const MobileMenuProfile = (props: {
  setShowComponent: (show: boolean) => void
}) => {
  const { fullName, username, isSignedIn } = useUserDetails()

  const handleClick = () => {
    props.setShowComponent(false)
  }

  return (
    <div>
      {isSignedIn && (
        <div>
          <div className="flex items-center justify-start space-x-2">
            <div className="flex w-12 justify-center">
              <UserButton />
            </div>
            <div className="my-4 flex flex-col">
              <div className="text-md truncate text-clip">{fullName}</div>
              <div className="text-sm text-slate-500">{`@${username}`}</div>
            </div>
          </div>
          <SignOutButton>
            <div
              className="flex items-center space-x-2 hover:cursor-pointer hover:text-violet-400"
              onClick={handleClick}>
              <div className="flex w-12 justify-center ">
                <BiLogOutCircle size={36} />
              </div>
              <div className="">
                <div className="">Sign Out</div>
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
    <section className=" flex flex-col space-y-6">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div className="flex w-12 justify-center">
            <BirdAppIcon size={42} />
          </div>
          <p className="text-xl">Bird App</p>
        </div>
      </Link>
      <div className="flex flex-col space-y-4">
        <div className=" flex items-center space-x-2">
          <div className=" flex w-12 justify-center">
            <FaHashtag size={36} />
          </div>
          <p className="text-xl">Emojis Only!</p>
        </div>
      </div>
      <Link href="/about">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="  flex w-12 justify-center">
              <FaInfo size={36} />
            </div>
            <p className="text-xl">About</p>
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
        <div className="flex h-12 justify-end p-4">
          <button
            className="transition hover:scale-110"
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

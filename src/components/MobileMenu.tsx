import { UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"

const MobileMenuContent = () => {
  const { user } = useUser()

  if (!user) return <div></div>

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
  const username = fullName === " " ? user.username : fullName

  return (
    <div className="mx-4 flex flex-col justify-end ">
      <div className="py-2">
        <UserButton />
      </div>
      <div className=" text-md truncate text-clip">{username}</div>
      <div className="text-sm  text-slate-500">{`@${user.username ?? ""}`}</div>
    </div>
  )
}

const MobileMenu = (props: {
  showMobileMenu: boolean
  setShowMobileMenu: (showMobileMenu: boolean) => void
}) => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [showComponent, setShowComponent] = useState(false)

  const closeMobileMenu = () => {
    setShowComponent(false)
    setTimeout(() => {
      props.setShowMobileMenu(!props.showMobileMenu)
    }, 100)
  }

  // delay show comeponent to enable animation to playout
  useEffect(() => {
    const timeoutId = setTimeout(() => setShowComponent(true), 100)
    return () => clearTimeout(timeoutId)
  }, [])

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
  }, [])

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
        <MobileMenuContent />
      </div>
    </div>
  )
}

export default MobileMenu

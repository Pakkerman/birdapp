import { useAutoAnimate } from "@formkit/auto-animate/react"
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai"
import { GiChicken } from "react-icons/gi"

const Navbar = (props: {
  showMobileMenu: boolean
  title: string
  setShowMobileMenu: (currentShowState: boolean) => void
}) => {
  const { showMobileMenu, setShowMobileMenu, title } = props
  const [animationParent] = useAutoAnimate()

  return (
    <div className="flex h-[inherit] items-center justify-between border-b border-slate-600 bg-zinc-900 bg-opacity-60 px-4 backdrop-blur-sm">
      <div className=" flex items-center space-x-3 ">
        <div className="text-violet-400 sm:hidden">
          <GiChicken size={28} />
        </div>
        <div className=" text-xl font-semibold sm:text-2xl">
          {title ?? "Home"}
        </div>
      </div>
      <div className=" flex items-center md:hidden">
        <button
          className="transition hover:scale-110"
          ref={animationParent}
          onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? (
            <AiOutlineClose size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </button>
      </div>
    </div>
  )
}

export default Navbar

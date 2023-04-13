import { useAutoAnimate } from "@formkit/auto-animate/react"
import { AiOutlineMenu } from "react-icons/ai"
import { GiChicken } from "react-icons/gi"

const Navbar = (props: {
  navbarTitle: string
  showMobileMenu?: boolean
  setShowMobileMenu?: (show: boolean) => void
}) => {
  const { showMobileMenu, setShowMobileMenu } = props
  const [animationParent] = useAutoAnimate()

  return (
    <div className="custom-backdrop flex h-[inherit] items-center justify-between border-b  border-slate-600 px-4">
      <div className=" flex items-center space-x-3 ">
        <div className="text-violet-400 sm:hidden">
          <GiChicken size={28} />
        </div>
        <div className=" text-xl font-semibold sm:text-2xl ">
          {props.navbarTitle}
        </div>
      </div>
      <div className=" flex items-center md:hidden">
        <button
          className="transition hover:scale-110"
          ref={animationParent}
          onClick={() => {
            if (setShowMobileMenu) setShowMobileMenu(!showMobileMenu)
          }}>
          <AiOutlineMenu size={24} />
        </button>
      </div>
    </div>
  )
}

export default Navbar

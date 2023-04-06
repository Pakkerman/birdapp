const MobileMenu = (props: { show: boolean }) => {
  return (
    <div>
      <div
        className={`h-full w-full fixed top-[3.5rem] backdrop-blur-sm transition bg-zinc-900 bg-opacity-25  right-0 z-20 ${
          props.show ? "visible" : "hidden"
        }`}></div>
      <div
        className={` h1 fixed top-[3.5rem] right-0 h-[100svh] z-30 w-[50%] transition sm:top-[5rem] md:hidden ${
          props.show ? "" : "translate-x-[100%]"
        }`}>
        Toggle Menu
      </div>
    </div>
  )
}

export default MobileMenu

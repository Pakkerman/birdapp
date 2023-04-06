const MobileMenu = (props: { show: boolean }) => {
  return (
    <div
      className={`preview h1 fixed top-[3.5rem] right-0 h-[100svh] w-[50%] transition sm:top-[5rem] md:hidden ${
        props.show ? "" : "translate-x-[100%]"
      }`}>
      Toggle Menu
    </div>
  )
}

export default MobileMenu

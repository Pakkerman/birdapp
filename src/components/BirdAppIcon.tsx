import Link from "next/link"
import { GiChicken } from "react-icons/gi"

const BirdAppIcon = (props: { size: number }) => {
  return (
    <Link href="/">
      <div className="flex items-center space-x-2">
        <div className="flex w-16 justify-center text-violet-400 lg:w-10">
          <GiChicken size={props.size} />
        </div>
        <h1 className="custom-gradient hidden text-xl lg:block">Bird App</h1>
      </div>
    </Link>
  )
}
export default BirdAppIcon

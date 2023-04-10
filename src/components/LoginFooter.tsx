import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { GiChicken } from "react-icons/gi"

const LoginFooter = () => {
  return (
    <div className="">
      <div className=" custom-backdrop fixed bottom-0 left-0 z-50 flex  h-20 w-full items-center justify-center  space-x-4 border-t-[0.5px] border-slate-500">
        <div className="flex items-center space-x-2 ">
          <p>Welcome to</p>
          <div className="text-violet-400">
            <GiChicken size={24} />
          </div>
        </div>
        <div className="w-18 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400">
          <SignUpButton />
        </div>
        <p>or</p>
        <div className="w-18 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400">
          <SignInButton />
        </div>
        <p>to post!</p>
      </div>
    </div>
  )
}

export default LoginFooter

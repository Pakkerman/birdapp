import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { GiChicken } from "react-icons/gi"

const LoginFooter = () => {
  return (
    <section className="custom-backdrop fixed bottom-0 left-0 z-50 h-28 w-full border-[0.5px] border-slate-500 sm:h-20 sm:border-0 sm:border-t-[0.5px]">
      <div className="flex h-full flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <p>Welcome to</p>
          <div className="text-violet-400">
            <GiChicken size={24} />
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-18 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400">
            <SignUpButton />
          </div>
          <p>or</p>
          <div className="w-18 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400">
            <SignInButton />
          </div>
        </div>
        <p className="hidden sm:block">to post!</p>
      </div>
    </section>
  )
}

export default LoginFooter

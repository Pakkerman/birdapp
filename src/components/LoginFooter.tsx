import { SignInButton, SignUpButton } from "@clerk/nextjs"
import React from "react"

const LoginFooter = () => {
  return (
    <div className="">
      <div className=" custom-backdrop fixed bottom-0 left-0 z-50 flex  h-16 w-full items-center justify-center  space-x-16">
        <div className="w-18 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400">
          <SignUpButton />
        </div>
        <div className="w-18 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400">
          <SignInButton />
        </div>
      </div>
    </div>
  )
}

export default LoginFooter

import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs"

import { type NextPage } from "next"
import Image from "next/image"

import { api } from "~/utils/api"

import { useState } from "react"
import { PageLayout } from "~/components/layout"
import { LoadingPage, LoadingSpinner } from "~/components/loading"
import PostView from "~/components/PostView"
import toast from "react-hot-toast"

const CreatPostWizard = () => {
  const { user } = useUser()

  const [input, setInput] = useState<string>("")

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      // trash the previous fetched cache and get new one
      void ctx.posts.getAll.invalidate()
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content
      console.log("errorMessage", errorMessage)
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! Please try again later!")
      }
    },
  })

  if (!user) return null

  return (
    <div className="flex w-full gap-3 ">
      <Image
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt="profile picture"
        width={56}
        height={56}
      />
      <input
        placeholder="Say something in emoji!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={isPosting}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return
          if (input === "") return
          event.preventDefault()
          mutate({ content: input })
        }}
      />

      {input !== "" && !isPosting && (
        <button
          className=" self-center rounded-md border-2 border-slate-400 p-2"
          onClick={() => mutate({ content: input })}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={30} />
        </div>
      )}
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>somehting went wrong</div>

  return (
    <div className="flex flex-col">
      {data.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  // start fetch asap, and the result will be cache by react query
  api.posts.getAll.useQuery()

  // Return empty div if user isn't loaded
  if (!userLoaded) return <div />

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatPostWizard />}
      </div>
      <Feed />
    </PageLayout>
  )
}

export default Home

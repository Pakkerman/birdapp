import { useUser } from "@clerk/nextjs"

import { type NextPage } from "next"
import Image from "next/image"

import { api } from "~/utils/api"

// react
import { useEffect, useState } from "react"
import { PageLayout } from "~/components/layout"
import { LoadingPage, LoadingSpinner } from "~/components/loading"
import LoginFooter from "~/components/LoginFooter"
import PostView from "~/components/PostView"
import toast from "react-hot-toast"

// Libraries
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react"
import { MdOutlineEmojiEmotions } from "react-icons/md"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import useUserDetails from "~/hooks/useUserDetails"

const CreatPostWizard = () => {
  const { user } = useUser()
  const { fullName, username } = useUserDetails()

  const [input, setInput] = useState<string>("")
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState<boolean>(false)

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onMutate: async ({ content }) => {
      await ctx.posts.getAll.cancel()
      const prevData = ctx.posts.getAll.getData()

      ctx.posts.getAll.setData(undefined, (old) => {
        const newPostMock = {
          post: {
            id: Math.random().toString(),
            likeCount: 0,
            viewCount: 0,
            likedUsers: [],
            content: content,
            authorId: user?.id ?? "",
            createdAt: new Date(),
          },
          author: {
            id: "",
            authorName: fullName ?? "",
            username: username ?? "",
            profileImageUrl: user?.profileImageUrl ?? "",
          },
        }

        if (!old) return [newPostMock]

        return [newPostMock, ...old]
      })

      return { prevData }
    },

    onError: (error, _, context) => {
      ctx.posts.getAll.setData(undefined, context?.prevData)
      const errorMessage = error.data?.zodError?.fieldErrors.content
      console.log("errorMessage", errorMessage)
      if (errorMessage && errorMessage[0]) {
        toast.dismiss("createPostWizardError")
        toast.error(errorMessage[0], { id: "createPostWizardError" })
      } else {
        toast.dismiss("createPostWizardError")
        toast.error(error.message, { id: "createPostWizardError" })
      }
    },

    onSettled: (_, error) => {
      void ctx.posts.getAll.invalidate()

      if (error) return
      toast.success("Posted!")
      // setInput("")
    },
  })

  // click away to close the emoji picker
  useEffect(() => {
    const emojiClickAway = document.querySelector("#emoji-click-away")
    const handleClick = () => setShowEmojiKeyboard(false)

    emojiClickAway?.addEventListener("click", handleClick)

    return () => {
      emojiClickAway?.removeEventListener("click", handleClick)
    }
  }, [showEmojiKeyboard])

  if (!user) return null

  return (
    <div className="flex space-x-4">
      <Image
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt="profile picture"
        width={56}
        height={56}
      />
      <div className="flex w-full flex-col">
        <input
          placeholder="Say something in emoji!"
          className=" h-[56px] bg-transparent text-xl outline-none"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value.replaceAll(" ", ""))}
          disabled={isPosting}
          onKeyDown={(event) => {
            setShowEmojiKeyboard(false)
            if (event.key !== "Enter") return
            if (input === "") return
            event.preventDefault()
            mutate({ content: input })
          }}
        />
        <div className="my-4 border-[0.5px] border-b border-slate-800" />
        <div className="relative mx-2 flex justify-between">
          <button
            onClick={() => {
              setShowEmojiKeyboard(!showEmojiKeyboard)
            }}>
            <div
              className={`rounded-full text-violet-400 transition-colors hover:bg-violet-800 hover:text-violet-400 ${
                showEmojiKeyboard ? "bg-violet-700" : "bg-none"
              }`}>
              <MdOutlineEmojiEmotions size={30} />
            </div>
          </button>

          <button
            className="w-18 z-50 flex flex-[0_0_75px] items-center justify-center rounded-md bg-violet-600 p-2 text-slate-50 transition-colors disabled:bg-violet-800 disabled:text-slate-400"
            disabled={isPosting || input === ""}
            onClick={() => {
              setShowEmojiKeyboard(false)
              mutate({ content: input })
            }}>
            {isPosting ? (
              <div className="text-slate-50 ">
                <LoadingSpinner size={24} />
              </div>
            ) : (
              "Emote"
            )}
          </button>
        </div>
        {showEmojiKeyboard && (
          <div
            id="emoji-click-away"
            className="fixed left-0 top-0 z-10 h-screen w-screen"
          />
        )}
        <div
          className={`relative ${showEmojiKeyboard ? "visible" : "invisible"}`}>
          <div className="absolute left-[-50px] top-[-40px] z-20 scale-75 overflow-hidden rounded-xl border-2 border-violet-900 transition ">
            <EmojiPicker
              height={400}
              width={300}
              searchDisabled
              skinTonesDisabled
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.TWITTER}
              onEmojiClick={({ emoji }) => setInput(input + emoji)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const PostFeed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery()
  const [animationParent] = useAutoAnimate()

  if (isLoading) return <LoadingPage />
  if (!data) {
    return <div className="py-20 text-center">somehting went wrong</div>
  }

  return (
    <div className="flex flex-col" ref={animationParent}>
      {data.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser()
  // start fetch asap, and the result will be cache by react query
  api.posts.getAll.useQuery()
  //  TOFIX: query cannot be empty
  const { mutate, isLoading } = api.profile.generateUsername.useMutation({
    onSuccess: () => {
      console.log("username updated")
    },
    onError: () => {
      console.log("fail to update username")
    },
  })

  // Return empty div if user isn't loaded
  if (!userLoaded) return <div />

  if (user?.username === null) {
    if (!isLoading) mutate({ userId: user.id })
  }

  return (
    <>
      <div className="flex w-screen justify-center">
        <PageLayout navbarTitle="Home">
          {!isSignedIn && <LoginFooter />}
          {isSignedIn && (
            <div className="border-b border-slate-600 p-4">
              <CreatPostWizard />
            </div>
          )}
          <PostFeed />
        </PageLayout>
      </div>
    </>
  )
}

export default Home

import Link from "next/link"
import Image from "next/image"

import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { IoIosStats } from "react-icons/io"
import { LoadingSpinner } from "./loading"
import type { Prisma } from "@prisma/client"
import { useState } from "react"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale("en", {
  relativeTime: {
    past: "%s",
    s: "just now",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1Y",
    yy: "%dY",
  },
})

// timecode 49:15
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
// a component that will display the full post with all the data including author info that is
// fetched from the server

const DeletePostWizard = (props: { postId: string; authorId: string }) => {
  const { isSignedIn, user } = useUser()
  if (!isSignedIn) return <div></div>

  const ctx = api.useContext()

  if (!user || user.id != props.authorId) return <div></div>

  const { mutate, isLoading } = api.posts.deletePostById.useMutation({
    onSuccess: () => {
      toast.success("Post deleted!")
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

  return (
    <div
      className="cursor-pointer text-slate-600 transition-colors duration-200 hover:text-red-400 active:text-slate-600 "
      onClick={() => mutate({ postId: props.postId })}>
      {isLoading ? <LoadingSpinner size={24} /> : <AiOutlineClose size={24} />}
    </div>
  )
}

const PostActions = (props: {
  username: string
  postId: string
  likeCount: number
  viewCount: number
  liked: boolean
}) => {
  const { likeCount, viewCount, postId, username } = props
  const ctx = api.useContext()
  const { mutate } = api.posts.likePost.useMutation({
    onSuccess: () => {
      toast.success("Liked emote!")
      void ctx.posts.getAll.invalidate()
    },

    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content
      console.log("errorMessage", errorMessage)
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to like! Please try again later!")
      }
      toast.error("Failed to like! Please try again later!")
    },
  })

  return (
    <div className=" mt-2 flex space-x-8 text-slate-400">
      <div className="flex cursor-pointer items-center space-x-1">
        <button onClick={() => mutate({ postId, username })}>
          <AiOutlineHeart size={24} />
        </button>
        <div>{likeCount}</div>
      </div>
      <div className="flex cursor-pointer space-x-1">
        <IoIosStats size={24} />
        <div>{viewCount}</div>
      </div>
    </div>
  )
}

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  // const [liked, setLiked] = useState(false)
  // const { user, isSignedIn } = useUser()

  // if (post.likedUsers && post.likedUsers?.includes(user.username))
  // if (isSignedIn && post?.likedUsers?.includes(user.username))

  return (
    <div className="flex space-x-4 border-b border-slate-600 p-4" key={post.id}>
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="h-[56px] w-[56px] rounded-full"
        width={56}
        height={56}
      />
      <div className="flex w-full flex-col">
        <div className="mb-1 flex items-center justify-between gap-1 text-slate-300">
          <div>
            <Link href={`/@${author.username}`}>
              <span className="">{`${
                author.authorName ?? author.username
              }`}</span>{" "}
              <span className="text-slate-500">{`@${author.username}`}</span>
            </Link>
            <span className="font-thin text-slate-500">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </div>
          <div>
            <DeletePostWizard postId={post.id} authorId={author.id} />
          </div>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="text-xl">{post.content}</span>
        </Link>
        <PostActions
          username={author.username}
          postId={post.id}
          liked={false}
          likeCount={post.likeCount ?? 0}
          viewCount={post.viewCount ?? 0}
        />
      </div>
    </div>
  )
}

export default PostView

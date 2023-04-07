import Link from "next/link"
import Image from "next/image"

import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"

import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { IoIosStats } from "react-icons/io"

import { LoadingSpinner } from "./loading"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { getRelativeTime } from "~/utils/getRelativeTime"
import { useQueryClient } from "@tanstack/react-query"

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
  currentUser: string | null
  postId: string
  likeCount: number
  viewCount: number
  likedUsers: string[]
}) => {
  const { likeCount, viewCount, postId, currentUser, likedUsers } = props
  const ctx = api.useContext()
  const [autoAnimateparent] = useAutoAnimate()
  const queryClient = useQueryClient()

  let liked = false
  if (currentUser) {
    liked = likedUsers.includes(currentUser)
  }

  const { mutate } = api.posts.likePost.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate()
      const message = liked ? "Unlike emote!" : "Like Emote"
      toast.success(message)
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.content
      console.log("errorMessage", errorMessage)
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
      } else {
        toast.error("Action failed! Please try again later!")
      }
      toast.error("Action Failed! Please try again later!")
    },
  })

  return (
    <div className="mt-2 flex space-x-8  text-slate-400">
      <div
        ref={autoAnimateparent}
        className={`flex cursor-pointer items-center space-x-1 ${
          liked && "text-red-400"
        }`}>
        <button
          onClick={() => {
            if (!currentUser) return
            mutate({ postId, currentUser })
          }}>
          <div>
            {liked ? (
              <div className="transition hover:scale-110">
                <AiFillHeart size={24} />
              </div>
            ) : (
              <div className="transition hover:scale-110 hover:text-red-400">
                <AiOutlineHeart size={24} />
              </div>
            )}
          </div>
        </button>
        <div className="w-2 text-center font-thin">{likeCount}</div>
      </div>
      <div
        className={`flex cursor-pointer space-x-1 ${
          viewCount !== 0 && "text-violet-400"
        }`}>
        <IoIosStats size={24} />
        <div className="w-2 text-center font-thin">{viewCount}</div>
      </div>
    </div>
  )
}

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  const { user } = useUser()
  const { mutate } = api.posts.incrementViewCount.useMutation()

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
            <span className="font-thin text-slate-500">{` · ${getRelativeTime(
              post.createdAt
            )}`}</span>
          </div>
          <div>
            <DeletePostWizard postId={post.id} authorId={author.id} />
          </div>
        </div>
        <Link
          href={`/post/${post.id}`}
          onClick={() => mutate({ postId: post.id })}>
          <span className="text-xl">{post.content}</span>
        </Link>
        <PostActions
          currentUser={user?.username ?? null}
          postId={post.id}
          likedUsers={post.likedUsers as string[]}
          likeCount={post.likeCount ?? 0}
          viewCount={post.viewCount ?? 0}
        />
      </div>
    </div>
  )
}

export default PostView

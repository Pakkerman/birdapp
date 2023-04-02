import Link from "next/link"
import Image from "next/image"

import { api, RouterOutputs } from "~/utils/api"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { AiOutlineClose } from "react-icons/ai"
import toast from "react-hot-toast"
import { useUser } from "@clerk/nextjs"

dayjs.extend(relativeTime)

// timecode 49:15
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
// a component that will display the full post with all the data including author info that is
// fetched from the server

const DeletePostWizard = (props: { postId: string; authorId: string }) => {
  const { isSignedIn, user } = useUser()
  if (!isSignedIn) return <div></div>

  const ctx = api.useContext()

  if (!user || user.id != props.authorId) return <div></div>

  const { mutate } = api.posts.deletePostById.useMutation({
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
    <div onClick={() => mutate({ postId: props.postId })}>
      <AiOutlineClose />
    </div>
  )
}

const PostView = (props: PostWithUser) => {
  const { post, author } = props

  return (
    <div
      className=" flex space-x-3 border-b border-slate-600 p-4"
      key={post.id}>
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
              <span>{`${author.username}`}</span>{" "}
              <span className="text-slate-500">{`@${author.username}`}</span>
            </Link>
            <Link href={`/post/${post.id}`}>
              <span className="font-thin text-slate-500">{` · ${dayjs(
                post.createdAt
              ).fromNow()}`}</span>
            </Link>
          </div>
          <div>
            <DeletePostWizard postId={post.id} authorId={author.id} />
          </div>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  )
}

export default PostView

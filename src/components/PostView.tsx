import Link from "next/link"
import Image from "next/image"

import { RouterOutputs } from "~/utils/api"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

// timecode 49:15
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
// a component that will display the full post with all the data including author info that is
// fetched from the server

const PostView = (props: PostWithUser) => {
  const { post, author } = props

  return (
    <div className="flex space-x-3 border-b border-slate-400 p-4" key={post.id}>
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className=" rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300 ">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  )
}

export default PostView

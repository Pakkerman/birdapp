import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"

import { api } from "~/utils/api"
import type { RouterOutputs } from "~/utils/api"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"

dayjs.extend(relativeTime)

const CreatPostWizard = () => {
  const { user } = useUser()

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
      />
    </div>
  )
}

// timecode 49:15
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
// a component that will display the full post with all the data including author info that is
// fetched from the server
const PostView = (props: PostWithUser) => {
  const { post, author } = props

  return (
    <div className="flex border-b border-slate-400 p-4" key={post.id}>
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className=" rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{` · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const user = useUser()
  const { data, isLoading } = api.posts.getAll.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Something Went Wrong</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex  border-b border-slate-400 p-4">
            <div className="flex justify-center">
              {!user.isSignedIn && <SignInButton />}
            </div>
            {!!user.isSignedIn && <CreatPostWizard />}
          </div>
          <div className="flex flex-col">
            {data.map((fullpost) => (
              <PostView {...fullpost} key={fullpost.post.id} />
            ))}
          </div>
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  )
}

export default Home

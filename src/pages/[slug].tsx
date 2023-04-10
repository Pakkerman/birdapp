import type { GetStaticProps, NextPage } from "next"
import Image from "next/image"
import Head from "next/head"

import { api } from "~/utils/api"
import { generateSSGHelper } from "~/server/helpers/ssgHelper"

import { PageLayout } from "~/components/layout"
import PostView from "~/components/PostView"
import { LoadingSpinner } from "~/components/loading"

import { AiOutlineArrowLeft } from "react-icons/ai"
import usePosts from "~/hooks/usePosts"
import Link from "next/link"

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = usePosts(props.userId)

  if (isLoading)
    return (
      <div className="flex w-full justify-center py-12">
        <LoadingSpinner size={64} />
      </div>
    )
  if (!data || data.length === 0)
    return <div className="text-xl">There is no post here!</div>

  return (
    <div className="flex flex-col">
      {data.map((fullpost) => (
        <PostView key={fullpost.post.id} {...fullpost} />
      ))}
    </div>
  )
}

const LocalNavbar = (props: { username: string; userId: string }) => {
  const { data, isLoading } = usePosts(props.userId)
  const { username } = props

  return (
    <div className="flex h-20 items-center p-3">
      <Link href="/">
        <AiOutlineArrowLeft size={24} />
      </Link>
      <div>
        <div className="pl-4 text-2xl font-semibold">{username}</div>
        <div className="text-md pl-4 font-semibold text-slate-500">
          {isLoading ? 0 : data?.length} Emotes
        </div>
      </div>
    </div>
  )
}

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  })

  if (!data)
    return (
      <div className="flex h-screen items-center justify-center text-4xl ">
        <p>404: Page not found</p>
      </div>
    )

  return (
    <>
      <Head>
        <title>{data.authorName}</title>
      </Head>
      <div className="flex w-screen justify-center">
        <PageLayout>
          <LocalNavbar username={username} userId={data.id} />

          <div className="relative h-36 bg-slate-600">
            <Image
              src={data.profileImageUrl}
              alt={`${data.username ?? ""}'s profile pic`}
              height={128}
              width={128}
              className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
            />
          </div>
          <div className="h-[64px]"></div>

          <div className="p-4">
            <div className="text-2xl font-bold ">{`${
              data.authorName ?? ""
            }`}</div>
            <div className="text-1xl font-bold text-slate-500">{`@${
              data.username ?? ""
            }`}</div>
          </div>
          <div className="w-full border-b border-slate-600"></div>
          <ProfileFeed userId={data.id} />
        </PageLayout>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const slug = context.params?.slug
  if (typeof slug !== "string") throw new Error("No slug")
  const username = slug.replace("@", "")

  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default ProfilePage

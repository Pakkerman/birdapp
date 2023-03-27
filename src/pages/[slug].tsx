import type { GetStaticProps, NextPage } from "next"
import Image from "next/image"

import Head from "next/head"
import { api } from "~/utils/api"

import { PageLayout } from "~/components/layout"
import PostView from "~/components/PostView"

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  })

  if (isLoading) return <LoadingSpinner />
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
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36  bg-slate-600">
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
          <div className=" text-2xl font-bold">{`${data.username ?? ""}`}</div>
          <div className="text-1xl font-bold text-slate-500">{`@${
            data.username ?? ""
          }`}</div>
        </div>
        <div className="w-full border-b border-slate-400"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  )
}
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { prisma } from "~/server/db"
import { appRouter } from "~/server/api/root"
import superjson from "superjson"
import { LoadingSpinner } from "~/components/loading"

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  })
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

import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"

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
      <main className="flex h-screen justify-center">
        <div>{data.username}</div>
      </main>
    </>
  )
}
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { prisma } from "~/server/db"
import { appRouter } from "~/server/api/root"
import superjson from "superjson"

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

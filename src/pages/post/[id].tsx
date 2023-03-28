import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"

import { api } from "~/utils/api"
import { generateSSGHelper } from "~/server/helpers/ssgHelper"
import PostView from "~/components/PostView"
import { PageLayout } from "~/components/layout"

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
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
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <main>
        <PageLayout>
          <PostView {...data} />
        </PageLayout>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id
  if (typeof id !== "string") throw new Error("No post id")

  await ssg.posts.getById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default SinglePostPage

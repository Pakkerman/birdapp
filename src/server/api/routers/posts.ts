import { clerkClient } from "@clerk/nextjs/server"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import Trpc from "~/pages/api/trpc/[trpc]"
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { filterUserForClient } from "~/server/helpers/filterUserForClients"
import type { Post, Prisma } from "@prisma/client"
import unknownUser from "/public/unknownUser.png"

// Create a new ratelimiter, that allows 10 requests per 10 secs

const addUserDataToPost = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient)

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId)

    // if (!author || !author.username)
    //   throw new TRPCError({
    //     code: "INTERNAL_SERVER_ERROR",
    //     message: "Author for post not found",
    //   })

    if (!author || !author.username)
      return {
        post,
        author: {
          id: "xxx",
          profileImageUrl: unknownUser,
          username: "unknown",
          authorName: "Unknown User",
        },
      }

    return { post, author: { ...author, username: author.username } }
  })
}

// ratelimiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
  analytics: true,
})

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    })

    return addUserDataToPost(posts)
  }),

  getPostsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: { authorId: input.userId },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPost)
    ),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({ where: { id: input.id } })

      if (!post) throw new TRPCError({ code: "NOT_FOUND" })

      return (await addUserDataToPost([post]))[0]
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("ONLY EMOJIS!").min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      // Handle ratelimit
      const { success } = await ratelimit.limit(authorId)
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
          likedUsers: [],
        },
      })

      return post
    }),

  deletePostById: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const postId = input.postId

      const deletePost = await ctx.prisma.post.delete({ where: { id: postId } })

      return deletePost
    }),

  likePost: privateProcedure
    .input(z.object({ postId: z.string(), currentUser: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const json = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
        select: { likedUsers: true },
      })

      let updateUserArray: Prisma.JsonArray = []

      if (
        json?.likedUsers &&
        typeof json?.likedUsers === "object" &&
        Array.isArray(json?.likedUsers)
      ) {
        updateUserArray = (
          json?.likedUsers.includes(input.currentUser)
            ? json.likedUsers.filter((name) => name != input.currentUser)
            : [...json?.likedUsers, input.currentUser]
        ) as Prisma.JsonArray
      }

      const post = await ctx.prisma.post.update({
        where: { id: input.postId },
        data: {
          likeCount: updateUserArray.length,
          likedUsers: updateUserArray,
        },
      })
      return post
    }),

  incrementViewCount: publicProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.update({
        where: { id: input.postId },
        data: {
          viewCount: { increment: 1 },
        },
      })
    }),
})

import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { filterUserForClient } from "~/server/helpers/filterUserForClients"

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      })

      if (!user)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        })

      return filterUserForClient(user)
    }),

  generateUsername: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const user = await clerkClient.users.getUser(input.userId)

      return clerkClient.users.updateUser(input.userId, {
        username: user.emailAddresses[0]?.emailAddress.split("@")[0],
      })
    }),
})

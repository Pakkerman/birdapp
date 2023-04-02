import { emailAddresses } from "@clerk/nextjs/dist/api"
import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc"
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
      console.log("getting user", user)
      return filterUserForClient(user)
    }),

  generateUsername: publicProcedure.query(async () => {
    const users = await clerkClient.users.getUserList()

    users.map(async (user) => {
      if (user.username === null) {
        console.log("updataing =>", user.emailAddresses)
        return clerkClient.users.updateUser(user.id, {
          username: user.emailAddresses[0]?.emailAddress.split("@")[0],
        })
      }
    })
  }),
})

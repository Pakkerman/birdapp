import type { User } from "@clerk/nextjs/dist/api"
export const filterUserForClient = (user: User) => {
  const username =
    user.username === null
      ? `${user.firstName ?? ""}${user.lastName ?? ""}`
      : user.username

  return {
    id: user.id,
    username: username,
    profileImageUrl: user.profileImageUrl,
  }
}

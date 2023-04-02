import type { User } from "@clerk/nextjs/dist/api"

export const filterUserForClient = (user: User) => {
  const authorName = `${user.firstName ?? ""} ${user.lastName ?? ""}`

  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    authorName: authorName == " " ? user.username : authorName,
  }
}

import { User } from "@clerk/nextjs/dist/api"
export const filterUserForClient = (user: User) => {
  console.log("ran filteruserforclient")
  let username = user.username
  if (username === null) username = user.firstName
  if (user.lastName != null) username = username + user.lastName

  return {
    id: user.id,
    username: username,
    profileImageUrl: user.profileImageUrl,
  }
}

import { useUser } from "@clerk/nextjs"

const useUserDetails = () => {
  const { user, isSignedIn } = useUser()

  if (!user || !user.username) {
    return { fullName: "loading", username: "loading" }
  }

  let fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
  if (fullName === " ") fullName = user.username

  return { fullName, username: user.username, isSignedIn }
}

export default useUserDetails

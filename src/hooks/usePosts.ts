import { api } from "~/utils/api"

const usePosts = (userId: string) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: userId,
  })

  return { data, isLoading }
}

export default usePosts

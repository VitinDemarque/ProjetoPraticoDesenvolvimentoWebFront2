import { useEffect } from 'react'
import { getUser } from '../services/storage'
import PostCard from '../components/PostCard'
import useProtectedPage from '../hooks/useProtectedPage'
import { useGlobalState } from '../context/GlobalState.jsx'

export default function Feed() {
  useProtectedPage()
  const currentUser = getUser()
  const { posts, loadPosts, loadingPosts } = useGlobalState()

  useEffect(() => {
    if (!posts || posts.length === 0) {
      loadPosts()
    }
  }, [loadPosts, posts])

  // Posts são atualizados automaticamente pelo contexto.

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
      </div>
      <div className="space-y-4">
        {loadingPosts && (
          <div className="text-center text-gray-600 bg-white border rounded-xl p-8 shadow-sm">
            Carregando posts...
          </div>
        )}
        {!loadingPosts && posts.length === 0 && (
          <div className="text-center text-gray-600 bg-white border rounded-xl p-8 shadow-sm">
            Nenhum post ainda. Use o botão "Novo Post" para criar.
          </div>
        )}
        {!loadingPosts && posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  )
}
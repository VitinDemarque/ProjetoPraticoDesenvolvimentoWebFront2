import { useEffect, useState } from 'react'
import { ensureSeedPosts, getPosts, getUser } from '../services/storage'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'

export default function Feed() {
  const currentUser = getUser()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const initial = ensureSeedPosts()
    setPosts(initial)
  }, [])

  const updatePostInState = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <Link
          to="/new"
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors shadow"
        >
          Novo Post
        </Link>
      </div>
      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center text-gray-600 bg-white border rounded-xl p-8 shadow-sm">
            Nenhum post ainda. Crie o primeiro!
          </div>
        )}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onChange={updatePostInState}
          />
        ))}
      </div>
    </div>
  )
}
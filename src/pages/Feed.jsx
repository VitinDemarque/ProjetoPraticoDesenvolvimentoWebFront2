import { useEffect, useState } from 'react'
import { getUser } from '../services/storage'
import PostCard from '../components/PostCard'
import useProtectedPage from '../hooks/useProtectedPage'
import { fetchPostsApi, createPostApi } from '../services/api'

export default function Feed() {
  useProtectedPage()
  const currentUser = getUser()
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const initial = await fetchPostsApi()
      if (mounted) setPosts(initial)
    })()
    return () => { mounted = false }
  }, [])

  const updatePostInState = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title || !content) {
      setError('Informe título e conteúdo.')
      return
    }
    try {
      setLoading(true)
      const newPost = await createPostApi({ title, content, author: currentUser.name || currentUser.email })
      setPosts((prev) => [newPost, ...prev])
      setTitle('')
      setContent('')
    } catch (err) {
      setError(err.message || 'Falha ao criar post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <form onSubmit={submit} className="mt-4 bg-white border rounded-xl p-4 shadow-sm space-y-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Título do post"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Escreva seu post aqui"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
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
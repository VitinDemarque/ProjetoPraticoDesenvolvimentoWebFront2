import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProtectedPage from '../hooks/useProtectedPage'
import { fetchPostByIdApi, addCommentApi } from '../services/api'
import { getUser } from '../services/storage'

export default function PostDetails() {
  useProtectedPage()
  const { id } = useParams()
  const currentUser = getUser()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchPostByIdApi(id)
        if (mounted) setPost(data)
      } catch (err) {
        setError(err.message || 'Falha ao carregar post')
      }
    })()
    return () => { mounted = false }
  }, [id])

  const onAddComment = async (e) => {
    e.preventDefault()
    setError('')
    if (!comment.trim()) {
      setError('Digite um comentário.')
      return
    }
    try {
      setLoading(true)
      const updated = await addCommentApi({ postId: id, author: currentUser.name || currentUser.email, content: comment.trim() })
      setPost(updated)
      setComment('')
    } catch (err) {
      setError(err.message || 'Não foi possível adicionar o comentário')
    } finally {
      setLoading(false)
    }
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Detalhes do Post</h1>
          {error ? (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          ) : (
            <p className="mt-2 text-gray-600 text-sm">Carregando...</p>
          )}
          <div className="mt-4">
            <Link to="/feed" className="text-blue-600 hover:underline">Voltar ao Feed</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <article className="bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-1 text-sm text-gray-600">por {post.author}</p>
        <p className="mt-4 text-gray-800 whitespace-pre-line">{post.content}</p>
        <div className="mt-4 text-sm text-gray-600">Curtidas: {post.likes} • Não curtidas: {post.dislikes}</div>
      </article>

      <section className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Comentários</h2>
        <form onSubmit={onAddComment} className="mt-4 space-y-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Escreva um comentário"
          />
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            post.comments.map((c) => (
              <div key={c.id} className="border rounded-md p-3">
                <div className="text-sm text-gray-600">{c.author}</div>
                <div className="mt-1 text-gray-800 whitespace-pre-line">{c.content}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-600">Sem comentários ainda.</div>
          )}
        </div>
      </section>

      <div className="mt-4">
        <Link to="/feed" className="text-blue-600 hover:underline">Voltar ao Feed</Link>
      </div>
    </div>
  )
}
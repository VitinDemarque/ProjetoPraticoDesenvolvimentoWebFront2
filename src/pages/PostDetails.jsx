import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProtectedPage from '../hooks/useProtectedPage'
import { getUser } from '../services/storage'
import { useGlobalState } from '../context/GlobalState.jsx'
import useForm from '../hooks/useForm'

export default function PostDetails() {
  useProtectedPage()
  const { id } = useParams()
  const currentUser = getUser()
  const { values, errors, handleChange, handleSubmit, submitting, setErrors, reset } = useForm({
    initialValues: { comment: '' },
    validate: (v) => {
      const e = {}
      if (!v.comment?.trim()) e.comment = 'Digite um comentário.'
      return e
    },
    onSubmit: async (v) => {
      try {
        await addComment({ postId: id, author: currentUser.name || currentUser.email, content: v.comment.trim() })
        reset()
      } catch (err) {
        setErrors((prev) => ({ ...prev, form: err?.message || 'Não foi possível adicionar o comentário' }))
      }
    },
  })
  const { currentPost, loadPostById, addComment, loadingPost, addingComment } = useGlobalState()

  useEffect(() => {
    ;(async () => {
      try {
        if (!currentPost || String(currentPost.id) !== String(id)) {
          await loadPostById(id)
        }
      } catch (err) {
        setError(err.message || 'Falha ao carregar post')
      }
    })()
  }, [id, loadPostById, currentPost])

  const onAddComment = handleSubmit

  if (!currentPost) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Detalhes do Post</h1>
          {error ? (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          ) : (
            <p className="mt-2 text-gray-600 text-sm">{loadingPost ? 'Carregando...' : 'Post não encontrado.'}</p>
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
        <h1 className="text-2xl font-bold text-gray-900">{currentPost.title}</h1>
        <p className="mt-1 text-sm text-gray-600">por {currentPost.author}</p>
        <p className="mt-4 text-gray-800 whitespace-pre-line">{currentPost.content}</p>
        <div className="mt-4 text-sm text-gray-600">Curtidas: {currentPost.likes} • Não curtidas: {currentPost.dislikes}</div>
      </article>

      <section className="mt-6 bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Comentários</h2>
        <form onSubmit={onAddComment} className="mt-4 space-y-3">
          {(errors.form) && <div className="text-sm text-red-600">{errors.form}</div>}
          <textarea
            name="comment"
            value={values.comment}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Escreva um comentário"
          />
          {errors.comment && <div className="text-xs text-red-600">{errors.comment}</div>}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={addingComment || submitting}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {addingComment || submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {Array.isArray(currentPost.comments) && currentPost.comments.length > 0 ? (
            currentPost.comments.map((c) => (
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
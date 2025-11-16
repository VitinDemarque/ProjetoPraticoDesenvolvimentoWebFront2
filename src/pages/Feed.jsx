import { useEffect } from 'react'
import { getUser } from '../services/storage'
import PostCard from '../components/PostCard'
import useProtectedPage from '../hooks/useProtectedPage'
import { useGlobalState } from '../context/GlobalState.jsx'
import useForm from '../hooks/useForm'

export default function Feed() {
  useProtectedPage()
  const currentUser = getUser()
  const { posts, loadPosts, createPost, creatingPost, loadingPosts } = useGlobalState()
  const { values, errors, handleChange, handleSubmit, submitting, reset } = useForm({
    initialValues: { title: '', content: '' },
    validate: (v) => {
      const e = {}
      if (!v.title) e.title = 'Informe o título'
      if (!v.content) e.content = 'Informe o conteúdo'
      return e
    },
    onSubmit: async (v) => {
      await createPost({ title: v.title, content: v.content, author: currentUser.name || currentUser.email })
      reset()
    },
  })

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Posts são atualizados automaticamente pelo contexto.

  const submit = handleSubmit

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <form onSubmit={submit} className="mt-4 bg-white border rounded-xl p-4 shadow-sm space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Título do post"
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
            <textarea
              name="content"
              value={values.content}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Escreva seu post aqui"
            />
            {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content}</p>}
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="submit"
              disabled={creatingPost || submitting}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {creatingPost || submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {loadingPosts && (
          <div className="text-center text-gray-600 bg-white border rounded-xl p-8 shadow-sm">
            Carregando posts...
          </div>
        )}
        {!loadingPosts && posts.length === 0 && (
          <div className="text-center text-gray-600 bg-white border rounded-xl p-8 shadow-sm">
            Nenhum post ainda. Crie o primeiro!
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
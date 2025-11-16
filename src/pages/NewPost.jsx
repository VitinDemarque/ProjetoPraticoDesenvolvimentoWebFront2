import { useNavigate } from 'react-router-dom'
import { getUser } from '../services/storage'
import { useGlobalState } from '../context/GlobalState.jsx'
import useForm from '../hooks/useForm'

export default function NewPost() {
  const navigate = useNavigate()
  const user = getUser()
  const { createPost, creatingPost } = useGlobalState()
  const { values, errors, handleChange, handleSubmit, submitting } = useForm({
    initialValues: { title: '', content: '' },
    validate: (v) => {
      const e = {}
      if (!v.title) e.title = 'Informe o título'
      if (!v.content) e.content = 'Informe o conteúdo'
      return e
    },
    onSubmit: async (v) => {
      await createPost({ title: v.title, content: v.content, author: user.name || user.email })
      navigate('/feed')
    },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Post</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Dê um título bacana ao seu post"
          />
          {errors.title && <div className="text-xs text-red-600">{errors.title}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
          <textarea
            name="content"
            value={values.content}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Escreva seu post aqui..."
          />
          {errors.content && <div className="text-xs text-red-600">{errors.content}</div>}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={creatingPost || submitting}
            className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {creatingPost || submitting ? 'Publicando...' : 'Publicar'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md bg-gray-100 text-gray-800 px-4 py-2 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
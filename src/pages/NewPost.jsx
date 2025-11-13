import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addPost, getUser } from '../services/storage'

export default function NewPost() {
  const navigate = useNavigate()
  const user = getUser()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!title || !content) {
      setError('Informe título e conteúdo.')
      return
    }
    addPost({ title, content, author: user.name || user.email })
    navigate('/feed')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Post</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Dê um título bacana ao seu post"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Conteúdo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Escreva seu post aqui..."
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Publicar
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
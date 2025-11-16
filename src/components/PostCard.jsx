import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useGlobalState } from '../context/GlobalState.jsx'
import useForm from '../hooks/useForm'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function PostCard({ post, currentUser }) {
  const { toggleVote, updatePost, deletePost, updatingPost, deletingPost } = useGlobalState()
  const isAuthor = currentUser?.email && (post.author === currentUser.name || post.author === currentUser.email)
  const { values, errors, handleChange, handleSubmit, submitting, reset } = useForm({
    initialValues: { title: post.title, content: post.content },
    validate: (v) => {
      const e = {}
      if (!v.title) e.title = 'Informe o título'
      if (!v.content) e.content = 'Informe o conteúdo'
      return e
    },
    onSubmit: async (v) => {
      await updatePost({ postId: post.id, title: v.title, content: v.content })
      setEditing(false)
    },
  })
  const [editing, setEditing] = useState(false)
  const onLike = () => {
    toggleVote(post.id, currentUser.email, 'like')
  }

  const onDislike = () => {
    toggleVote(post.id, currentUser.email, 'dislike')
  }

  const [confirmOpen, setConfirmOpen] = useState(false)
  const onDelete = async () => {
    await deletePost({ postId: post.id })
  }

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
          <textarea
            name="content"
            value={values.content}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {errors.content && <p className="text-xs text-red-600">{errors.content}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { reset(); setEditing(false) }}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updatingPost || submitting}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {updatingPost || submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link to={`/post/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{post.content}</p>
        </>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">por {post.author}</span>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={onLike}
            className="px-3 py-1.5 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
            title="Curtir"
          >
            Curtir {post.likes}
          </button>
          <button
            onClick={onDislike}
            className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            title="Não curtir"
          >
            Não curtir {post.dislikes}
          </button>
          {isAuthor && !editing && (
            <>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="px-3 py-1.5 text-sm rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
                title="Mais opções"
                aria-haspopup="menu"
                aria-expanded={menuOpen ? 'true' : 'false'}
              >
                ...
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white border rounded-md shadow-lg z-10">
                  <button
                    onClick={() => { setMenuOpen(false); setEditing(true) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); setConfirmOpen(true) }}
                    disabled={deletingPost}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
                  >
                    {deletingPost ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Excluir post"
        message="Tem certeza que deseja excluir este post?"
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deletingPost}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => { await onDelete(); setConfirmOpen(false) }}
      />
    </article>
  )
}
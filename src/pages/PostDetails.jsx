import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useProtectedPage from '../hooks/useProtectedPage'
import { getUser } from '../services/storage'
import { useGlobalState } from '../context/GlobalState.jsx'
import useForm from '../hooks/useForm'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

function MoreMenu({ onEdit, onDelete, deleting }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 text-sm rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
        title="Mais opções"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
      >
        ...
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white border rounded-md shadow-lg z-10">
          <button
            onClick={() => { setOpen(false); onEdit?.() }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            Editar
          </button>
          <button
            onClick={async () => { setOpen(false); await onDelete?.() }}
            disabled={deleting}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-60"
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function PostDetails() {
  useProtectedPage()
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = getUser()
  const [error, setError] = useState('')
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
  const { currentPost, loadPostById, addComment, loadingPost, addingComment, updatePost, deletePost, updatingPost, deletingPost } = useGlobalState()

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

  const isAuthor = currentUser?.email && (currentPost?.author === currentUser.name || currentPost?.author === currentUser.email)
  const [editing, setEditing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const editForm = useForm({
    initialValues: { title: currentPost?.title || '', content: currentPost?.content || '' },
    validate: (v) => {
      const e = {}
      if (!v.title) e.title = 'Informe o título'
      if (!v.content) e.content = 'Informe o conteúdo'
      return e
    },
    onSubmit: async (v) => {
      await updatePost({ postId: currentPost.id, title: v.title, content: v.content })
      setEditing(false)
    },
  })

  useEffect(() => {
    if (currentPost) {
      editForm.setValue('title', currentPost.title)
      editForm.setValue('content', currentPost.content)
    }
  }, [currentPost])

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
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/feed')}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <span className="text-lg">←</span>
          Voltar
        </button>
        <h2 className="text-sm text-gray-600">Detalhes do Post</h2>
      </div>
      <article className="bg-white border rounded-xl p-6 shadow-sm">
        {editing ? (
          <form onSubmit={editForm.handleSubmit} className="space-y-3">
            <input
              type="text"
              name="title"
              value={editForm.values.title}
              onChange={editForm.handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {editForm.errors.title && <p className="text-xs text-red-600">{editForm.errors.title}</p>}
            <textarea
              name="content"
              value={editForm.values.content}
              onChange={editForm.handleChange}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {editForm.errors.content && <p className="text-xs text-red-600">{editForm.errors.content}</p>}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => { editForm.reset(); setEditing(false) }} className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cancelar</button>
              <button type="submit" disabled={updatingPost || editForm.submitting} className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{updatingPost || editForm.submitting ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{currentPost.title}</h1>
            <p className="mt-1 text-sm text-gray-600">por {currentPost.author}</p>
            <p className="mt-4 text-gray-800 whitespace-pre-line">{currentPost.content}</p>
            <div className="mt-4 text-sm text-gray-600">Curtidas: {currentPost.likes} • Não curtidas: {currentPost.dislikes}</div>
          </>
        )}
        {isAuthor && !editing && (
          <div className="mt-4 flex justify-end relative">
            <MoreMenu
              onEdit={() => setEditing(true)}
              onDelete={() => setConfirmOpen(true)}
              deleting={deletingPost}
            />
          </div>
        )}
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir post"
        message="Tem certeza que deseja excluir este post?"
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deletingPost}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => { await deletePost({ postId: currentPost.id }); setConfirmOpen(false); navigate('/feed') }}
      />

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
    </div>
  )
}
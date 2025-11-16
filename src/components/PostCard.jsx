import { toggleVote } from '../services/storage'
import { Link } from 'react-router-dom'

export default function PostCard({ post, currentUser, onChange }) {
  const onLike = () => {
    const updated = toggleVote(post.id, currentUser.email, 'like')
    onChange(updated)
  }

  const onDislike = () => {
    const updated = toggleVote(post.id, currentUser.email, 'dislike')
    onChange(updated)
  }

  return (
    <article className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">
        <Link to={`/post/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-gray-700 whitespace-pre-line">{post.content}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">por {post.author}</span>
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </article>
  )
}
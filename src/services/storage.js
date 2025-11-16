const USER_KEY = 'devforum_user'
const POSTS_KEY = 'devforum_posts'
const TOKEN_KEY = 'devforum_token'

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export function ensureSeedPosts() {
  const existing = getPosts()
  if (existing && existing.length > 0) return existing
  const seed = [
    {
      id: crypto.randomUUID(),
      author: 'devforum',
      title: 'Bem-vindo ao DevForum!',
      content: 'Crie seu primeiro post e interaja com curtidas e não curtidas.',
      likes: 1,
      dislikes: 0,
      likedBy: ['devforum@demo'],
      dislikedBy: [],
      comments: [
        {
          id: crypto.randomUUID(),
          author: 'devforum',
          content: 'Este é um comentário de exemplo. Use o formulário para adicionar o seu!',
          createdAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
    },
  ]
  savePosts(seed)
  return seed
}

export function addPost({ title, content, author }) {
  const posts = getPosts()
  const newPost = {
    id: crypto.randomUUID(),
    author,
    title,
    content,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    createdAt: Date.now(),
  }
  const updated = [newPost, ...posts]
  savePosts(updated)
  return newPost
}

export function getPostById(postId) {
  const posts = getPosts()
  return posts.find((p) => p.id === postId) || null
}

export function addComment(postId, { author, content }) {
  const posts = getPosts()
  const updated = posts.map((p) => {
    if (p.id !== postId) return p
    const comment = {
      id: crypto.randomUUID(),
      author,
      content,
      createdAt: Date.now(),
    }
    const comments = Array.isArray(p.comments) ? p.comments : []
    return { ...p, comments: [comment, ...comments] }
  })
  savePosts(updated)
  return updated.find((p) => p.id === postId)
}

export function toggleVote(postId, userId, type) {
  const posts = getPosts()
  const updated = posts.map((p) => {
    if (p.id !== postId) return p
    const isLike = type === 'like'
    const hasLiked = p.likedBy.includes(userId)
    const hasDisliked = p.dislikedBy.includes(userId)

    if (isLike) {
      // Remover dislike oposto
      if (hasDisliked) {
        p.dislikedBy = p.dislikedBy.filter((u) => u !== userId)
        p.dislikes = Math.max(0, p.dislikes - 1)
      }
      // Alternar like
      if (hasLiked) {
        p.likedBy = p.likedBy.filter((u) => u !== userId)
        p.likes = Math.max(0, p.likes - 1)
      } else {
        p.likedBy = [...p.likedBy, userId]
        p.likes = p.likes + 1
      }
    } else {
      // Remover like oposto
      if (hasLiked) {
        p.likedBy = p.likedBy.filter((u) => u !== userId)
        p.likes = Math.max(0, p.likes - 1)
      }
      // Alternar dislike
      if (hasDisliked) {
        p.dislikedBy = p.dislikedBy.filter((u) => u !== userId)
        p.dislikes = Math.max(0, p.dislikes - 1)
      } else {
        p.dislikedBy = [...p.dislikedBy, userId]
        p.dislikes = p.dislikes + 1
      }
    }
    return p
  })
  savePosts(updated)
  return updated.find((p) => p.id === postId)
}
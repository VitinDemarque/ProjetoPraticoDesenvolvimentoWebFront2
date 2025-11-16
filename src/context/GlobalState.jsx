import { createContext, useContext, useMemo, useState } from 'react'
import { fetchPostsApi, createPostApi, fetchPostByIdApi, addCommentApi } from '../services/api'
import { toggleVote as toggleVoteStorage } from '../services/storage'

const GlobalStateContext = createContext(null)

export function GlobalStateProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [creatingPost, setCreatingPost] = useState(false)
  const [addingComment, setAddingComment] = useState(false)

  async function loadPosts() {
    setLoadingPosts(true)
    try {
      const data = await fetchPostsApi()
      setPosts(data)
    } finally {
      setLoadingPosts(false)
    }
  }

  async function loadPostById(id) {
    setLoadingPost(true)
    try {
      const data = await fetchPostByIdApi(id)
      setCurrentPost(data)
    } finally {
      setLoadingPost(false)
    }
  }

  async function createPost({ title, content, author }) {
    setCreatingPost(true)
    try {
      const newPost = await createPostApi({ title, content, author })
      setPosts((prev) => [newPost, ...prev])
      return newPost
    } finally {
      setCreatingPost(false)
    }
  }

  async function addComment({ postId, author, content }) {
    setAddingComment(true)
    try {
      const updated = await addCommentApi({ postId, author, content })
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setCurrentPost((prev) => (prev && prev.id === updated.id ? updated : prev))
      return updated
    } finally {
      setAddingComment(false)
    }
  }

  function toggleVote(postId, userId, type) {
    const updated = toggleVoteStorage(postId, userId, type)
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setCurrentPost((prev) => (prev && prev.id === updated.id ? updated : prev))
    return updated
  }

  const value = useMemo(
    () => ({
      posts,
      currentPost,
      loadingPosts,
      loadingPost,
      creatingPost,
      addingComment,
      loadPosts,
      loadPostById,
      createPost,
      addComment,
      toggleVote,
    }),
    [posts, currentPost, loadingPosts, loadingPost, creatingPost, addingComment]
  )

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>
}

export function useGlobalState() {
  const ctx = useContext(GlobalStateContext)
  if (!ctx) throw new Error('useGlobalState deve ser usado dentro de GlobalStateProvider')
  return ctx
}
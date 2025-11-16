import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { fetchPostsApi, createPostApi, fetchPostByIdApi, addCommentApi, updatePostApi, deletePostApi } from '../services/api'
import { toggleVote as toggleVoteStorage } from '../services/storage'

const GlobalStateContext = createContext(null)

export function GlobalStateProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [creatingPost, setCreatingPost] = useState(false)
  const [addingComment, setAddingComment] = useState(false)
  const [updatingPost, setUpdatingPost] = useState(false)
  const [deletingPost, setDeletingPost] = useState(false)

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true)
    try {
      const data = await fetchPostsApi()
      setPosts(data)
    } finally {
      setLoadingPosts(false)
    }
  }, [])

  const loadPostById = useCallback(async (id) => {
    setLoadingPost(true)
    try {
      const data = await fetchPostByIdApi(id)
      setCurrentPost(data)
    } finally {
      setLoadingPost(false)
    }
  }, [])

  const createPost = useCallback(async ({ title, content, author }) => {
    setCreatingPost(true)
    try {
      const newPost = await createPostApi({ title, content, author })
      setPosts((prev) => [newPost, ...prev])
      return newPost
    } finally {
      setCreatingPost(false)
    }
  }, [])

  const addComment = useCallback(async ({ postId, author, content }) => {
    setAddingComment(true)
    try {
      const updated = await addCommentApi({ postId, author, content })
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setCurrentPost((prev) => (prev && prev.id === updated.id ? updated : prev))
      return updated
    } finally {
      setAddingComment(false)
    }
  }, [])

  const updatePost = useCallback(async ({ postId, title, content }) => {
    setUpdatingPost(true)
    try {
      const updated = await updatePostApi({ postId, title, content })
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setCurrentPost((prev) => (prev && prev.id === updated.id ? updated : prev))
      return updated
    } finally {
      setUpdatingPost(false)
    }
  }, [])

  const deletePost = useCallback(async ({ postId }) => {
    setDeletingPost(true)
    try {
      await deletePostApi({ postId })
      setPosts((prev) => prev.filter((p) => p.id !== postId))
      setCurrentPost((prev) => (prev && prev.id === postId ? null : prev))
      return true
    } finally {
      setDeletingPost(false)
    }
  }, [])

  const toggleVote = useCallback((postId, userId, type) => {
    const updated = toggleVoteStorage(postId, userId, type)
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setCurrentPost((prev) => (prev && prev.id === updated.id ? updated : prev))
    return updated
  }, [])

  const value = useMemo(
    () => ({
      posts,
      currentPost,
      loadingPosts,
      loadingPost,
      creatingPost,
      addingComment,
      updatingPost,
      deletingPost,
      loadPosts,
      loadPostById,
      createPost,
      addComment,
      toggleVote,
      updatePost,
      deletePost,
    }),
    [posts, currentPost, loadingPosts, loadingPost, creatingPost, addingComment, updatingPost, deletingPost]
  )

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>
}

export function useGlobalState() {
  const ctx = useContext(GlobalStateContext)
  if (!ctx) throw new Error('useGlobalState deve ser usado dentro de GlobalStateProvider')
  return ctx
}
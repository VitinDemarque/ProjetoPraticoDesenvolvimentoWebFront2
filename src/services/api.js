export async function loginApi({ email, password }) {
  // Mock simples: credenciais válidas se e-mail contém '@' e senha >= 6
  await new Promise((r) => setTimeout(r, 400))
  const valid = /.+@.+\..+/.test(email) && password && password.length >= 6
  if (!valid) {
    const error = new Error('Credenciais inválidas')
    error.status = 401
    throw error
  }
  // Token mockado e dados do usuário
  return {
    token: `devforum-token-${btoa(email).slice(0, 16)}`,
    user: { email, name: email.split('@')[0] },
  }
}

export async function signupApi({ name, email, password }) {
  // Mock de cadastro: valida campos e retorna token + usuário
  await new Promise((r) => setTimeout(r, 500))
  const valid = name && /.+@.+\..+/.test(email) && password && password.length >= 6
  if (!valid) {
    const error = new Error('Dados inválidos')
    error.status = 400
    throw error
  }
  return {
    token: `devforum-token-${btoa(email).slice(0, 16)}`,
    user: { email, name },
  }
}

// -------- Posts API (mock) --------
import { ensureSeedPosts, addPost, getPostById, addComment } from './storage'

export async function fetchPostsApi() {
  await new Promise((r) => setTimeout(r, 400))
  return ensureSeedPosts()
}

export async function createPostApi({ title, content, author }) {
  await new Promise((r) => setTimeout(r, 300))
  if (!title || !content || !author) {
    const error = new Error('Título, conteúdo e autor são obrigatórios')
    error.status = 400
    throw error
  }
  return addPost({ title, content, author })
}

export async function fetchPostByIdApi(id) {
  await new Promise((r) => setTimeout(r, 300))
  const post = getPostById(id)
  if (!post) {
    const error = new Error('Post não encontrado')
    error.status = 404
    throw error
  }
  return post
}

export async function addCommentApi({ postId, author, content }) {
  await new Promise((r) => setTimeout(r, 300))
  if (!postId || !author || !content) {
    const error = new Error('Post, autor e conteúdo são obrigatórios')
    error.status = 400
    throw error
  }
  return addComment(postId, { author, content })
}
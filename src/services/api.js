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
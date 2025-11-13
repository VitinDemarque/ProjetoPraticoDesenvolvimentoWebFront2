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
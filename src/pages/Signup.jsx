import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../services/storage'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Preencha nome, e-mail e senha.')
      return
    }
    setUser({ email, name })
    navigate('/feed')
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border rounded-2xl shadow-lg p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro</h1>
        <p className="text-sm text-gray-600 mt-1">Crie sua conta para postar</p>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors"
        >
          Criar conta
        </button>
      </form>
    </div>
  )
}
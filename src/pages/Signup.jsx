import { useNavigate } from 'react-router-dom'
import { setUser, setToken } from '../services/storage'
import { signupApi } from '../services/api'
import useForm from '../hooks/useForm'
import useRequestData from '../hooks/useRequestData'

export default function Signup() {
  const navigate = useNavigate()
  const { run, loading, error } = useRequestData(signupApi)
  const { values, errors, handleChange, handleSubmit, submitting, setErrors } = useForm({
    initialValues: { name: '', email: '', password: '' },
    validate: (v) => {
      const e = {}
      if (!v.name) e.name = 'Informe o nome'
      if (!v.email) e.email = 'Informe o e-mail'
      else if (!/.+@.+\..+/.test(v.email)) e.email = 'E-mail inválido'
      if (!v.password) e.password = 'Informe a senha'
      else if (v.password.length < 6) e.password = 'Mínimo de 6 caracteres'
      return e
    },
    onSubmit: async (v) => {
      try {
        const { token, user } = await run(v)
        setToken(token)
        setUser(user)
        navigate('/feed')
      } catch (err) {
        setErrors((prev) => ({ ...prev, form: err?.message || 'Falha no cadastro' }))
      }
    },
  })

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border rounded-2xl shadow-lg p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro</h1>
        <p className="text-sm text-gray-600 mt-1">Crie sua conta para postar</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {(errors.form || error) && <div className="text-sm text-red-600">{errors.form || error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="Seu nome"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || submitting}
          className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading || submitting ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}
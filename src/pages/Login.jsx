import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { setUser, setToken } from '../services/storage'
import { loginApi } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    try {
      const { token, user } = await loginApi(data)
      setToken(token)
      setUser(user)
      navigate('/feed')
    } catch (err) {
      alert(err.message || 'Falha no login')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border rounded-2xl shadow-lg p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Entrar</h1>
        <p className="text-sm text-gray-600 mt-1">Bem-vindo ao DevForum</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input
            type="email"
            {...register('email', { required: 'Informe o e-mail', pattern: { value: /.+@.+\..+/, message: 'E-mail inválido' } })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            {...register('password', { required: 'Informe a senha', minLength: { value: 6, message: 'Mínimo de 6 caracteres' } })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-sm text-gray-600 text-center">
          Não tem conta?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  )
}
import { Link, useNavigate } from 'react-router-dom'
import { clearUser, getUser } from '../services/storage'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getUser()

  const logout = () => {
    clearUser()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to={user ? '/feed' : '/'}
          className="inline-flex items-center gap-2 text-xl font-semibold text-gray-900"
        >
          <span className="inline-block h-7 w-7 rounded-md bg-blue-600 text-white grid place-items-center">D</span>
          DevForum
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600">Olá, {user.name || user.email}</span>
              <Link
                to="/feed"
                className="text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Feed
              </Link>
              <Link
                to="/new"
                className="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                Novo Post
              </Link>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
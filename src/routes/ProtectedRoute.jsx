import { Navigate } from 'react-router-dom'
import { getUser } from '../services/storage'

export default function ProtectedRoute({ children }) {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  return children
}
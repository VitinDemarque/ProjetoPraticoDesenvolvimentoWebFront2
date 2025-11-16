import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../services/storage'

export default function useProtectedPage() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate])
}
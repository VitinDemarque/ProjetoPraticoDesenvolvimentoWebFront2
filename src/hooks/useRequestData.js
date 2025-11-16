import { useCallback, useState } from 'react'

export default function useRequestData(requestFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = useCallback(async (params) => {
    setLoading(true)
    setError('')
    try {
      const result = await requestFn(params)
      setData(result)
      return result
    } catch (err) {
      const message = err?.message || 'Falha na requisição'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [requestFn])

  const reset = useCallback(() => {
    setData(null)
    setError('')
  }, [])

  return { data, loading, error, run, reset }
}
import { useCallback, useState } from 'react'

export default function useForm({ initialValues = {}, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.()
      const validationErrors = validate ? validate(values) : {}
      setErrors(validationErrors || {})
      if (validationErrors && Object.keys(validationErrors).length > 0) return
      if (!onSubmit) return
      try {
        setSubmitting(true)
        await onSubmit(values, { reset, setErrors })
      } finally {
        setSubmitting(false)
      }
    },
    [values, validate, onSubmit, reset]
  )

  return { values, errors, submitting, handleChange, handleSubmit, setValue, reset, setErrors }
}
import { useState } from 'react'

// Hook personalizado para gerenciar estado de loading e erros
export const useApiState = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (apiCall) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      setError(err.message || 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    loading,
    error,
    execute,
    clearError
  }
}

// Hook para validação de formulários
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field]
      const value = values[field]
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.message || `${field} é obrigatório`
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[field] = rule.message || `${field} deve ter pelo menos ${rule.minLength} caracteres`
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} tem formato inválido`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const setValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Limpa erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return {
    values,
    errors,
    setValue,
    validate,
    reset,
    setValues
  }
}
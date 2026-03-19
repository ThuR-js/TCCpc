// Utilitários para formatação e validação

// Formatação de CPF
export const formatCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cpf
}

// Formatação de CEP
export const formatCEP = (cep) => {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length <= 8) {
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
  return cep
}

// Formatação de telefone
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

// Validação de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de CPF
export const isValidCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(10))) return false
  
  return true
}

// Validação de CEP
export const isValidCEP = (cep) => {
  const cleaned = cep.replace(/\D/g, '')
  return cleaned.length === 8
}

// Formatação de data
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR')
}

// Formatação de moeda (se necessário no futuro)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para debounce (útil para pesquisas)
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Função para truncar texto
export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Função para gerar ID único (fallback se não vier do backend)
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

// Função para validar tamanho de arquivo
export const isValidFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Função para validar tipo de arquivo de imagem
export const isValidImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}
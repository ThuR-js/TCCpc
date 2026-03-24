// Configuração centralizada da API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',
  ENDPOINTS: {
    USUARIO: '/usuario',
    DOADOR: '/doador',
    ANUNCIO: '/anuncio',
    SOLICITACAO: '/solicitacao'
  }
}

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return await response.text()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}
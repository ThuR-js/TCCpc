// Configuração centralizada da API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1',
  ENDPOINTS: {
    USUARIO: '/usuario',
    DOADOR: '/doador',
    ANUNCIO: '/anuncio',
    SOLICITACAO: '/solicitacao',
    SOLICITACAO_POR_USUARIO: (usuarioId) => `/solicitacao/usuario/${usuarioId}`,
    SOLICITACAO_POR_ANUNCIO: (anuncioId) => `/solicitacao/anuncio/${anuncioId}`,
    SOLICITACAO_STATUS: (id) => `/solicitacao/${id}/status`,
    LOGIN: '/usuario/login',
    FAVORITOS: (usuarioId) => `/anuncio/favoritos/${usuarioId}`,
    FAVORITAR: (anuncioId) => `/anuncio/${anuncioId}/favoritar`,
    INATIVAR_ANUNCIO: (anuncioId) => `/anuncio/${anuncioId}/inativar`,
    PERFIL_PUBLICO: (usuarioId) => `/usuario/${usuarioId}/perfil`,
    ALTERAR_SENHA: (usuarioId) => `/usuario/${usuarioId}/senha`,
    ANUNCIO_POR_CATEGORIA: (categoriaId) => `/anuncio/categoria/${categoriaId}`,
    ANUNCIO_POR_DOADOR: (doadorId) => `/anuncio/doador/${doadorId}`
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
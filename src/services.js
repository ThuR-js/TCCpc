import { apiRequest, API_CONFIG } from './api'

// Serviço para gerenciar produtos
export const ProductService = {
  // Buscar todos os produtos
  async getAll() {
    try {
      return await apiRequest(API_CONFIG.ENDPOINTS.PRODUTO)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      return []
    }
  },

  // Buscar produto por ID
  async getById(id) {
    try {
      return await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUTO}/${id}`)
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      return null
    }
  },

  // Criar novo produto
  async create(productData) {
    try {
      return await apiRequest(API_CONFIG.ENDPOINTS.PRODUTO, {
        method: 'POST',
        body: JSON.stringify(productData)
      })
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      throw error
    }
  },

  // Atualizar produto
  async update(id, productData) {
    try {
      return await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUTO}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      })
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }
  },

  // Deletar produto
  async delete(id) {
    try {
      return await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUTO}/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      throw error
    }
  }
}

// Serviço para gerenciar solicitações
export const RequestService = {
  // Buscar todas as solicitações
  async getAll() {
    try {
      return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO)
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error)
      return []
    }
  },

  // Criar nova solicitação
  async create(requestData) {
    try {
      return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO, {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
    } catch (error) {
      console.error('Erro ao criar solicitação:', error)
      throw error
    }
  },

  // Atualizar status da solicitação
  async updateStatus(id, status) {
    try {
      return await apiRequest(`${API_CONFIG.ENDPOINTS.SOLICITACAO}/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      throw error
    }
  }
}
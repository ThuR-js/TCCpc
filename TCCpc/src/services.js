import { apiRequest, API_CONFIG } from './api'

export const UsuarioService = {
  async getAll() {
    return await apiRequest(API_CONFIG.ENDPOINTS.USUARIO)
  },

  async getById(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${id}`)
  },

  async getPerfilPublico(usuarioId) {
    return await apiRequest(API_CONFIG.ENDPOINTS.PERFIL_PUBLICO(usuarioId))
  },

  async login(email, senha) {
    return await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    })
  },

  async create(usuario) {
    return await apiRequest(API_CONFIG.ENDPOINTS.USUARIO, {
      method: 'POST',
      body: JSON.stringify(usuario)
    })
  },

  async update(id, usuario) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario)
    })
  },

  async alterarSenha(usuarioId, senhaAtual, novaSenha) {
    return await apiRequest(API_CONFIG.ENDPOINTS.ALTERAR_SENHA(usuarioId), {
      method: 'PATCH',
      body: JSON.stringify({ senhaAtual, novaSenha })
    })
  },

  async inativar(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${id}/inativar`, {
      method: 'PUT'
    })
  },

  async reativar(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${id}/reativar`, {
      method: 'PUT'
    })
  },

  async delete(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${id}`, {
      method: 'DELETE'
    })
  }
}

export const DoadorService = {
  async getAll() {
    return await apiRequest(API_CONFIG.ENDPOINTS.DOADOR)
  },

  async getById(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.DOADOR}/${id}`)
  },

  async getByUsuarioId(usuarioId) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.DOADOR}/usuario/${usuarioId}`)
  },

  async create(doador) {
    return await apiRequest(API_CONFIG.ENDPOINTS.DOADOR, {
      method: 'POST',
      body: JSON.stringify(doador)
    })
  },

  async update(id, doador) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.DOADOR}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doador)
    })
  },

  async delete(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.DOADOR}/${id}`, {
      method: 'DELETE'
    })
  }
}

export const AnuncioService = {
  async getAll() {
    return await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO)
  },

  async getAllAdmin() {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/admin`)
  },

  async getById(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`)
  },

  async getByCategoria(categoriaId) {
    return await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO_POR_CATEGORIA(categoriaId))
  },

  async getByDoador(doadorId) {
    return await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO_POR_DOADOR(doadorId))
  },

  async create(anuncio) {
    return await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO, {
      method: 'POST',
      body: JSON.stringify(anuncio)
    })
  },

  async update(id, anuncio) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(anuncio)
    })
  },

  async inativar(anuncioId, doadorId) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.INATIVAR_ANUNCIO(anuncioId)}?doadorId=${doadorId}`, {
      method: 'PUT'
    })
  },

  async delete(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
      method: 'DELETE'
    })
  },

  async favoritar(anuncioId, usuarioId) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.FAVORITAR(anuncioId)}?usuarioId=${usuarioId}`, {
      method: 'POST'
    })
  },

  async desfavoritar(anuncioId, usuarioId) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.FAVORITAR(anuncioId)}?usuarioId=${usuarioId}`, {
      method: 'DELETE'
    })
  },

  async getFavoritos(usuarioId) {
    return await apiRequest(API_CONFIG.ENDPOINTS.FAVORITOS(usuarioId))
  }
}

export const SolicitacaoService = {
  async getAll() {
    return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO)
  },

  async getById(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.SOLICITACAO}/${id}`)
  },

  async getByUsuarioId(usuarioId) {
    return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO_POR_USUARIO(usuarioId))
  },

  async getByAnuncioId(anuncioId) {
    return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO_POR_ANUNCIO(anuncioId))
  },

  async create(solicitacao) {
    return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO, {
      method: 'POST',
      body: JSON.stringify(solicitacao)
    })
  },

  async updateStatus(id, status) {
    return await apiRequest(API_CONFIG.ENDPOINTS.SOLICITACAO_STATUS(id), {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  },

  async delete(id) {
    return await apiRequest(`${API_CONFIG.ENDPOINTS.SOLICITACAO}/${id}`, {
      method: 'DELETE'
    })
  }
}

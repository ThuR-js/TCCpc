import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'

const Requests = () => {
  const navigate = useNavigate()
  const { currentUser, fetchProducts } = useApp()
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchAnuncios = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO)
      setAnuncios(Array.isArray(data) ? data : [])
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnuncios()
  }, [])

  const aprovar = async (id) => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ statusAnuncio: 'APROVADO' })
      })
      await fetchProducts()
      setAnuncios(prev => prev.map(a => a.id === id ? { ...a, statusAnuncio: 'APROVADO' } : a))
      setSelectedItem(prev => prev?.id === id ? { ...prev, statusAnuncio: 'APROVADO' } : prev)
    } catch (e) {
      alert('Erro ao aprovar: ' + e.message)
    }
  }

  const rejeitar = async (id) => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'DELETE'
      })
      setAnuncios(prev => prev.filter(a => a.id !== id))
      setSelectedItem(null)
    } catch (e) {
      alert('Erro ao rejeitar: ' + e.message)
    }
  }

  const pendentes = anuncios.filter(a => a.statusAnuncio === 'PENDENTE')

  const getStatusColor = (status) => {
    if (status === 'APROVADO') return '#28a745'
    if (status === 'PENDENTE') return '#ffc107'
    return '#dc3545'
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>

      {currentUser?.isAdmin && (
        <button
          onClick={fetchAnuncios}
          className="btn btn-primary"
          style={{ marginLeft: '1rem', marginBottom: '1rem' }}
        >
          🔄 Recarregar Anúncios
        </button>
      )}

      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>Validação de Anúncios</h3>

          {loading ? (
            <p style={{ color: 'white', padding: '1rem' }}>Carregando...</p>
          ) : erro ? (
            <p style={{ color: 'red', padding: '1rem' }}>Erro: {erro}</p>
          ) : pendentes.length === 0 ? (
            <p style={{ color: 'white', padding: '1rem', fontSize: '0.9rem' }}>Nenhum anúncio pendente.</p>
          ) : (
            pendentes.map(a => (
              <div
                key={a.id}
                className={`chat-item ${selectedItem?.id === a.id ? 'active' : ''}`}
                onClick={() => setSelectedItem(a)}
              >
                <div className="chat-preview">
                  <strong>{a.nome}</strong>
                  <p>Doador: {a.doador?.nome}</p>
                  <small style={{ fontSize: '0.7rem', opacity: 0.7 }}>{a.dataCadastro}</small>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="chat-main">
          {selectedItem ? (
            <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: '1rem', color: '#4A230A' }}>{selectedItem.nome}</h2>
                <p><strong>Doador:</strong> {selectedItem.doador?.nome}</p>
                <p><strong>Categoria:</strong> {selectedItem.categoria?.nome}</p>
                <p><strong>Tamanho:</strong> {selectedItem.tamanho}</p>
                <p><strong>Condição:</strong> {selectedItem.condicao}</p>
                <p><strong>Descrição:</strong> {selectedItem.descricao}</p>
                <p><strong>Data:</strong> {selectedItem.dataCadastro}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: getStatusColor(selectedItem.statusAnuncio), fontWeight: 'bold' }}>
                    {selectedItem.statusAnuncio}
                  </span>
                </p>
              </div>

              {currentUser?.isAdmin && selectedItem.statusAnuncio === 'PENDENTE' && (
                <div style={{ display: 'flex', gap: '1rem', borderTop: '2px solid #4A230A', paddingTop: '1rem' }}>
                  <button onClick={() => aprovar(selectedItem.id)} className="btn btn-primary" style={{ flex: 1 }}>
                    Aprovar Anúncio
                  </button>
                  <button
                    onClick={() => rejeitar(selectedItem.id)}
                    className="btn btn-secondary"
                    style={{ flex: 1, background: '#dc3545' }}
                  >
                    Rejeitar Anúncio
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-chat-selected">
              <p>Selecione um anúncio para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Requests

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'

const AdminPanel = () => {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  const fetchAnuncios = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO)
      console.log('Anúncios recebidos:', data)
      setAnuncios(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Erro ao buscar anúncios:', e)
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
      setAnuncios(prev => prev.map(a => a.id === id ? { ...a, statusAnuncio: 'APROVADO' } : a))
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
    } catch (e) {
      alert('Erro ao rejeitar: ' + e.message)
    }
  }

  const remover = async (id) => {
    if (!confirm('Remover este anúncio?')) return
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'DELETE'
      })
      setAnuncios(prev => prev.filter(a => a.id !== id))
    } catch (e) {
      alert('Erro ao remover: ' + e.message)
    }
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="container">
        <h2 style={{ color: 'white' }}>Acesso Negado</h2>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Fazer Login</button>
      </div>
    )
  }

  const pendentes = anuncios.filter(a => a.statusAnuncio === 'PENDENTE')
  const todos = anuncios

  return (
    <div className="container">
      <button onClick={() => navigate('/login')} className="btn-back">← Sair</button>
      <h2 style={{ color: 'white', marginBottom: '2rem' }}>Painel Administrativo</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Anúncios Pendentes</h3>
          <span>{pendentes.length}</span>
        </div>
        <div className="stat-card">
          <h3>Total de Anúncios</h3>
          <span>{todos.length}</span>
        </div>
        <div className="stat-card">
          <button onClick={fetchAnuncios} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
            🔄 Atualizar
          </button>
        </div>
      </div>

      <div className="pending-products">
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Anúncios para Validação</h3>

        {loading ? (
          <p style={{ color: 'white' }}>Carregando...</p>
        ) : erro ? (
          <p style={{ color: 'red' }}>Erro ao carregar: {erro}</p>
        ) : pendentes.length === 0 ? (
          <p style={{ color: 'white' }}>Nenhum anúncio pendente</p>
        ) : (
          <div className="products-grid">
            {pendentes.map(a => (
              <div key={a.id} className="product-card admin-card">
                <div className="product-info">
                  <h4>{a.nome}</h4>
                  <p>{a.descricao}</p>
                  <p><strong>Doador:</strong> {a.doador?.nome}</p>
                  <p><strong>Categoria:</strong> {a.categoria?.nome}</p>
                  <p><strong>Tamanho:</strong> {a.tamanho}</p>
                  <p><strong>Condição:</strong> {a.condicao}</p>
                  <p><strong>Data:</strong> {a.dataCadastro}</p>
                </div>
                <div className="admin-actions">
                  <button onClick={() => aprovar(a.id)} className="btn btn-success">Aprovar</button>
                  <button onClick={() => rejeitar(a.id)} className="btn btn-danger">Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', borderTop: '2px solid #333', paddingTop: '2rem' }}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>TODOS OS ANÚNCIOS ({todos.length})</h3>
        <div className="products-grid">
          {todos.map(a => (
            <div key={a.id} className="product-card admin-card">
              <div className="product-info">
                <h4>{a.nome}</h4>
                <p><strong>Doador:</strong> {a.doador?.nome}</p>
                <p><strong>Status:</strong> {a.statusAnuncio}</p>
              </div>
              <div className="admin-actions">
                <button onClick={() => remover(a.id)} className="btn btn-danger">REMOVER</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'

const AdminPanel = () => {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (currentUser?.isAdmin) fetchAnuncios()
  }, [currentUser])

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      setTimeout(() => setMessage(null), 5000)
    }
  }, [location.state])

  const fetchAnuncios = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/admin`)
      setAnuncios(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Erro ao buscar anúncios:', e)
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const getImageSrc = (anuncio) => {
    if (anuncio.imagens && anuncio.imagens.length > 0) {
      const img = anuncio.imagens[0]
      if (img.startsWith('http') || img.startsWith('data:')) return img
      return `/${img}`
    }
    if (anuncio.imagem) {
      if (anuncio.imagem.startsWith('http') || anuncio.imagem.startsWith('data:')) return anuncio.imagem
      return `/${anuncio.imagem}`
    }
    return '/images/avatar2.webp'
  }

  if (!currentUser?.isAdmin) {
    return (
      <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
        <div className="container">
          <h2 style={{ color: '#3B2415', textAlign: 'center', paddingTop: '4rem' }}>Acesso Negado</h2>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={() => navigate('/login')} className="btn-back">Fazer Login</button>
          </div>
        </div>
      </div>
    )
  }

  const pendentes = anuncios.filter(a => a.statusAnuncio === 'PENDENTE')
  const todos = anuncios

  return (
    <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
      <div className="container">
        <button onClick={() => navigate('/login')} className="btn-back">← Sair</button>
        
        {/* Mensagem de feedback */}
        {message && (
          <div style={{
            background: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 700, 
            color: '#3B2415', 
            margin: '0 0 0.5rem 0',
            lineHeight: 1.1
          }}>
            Painel Administrativo
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#7B6B5E', 
            margin: 0 
          }}>
            Gerencie anúncios pendentes de validação
          </p>
        </div>

        {/* Estatísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ color: '#7B6B5E', fontSize: '1rem', margin: '0 0 8px 0' }}>Anúncios Pendentes</h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8B5E3C' }}>{pendentes.length}</span>
          </div>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ color: '#7B6B5E', fontSize: '1rem', margin: '0 0 8px 0' }}>Total de Anúncios</h3>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6B3E1F' }}>{todos.length}</span>
          </div>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <button 
              onClick={fetchAnuncios}
              style={{
                width: '100%',
                height: '52px',
                background: '#8B5E3C',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Lista de anúncios pendentes */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8DDD2',
          borderRadius: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#3B2415',
            margin: '0 0 24px 0'
          }}>
            Anúncios para Validação ({pendentes.length})
          </h2>

          {loading ? (
            <p style={{ color: '#7B6B5E', textAlign: 'center', padding: '2rem' }}>Carregando...</p>
          ) : erro ? (
            <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>Erro ao carregar: {erro}</p>
          ) : pendentes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7B6B5E' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#8B5E3C', marginBottom: '0.5rem' }}>Nenhum anúncio pendente</h3>
              <p>Todos os anúncios foram validados!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {pendentes.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => navigate(`/validate-ad/${a.id}`)}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #E8DDD2',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 94, 60, 0.15)'
                    e.currentTarget.style.borderColor = '#8B5E3C'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                    e.currentTarget.style.borderColor = '#E8DDD2'
                  }}
                >
                  <img
                    src={getImageSrc(a)}
                    alt={a.nome}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/avatar2.webp'
                      e.target.onerror = null
                    }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#3B2415',
                      margin: '0 0 8px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {a.nome}
                    </h4>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#7B6B5E',
                      margin: '0 0 12px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {a.descricao || 'Sem descrição'}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: '#6B3E1F' }}>
                      <p style={{ margin: '0 0 4px 0' }}><strong>Doador:</strong> {a.doador?.nome || 'N/A'}</p>
                      <p style={{ margin: '0 0 4px 0' }}><strong>Categoria:</strong> {a.categoria?.nome || 'N/A'}</p>
                      <p style={{ margin: '0' }}><strong>Data:</strong> {a.dataCadastro ? new Date(a.dataCadastro).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

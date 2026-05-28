import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { DoadorService, AnuncioService, SolicitacaoService } from '../services'

const ReceivedRequests = () => {
  const navigate = useNavigate()
  const { currentUser } = useApp()
  const [anuncios, setAnuncios] = useState([])
  const [solicitacoesPorAnuncio, setSolicitacoesPorAnuncio] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return
      try {
        const doador = await DoadorService.getByUsuarioId(currentUser.id)
        const anunciosDoador = await AnuncioService.getByDoador(doador.id)
        setAnuncios(anunciosDoador)

        const solicitacoesMap = {}
        await Promise.all(
          anunciosDoador.map(async (a) => {
            try {
              const solic = await SolicitacaoService.getByAnuncioId(a.id)
              solicitacoesMap[a.id] = solic
            } catch { solicitacoesMap[a.id] = [] }
          })
        )
        setSolicitacoesPorAnuncio(solicitacoesMap)
      } catch (e) {
        console.error('Erro ao carregar solicitações:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentUser])

  if (loading) return <div className="container"><p>Carregando...</p></div>

  return (
    <div className="container">
      <button onClick={() => navigate('/profile')} className="btn-back">← Voltar ao Perfil</button>

      <div style={{ padding: '2rem 0' }}>
        <h2 style={{ color: '#4A230A', marginBottom: '2rem' }}>Solicitações Recebidas</h2>

        {anuncios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px', color: '#666' }}>
            <p>Você ainda não possui anúncios publicados.</p>
            <button onClick={() => navigate('/add-product')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Publicar Anúncio
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {anuncios.map(anuncio => {
              const count = solicitacoesPorAnuncio[anuncio.id]?.length || 0
              return (
                <div
                  key={anuncio.id}
                  className="product-card"
                  onClick={() => navigate(`/product-requests/${anuncio.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={anuncio.foto || '/images/avatar2.webp'}
                    alt={anuncio.nome}
                    className="product-image"
                    onError={(e) => { e.target.src = '/images/avatar2.webp'; e.target.onerror = null }}
                  />
                  <div className="product-info">
                    <h3 className="product-name">{anuncio.nome}</h3>
                    <p className="product-details">Tam. {anuncio.tamanho} • {anuncio.condicao}</p>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginTop: '1rem', padding: '0.75rem',
                      background: count > 0 ? '#e8f5e8' : '#f8f9fa',
                      borderRadius: '6px',
                      border: count > 0 ? '1px solid #28a745' : '1px solid #ddd'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: count > 0 ? '#28a745' : '#666' }}>
                        {count > 0 ? `${count} solicitação${count !== 1 ? 'ões' : ''}` : 'Nenhuma solicitação'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>Ver detalhes →</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReceivedRequests

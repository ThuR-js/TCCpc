import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SolicitacaoService, AnuncioService } from '../services'

const ProductRequests = () => {
  const { productId: rawProductId } = useParams()
  const productId = String(rawProductId).startsWith('api_') ? rawProductId.replace('api_', '') : rawProductId
  const navigate = useNavigate()
  const [anuncio, setAnuncio] = useState(null)
  const [solicitacoes, setSolicitacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anuncioData, solic] = await Promise.all([
          AnuncioService.getById(productId),
          SolicitacaoService.getByAnuncioId(productId)
        ])
        setAnuncio(anuncioData)
        setSolicitacoes(solic)
      } catch (e) {
        console.error('Erro ao carregar:', e)
        setErro(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [productId])

  if (loading) return <div className="container"><p>Carregando...</p></div>
  if (erro) return <div className="container"><p>Erro ao carregar anúncio: {erro}</p></div>
  if (!anuncio) return <div className="container"><p>Anúncio não encontrado. (ID: {productId})</p></div>

  const getStatusColor = (status) => {
    if (status === 'ACEITA') return '#28a745'
    if (status === 'PENDENTE') return '#ffc107'
    return '#dc3545'
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/received-requests')} className="btn-back">← Voltar</button>

      <div style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <img
            src={anuncio.foto || '/images/avatar2.webp'}
            alt={anuncio.nome}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => { e.target.src = '/images/avatar2.webp'; e.target.onerror = null }}
          />
          <div>
            <h2 style={{ margin: 0, color: '#4A230A' }}>{anuncio.nome}</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Tam. {anuncio.tamanho} • {anuncio.condicao}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#4A230A' }}>Solicitações Recebidas</h3>
          <span style={{ background: '#4A230A', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
            {solicitacoes.length} solicitação{solicitacoes.length !== 1 ? 'ões' : ''}
          </span>
        </div>

        {solicitacoes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f8f9fa', borderRadius: '8px', color: '#666' }}>
            <p>Nenhuma solicitação recebida para este anúncio ainda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {solicitacoes.map(s => (
              <div key={s.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#4A230A' }}>{s.usuario?.nome}</h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      Solicitado em {s.dataCadastro}
                    </p>
                  </div>
                  <span style={{ background: getStatusColor(s.statusSolicitacao), color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                    {s.statusSolicitacao}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div><strong style={{ color: '#4A230A' }}>Email:</strong><p style={{ margin: '0.25rem 0 0 0' }}>{s.usuario?.username}</p></div>
                  <div><strong style={{ color: '#4A230A' }}>Telefone:</strong><p style={{ margin: '0.25rem 0 0 0' }}>{s.telefone || '—'}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductRequests

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'

const MyAds = () => {
  const navigate = useNavigate()
  const { products, currentUser, setProducts } = useApp()
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [productToRemove, setProductToRemove] = useState(null)
  const [isRemoving, setIsRemoving] = useState(false)

  const myAds = products.filter(product =>
    currentUser?.doadorId &&
    String(product.donorId) === String(currentUser.doadorId) &&
    String(product.id).startsWith('api_')
  )

  const getImageSrc = (img) => {
    if (!img) return '/images/avatar2.webp'
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `/${img}`
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'pending': return 'Aguardando Aprovação'
      case 'analyzing': return 'Em Análise'
      case 'donated': return 'Doado'
      default: return 'Desconhecido'
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available': return { background: '#E8F5E9', color: '#2E7D32' }
      case 'pending':   return { background: '#FFF8E1', color: '#F57F17' }
      case 'analyzing': return { background: '#E3F2FD', color: '#1565C0' }
      case 'donated':   return { background: '#F3E5F5', color: '#6A1B9A' }
      default:          return { background: '#F5F5F5', color: '#616161' }
    }
  }

  const typeName = (type) => {
    if (type === 'moletom') return 'Blusa'
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : '—'
  }

  const handleRemoveClick = (product) => {
    setProductToRemove(product)
    setShowRemoveModal(true)
  }

  const confirmRemove = async () => {
    if (!productToRemove) return
    setIsRemoving(true)
    try {
      const apiId = String(productToRemove.id).replace('api_', '')
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${apiId}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== productToRemove.id))
    } catch {
      alert('Erro ao remover anúncio. Tente novamente.')
    }
    setIsRemoving(false)
    setShowRemoveModal(false)
    setProductToRemove(null)
  }

  if (!currentUser || (currentUser.type !== 'doador' && currentUser.nivelAcesso !== 'DOADOR')) {
    return (
      <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
          <h2 style={{ color: '#3B2415', marginBottom: '1rem' }}>Acesso Restrito</h2>
          <p style={{ color: '#7B6B5E' }}>Esta página é apenas para doadores.</p>
          <button onClick={() => navigate('/')} className="btn-back" style={{ marginTop: '1.5rem' }}>
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Anúncios',   value: myAds.length },
    { label: 'Disponíveis', value: myAds.filter(p => p.status === 'available').length },
    { label: 'Em análise',  value: myAds.filter(p => p.status === 'pending' || p.status === 'analyzing').length },
    { label: 'Doados',      value: myAds.filter(p => p.status === 'donated').length },
  ]

  return (
    <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: '#3B2415', margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Meus Anúncios</h2>
          <button
            onClick={() => navigate('/add-product')}
            style={{
              background: '#8B5E3C', color: 'white', border: 'none',
              borderRadius: '12px', padding: '12px 20px',
              fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            + Novo Anúncio
          </button>
        </div>

        {/* Estatísticas */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: '#FFFFFF', border: '1px solid #E8DDD2',
              borderRadius: '18px', padding: '20px 28px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              textAlign: 'center', flex: '1', minWidth: '120px'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#8B5E3C' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#7B6B5E', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Lista de anúncios */}
        {myAds.length === 0 ? (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E8DDD2', borderRadius: '18px',
            padding: '4rem 2rem', textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: '#3B2415', marginBottom: '0.5rem' }}>Nenhum anúncio encontrado</h3>
            <p style={{ color: '#7B6B5E', marginBottom: '1.5rem' }}>Que tal começar doando algo?</p>
            <button
              onClick={() => navigate('/add-product')}
              style={{
                background: '#8B5E3C', color: 'white', border: 'none',
                borderRadius: '12px', padding: '12px 24px',
                fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Criar Primeiro Anúncio
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {myAds.map(product => (
              <div key={product.id} style={{
                background: '#FFFFFF', border: '1px solid #E8DDD2',
                borderRadius: '18px', padding: '20px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                display: 'flex', gap: '20px', alignItems: 'flex-start'
              }}>
                {/* Imagem */}
                <img
                  src={getImageSrc(product.image)}
                  alt={product.name}
                  style={{
                    width: '120px', height: '120px',
                    objectFit: 'cover', borderRadius: '12px',
                    border: '1px solid #E8DDD2', flexShrink: 0
                  }}
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; e.target.onerror = null }}
                />

                {/* Conteúdo */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ fontSize: '20px', fontWeight: 700, color: '#3B2415', margin: 0, cursor: 'pointer' }}
                    >
                      {product.name}
                    </h3>
                    <span style={{
                      ...getStatusStyle(product.status),
                      padding: '4px 12px', borderRadius: '20px',
                      fontSize: '0.78rem', fontWeight: 600, flexShrink: 0, marginLeft: '12px'
                    }}>
                      {getStatusLabel(product.status)}
                    </span>
                  </div>

                  <p style={{ color: '#7B6B5E', fontSize: '0.88rem', margin: 0 }}>
                    {product.size} • {typeName(product.type)} • {product.condition}
                  </p>

                  {product.region && (
                    <p style={{ color: '#7B6B5E', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B3E1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {product.region}
                    </p>
                  )}

                  {/* Botões */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{
                        background: '#8B5E3C', color: 'white', border: 'none',
                        borderRadius: '10px', padding: '8px 18px',
                        fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Ver detalhes
                    </button>
                    <button
                      onClick={() => navigate(`/product-requests/${product.id}`)}
                      style={{
                        background: 'white', color: '#8B5E3C',
                        border: '1px solid #8B5E3C',
                        borderRadius: '10px', padding: '8px 18px',
                        fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      Solicitações
                    </button>
                    <button
                      onClick={() => handleRemoveClick(product)}
                      style={{
                        background: 'white', color: '#7B6B5E',
                        border: '1px solid #E8DDD2',
                        borderRadius: '10px', padding: '8px 18px',
                        fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      {showRemoveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '18px', padding: '2rem',
            maxWidth: '420px', width: '90%', textAlign: 'center',
            border: '1px solid #E8DDD2', boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}>
            <h3 style={{ color: '#3B2415', marginBottom: '0.75rem', fontSize: '1.2rem' }}>Remover anúncio</h3>
            <p style={{ color: '#7B6B5E', marginBottom: '0.5rem' }}>Tem certeza que deseja remover:</p>
            <p style={{ color: '#8B5E3C', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              "{productToRemove?.name}"
            </p>
            <p style={{ color: '#7B6B5E', fontSize: '0.85rem', marginBottom: '2rem' }}>Esta ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={confirmRemove}
                disabled={isRemoving}
                style={{
                  background: '#8B5E3C', color: 'white', border: 'none',
                  borderRadius: '10px', padding: '10px 24px',
                  fontSize: '0.9rem', fontWeight: 600,
                  cursor: isRemoving ? 'not-allowed' : 'pointer', opacity: isRemoving ? 0.7 : 1
                }}
              >
                {isRemoving ? 'Removendo...' : 'Confirmar'}
              </button>
              <button
                onClick={() => { setShowRemoveModal(false); setProductToRemove(null) }}
                disabled={isRemoving}
                style={{
                  background: 'white', color: '#7B6B5E',
                  border: '1px solid #E8DDD2',
                  borderRadius: '10px', padding: '10px 24px',
                  fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAds

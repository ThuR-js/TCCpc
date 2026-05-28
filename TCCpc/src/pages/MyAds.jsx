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

  // Filtrar apenas os anúncios do doador atual
  const myAds = products.filter(product => 
    currentUser?.doadorId && String(product.donorId) === String(currentUser.doadorId)
  )

  const getImageSrc = (img) => {
    if (!img) return '/images/avatar2.webp'
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `/${img}`
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponível'
      case 'pending': return 'Aguardando Aprovação'
      case 'analyzing': return 'Em Análise'
      case 'donated': return 'Doado'
      default: return 'Desconhecido'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'available': return 'status-available'
      case 'pending': return 'status-pending'
      case 'analyzing': return 'status-analyzing'
      case 'donated': return 'status-donated'
      default: return 'status-unknown'
    }
  }

  const handleRemoveClick = (product) => {
    setProductToRemove(product)
    setShowRemoveModal(true)
  }

  const confirmRemove = async () => {
    if (!productToRemove) return
    setIsRemoving(true)
    try {
      const apiId = String(productToRemove.id).startsWith('api_') ? String(productToRemove.id).replace('api_', '') : null
      if (apiId) {
        await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${apiId}`, {
          method: 'DELETE'
        })
      }
      setProducts(prev => prev.filter(p => p.id !== productToRemove.id))
      alert('Anúncio removido com sucesso!')
    } catch (error) {
      alert('Erro ao remover anúncio. Tente novamente.')
    }
    setIsRemoving(false)
    setShowRemoveModal(false)
    setProductToRemove(null)
  }

  const cancelRemove = () => {
    setShowRemoveModal(false)
    setProductToRemove(null)
  }

  // Verificar se o usuário é doador
  if (!currentUser || (currentUser.type !== 'doador' && currentUser.nivelAcesso !== 'DOADOR')) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'white' }}>
          <h2 style={{ color: '#DFA983', marginBottom: '1rem' }}>Acesso Restrito</h2>
          <p>Esta página é apenas para doadores.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'white', margin: 0 }}>Meus Anúncios</h2>
        <button 
          onClick={() => navigate('/add-product')} 
          className="btn btn-primary"
        >
          + Novo Anúncio
        </button>
      </div>

      {myAds.length === 0 ? (
        <div className="empty-ads" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(161, 135, 119, 0.8)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '4rem', color: '#DFA983', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#DFA983', marginBottom: '1rem' }}>Nenhum anúncio encontrado</h3>
          <p style={{ color: '#ccc', marginBottom: '2rem' }}>
            Você ainda não criou nenhum anúncio. Que tal começar doando algo?
          </p>
          <button 
            onClick={() => navigate('/add-product')} 
            className="btn btn-primary"
          >
            Criar Primeiro Anúncio
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {myAds.map(product => (
              <div 
                key={product.id} 
                className="my-ad-card"
                style={{
                  background: 'rgba(161, 135, 119, 0.8)',
                  border: '2px solid #4A230A',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <img 
                    src={getImageSrc(product.image)} 
                    alt={product.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #4A230A',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg'
                      e.target.onerror = null
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#4A230A', 
                      fontSize: '1.1rem', 
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem'
                    }}>
                      Tam. {product.size} • {product.type === 'moletom' ? 'Blusa' : product.type?.charAt(0).toUpperCase() + product.type?.slice(1)} • {product.condition}
                    </p>
                    <span 
                      className={`status-badge ${getStatusClass(product.status)}`}
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    >
                      {getStatusText(product.status)}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      Ver Detalhes
                    </button>
                    {product.status === 'available' && (
                      <button 
                        onClick={() => navigate(`/product-requests/${product.id}`)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      >
                        Ver Solicitações
                      </button>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveClick(product)}
                    className="btn"
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      fontSize: '0.8rem',
                      padding: '0.4rem 0.8rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c82333'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#dc3545'
                    }}
                  >
                    Remover Anúncio
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(161, 135, 119, 0.5)',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
              Total de anúncios: <strong>{myAds.length}</strong> • 
              Disponíveis: <strong>{myAds.filter(p => p.status === 'available').length}</strong> • 
              Em análise: <strong>{myAds.filter(p => p.status === 'pending' || p.status === 'analyzing').length}</strong> • 
              Doados: <strong>{myAds.filter(p => p.status === 'donated').length}</strong>
            </p>
          </div>
        </>
      )}

      {/* Modal de Confirmação */}
      {showRemoveModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#2a2a2a',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            border: '2px solid #dc3545'
          }}>
            <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>⚠️ Confirmar Remoção</h3>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              Tem certeza que deseja remover o anúncio:
            </p>
            <p style={{ 
              color: '#DFA983', 
              fontWeight: 'bold', 
              marginBottom: '2rem',
              fontSize: '1.1rem'
            }}>
              "{productToRemove?.name}"
            </p>
            <p style={{ color: '#ccc', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={confirmRemove}
                disabled={isRemoving}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isRemoving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {isRemoving ? 'Removendo...' : 'Sim, Remover'}
              </button>
              <button 
                onClick={cancelRemove}
                disabled={isRemoving}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isRemoving ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
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
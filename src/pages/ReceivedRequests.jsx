import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ReceivedRequests = () => {
  const navigate = useNavigate()
  const { products, requests, currentUser } = useApp()

  // Filtrar produtos do doador atual
  const userProducts = products.filter(product => 
    product.donorId === currentUser?.id && product.status === 'available'
  )

  // Contar solicitações por produto
  const getRequestCount = (productId) => {
    return requests.filter(req => req.productId === productId).length
  }

  const getImageSrc = (img) => {
    if (!img) return '/images/avatar2.webp'
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `/${img}`
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/profile')} className="btn-back">← Voltar ao Perfil</button>
      
      <div style={{ padding: '2rem 0' }}>
        <h2 style={{ color: '#4A230A', marginBottom: '2rem' }}>Solicitações Recebidas</h2>
        
        {userProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            color: '#666'
          }}>
            <p>Você ainda não possui produtos publicados.</p>
            <button 
              onClick={() => navigate('/add-product')} 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Publicar Produto
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {userProducts.map(product => {
              const requestCount = getRequestCount(product.id)
              return (
                <div 
                  key={product.id} 
                  className="product-card" 
                  onClick={() => navigate(`/product-requests/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={getImageSrc(product.image)} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/images/avatar2.webp'
                      e.target.onerror = null
                    }}
                  />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-details">
                      Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.size}</span> • 
                      {product.type === 'moletom' ? 'Blusa' : product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'Produto'} • 
                      {product.condition}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: requestCount > 0 ? '#e8f5e8' : '#f8f9fa',
                      borderRadius: '6px',
                      border: requestCount > 0 ? '1px solid #28a745' : '1px solid #ddd'
                    }}>
                      <span style={{ 
                        fontSize: '0.9rem',
                        color: requestCount > 0 ? '#28a745' : '#666'
                      }}>
                        {requestCount > 0 ? `${requestCount} solicitação${requestCount !== 1 ? 'ões' : ''}` : 'Nenhuma solicitação'}
                      </span>
                      <span style={{ 
                        fontSize: '0.8rem',
                        color: '#666'
                      }}>
                        Clique para ver detalhes →
                      </span>
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
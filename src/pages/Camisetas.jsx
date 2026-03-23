import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProductCarousel from '../components/ProductCarousel'

const Camisetas = () => {
  const navigate = useNavigate()
  const { 
    products, 
    favorites, 
    toggleFavorite, 
    currentUser, 
    addRequest, 
    removeProduct 
  } = useApp()

  // Filtrar apenas camisetas disponíveis
  const camisetas = products.filter(product => 
    product.type === 'camiseta' && product.status === 'available'
  )

  const handleProductInterest = (productId) => {
    if (currentUser?.isGuest === true || currentUser?.type === 'convidado') {
      alert('Faça login para manifestar interesse.')
      return
    }
    if (currentUser?.type !== 'donatario') {
      return
    }
    addRequest(productId)
    alert('Interesse manifestado! O doador será notificado.')
  }

  const startChat = () => {
    if (currentUser?.isGuest === true || currentUser?.type === 'convidado') {
      alert('Faça login para enviar mensagens.')
      return
    }
    navigate('/chat')
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Voltar para Início
      </button>
      
      <div className="categories-section">
        <h2 className="section-title">Camisetas</h2>
        <p style={{color: '#666', marginBottom: '2rem'}}>
          {camisetas.length} camisetas disponíveis para doação
        </p>
      </div>

      <div className="products-grid">
        {camisetas.map(product => (
          <div key={product.id} className="product-card" 
               onClick={() => navigate(`/product/${product.id}`)}>
            <img 
              src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
              alt={product.name} 
              className="product-image"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg'
                e.target.onerror = null
              }}
            />
            <div className="product-info">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 className="product-name">{product.name}</h3>
                {currentUser && currentUser.id === product.donorId && (
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeProduct(product.id)
                    }}
                  >
                    Remover
                  </button>
                )}
              </div>
              <p className="product-details">
                Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.size}</span> • 
                Camiseta • {product.condition}
              </p>
              <div className="product-donor">
                <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                <span>{product.donor}</span>
              </div>
              <div className="product-bottom">
                <div className="product-actions">
                  {product.chatEnabled && (
                    <button className="btn btn-primary" onClick={(e) => {
                      e.stopPropagation()
                      startChat()
                    }}>
                      Chat
                    </button>
                  )}
                  {product.whatsapp && (
                    <a href={`https://wa.me/55${product.whatsapp}`} 
                       className="btn btn-secondary" 
                       onClick={(e) => e.stopPropagation()}>
                      WhatsApp
                    </a>
                  )}
                  {currentUser && currentUser.type === 'donatario' && (
                    <button className="btn btn-outline" onClick={(e) => {
                      e.stopPropagation()
                      handleProductInterest(product.id)
                    }}>
                      Tenho Interesse
                    </button>
                  )}
                </div>
                <button 
                  className={`favorite-btn-card ${favorites.includes(product.id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(product.id)
                  }}
                >
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {camisetas.length === 0 && (
        <div style={{textAlign: 'center', padding: '4rem', color: '#666'}}>
          <h3>Nenhuma camiseta disponível no momento</h3>
          <p>Volte mais tarde para ver novas doações!</p>
        </div>
      )}
    </div>
  )
}

export default Camisetas
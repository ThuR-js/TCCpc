import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import DonorProfileModal from '../components/DonorProfileModal'
import { useState } from 'react'

const Favorites = () => {
  const navigate = useNavigate()
  const { products, favorites, toggleFavorite, currentUser } = useApp()
  const [showDonorModal, setShowDonorModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState(null)

  const favoriteProducts = products.filter(product => favorites.includes(product.id))

  const getImageSrc = (img) => {
    if (!img) return '/images/avatar2.webp'
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `/${img}`
  }

  const handleDonorClick = (e, product) => {
    e.stopPropagation()
    setSelectedDonor({
      id: product.donorId,
      name: product.donor
    })
    setShowDonorModal(true)
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <h2 style={{marginBottom: '2rem', color: 'white'}}>Meus Favoritos ({favorites.length})</h2>
      
      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">♡</div>
          <h3>Nenhum favorito ainda</h3>
          <p>Explore os anúncios e adicione seus produtos favoritos clicando no coração!</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Explorar Anúncios
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {favoriteProducts.map(product => (
            <div 
              key={product.id} 
              className={`product-card ${product.status === 'donated' ? 'donated' : ''} ${product.status === 'pending' ? 'pending' : ''}`} 
              onClick={() => {
                if (product.status !== 'donated') {
                  navigate(`/product/${product.id}`)
                }
              }}
              style={{
                cursor: product.status === 'donated' ? 'not-allowed' : 'pointer'
              }}
            >
              <img 
                src={getImageSrc(product.image)} 
                alt={product.name} 
                className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} 
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                  e.target.onerror = null
                }}
              />
              <div className="product-info">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <h3 className="product-name" style={{
                    color: product.status === 'donated' ? '#999' : 'inherit'
                  }}>{product.name}</h3>
                  <button 
                    className="favorite-btn-card favorited"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(product.id)
                    }}
                    title="Remover dos favoritos"
                  >
                    ♥
                  </button>
                </div>
                <p className="product-details" style={{
                  color: product.status === 'donated' ? '#999' : '#666'
                }}>Tam. <span style={{color: product.status === 'donated' ? '#999' : '#4A230A', fontWeight: 'bold'}}>{product.type === 'tenis' ? product.size : product.size}</span> • {product.type === 'moletom' ? 'Blusa' : product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'Produto'} • {product.condition}</p>
                {product.region && (
                  <p className="product-region" style={{
                    color: product.status === 'donated' ? '#999' : '#4A230A'
                  }}>Região: {product.region}</p>
                )}
                <div className="product-donor">
                  <img 
                    src={product.donorPhoto || '/images/avatar2.webp'} 
                    alt="Avatar" 
                    className="donor-avatar"
                    style={{
                      opacity: product.status === 'donated' ? 0.5 : 1
                    }}
                    onError={(e) => {
                      e.target.src = '/images/avatar2.webp'
                      e.target.onerror = null
                    }}
                  />
                  <span 
                    className="donor-name-link" 
                    onClick={(e) => {
                      if (product.status !== 'donated') {
                        handleDonorClick(e, product)
                      }
                    }}
                    style={{
                      color: product.status === 'donated' ? '#999' : '#4A230A',
                      cursor: product.status === 'donated' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {product.donor}
                  </span>
                </div>
                {product.status === 'pending' && <span className="product-status status-analyzing">Em Análise</span>}
                {product.status === 'analyzing' && <span className="product-status status-analyzing">Em Análise</span>}
                {product.status === 'donated' && <span className="product-status status-donated">Doado</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <DonorProfileModal 
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        donorId={selectedDonor?.id}
        donorName={selectedDonor?.name}
      />
    </div>
  )
}

export default Favorites
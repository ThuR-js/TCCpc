import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Favorites = () => {
  const navigate = useNavigate()
  const { products, favorites, toggleFavorite } = useApp()

  const favoriteProducts = products.filter(product => favorites.includes(product.id))

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <h2>Meus Favoritos ({favorites.length})</h2>
      {favorites.length === 0 ? (
        <p>Você ainda não tem produtos favoritos.</p>
      ) : (
        <div className="products-grid">
          {favoriteProducts.map(product => (
            <div key={product.id} className={`product-card ${product.status === 'donated' ? 'donated' : ''}`} 
                 onClick={() => {
                   navigate(`/product/${product.id}`);
                 }}>
              <div className="product-image-container">
                <img src={`/${product.image}`} alt={product.name} className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} />
                <button 
                  className="favorite-btn favorited"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  ♥
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-details">Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.size}</span> • {product.type.charAt(0).toUpperCase() + product.type.slice(1)} • {product.condition}</p>
                <div className="product-donor">
                  <img src="/images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                  <span>{product.donor}</span>
                </div>
                {product.status === 'analyzing' && <span className="product-status status-analyzing">Em Análise</span>}
                {product.status === 'donated' && <span className="product-status status-donated">Doado</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
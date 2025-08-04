import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Home = () => {
  const navigate = useNavigate()
  const { 
    products, 
    filters, 
    setFilters, 
    searchTerm, 
    favorites, 
    toggleFavorite, 
    currentUser,
    setCurrentImageIndex 
  } = useApp()

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.type === '' || product.type === filters.type) &&
      (filters.size === '' || product.size === filters.size) &&
      (filters.condition === '' || product.condition === filters.condition)
    )
  })

  const startChat = () => {
    navigate('/chat')
  }

  const handleProductInterest = (productId) => {
    if (!currentUser || currentUser.type !== 'donatario') return
    alert('Interesse manifestado! O doador será notificado.')
  }

  return (
    <div className="container">
      <div className="recent-section">
        <h2 className="section-title">Recém-publicados</h2>
        <div className="recent-grid">
          {products.slice(0, 5).map(product => (
            <div key={product.id} className="recent-card" onClick={() => navigate(`/product/${product.id}`)}>
              <img src={product.image} alt={product.name} className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-details">{product.size} • {product.condition}</p>
                <div className="product-donor">
                  <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                  <span>{product.donor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="categories-section">
        <h2 className="section-title">Para você</h2>
        <div className="categories-nav">
          <button className={`category-btn ${filters.type === '' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: ''})}>
            Todos os itens
          </button>
          <button className={`category-btn ${filters.type === 'camiseta' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'camiseta'})}>
            Camisetas
          </button>
          <button className={`category-btn ${filters.type === 'calca' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'calca'})}>
            Calças
          </button>
          <button className={`category-btn ${filters.type === 'moletom' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'moletom'})}>
            Moletoms
          </button>
          <button className={`category-btn ${filters.type === 'tenis' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'tenis'})}>
            Tênis
          </button>
          <button className={`category-btn ${filters.type === 'shorts' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'shorts'})}>
            Shorts
          </button>
        </div>
      </div>
      
      <div className="search-filters">
        <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
          <option value="">Todos os tipos</option>
          <option value="camiseta">Camiseta</option>
          <option value="calca">Calça</option>
          <option value="moletom">Moletom</option>
          <option value="tenis">Tênis</option>
          <option value="shorts">Shorts</option>
        </select>
        <select value={filters.size} onChange={(e) => setFilters({...filters, size: e.target.value})}>
          <option value="">Todos os tamanhos</option>
          <option value="PP">PP</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
        </select>
        <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})}>
          <option value="">Todas as condições</option>
          <option value="novo">Novo</option>
          <option value="seminovo">Seminovo</option>
          <option value="usado">Usado</option>
        </select>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className={`product-card ${product.status === 'donated' ? 'donated' : ''}`} 
               onClick={() => {
                 setCurrentImageIndex(0);
                 navigate(`/product/${product.id}`);
               }}>
            <img src={product.image} alt={product.name} className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-details">Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.size}</span> • {product.type.charAt(0).toUpperCase() + product.type.slice(1)} • {product.condition}</p>
              <div className="product-donor">
                <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                <span>{product.donor}</span>
              </div>
              {product.status === 'analyzing' && <span className="product-status status-analyzing">Em Análise</span>}
              {product.status === 'donated' && <span className="product-status status-donated">Doado</span>}
              <div className="product-bottom">
                {product.status === 'available' && (
                  <div className="product-actions">
                    {product.chatEnabled && <button className="btn btn-primary" onClick={(e) => {e.stopPropagation(); startChat()}}>Chat</button>}
                    {product.whatsapp && <a href={`https://wa.me/55${product.whatsapp}`} className="btn btn-secondary" onClick={(e) => e.stopPropagation()}>WhatsApp</a>}
                    {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={(e) => {e.stopPropagation(); handleProductInterest(product.id)}}>Tenho Interesse</button>}
                  </div>
                )}
                <button 
                  className={`favorite-btn-card ${favorites.includes(product.id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
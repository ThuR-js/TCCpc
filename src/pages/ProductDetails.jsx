import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, currentImageIndex, setCurrentImageIndex, currentUser } = useApp()
  
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return <div>Produto não encontrado</div>
  }

  const nextImage = () => {
    if (product.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  const startChat = () => {
    navigate('/chat')
  }

  const handleProductInterest = () => {
    if (!currentUser || currentUser.type !== 'donatario') return
    alert('Interesse manifestado! O doador será notificado.')
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <div className="product-detail-container">
        <div className="carousel-container">
          <div className="carousel">
            <img 
              src={product.images ? product.images[currentImageIndex] : product.image} 
              alt={product.name} 
              className="carousel-image active" 
            />
            <button className="carousel-nav carousel-prev" onClick={prevImage}>
              ‹
            </button>
            <button className="carousel-nav carousel-next" onClick={nextImage}>
              ›
            </button>
          </div>
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-specs">
            <p><strong>Tamanho:</strong> {product.size}</p>
            <p><strong>Tipo:</strong> {product.type.charAt(0).toUpperCase() + product.type.slice(1)}</p>
            <p><strong>Condição:</strong> {product.condition}</p>
            <div className="product-donor">
              <img src="/images/avatar2.webp" alt="Avatar" className="donor-avatar" />
              <span><strong>Doador:</strong> {product.donor}</span>
            </div>
          </div>
          <div className="product-detail-actions">
            {product.chatEnabled && <button className="btn btn-primary" onClick={startChat}>Chat</button>}
            {product.whatsapp && <a href={`https://wa.me/55${product.whatsapp}`} className="btn btn-secondary">WhatsApp</a>}
            {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={handleProductInterest}>Tenho Interesse</button>}
          </div>
        </div>
      </div>
      
      <div style={{marginTop: '4rem'}}>
        <h2 className="section-title">Veja também</h2>
        <div className="recent-grid">
          {products.filter(p => p.id !== product.id).slice(0, 4).map(relatedProduct => (
            <div key={relatedProduct.id} className="recent-card" onClick={() => {
              setCurrentImageIndex(0);
              navigate(`/product/${relatedProduct.id}`);
            }}>
              <img src={relatedProduct.image} alt={relatedProduct.name} className={`product-image ${relatedProduct.status === 'donated' ? 'donated' : ''}`} />
              <div className="product-info">
                <h3 className="product-name">{relatedProduct.name}</h3>
                <p className="product-details">{relatedProduct.size} • {relatedProduct.condition}</p>
                <div className="product-donor">
                  <img src="/images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                  <span>{relatedProduct.donor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
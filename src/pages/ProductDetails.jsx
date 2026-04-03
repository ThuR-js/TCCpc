import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, currentUser } = useApp()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const product = products.find(p => String(p.id) === String(id))

  const getImageSrc = (img) => {
    if (!img) return '/images/avatar2.webp'
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `/${img}`
  }

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [id])

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

  const handleProductInterest = () => {
    if (!currentUser || currentUser.type !== 'donatario') return
    
    const nome = prompt('Digite seu nome completo:')
    if (!nome) return
    
    const email = prompt('Digite seu email:')
    if (!email) return
    
    const telefone = prompt('Digite seu telefone:')
    if (!telefone) return
    
    // Aqui você pode adicionar a lógica para salvar a solicitação
    // addRequest(product.id, { nome, email, telefone, dataHora: new Date().toISOString() })
    
    alert('Interesse manifestado! O doador será notificado.')
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <div className="product-detail-container">
        <div className="carousel-container">
          <div className="carousel">
            <img 
              src={product.images ? getImageSrc(product.images[currentImageIndex]) : getImageSrc(product.image)} 
              alt={product.name} 
              className="carousel-image active" 
              onError={(e) => {
                console.log('Erro ao carregar imagem:', e.target.src)
                e.target.src = '/images/placeholder.jpg'
                e.target.onerror = null
              }}
            />
            {product.images && product.images.length > 1 && (
              <>
                <button className="carousel-nav carousel-prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="carousel-nav carousel-next" onClick={nextImage}>
                  ›
                </button>
              </>
            )}

          </div>
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-specs">
            <p><strong>Tamanho:</strong> {product.type === 'tenis' ? product.size : product.size}</p>
            <p><strong>Tipo:</strong> {product.type === 'moletom' ? 'Blusa' : product.type.charAt(0).toUpperCase() + product.type.slice(1)}</p>
            <p><strong>Condição:</strong> {product.condition}</p>
            <div className="product-donor">
              <img src="/images/avatar2.webp" alt="Avatar" className="donor-avatar" />
              <span><strong>Doador:</strong> {product.donor}</span>
            </div>
          </div>
          <div className="product-detail-actions">
            {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={handleProductInterest}>Tenho Interesse</button>}
            {currentUser && currentUser.id === product.donorId && <button className="btn btn-primary" onClick={() => navigate(`/product-requests/${product.id}`)}>Ver Solicitações</button>}
          </div>
        </div>
      </div>
      
      <div style={{marginTop: '4rem'}}>
        <h2 className="section-title">Veja também</h2>
        <div className="recent-grid">
          {products.filter(p => p.id !== product.id).slice(0, 4).map(relatedProduct => (
            <div key={relatedProduct.id} className="recent-card" onClick={() => {
              navigate(`/product/${relatedProduct.id}`);
            }}>
              <img 
                src={getImageSrc(relatedProduct.image)} 
                alt={relatedProduct.name} 
                className={`product-image ${relatedProduct.status === 'donated' ? 'donated' : ''}`} 
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                  e.target.onerror = null
                }}
              />
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
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import DonorProfileModal from '../components/DonorProfileModal'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, currentUser } = useApp()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDonorModal, setShowDonorModal] = useState(false)

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

  const handleDonorClick = () => setShowDonorModal(true)

  const typeName = product.type === 'moletom' ? 'Blusa'
    : product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1)
    : 'Produto'

  return (
    <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
      <div className="container">
        <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>

        {/* ── Layout principal 60/40 ── */}
        <div className={`pd-layout ${product.status === 'donated' ? 'donated' : ''}`}>

          {/* Coluna esquerda — fotos */}
          <div className="pd-gallery">
            <div className="pd-main-img-wrap">
              <img
                src={product.images ? getImageSrc(product.images[currentImageIndex]) : getImageSrc(product.image)}
                alt={product.name}
                className="pd-main-img"
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; e.target.onerror = null }}
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button className="pd-nav pd-prev" onClick={prevImage}>‹</button>
                  <button className="pd-nav pd-next" onClick={nextImage}>›</button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={getImageSrc(img)}
                    alt={`foto ${i + 1}`}
                    className={`pd-thumb ${i === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(i)}
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; e.target.onerror = null }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Coluna direita — informações */}
          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>

            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}

            {/* Caixa de especificações */}
            <div className="pd-specs-box">
              <div className="pd-spec-row">
                <span className="pd-spec-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M12 2L14 8h6l-4.8 3.6L17.4 18 12 14.4 6.6 18l2.2-6.4L4 8h6z"/></svg>
                  Tamanho
                </span>
                <span className="pd-spec-value">{product.size}</span>
              </div>
              <div className="pd-spec-row">
                <span className="pd-spec-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M4 4h16v16H4zM9 9h6v6H9z"/></svg>
                  Tipo
                </span>
                <span className="pd-spec-value">{typeName}</span>
              </div>
              <div className="pd-spec-row">
                <span className="pd-spec-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  Condição
                </span>
                <span className="pd-spec-value">{product.condition}</span>
              </div>
              {product.region && (
                <div className="pd-spec-row">
                  <span className="pd-spec-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Região
                  </span>
                  <span className="pd-spec-value">{product.region}</span>
                </div>
              )}
              <div className="pd-spec-row">
                <span className="pd-spec-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Doador
                </span>
                <span
                  className="pd-spec-value donor-name-link"
                  onClick={handleDonorClick}
                >
                  {product.donor}
                </span>
              </div>
            </div>

            {/* Botão principal */}
            {product.status === 'donated' ? (
              <button className="pd-main-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Produto Doado
              </button>
            ) : currentUser?.tipoUsuario === 'DONATARIO' ? (
              <button className="pd-main-btn">
                Quero este item
              </button>
            ) : !currentUser ? (
              <button className="pd-main-btn" onClick={() => navigate('/login')}>
                Faça login para solicitar este item
              </button>
            ) : null}

            {/* Botão doador — ver validações */}
            {currentUser && currentUser.id === product.donorId && (
              <button
                className="pd-secondary-btn"
                onClick={() => navigate(`/product-requests/${product.id}`)}
              >
                Ver Validações
              </button>
            )}
          </div>
        </div>


      </div>

      <DonorProfileModal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        donorId={product?.donorId}
        donorName={product?.donor}
      />
    </div>
  )
}

export default ProductDetails

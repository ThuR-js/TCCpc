import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductCarousel.css'
import DonorProfileModal from './DonorProfileModal'
import { useApp } from '../context/AppContext'

const ProductCarousel = ({ products, showAddCard = false, currentUser }) => {
  const navigate = useNavigate()
  const { favorites, toggleFavorite } = useApp()
  const carouselRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [showDonorModal, setShowDonorModal] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState(null)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const scroll = (direction) => {
    const scrollAmount = 300
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

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
    <div className="carousel-wrapper">
      <button className="carousel-btn carousel-btn-left" onClick={() => scroll('left')}>
        ‹
      </button>
      <div 
        className="carousel-track"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {showAddCard && currentUser && (currentUser.type === 'doador' || currentUser.nivelAcesso === 'DOADOR') && (
          <div className="carousel-card add-product-card" onClick={() => navigate('/add-product')}>
            <div className="add-product-icon">+</div>
            <div className="product-info">
              <h3 className="product-name">Adicionar Produto</h3>
              <p className="product-details">Clique para adicionar um novo item</p>
            </div>
          </div>
        )}
        {products.map(product => (
          <div key={product.id} className="carousel-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="carousel-image-container">
              <img 
                src={getImageSrc(product.image)} 
                alt={product.name} 
                className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} 
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                  e.target.onerror = null
                }}
              />
              {currentUser && (currentUser.type === 'donatario' || currentUser.nivelAcesso === 'DONATARIO') && (
                <button 
                  className={`carousel-favorite-btn ${favorites.includes(product.id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(product.id)
                  }}
                  title={favorites.includes(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-details">{product.size} • {product.condition}</p>
              {product.region && (
                <p className="product-region">Região: {product.region}</p>
              )}
              <div className="product-donor">
                <img 
                  src={product.donorPhoto || '/images/avatar2.webp'} 
                  alt="Avatar" 
                  className="donor-avatar"
                  onError={(e) => {
                    e.target.src = '/images/avatar2.webp'
                    e.target.onerror = null
                  }}
                />
                <span 
                  className="donor-name-link" 
                  onClick={(e) => handleDonorClick(e, product)}
                >
                  {product.donor}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn carousel-btn-right" onClick={() => scroll('right')}>
        ›
      </button>
      
      <DonorProfileModal 
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        donorId={selectedDonor?.id}
        donorName={selectedDonor?.name}
      />
    </div>
  )
}

export default ProductCarousel

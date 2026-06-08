import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductCarousel.css'
import DonorProfileModal from './DonorProfileModal'
import { useApp } from '../context/AppContext'

const ProductCarousel = ({ products, showAddCard = false, currentUser }) => {
  const navigate = useNavigate()
  const { } = useApp()
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
          <div 
            key={product.id} 
            className={`carousel-card ${product.status === 'donated' ? 'donated' : ''}`} 
            onClick={() => {
              if (product.status !== 'donated') {
                navigate(`/product/${product.id}`)
              }
            }}
            style={{
              cursor: product.status === 'donated' ? 'not-allowed' : 'pointer'
            }}
          >
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
            </div>
            <div className="product-info">
              <h3 className="product-name" style={{
                color: product.status === 'donated' ? '#999' : 'inherit'
              }}>{product.name}</h3>
              <p className="product-details" style={{
                color: product.status === 'donated' ? '#999' : '#666'
              }}>{product.size} • {product.condition}</p>
              {product.region && (
                <p className="product-region">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginRight: '8px'}}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {product.region}
                </p>
              )}
              <div className="product-donor">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginRight: '8px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span 
                  className="donor-name-link" 
                  onClick={(e) => {
                    if (product.status !== 'donated') {
                      handleDonorClick(e, product)
                    }
                  }}
                  style={{
                    color: product.status === 'donated' ? '#999' : undefined,
                    cursor: product.status === 'donated' ? 'not-allowed' : 'pointer'
                  }}
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

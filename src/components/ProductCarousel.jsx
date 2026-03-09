import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductCarousel.css'

const ProductCarousel = ({ products, showAddCard = false, currentUser }) => {
  const navigate = useNavigate()
  const carouselRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

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
            <img 
              src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
              alt={product.name} 
              className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} 
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg'
                e.target.onerror = null
              }}
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-details">{product.size} • {product.condition}</p>
              <div className="product-donor">
                <img src="/images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                <span>{product.donor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn carousel-btn-right" onClick={() => scroll('right')}>
        ›
      </button>
    </div>
  )
}

export default ProductCarousel

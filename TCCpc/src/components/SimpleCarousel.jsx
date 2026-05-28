import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/SimpleCarousel.css'

const SimpleCarousel = () => {
  const { products } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Apenas as imagens da pasta Carrossel
  const carouselProducts = [
    {
      id: 'carousel-slide-1',
      name: 'Bem-vindo à DoeConect',
      size: '',
      condition: 'Conectando doadores e donatários',
      image: 'images/Carrossel/PrimeiroSlide.jpg'
    },
    {
      id: 'carousel-slide-2',
      name: 'DoeConect',
      size: '',
      condition: 'Sua plataforma de doações',
      image: 'images/Carrossel/SegundoSlide.jpg'
    },
    {
      id: 'carousel-slide-3',
      name: 'Junte-se a nós',
      size: '',
      condition: 'Faça parte desta comunidade',
      image: 'images/Carrossel/TerceiroSlide.jpg'
    }
  ]

  // Auto-play do carrossel
  useEffect(() => {
    if (carouselProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselProducts.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [carouselProducts.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (carouselProducts.length === 0) {
    return null
  }

  return (
    <div className="simple-carousel">
      <div className="carousel-slides">
        {carouselProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg'
                e.target.onerror = null
              }}
            />
            {/* Nenhum texto sobreposto - apenas as imagens do carrossel */}
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button className="carousel-nav prev" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="carousel-nav next" onClick={nextSlide}>
        &#8250;
      </button>

      {/* Indicadores */}
      <div className="carousel-indicators">
        {carouselProducts.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default SimpleCarousel
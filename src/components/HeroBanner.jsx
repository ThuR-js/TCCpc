import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HeroBanner = ({ products }) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const slides = products.slice(0, 6)

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length)
  const next = () => setCurrent(i => (i + 1) % slides.length)

  const slide = slides[current]
  const imgSrc = slide.image?.startsWith('data:') ? slide.image : `/${slide.image}`

  return (
    <div
      className="relative w-full h-[420px] overflow-hidden cursor-pointer select-none"
      onClick={() => navigate(`/product/${slide.id}`)}
    >
      {/* Imagem de fundo */}
      <img
        src={imgSrc}
        alt={slide.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        onError={e => { e.target.src = '/images/placeholder.jpg'; e.target.onerror = null }}
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Texto centralizado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
        <span className="font-sans font-extrabold text-white text-4xl md:text-5xl lowercase tracking-tight drop-shadow-lg">
          {slide.name}
        </span>
        <span className="font-sans font-extrabold text-white/80 text-lg lowercase">
          {slide.size} • {slide.condition}
        </span>
      </div>

      {/* Seta esquerda */}
      <button
        onClick={e => { e.stopPropagation(); prev() }}
        aria-label="Anterior"
        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
      >
        <svg width="28" height="48" viewBox="0 0 28 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="24,4 4,24 24,44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Seta direita */}
      <button
        onClick={e => { e.stopPropagation(); next() }}
        aria-label="Próximo"
        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
      >
        <svg width="28" height="48" viewBox="0 0 28 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="4,4 24,24 4,44" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation(); setCurrent(i) }}
            className={`w-2.5 h-2.5 rounded-full border-2 border-white transition-all ${i === current ? 'bg-white' : 'bg-transparent'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner

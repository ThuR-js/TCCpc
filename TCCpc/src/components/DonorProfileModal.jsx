import { useState, useEffect } from 'react'
import './DonorProfileModal.css'

const DonorProfileModal = ({ isOpen, onClose, donorId, donorName }) => {
  const [donorProfile, setDonorProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Dados simulados dos doadores (em um app real, viria da API)
  const donorsData = {
    1: {
      id: 1,
      nome: "Maria Silva",
      dataRegistro: "2023-01-15",
      fotoPerfil: "/images/avatar2.webp",
      regiao: "São Paulo, SP",
      totalDoacoes: 12,
      avaliacaoMedia: 4.8
    },
    2: {
      id: 2,
      nome: "João Santos",
      dataRegistro: "2023-02-20",
      fotoPerfil: "/images/avatar2.webp",
      regiao: "Rio de Janeiro, RJ",
      totalDoacoes: 8,
      avaliacaoMedia: 4.6
    },
    3: {
      id: 3,
      nome: "Ana Costa",
      dataRegistro: "2023-03-10",
      fotoPerfil: "/images/avatar2.webp",
      regiao: "Belo Horizonte, MG",
      totalDoacoes: 15,
      avaliacaoMedia: 4.9
    },
    4: {
      id: 4,
      nome: "Carlos Lima",
      dataRegistro: "2023-01-05",
      fotoPerfil: "/images/avatar2.webp",
      regiao: "Salvador, BA",
      totalDoacoes: 6,
      avaliacaoMedia: 4.5
    },
    5: {
      id: 5,
      nome: "Fernanda Oliveira",
      dataRegistro: "2023-04-12",
      fotoPerfil: "/images/avatar2.webp",
      regiao: "Curitiba, PR",
      totalDoacoes: 9,
      avaliacaoMedia: 4.7
    }
  }

  useEffect(() => {
    if (isOpen && donorId) {
      setLoading(true)
      // Simula carregamento da API
      setTimeout(() => {
        const profile = donorsData[donorId] || {
          id: donorId,
          nome: donorName,
          dataRegistro: "2023-06-01",
          fotoPerfil: "/images/avatar2.webp",
          regiao: "Não informado",
          totalDoacoes: 1,
          avaliacaoMedia: 5.0
        }
        setDonorProfile(profile)
        setLoading(false)
      }, 500)
    }
  }, [isOpen, donorId, donorName])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="donor-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Perfil do Doador</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Carregando perfil...</p>
            </div>
          ) : donorProfile ? (
            <div className="donor-info">
              <div className="donor-avatar-section">
                <img 
                  src={donorProfile.fotoPerfil || '/images/avatar2.webp'} 
                  alt={donorProfile.nome}
                  className="donor-profile-avatar"
                  onError={(e) => {
                    e.target.src = '/images/avatar2.webp'
                    e.target.onerror = null
                  }}
                />
                <div className="donor-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < Math.floor(donorProfile.avaliacaoMedia) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">{donorProfile.avaliacaoMedia.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="donor-details">
                <div className="detail-item">
                  <span className="detail-label">Nome:</span>
                  <span className="detail-value">{donorProfile.nome}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Membro desde:</span>
                  <span className="detail-value">{formatDate(donorProfile.dataRegistro)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Região:</span>
                  <span className="detail-value">{donorProfile.regiao}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Total de doações:</span>
                  <span className="detail-value">{donorProfile.totalDoacoes} itens</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-message">
              <p>Não foi possível carregar o perfil do doador.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonorProfileModal
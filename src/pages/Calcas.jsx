import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Calcas = () => {
  const navigate = useNavigate()
  const { 
    products, 
    favorites, 
    toggleFavorite, 
    currentUser, 
    addRequest, 
    removeProduct 
  } = useApp()

  // Filtrar apenas calças disponíveis
  const calcas = products.filter(product => 
    product.type === 'calca' && product.status === 'available'
  )

  const handleProductInterest = (productId) => {
    if (currentUser?.isGuest === true || currentUser?.type === 'convidado') {
      alert('Faça login para manifestar interesse.')
      return
    }
    if (currentUser?.type !== 'donatario') {
      return
    }
    
    const nome = prompt('Digite seu nome completo:')
    if (!nome) return
    
    const email = prompt('Digite seu email:')
    if (!email) return
    
    const telefone = prompt('Digite seu telefone:')
    if (!telefone) return
    
    addRequest(productId, {
      nome,
      email,
      telefone,
      dataHora: new Date().toISOString()
    })
    alert('Interesse manifestado! O doador será notificado.')
  }



  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Voltar para Início
      </button>
      
      <div className="categories-section">
        <h2 className="section-title">Calças</h2>
        <p style={{color: '#666', marginBottom: '2rem'}}>
          {calcas.length} calças disponíveis para doação
        </p>
      </div>

      <div className="products-grid">
        {calcas.map(product => (
          <div key={product.id} className="product-card" 
               onClick={() => navigate(`/product/${product.id}`)}>
            <img 
              src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
              alt={product.name} 
              className="product-image"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg'
                e.target.onerror = null
              }}
            />
            <div className="product-info">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 className="product-name">{product.name}</h3>
                {currentUser && currentUser.id === product.donorId && (
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeProduct(product.id)
                    }}
                  >
                    Remover
                  </button>
                )}
              </div>
              <p className="product-details">
                Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.size}</span> • 
                Calça • {product.condition}
              </p>
              <div className="product-donor">
                <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                <span>{product.donor}</span>
              </div>
              <div className="product-bottom">
                <div className="product-actions">
                  {currentUser && currentUser.type === 'donatario' && (
                    <button className="btn btn-outline" onClick={(e) => {
                      e.stopPropagation()
                      handleProductInterest(product.id)
                    }}>
                      Tenho Interesse
                    </button>
                  )}
                  {currentUser && currentUser.id === product.donorId && (
                    <button className="btn btn-primary" onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/product-requests/${product.id}`)
                    }}>
                      Ver Solicitações
                    </button>
                  )}
                </div>
                {currentUser && (currentUser.type === 'donatario' || currentUser.nivelAcesso === 'DONATARIO') && (
                  <button 
                    className={`favorite-btn-card ${favorites.includes(product.id) ? 'favorited' : ''}`}
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
            </div>
          </div>
        ))}
      </div>

      {calcas.length === 0 && (
        <div style={{textAlign: 'center', padding: '4rem', color: '#666'}}>
          <h3>Nenhuma calça disponível no momento</h3>
          <p>Volte mais tarde para ver novas doações!</p>
        </div>
      )}
    </div>
  )
}

export default Calcas
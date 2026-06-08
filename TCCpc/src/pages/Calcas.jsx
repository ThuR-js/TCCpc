import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Calcas = () => {
  const navigate = useNavigate()
  const { 
    products, 
    currentUser, 
    addRequest, 
    removeProduct 
  } = useApp()

  // Filtrar apenas calças disponíveis
  const calcas = products.filter(product => 
    product.type === 'calca' && product.status === 'available'
  )

  /* BOTÃO "TENHO INTERESSE" - DESATIVADO NO WEB
     Deve aparecer apenas no mobile (React Native).
     Para reativar: remova os comentários do bloco abaixo e da função handleProductInterest.
     Chama: POST /api/v1/solicitacao com { usuario: { id }, anuncio: { id }, telefone }
  const handleProductInterest = (productId) => {
    if (currentUser?.isGuest === true || currentUser?.type === 'convidado') {
      alert('Faça login para manifestar interesse.')
      return
    }
    if (currentUser?.type !== 'donatario') return
    const nome = prompt('Digite seu nome completo:')
    if (!nome) return
    const email = prompt('Digite seu email:')
    if (!email) return
    const telefone = prompt('Digite seu telefone:')
    if (!telefone) return
    addRequest(productId, { nome, email, telefone, dataHora: new Date().toISOString() })
    alert('Interesse manifestado! O doador será notificado.')
  }
  */
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, marginRight: '8px'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>{product.donor}</span>
              </div>
              <div className="product-bottom">
                <div className="product-actions">
                  {/* BOTÃO "TENHO INTERESSE" - DESATIVADO NO WEB
                     Para reativar: remova este comentário e descomente a função handleProductInterest acima.
                  {currentUser && currentUser.type === 'donatario' && (
                    <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); handleProductInterest(product.id) }}>
                      Tenho Interesse
                    </button>
                  )} */}
                  {currentUser && currentUser.id === product.donorId && (
                    <button className="btn btn-primary" onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/product-requests/${product.id}`)
                    }}>
                      Ver Solicitações
                    </button>
                  )}
                </div>
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
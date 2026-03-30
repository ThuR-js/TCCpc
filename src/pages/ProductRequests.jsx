import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ProductRequests = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products, requests, currentUser } = useApp()

  // Encontrar o produto
  const product = products.find(p => p.id.toString() === productId)
  
  // Verificar se o usuário é o dono do produto
  if (!product || currentUser?.id !== product.donorId) {
    return (
      <div className="container">
        <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Acesso negado</h2>
          <p>Você não tem permissão para ver as solicitações deste produto.</p>
        </div>
      </div>
    )
  }

  // Filtrar solicitações para este produto
  const productRequests = requests.filter(req => req.productId.toString() === productId)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      
      <div style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <img 
            src={product.image?.startsWith('http') || product.image?.startsWith('data:') ? product.image : `/${product.image}`}
            alt={product.name}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => {
              e.target.src = '/images/avatar2.webp'
              e.target.onerror = null
            }}
          />
          <div>
            <h2 style={{ margin: 0, color: '#4A230A' }}>{product.name}</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              Tam. {product.size} • {product.type === 'moletom' ? 'Blusa' : product.type?.charAt(0).toUpperCase() + product.type?.slice(1)} • {product.condition}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#4A230A' }}>Solicitações Recebidas</h3>
          <span style={{ 
            background: '#4A230A', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            {productRequests.length} solicitação{productRequests.length !== 1 ? 'ões' : ''}
          </span>
        </div>

        {productRequests.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            color: '#666'
          }}>
            <p>Nenhuma solicitação recebida para este produto ainda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {productRequests.map(request => (
              <div 
                key={request.id} 
                style={{ 
                  background: 'white', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#4A230A', fontSize: '1.1rem' }}>
                      {request.userName}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                      Solicitado em {formatDate(request.date)}
                    </p>
                  </div>
                  <span style={{ 
                    background: request.status === 'pending' ? '#ffc107' : '#28a745',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}>
                    {request.status === 'pending' ? 'Pendente' : 'Aprovado'}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: '#4A230A' }}>Email:</strong>
                    <p style={{ margin: '0.25rem 0 0 0' }}>{request.userEmail}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#4A230A' }}>Telefone:</strong>
                    <p style={{ margin: '0.25rem 0 0 0' }}>{request.userPhone}</p>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  background: '#f8f9fa', 
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <strong>💡 Dica:</strong> Entre em contato diretamente com o interessado usando as informações acima. 
                  A comunicação acontece fora da plataforma.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductRequests
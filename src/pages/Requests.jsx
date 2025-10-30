import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Requests = () => {
  const navigate = useNavigate()
  const { requests, updateRequestStatus, currentUser, products, setProducts } = useApp()
  const [selectedRequest, setSelectedRequest] = useState(null)
  
  // Recarregar produtos do localStorage quando componente monta
  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
  }, [setProducts])

  const handleApprove = (requestId) => {
    updateRequestStatus(requestId, 'approved')
  }

  const handleReject = (requestId) => {
    updateRequestStatus(requestId, 'rejected')
  }

  console.log('Current user:', currentUser)
  console.log('All requests:', requests)
  
  const approveProduct = (productId) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'available', approvedDate: new Date().toISOString() } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    localStorage.setItem('products_global', JSON.stringify(updatedProducts))
  }

  const rejectProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    localStorage.setItem('products_global', JSON.stringify(updatedProducts))
  }

  // Se for admin, criar "solicitações" baseadas nos produtos pendentes
  console.log('Current user:', currentUser)
  console.log('All products:', products)
  console.log('Pending products:', products.filter(p => p.status === 'pending'))
  
  const filteredRequests = currentUser?.isAdmin 
    ? (products || []).filter(p => p?.status === 'pending').map(product => ({
        id: product.id,
        productName: product.name || 'Produto sem nome',
        productImage: product.image || '/images/placeholder.jpg',
        userName: product.donor || 'Usuário desconhecido',
        userEmail: `${(product.donor || 'usuario').toLowerCase().replace(/\s+/g, '.')}@email.com`,
        date: new Date().toISOString(),
        status: 'pending',
        isProductValidation: true,
        product: product
      }))
    : currentUser?.type === 'doador' 
      ? requests.filter(req => {
          console.log('Checking request for donor:', req.donorId, 'vs current user:', currentUser?.id)
          return req.donorId === currentUser?.id
        })
      : requests.filter(req => req.userId === currentUser?.id)
    
  console.log('Filtered requests:', filteredRequests)

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pendente'
      case 'approved': return 'Aprovado'
      case 'rejected': return 'Rejeitado'
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107'
      case 'approved': return '#28a745'
      case 'rejected': return '#dc3545'
      default: return '#6c757d'
    }
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      {currentUser?.isAdmin && (
        <button 
          onClick={() => {
            const savedProducts = localStorage.getItem('products')
            console.log('Produtos salvos no localStorage:', savedProducts)
            if (savedProducts) {
              const parsedProducts = JSON.parse(savedProducts)
              console.log('Produtos parseados:', parsedProducts)
              console.log('Produtos pendentes:', parsedProducts.filter(p => p.status === 'pending'))
              setProducts(parsedProducts)
            }
          }}
          className="btn btn-primary"
          style={{marginLeft: '1rem', marginBottom: '1rem'}}
        >
          🔄 Recarregar Anúncios
        </button>
      )}
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>{currentUser?.isAdmin ? 'Validação de Anúncios' : 'Solicitações'}</h3>
          {filteredRequests.length === 0 ? (
            <p style={{color: 'white', padding: '1rem', fontSize: '0.9rem'}}>Nenhuma solicitação encontrada.</p>
          ) : (
            filteredRequests.map(request => (
              <div 
                key={request.id} 
                className={`chat-item ${selectedRequest?.id === request.id ? 'active' : ''}`} 
                onClick={() => setSelectedRequest(request)}
              >
                <div className="chat-preview">
                  <strong>{request.productName}</strong>
                  <p>{currentUser?.isAdmin ? `Doador: ${request.userName}` : currentUser?.type === 'doador' ? `Por: ${request.userName}` : `Status: ${getStatusText(request.status)}`}</p>
                  <small style={{fontSize: '0.7rem', opacity: 0.7}}>
                    {new Date(request.date).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="chat-main">
          {selectedRequest ? (
            <div style={{padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column'}}>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', gap: '2rem', marginBottom: '2rem'}}>
                  <img 
                    src={selectedRequest.productImage.startsWith('data:') ? selectedRequest.productImage : `/${selectedRequest.productImage}`} 
                    alt={selectedRequest.productName} 
                    style={{width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px'}}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg'
                      e.target.onerror = null
                    }}
                  />
                  <div style={{flex: 1}}>
                    <h2 style={{marginBottom: '1rem', color: '#4A230A'}}>{selectedRequest.productName}</h2>
                    <p style={{marginBottom: '0.5rem', color: '#333'}}>
                      <strong>{currentUser?.isAdmin ? 'Doador:' : currentUser?.type === 'doador' ? 'Interessado:' : 'Você manifestou interesse em:'}</strong> {currentUser?.isAdmin ? selectedRequest.userName : currentUser?.type === 'doador' ? selectedRequest.userName : selectedRequest.productName}
                    </p>
                    {selectedRequest.product && currentUser?.isAdmin && (
                      <>
                        <p style={{marginBottom: '0.5rem', color: '#333'}}>
                          <strong>Categoria:</strong> {selectedRequest.product.type}
                        </p>
                        <p style={{marginBottom: '0.5rem', color: '#333'}}>
                          <strong>Tamanho:</strong> {selectedRequest.product.size}
                        </p>
                        <p style={{marginBottom: '0.5rem', color: '#333'}}>
                          <strong>Condição:</strong> {selectedRequest.product.condition}
                        </p>
                        <p style={{marginBottom: '0.5rem', color: '#333'}}>
                          <strong>Descrição:</strong> {selectedRequest.product.description}
                        </p>
                      </>
                    )}
                    <p style={{marginBottom: '0.5rem', color: '#333'}}>
                      <strong>Email:</strong> {selectedRequest.userEmail}
                    </p>
                    <p style={{marginBottom: '0.5rem', color: '#333'}}>
                      <strong>Data:</strong> {new Date(selectedRequest.date).toLocaleDateString()}
                    </p>
                    <p style={{marginBottom: '1rem', color: '#333'}}>
                      <strong>Status:</strong> 
                      <span style={{color: getStatusColor(selectedRequest.status), fontWeight: 'bold', marginLeft: '0.5rem'}}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              {((currentUser?.type === 'doador' && selectedRequest.status === 'pending') || (currentUser?.isAdmin && selectedRequest.isProductValidation)) && (
                <div style={{display: 'flex', gap: '1rem', borderTop: '2px solid #4A230A', paddingTop: '1rem'}}>
                  <button 
                    onClick={() => currentUser?.isAdmin ? approveProduct(selectedRequest.id) : handleApprove(selectedRequest.id)} 
                    className="btn btn-primary"
                    style={{flex: 1}}
                  >
                    {currentUser?.isAdmin ? 'Aprovar Anúncio' : 'Aprovar Solicitação'}
                  </button>
                  <button 
                    onClick={() => currentUser?.isAdmin ? rejectProduct(selectedRequest.id) : handleReject(selectedRequest.id)} 
                    className="btn btn-secondary"
                    style={{flex: 1, background: '#dc3545'}}
                  >
                    {currentUser?.isAdmin ? 'Rejeitar Anúncio' : 'Rejeitar Solicitação'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-chat-selected">
              <p>Selecione uma solicitação para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Requests
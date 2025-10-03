import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Requests = () => {
  const navigate = useNavigate()
  const { requests, updateRequestStatus, currentUser } = useApp()
  const [selectedRequest, setSelectedRequest] = useState(null)

  const handleApprove = (requestId) => {
    updateRequestStatus(requestId, 'approved')
  }

  const handleReject = (requestId) => {
    updateRequestStatus(requestId, 'rejected')
  }

  console.log('Current user:', currentUser)
  console.log('All requests:', requests)
  
  const filteredRequests = currentUser?.type === 'doador' 
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
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>Solicitações</h3>
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
                  <p>{currentUser?.type === 'doador' ? `Por: ${request.userName}` : `Status: ${getStatusText(request.status)}`}</p>
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
                      <strong>{currentUser?.type === 'doador' ? 'Interessado:' : 'Você manifestou interesse em:'}</strong> {currentUser?.type === 'doador' ? selectedRequest.userName : selectedRequest.productName}
                    </p>
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
              {currentUser?.type === 'doador' && selectedRequest.status === 'pending' && (
                <div style={{display: 'flex', gap: '1rem', borderTop: '2px solid #4A230A', paddingTop: '1rem'}}>
                  <button 
                    onClick={() => handleApprove(selectedRequest.id)} 
                    className="btn btn-primary"
                    style={{flex: 1}}
                  >
                    Aprovar Solicitação
                  </button>
                  <button 
                    onClick={() => handleReject(selectedRequest.id)} 
                    className="btn btn-secondary"
                    style={{flex: 1, background: '#dc3545'}}
                  >
                    Rejeitar Solicitação
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
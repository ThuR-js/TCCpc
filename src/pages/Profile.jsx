import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, requests, products } = useApp()

  const userRequests = requests.filter(req => req.userId === currentUser?.id)
  const pendingRequests = userRequests.filter(req => req.status === 'pending')
  
  // Para doadores
  const donorRequests = requests.filter(req => req.donorId === currentUser?.id)
  const pendingDonorRequests = donorRequests.filter(req => req.status === 'pending')
  const approvedDonations = donorRequests.filter(req => req.status === 'approved').length
  const userProducts = products.filter(product => product.donorId === currentUser?.id)

  const getRegistrationDate = () => {
    // Como não temos data real, vamos simular baseado no ID
    if (currentUser?.id) {
      const date = new Date(currentUser.id)
      return date.toLocaleDateString()
    }
    return new Date().toLocaleDateString()
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <h2 style={{marginBottom: '2rem', color: 'white'}}>Perfil</h2>
      
      <div className="profile-container">
        <div className="profile-card">
          <h3>Informações da Conta</h3>
          <div className="profile-info">
            <div className="info-item">
              <strong>Nome:</strong>
              <span>{currentUser?.name}</span>
            </div>
            <div className="info-item">
              <strong>Data de Registro:</strong>
              <span>{getRegistrationDate()}</span>
            </div>
            <div className="info-item">
              <strong>Tipo de Conta:</strong>
              <span>{currentUser?.type === 'donatario' ? 'Donatário' : 'Doador'}</span>
            </div>
          </div>
        </div>

        {currentUser?.type === 'doador' ? (
          <>
            <div className="profile-card">
              <h3>Estatísticas de Doação</h3>
              <div className="profile-info">
                <div className="info-item">
                  <strong>Produtos Cadastrados:</strong>
                  <span>{userProducts.length}</span>
                </div>
                <div className="info-item">
                  <strong>Doações Realizadas:</strong>
                  <span>{approvedDonations}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-card">
              <h3>Solicitações Recebidas</h3>
              {pendingDonorRequests.length === 0 ? (
                <p>Nenhuma solicitação pendente.</p>
              ) : (
                <div className="requests-summary">
                  {pendingDonorRequests.map(request => (
                    <div key={request.id} className="request-summary-item">
                      <div className="request-product">
                        <img 
                          src={request.productImage.startsWith('data:') ? request.productImage : `/${request.productImage}`} 
                          alt={request.productName}
                          className="request-thumb"
                        />
                        <div className="request-details">
                          <strong>{request.productName}</strong>
                          <p>Solicitado por: {request.userName}</p>
                          <p>Data: {new Date(request.date).toLocaleDateString()}</p>
                          <span className="status-pending">Aguardando sua resposta</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="profile-card">
            <h3>Solicitações em Andamento</h3>
            {pendingRequests.length === 0 ? (
              <p>Nenhuma solicitação pendente.</p>
            ) : (
              <div className="requests-summary">
                {pendingRequests.map(request => (
                  <div key={request.id} className="request-summary-item">
                    <div className="request-product">
                      <img 
                        src={request.productImage.startsWith('data:') ? request.productImage : `/${request.productImage}`} 
                        alt={request.productName}
                        className="request-thumb"
                      />
                      <div className="request-details">
                        <strong>{request.productName}</strong>
                        <p>Solicitado em: {new Date(request.date).toLocaleDateString()}</p>
                        <span className="status-pending">Aguardando resposta</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
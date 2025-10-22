import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, requests, products, updateUser } = useApp()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(currentUser?.name || currentUser?.nome || '')
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSaveName = async () => {
    if (!newName.trim()) {
      alert('Nome não pode estar vazio')
      return
    }

    setIsLoading(true)
    const result = await updateUser({ nome: newName.trim() })
    
    if (result.success) {
      setIsEditingName(false)
      alert('Nome atualizado com sucesso!')
    } else {
      alert(result.error || 'Erro ao atualizar nome')
    }
    setIsLoading(false)
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
              {isEditingName ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ 
                      padding: '5px', 
                      borderRadius: '4px', 
                      border: '1px solid #ccc',
                      fontSize: '14px'
                    }}
                  />
                  <button 
                    onClick={handleSaveName}
                    disabled={isLoading}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#4CAF50', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingName(false)
                      setNewName(currentUser?.name || currentUser?.nome || '')
                    }}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#f44336', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{currentUser?.name || currentUser?.nome}</span>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    style={{ 
                      padding: '3px 8px', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
            <div className="info-item">
              <strong>Email:</strong>
              <span>{currentUser?.email}</span>
            </div>
            <div className="info-item">
              <strong>Telefone:</strong>
              <span>{currentUser?.phone || currentUser?.telefone || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <strong>CPF:</strong>
              <span>{currentUser?.cpf || 'Não informado'}</span>
            </div>
            <div className="info-item">
              <strong>Data de Registro:</strong>
              <span>{currentUser?.dataCadastro || getRegistrationDate()}</span>
            </div>
            <div className="info-item">
              <strong>Tipo de Conta:</strong>
              <span>{(currentUser?.type === 'donatario' || currentUser?.nivelAcesso === 'DONATARIO') ? 'Donatário' : 'Doador'}</span>
            </div>
          </div>
        </div>

        {(currentUser?.type === 'doador' || currentUser?.nivelAcesso === 'DOADOR') ? (
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
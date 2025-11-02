import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, requests, products, updateUser, setProducts, resetProducts, setCurrentUser } = useApp()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(currentUser?.name || currentUser?.nome || '')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  // Debug: verificar se os dados estão carregando
  console.log('Profile - currentUser:', currentUser)
  console.log('Profile - products:', products?.length)
  console.log('Profile - requests:', requests?.length)

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

  const removeProduct = (productId) => {
    if (confirm('Tem certeza que deseja remover este anúncio?')) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      // Atualiza AMBOS os localStorage para garantir sincronização
      localStorage.setItem('products', JSON.stringify(updatedProducts))
      localStorage.setItem('products_global', JSON.stringify(updatedProducts))
      // Dispara evento para atualizar outros componentes
      window.dispatchEvent(new Event('localStorageUpdate'))
    }
  }

  const handleDeactivateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/usuario/${currentUser.id}/inativar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        alert('Conta inativada com sucesso!')
        setCurrentUser(null)
        sessionStorage.removeItem('currentUser')
        navigate('/login')
      } else {
        alert('Erro ao inativar conta')
      }
    } catch (error) {
      alert('Erro de conexão')
    }
    setShowDeactivateModal(false)
  }





  // Verificar se o usuário está carregado
  if (!currentUser) {
    return (
      <div className="container">
        <p style={{color: 'white'}}>Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Botão de teste simples */}
      <button 
        onClick={() => {
          console.log('Botão clicado!')
          navigate('/')
        }} 
        className="btn-back"
        style={{
          display: 'inline-block',
          visibility: 'visible',
          opacity: 1,
          backgroundColor: '#4A230A',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Voltar
      </button>
      

      
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
                    onClick={async () => {
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
                    }}
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
                      fontSize: '11px',
                      display: 'inline-block',
                      visibility: 'visible',
                      opacity: 1
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
            
            {/* Campos específicos para doadores */}
            {(currentUser?.nivelAcesso === 'DOADOR' || currentUser?.type === 'doador') && (
              <div style={{marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '2px solid #DFA983'}}>
                <h4 style={{color: '#DFA983', marginBottom: '1.5rem', fontSize: '18px', fontWeight: '600', textAlign: 'center'}}>Informações de Doador</h4>
                  
                <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                  <strong style={{color: '#fff', fontSize: '14px'}}>CPF (obrigatório):</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', justifyContent: 'center' }}>
                      <input 
                        type="text"
                        placeholder="00000000000"
                        maxLength="11"
                        value={currentUser?.cpfDoador || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          // Atualizar temporáriamente no estado local
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '14px',
                          width: '150px'
                        }}
                      />
                      <button 
                        onClick={async () => {
                          const cpfInput = document.querySelector('input[placeholder="00000000000"]')
                          const cpf = cpfInput.value.replace(/\D/g, '')
                          
                          if (cpf.length !== 11) {
                            alert('CPF deve ter 11 dígitos')
                            return
                          }
                          
                          setIsLoading(true)
                          const result = await updateUser({ cpfDoador: cpf })
                          if (result.success) {
                            alert('CPF atualizado com sucesso!')
                          } else {
                            alert(result.error || 'Erro ao atualizar CPF')
                          }
                          setIsLoading(false)
                        }}
                        disabled={isLoading}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Salvar
                      </button>
                    </div>
                </div>
                
                <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                  <strong style={{color: '#fff', fontSize: '14px'}}>Data de Nascimento (obrigatório):</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', justifyContent: 'center' }}>
                      <input 
                        type="date"
                        value={currentUser?.dataNascimento || ''}
                        onChange={(e) => {
                          // Atualizar temporáriamente no estado local
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '14px',
                          width: '150px'
                        }}
                      />
                      <button 
                        onClick={async () => {
                          const dateInput = document.querySelector('input[type="date"]')
                          const birthDate = dateInput.value
                          
                          if (!birthDate) {
                            alert('Data de nascimento é obrigatória')
                            return
                          }
                          
                          setIsLoading(true)
                          const result = await updateUser({ dataNascimento: birthDate })
                          if (result.success) {
                            alert('Data de nascimento atualizada com sucesso!')
                          } else {
                            alert(result.error || 'Erro ao atualizar data de nascimento')
                          }
                          setIsLoading(false)
                        }}
                        disabled={isLoading}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Salvar
                      </button>
                    </div>
                </div>
                
                <div style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                  <strong style={{color: '#fff', fontSize: '14px'}}>CEP (obrigatório):</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', justifyContent: 'center' }}>
                      <input 
                        type="text"
                        placeholder="00000000"
                        maxLength="8"
                        value={currentUser?.cep || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          // Atualizar temporáriamente no estado local
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          fontSize: '14px',
                          width: '150px'
                        }}
                      />
                      <button 
                        onClick={async () => {
                          const cepInput = document.querySelector('input[placeholder="00000000"]')
                          const cep = cepInput.value.replace(/\D/g, '')
                          
                          if (cep.length !== 8) {
                            alert('CEP deve ter 8 dígitos')
                            return
                          }
                          
                          setIsLoading(true)
                          const result = await updateUser({ cep: cep })
                          if (result.success) {
                            alert('CEP atualizado com sucesso!')
                          } else {
                            alert(result.error || 'Erro ao atualizar CEP')
                          }
                          setIsLoading(false)
                        }}
                        disabled={isLoading}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Salvar
                      </button>
                    </div>
                </div>
                
                <p style={{color: '#ff9800', fontSize: '13px', marginTop: '1rem', fontStyle: 'italic', textAlign: 'center', backgroundColor: '#2a1a0a', padding: '10px', borderRadius: '6px'}}>
                  ⚠️ Estes campos são obrigatórios para adicionar produtos como doador
                </p>
              </div>
            )}
            <div className="info-item">
              <strong>Tipo de Conta:</strong>
              {currentUser?.isAdmin ? (
                <span>Administrador</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select 
                    value={currentUser?.nivelAcesso || (currentUser?.type === 'donatario' ? 'DONATARIO' : 'DOADOR')}
                    onChange={async (e) => {
                      const newType = e.target.value
                      console.log('Current user before change:', currentUser)
                      setIsLoading(true)
                      try {
                        const response = await fetch(`http://localhost:8080/api/v1/usuario/${currentUser.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            ...currentUser, // Preserva TODOS os campos existentes
                            nivelAcesso: newType // Só altera o tipo de conta
                          })
                        })
                        
                        if (response.ok) {
                          const updatedUser = await response.json()
                          console.log('Updated user from API:', updatedUser)
                          
                          // Garantir que todos os dados sejam preservados
                          const mergedUser = {
                            ...currentUser, // Dados atuais
                            ...updatedUser, // Dados do servidor
                            nivelAcesso: newType // Garantir o novo tipo
                          }
                          
                          console.log('Merged user:', mergedUser)
                          setCurrentUser(mergedUser)
                          sessionStorage.setItem('currentUser', JSON.stringify(mergedUser))
                          alert(`Tipo de conta alterado para ${newType === 'DOADOR' ? 'Doador' : 'Donatário'} com sucesso!`)
                        } else {
                          alert('Erro ao alterar tipo de conta')
                        }
                      } catch (error) {
                        alert('Erro de conexão')
                      }
                      setIsLoading(false)
                    }}
                    disabled={isLoading}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="DONATARIO">Donatário</option>
                    <option value="DOADOR">Doador</option>
                  </select>
                  {isLoading && <span style={{fontSize: '12px', color: '#ccc'}}>Salvando...</span>}
                </div>
              )}
            </div>
            
            <div className="danger-zone" style={{marginTop: '2rem', padding: '1rem', border: '2px solid #ff4444', borderRadius: '8px', backgroundColor: '#2a1a1a'}}>
              <h4 style={{color: '#ff4444', marginBottom: '1rem'}}>Zona de Perigo</h4>
              <p style={{color: '#ccc', marginBottom: '1rem', fontSize: '14px'}}>Inativar sua conta irá desabilitar o acesso. Você pode reativar fazendo login novamente.</p>
              <button 
                onClick={() => setShowDeactivateModal(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Inativar Conta
              </button>
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

        {currentUser?.isAdmin && (
          <div className="profile-card" style={{marginTop: '2rem', borderTop: '2px solid #ff4444'}}>
            <h3 style={{color: '#ff4444'}}>Painel Administrativo - Remover Anúncios</h3>
            <div style={{marginBottom: '1rem'}}>
              <span style={{color: '#ccc'}}>Total de anúncios: {products.length}</span>
            </div>
            
            <div className="admin-products-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {products.slice(0, 10).map(product => (
                <div key={product.id} className="admin-product-item" style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '10px', 
                  border: '1px solid #333', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  backgroundColor: '#1a1a1a'
                }}>
                  <img 
                    src={product.image?.startsWith('data:') ? product.image : `/${product.image}`} 
                    alt={product.name}
                    style={{
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover', 
                      borderRadius: '4px',
                      marginRight: '15px'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg'
                      e.target.onerror = null
                    }}
                  />
                  <div style={{flex: 1}}>
                    <h5 style={{margin: '0 0 5px 0', color: 'white'}}>{product.name}</h5>
                    <p style={{margin: '0', color: '#ccc', fontSize: '14px'}}>Por: {product.donor}</p>
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: product.status === 'available' ? '#4CAF50' : 
                                     product.status === 'pending' ? '#FF9800' : '#f44336',
                      color: 'white'
                    }}>
                      {product.status === 'available' ? 'Disponível' : 
                       product.status === 'pending' ? 'Pendente' : 'Doado'}
                    </span>
                  </div>
                  <button 
                    onClick={() => removeProduct(product.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'inline-block',
                      visibility: 'visible',
                      opacity: 1
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}
              {products.length > 10 && (
                <p style={{textAlign: 'center', color: '#ccc', marginTop: '15px'}}>
                  Mostrando 10 de {products.length} anúncios.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showDeactivateModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#2a2a2a',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{color: '#ff4444', marginBottom: '1rem'}}>Confirmar Inativação</h3>
            <p style={{color: '#ccc', marginBottom: '2rem'}}>Tem certeza que deseja inativar sua conta? Você pode reativar fazendo login novamente.</p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
              <button 
                onClick={handleDeactivateAccount}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Sim, Inativar
              </button>
              <button 
                onClick={() => setShowDeactivateModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
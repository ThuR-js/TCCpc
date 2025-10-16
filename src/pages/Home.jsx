// Importações necessárias para estado, navegação e contexto
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Componente principal da página inicial
const Home = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  
  // Desestruturação do contexto global para acessar estados e funções
  const { 
    products, // Lista de todos os produtos
    filters, // Filtros ativos (tipo, tamanho, condição)
    setFilters, // Função para atualizar filtros
    searchTerm, // Termo de busca atual
    favorites, // Lista de IDs dos produtos favoritos
    toggleFavorite, // Função para adicionar/remover favoritos
    currentUser, // Usuário atualmente logado
    addRequest, // Função para adicionar solicitação de produto
    removeProduct, // Função para remover produto por ID
    removeProductByName, // Função para remover produto por nome
    getProductTypeFromSearch // Função que identifica tipo de produto pela busca
  } = useApp()
  
  // Estados locais para controle do modal de remoção
  const [showRemoveModal, setShowRemoveModal] = useState(false) // Controla se o modal está visível
  const [productToRemove, setProductToRemove] = useState(null) // Produto selecionado para remoção

  // Função que filtra quais produtos aparecem na tela
  const filteredProducts = products.filter(product => {
    // PASSO 1: Verifica se o usuário é doador
    let isDoador = false
    if (currentUser?.type === 'doador' || currentUser?.nivelAcesso === 'DOADOR') {
      isDoador = true
    }
    
    // PASSO 2: Aplica regras de visibilidade por tipo de usuário
    // Donatários e convidados só veem produtos aprovados
    if (!isDoador && product.status !== 'available') {
      return false
    }
    
    // Doadores veem seus próprios produtos + produtos aprovados de outros
    if (isDoador) {
      let canSee = false
      if (product.donorId === currentUser?.id) {
        canSee = true // Pode ver seus próprios produtos
      }
      if (product.status === 'available') {
        canSee = true // Pode ver produtos aprovados de outros
      }
      if (!canSee) {
        return false
      }
    }
    
    // PASSO 3: Aplica filtro de busca por nome do produto
    if (searchTerm !== '') {
      let nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      if (!nameMatch) {
        return false
      }
    }
    
    // PASSO 4: Aplica filtros de categoria, tamanho e condição
    if (filters.type !== '' && product.type !== filters.type) {
      return false
    }
    if (filters.size !== '' && product.size !== filters.size) {
      return false
    }
    if (filters.condition !== '' && product.condition !== filters.condition) {
      return false
    }
    
    // Se passou por todos os filtros, mostra o produto
    return true
  })

  // Função que abre a página de chat
  const startChat = () => {
    // Verifica se o usuário é convidado (não logado)
    if (currentUser?.isGuest === true || currentUser?.type === 'convidado') {
      alert('Faça login para enviar mensagens.')
      return // Para a execução aqui
    }
    // Se não é convidado, vai para a página de chat
    navigate('/chat')
  }

  // Função que registra interesse em um produto
  const handleProductInterest = (productId) => {
    // Verifica se o usuário é convidado (não logado)
    if (currentUser?.isGuest === true || currentUser?.type === 'convidado') {
      alert('Faça login para manifestar interesse.')
      return // Para a execução aqui
    }
    // Verifica se o usuário é donatário (quem recebe doações)
    if (currentUser?.type !== 'donatario') {
      return // Só donatários podem manifestar interesse
    }
    // Registra o interesse no produto
    addRequest(productId)
    alert('Interesse manifestado! O doador será notificado.')
  }

  // Função que abre o modal para confirmar remoção
  const handleRemoveClick = (e, product) => {
    e.stopPropagation() // Evita abrir a página do produto
    setProductToRemove(product) // Guarda qual produto vai ser removido
    setShowRemoveModal(true) // Mostra o modal de confirmação
  }

  // Função que remove o produto quando usuário confirma
  const confirmRemove = () => {
    if (productToRemove) {
      removeProduct(productToRemove.id) // Remove da lista
      setShowRemoveModal(false) // Fecha o modal
      setProductToRemove(null) // Limpa a seleção
    }
  }

  // Função que cancela a remoção
  const cancelRemove = () => {
    setShowRemoveModal(false) // Fecha o modal
    setProductToRemove(null) // Limpa a seleção
  }

  return (
    <div className="container">
      <div className="recent-section">
        <h2 className="section-title">Recém-publicados</h2>
        <div className="recent-grid">
          {currentUser && (currentUser.type === 'doador' || currentUser.nivelAcesso === 'DOADOR') && (
            <div className="recent-card add-product-card" onClick={() => navigate('/add-product')}>
              <div className="add-product-icon">+</div>
              <div className="product-info">
                <h3 className="product-name">Adicionar Produto</h3>
                <p className="product-details">Clique para adicionar um novo item</p>
              </div>
            </div>
          )}
          {filteredProducts.slice(0, 5).map(product => (
            <div key={product.id} className="recent-card" onClick={() => navigate(`/product/${product.id}`)}>
              <img 
                src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
                alt={product.name} 
                className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} 
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                  e.target.onerror = null
                }}
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-details">{product.size} • {product.condition}</p>
                <div className="product-donor">
                  <img src="/images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                  <span>{product.donor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="categories-section">
        <h2 className="section-title">Para você</h2>
        <div className="categories-nav">
          <button className={`category-btn ${filters.type === '' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: ''})}>
            Todos os itens
          </button>
          <button className={`category-btn ${filters.type === 'camiseta' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'camiseta'})}>
            Camisetas
          </button>
          <button className={`category-btn ${filters.type === 'calca' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'calca'})}>
            Calças
          </button>
          <button className={`category-btn ${filters.type === 'moletom' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'moletom'})}>
            Blusas
          </button>
          <button className={`category-btn ${filters.type === 'tenis' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'tenis'})}>
            Tênis
          </button>
          <button className={`category-btn ${filters.type === 'shorts' ? 'active' : ''}`} 
                  onClick={() => setFilters({...filters, type: 'shorts'})}>
            Shorts
          </button>
        </div>
      </div>
      
      <div className="search-filters">
        <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
          <option value="">Todos os tipos</option>
          <option value="camiseta">Camiseta</option>
          <option value="calca">Calça</option>
          <option value="moletom">Blusa</option>
          <option value="tenis">Tênis</option>
          <option value="shorts">Shorts</option>
        </select>
        <select value={filters.size} onChange={(e) => setFilters({...filters, size: e.target.value})}>
          <option value="">Todos os tamanhos</option>
          <option value="34">34</option>
          <option value="36">36</option>
          <option value="38">38</option>
          <option value="40">40</option>
          <option value="42">42</option>
          <option value="44">44</option>
          <option value="46">46</option>
          <option value="48">48</option>
        </select>
        <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})}>
          <option value="">Todas as condições</option>
          <option value="novo">Novo</option>
          <option value="seminovo">Seminovo</option>
          <option value="usado">Usado</option>
        </select>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className={`product-card ${product.status === 'donated' ? 'donated' : ''} ${product.status === 'pending' ? 'pending' : ''}`} 
               onClick={() => {
                 navigate(`/product/${product.id}`);
               }}>
            <img 
              src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
              alt={product.name} 
              className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} 
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
                    onClick={(e) => handleRemoveClick(e, product)}
                  >
                    Remover
                  </button>
                )}
              </div>
              <p className="product-details">Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.type === 'tenis' ? product.size : product.size}</span> • {product.type === 'moletom' ? 'Blusa' : product.type.charAt(0).toUpperCase() + product.type.slice(1)} • {product.condition}</p>
              <div className="product-donor">
                <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                <span>{product.donor}</span>
              </div>
              {product.status === 'pending' && <span className="product-status status-analyzing">Em Análise</span>}
              {product.status === 'analyzing' && <span className="product-status status-analyzing">Em Análise</span>}
              {product.status === 'donated' && <span className="product-status status-donated">Doado</span>}
              <div className="product-bottom">
                {product.status === 'available' && (
                  <div className="product-actions">
                    {product.chatEnabled && <button className="btn btn-primary" onClick={(e) => {e.stopPropagation(); startChat()}}>Chat</button>}
                    {product.whatsapp && <a href={`https://wa.me/55${product.whatsapp}`} className="btn btn-secondary" onClick={(e) => e.stopPropagation()}>WhatsApp</a>}
                    {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={(e) => {e.stopPropagation(); handleProductInterest(product.id)}}>Tenho Interesse</button>}
                  </div>
                )}
                <button 
                  className={`favorite-btn-card ${favorites.includes(product.id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showRemoveModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Deseja remover esse anúncio?</h3>
            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button onClick={confirmRemove} className="btn btn-primary">Sim</button>
              <button onClick={cancelRemove} className="btn btn-secondary">Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
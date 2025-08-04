import { useState, useEffect } from 'react'
import './App.css'
import LoginScreen from './LoginScreen'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [showInitialLogin, setShowInitialLogin] = useState(true)
  const [products, setProducts] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ type: '', size: '', condition: '' })
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState('chat1')
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const sampleProducts = [
    {
      id: 1,
      name: "Camiseta Hellstar Cinza",
      description: "Camiseta 100% algodão em ótimo estado",
      type: "camiseta",
      size: "M",
      condition: "seminovo",
      donor: "Maria Silva",
      donorId: 1,
      image: "images/Camisetas/camiseta-hellstar.webp",
      images: [
        "images/Camisetas/camiseta-hellstar.webp",
        "images/Camisetas/camiseta-hellstar2.webp"
      ],
      status: "available",
      whatsapp: "11999999999",
      chatEnabled: true
    },
    {
      id: 2,
      name: "Calça Baggy Lavagem Preta",
      description: "Calça jeans azul, tamanho 40",
      type: "calca",
      size: "M",
      condition: "usado",
      donor: "João Santos",
      donorId: 2,
      image: "images/Calças/calca-baggy.webp",
      images: [
        "images/Calças/calca-baggy.webp",
        "images/Calças/calca-baggy2.webp",
        "images/Calças/calca-baggy3.webp"
      ],
      status: "analyzing",
      whatsapp: "",
      chatEnabled: true
    },
    {
      id: 3,
      name: "Shorts Eric Emanuel",
      description: "Vestido estampado, nunca usado",
      type: "shorts",
      size: "M",
      condition: "novo",
      donor: "Ana Costa",
      donorId: 3,
      image: "images/Shorts/shorts-eric.webp",
      images: [
        "images/Shorts/shorts-eric.webp",
        "images/Shorts/shorts-eric.webp",
        "images/Shorts/shorts-eric.webp"
      ],
      status: "donated",
      whatsapp: "11888888888",
      chatEnabled: false
    },
    {
      id: 4,
      name: "Shorts Nike",
      description: "Tênis para corrida, pouco usado",
      type: "shorts",
      size: "M",
      condition: "seminovo",
      donor: "Carlos Lima",
      donorId: 4,
      image: "images/Shorts/shorts-nike2.webp",
      images: [
        "images/Shorts/shorts-nike.webp",
        "images/Shorts/shorts-nike2.webp"
      ],
      status: "available",
      whatsapp: "11777777777",
      chatEnabled: true
    },
    {
      id: 5,
      name: "Camiseta Stone Island Year of Dragon",
      description: "Casaco de lã quentinho para o inverno",
      type: "camiseta",
      size: "M",
      condition: "usado",
      donor: "Fernanda Oliveira",
      donorId: 5,
      image: "images/Camisetas/camiseta-stone.webp",
      images: [
        "images/Camisetas/camiseta-stone.webp",
        "images/Camisetas/camiseta-stone2.webp",
        "images/Camisetas/camiseta-stone3.webp",
        "images/Camisetas/camiseta-stone4.webp"
      ],
      status: "available",
      whatsapp: "",
      chatEnabled: true
    },
    {
      id: 6,
      name: "Calça Corteiz Devil Island",
      description: "Saia social preta, ideal para trabalho",
      type: "calca",
      size: "M",
      condition: "novo",
      donor: "Patricia Mendes",
      donorId: 6,
      image: "images/Calças/calca-corteiz.webp",
      images: [
        "images/Calças/calca-corteiz.webp",
        "images/Calças/calca-corteiz2.webp",
        "images/Calças/calca-corteiz3.webp",
        "images/Calças/calca-corteiz4.webp"
      ],
      status: "analyzing",
      whatsapp: "11666666666",
      chatEnabled: true
    },
    {
      id: 7,
      name: "Jaqueta Palace Stella",
      description: "Jaqueta Palace Stella em ótimo estado, pouco usada",
      type: "moletom",
      size: "M",
      condition: "seminovo",
      donor: "Lucas Ferreira",
      donorId: 7,
      image: "images/Moletons/Jaquetapalacestella.webp",
      images: [
        "images/Moletons/Jaquetapalacestella.webp",
        "images/Moletons/Jaquetapalacestella2.webp",
        "images/Moletons/Jaquetapalacestella3.webp"
      ],
      status: "available",
      whatsapp: "11555555555",
      chatEnabled: true
    },
    {
      id: 8,
      name: "Moletom Champion",
      description: "Moletom Champion original, muito confortável",
      type: "moletom",
      size: "M",
      condition: "usado",
      donor: "Beatriz Santos",
      donorId: 8,
      image: "images/Moletons/MoletomChampion.webp",
      images: [
        "images/Moletons/MoletomChampion.webp",
        "images/Moletons/MoletomChampion2.webp",
        "images/Moletons/MoletomChampion3.webp"
      ],
      status: "available",
      whatsapp: "11444444444",
      chatEnabled: true
    }
  ]

  useEffect(() => {
    setProducts(sampleProducts)
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      setShowInitialLogin(false)
    }
  }, [])

  const handleInitialLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('lastUser', JSON.stringify(user))
      setShowInitialLogin(false)
      setCurrentPage(user.type === 'doador' ? 'donor' : 'recipient')
    } else {
      alert('Email ou senha incorretos')
    }
  }

  const handleContinueWithoutLogin = () => {
    // Criar conta de convidado com dados da última conta logada
    const lastUser = localStorage.getItem('lastUser')
    const guestUser = {
      id: 'guest',
      name: 'Convidado',
      email: 'convidado@temp.com',
      type: 'convidado',
      isGuest: true,
      lastUserData: lastUser ? JSON.parse(lastUser) : null
    }
    setCurrentUser(guestUser)
    setShowInitialLogin(false)
    setCurrentPage('home')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const email = e.target.loginEmail.value
    const password = e.target.loginPassword.value
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('lastUser', JSON.stringify(user))
      setShowLoginModal(false)
      setCurrentPage(user.type === 'doador' ? 'donor' : 'recipient')
    } else {
      alert('Email ou senha incorretos')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const userData = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      type: formData.get('userType')
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.email === userData.email)) {
      alert('Email já cadastrado')
      return
    }
    
    users.push(userData)
    localStorage.setItem('users', JSON.stringify(users))
    setShowRegisterModal(false)
    alert('Analisaremos sua solicitação de cadastro em 24h, fique atento ao E-mail cadastrado.')
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const newProduct = {
      id: Date.now(),
      name: formData.get('name'),
      description: formData.get('description'),
      type: formData.get('type'),
      size: formData.get('size'),
      condition: formData.get('condition'),
      donor: currentUser.name,
      donorId: currentUser.id,
      image: `https://via.placeholder.com/280x200/e91e63/white?text=${encodeURIComponent(formData.get('name'))}`,
      status: 'available',
      whatsapp: formData.get('whatsapp') || '',
      chatEnabled: formData.get('chatEnabled') === 'on'
    }
    
    setProducts([...products, newProduct])
    setShowAddProductModal(false)
    e.target.reset()
  }

  const handleProductInterest = (productId) => {
    if (!currentUser || currentUser.type !== 'donatario') return
    
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'analyzing' } : p
    )
    setProducts(updatedProducts)
    alert('Interesse manifestado! O doador será notificado.')
  }

  const approveRequest = (productId) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'donated' } : p
    )
    setProducts(updatedProducts)
  }

  const rejectRequest = (productId) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'available' } : p
    )
    setProducts(updatedProducts)
  }

  const startChat = (productId) => {
    setCurrentChat('chat1')
    setCurrentPage('chat')
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    // Verificar se o usuário é convidado ao tentar enviar
    if (!currentUser || currentUser.isGuest) {
      setShowLoginModal(true)
      return
    }
    
    const messageElement = document.createElement('div')
    messageElement.className = 'message sent'
    messageElement.innerHTML = `<strong>Você:</strong> ${newMessage}`
    
    const chatMessages = document.getElementById('chatMessages')
    chatMessages.appendChild(messageElement)
    
    setNewMessage('')
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length)
    }
  }

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length)
    }
  }

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.type === '' || product.type === filters.type) &&
      (filters.size === '' || product.size === filters.size) &&
      (filters.condition === '' || product.condition === filters.condition)
    )
  })

  const userProducts = products.filter(p => p.donorId === currentUser?.id)



  if (showInitialLogin) {
    return (
      <LoginScreen 
        onLogin={handleInitialLogin}
        onContinueWithoutLogin={handleContinueWithoutLogin}
      />
    )
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>DoeConect+</h1>
          </div>
          <div className="header-search">
            <input 
              type="text" 
              placeholder="Buscar roupas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <nav className="nav">
            {currentUser ? (
              <>
                <span>Olá, {currentUser.name}{currentUser.isGuest ? ' (Convidado)' : ''}</span>
                <button onClick={() => {
                  setCurrentPage('home');
                  setSelectedProduct(null);
                }}>Início</button>
                {!currentUser.isGuest && <button onClick={() => setCurrentPage(currentUser.type === 'doador' ? 'donor' : 'recipient')}>Painel</button>}
                {currentUser.isGuest ? (
                  <>
                    <button onClick={() => setShowInitialLogin(true)}>Entrar</button>
                    <button onClick={() => setShowRegisterModal(true)}>Cadastrar</button>
                  </>
                ) : (
                  <button onClick={() => {
                    localStorage.removeItem('currentUser');
                    setCurrentUser(null);
                    window.location.reload();
                  }}>Sair</button>
                )}
              </>
            ) : (
              <>
                <a href="#" onClick={() => {
                  setCurrentPage('home');
                  setSelectedProduct(null);
                }}>Início</a>
                <a href="#" onClick={() => setShowInitialLogin(true)}>Entrar</a>
                <a href="#" onClick={() => setShowRegisterModal(true)}>Cadastrar</a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="container">
            <div className="recent-section">
              <h2 className="section-title">Recém-publicados</h2>
              <div className="recent-grid">
                {products.slice(0, 5).map(product => (
                  <div key={product.id} className="recent-card" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} />
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-details">{product.size} • {product.condition}</p>
                      <div className="product-donor">
                        <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
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
                  Moletoms
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
                <option value="moletom">Moletom</option>
                <option value="tenis">Tênis</option>
                <option value="shorts">Shorts</option>
              </select>
              <select value={filters.size} onChange={(e) => setFilters({...filters, size: e.target.value})}>
                <option value="">Todos os tamanhos</option>
                <option value="PP">PP</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
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
                <div key={product.id} className={`product-card ${product.status === 'donated' ? 'donated' : ''}`} 
                     onClick={() => {
                       setSelectedProduct(product);
                       setCurrentImageIndex(0);
                       setCurrentPage('productDetails');
                     }}>
                  <img src={product.image} alt={product.name} className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-details">Tam. <span style={{color: '#4A230A', fontWeight: 'bold'}}>{product.size}</span> • {product.type.charAt(0).toUpperCase() + product.type.slice(1)} • {product.condition}</p>
                    <div className="product-donor">
                      <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                      <span>{product.donor}</span>
                    </div>
                    {product.status === 'analyzing' && <span className="product-status status-analyzing">Em Análise</span>}
                    {product.status === 'donated' && <span className="product-status status-donated">Doado</span>}
                    {product.status === 'available' && (
                      <div className="product-actions">
                        {product.chatEnabled && <button className="btn btn-primary" onClick={(e) => {e.stopPropagation(); startChat(product.id)}}>Chat</button>}
                        {product.whatsapp && <a href={`https://wa.me/55${product.whatsapp}`} className="btn btn-secondary" onClick={(e) => e.stopPropagation()}>WhatsApp</a>}
                        {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={(e) => {e.stopPropagation(); handleProductInterest(product.id)}}>Tenho Interesse</button>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donor Dashboard */}
        {currentPage === 'donor' && currentUser && (
          <div className="container">
            <div className="dashboard-header">
              <h2>Painel do Doador</h2>
              <button onClick={() => setShowAddProductModal(true)} className="btn-primary">Adicionar Produto</button>
            </div>
            <div className="products-grid">
              {userProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-details">{product.size} • {product.type} • {product.condition}</p>
                    <div className="product-donor">
                      <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                      <span>{product.donor}</span>
                    </div>
                    {product.status === 'analyzing' && <span className="product-status status-analyzing">Em Análise</span>}
                    {product.status === 'donated' && <span className="product-status status-donated">Doado</span>}
                    {product.status === 'analyzing' && (
                      <div className="product-actions">
                        <button className="btn btn-primary" onClick={(e) => {e.stopPropagation(); approveRequest(product.id)}}>Aprovar</button>
                        <button className="btn btn-outline" onClick={(e) => {e.stopPropagation(); rejectRequest(product.id)}}>Rejeitar</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipient Dashboard */}
        {currentPage === 'recipient' && currentUser && (
          <div className="container">
            <h2>Painel do Donatário</h2>
            <p>Seus interesses aparecerão aqui quando você manifestar interesse em algum produto.</p>
          </div>
        )}

        {/* Chat Page */}
        {currentPage === 'chat' && (
          <div className="container">
            <button onClick={() => {
              setCurrentPage('home');
              setSelectedProduct(null);
            }} className="btn-back">← Voltar</button>
            <div className="chat-container">
              <div className="chat-sidebar">
                <h3>Conversas</h3>
                <div className={`chat-item ${currentChat === 'chat1' ? 'active' : ''}`} onClick={() => setCurrentChat('chat1')}>
                  <div className="chat-preview">
                    <strong>Maria Silva</strong>
                    <p>Camiseta Hellstar disponível!</p>
                  </div>
                </div>
                <div className={`chat-item ${currentChat === 'chat2' ? 'active' : ''}`} onClick={() => setCurrentChat('chat2')}>
                  <div className="chat-preview">
                    <strong>João Santos</strong>
                    <p>Calça baggy ainda disponível</p>
                  </div>
                </div>
                <div className={`chat-item ${currentChat === 'chat3' ? 'active' : ''}`} onClick={() => setCurrentChat('chat3')}>
                  <div className="chat-preview">
                    <strong>Ana Costa</strong>
                    <p>Obrigada pelo interesse!</p>
                  </div>
                </div>
                <div className={`chat-item ${currentChat === 'chat4' ? 'active' : ''}`} onClick={() => setCurrentChat('chat4')}>
                  <div className="chat-preview">
                    <strong>Carlos Lima</strong>
                    <p>Shorts Nike perfeito para verão</p>
                  </div>
                </div>
              </div>
              <div className="chat-main">
                <div id="chatMessages">
                  {currentChat === 'chat1' && (
                    <>
                      <div className="message received">
                        <strong>Maria Silva:</strong> Oi! Vi que você se interessou pela camiseta Hellstar. Ela está em ótimo estado!
                      </div>
                      <div className="message received">
                        <strong>Maria Silva:</strong> Comprei há uns 6 meses mas quase não usei, só umas 3 vezes.
                      </div>
                      <div className="message sent">
                        <strong>Você:</strong> Que legal! Ainda está disponível?
                      </div>
                      <div className="message received">
                        <strong>Maria Silva:</strong> Sim! Posso separar pra você. Me chama no WhatsApp: (11) 99999-9999
                      </div>
                    </>
                  )}
                  {currentChat === 'chat2' && (
                    <>
                      <div className="message received">
                        <strong>João Santos:</strong> Olá! A calça baggy ainda está disponível sim!
                      </div>
                      <div className="message received">
                        <strong>João Santos:</strong> É uma calça bem estilosa, usei bastante mas ainda está em bom estado.
                      </div>
                      <div className="message sent">
                        <strong>Você:</strong> Perfeito! Como podemos combinar a retirada?
                      </div>
                      <div className="message received">
                        <strong>João Santos:</strong> Posso deixar na portaria do meu prédio. Te passo o endereço por aqui mesmo.
                      </div>
                    </>
                  )}
                  {currentChat === 'chat3' && (
                    <>
                      <div className="message sent">
                        <strong>Você:</strong> Oi Ana! Vi o shorts Eric Emanuel, ainda está disponível?
                      </div>
                      <div className="message received">
                        <strong>Ana Costa:</strong> Oi! Infelizmente já foi doado ontem 😔
                      </div>
                      <div className="message received">
                        <strong>Ana Costa:</strong> Mas obrigada pelo interesse! Vou postar mais roupas em breve.
                      </div>
                      <div className="message sent">
                        <strong>Você:</strong> Sem problemas! Vou ficar de olho nas próximas doações.
                      </div>
                    </>
                  )}
                  {currentChat === 'chat4' && (
                    <>
                      <div className="message received">
                        <strong>Carlos Lima:</strong> Oi! O shorts Nike é perfeito para o verão!
                      </div>
                      <div className="message received">
                        <strong>Carlos Lima:</strong> Usei poucas vezes, é bem confortável para exercícios.
                      </div>
                      <div className="message sent">
                        <strong>Você:</strong> Que tamanho é mesmo?
                      </div>
                      <div className="message received">
                        <strong>Carlos Lima:</strong> É tamanho M. Quer que eu tire mais fotos?
                      </div>
                      <div className="message sent">
                        <strong>Você:</strong> Seria ótimo! Pode mandar por aqui mesmo.
                      </div>
                    </>
                  )}
                  {!currentChat && (
                    <div className="no-chat-selected">
                      <p>Selecione uma conversa para começar</p>
                    </div>
                  )}
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Digite sua mensagem..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                  <button onClick={sendMessage}>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Details Page */}
        {currentPage === 'productDetails' && selectedProduct && (
          <div className="container">
            <button onClick={() => {
              setCurrentPage('home');
              setSelectedProduct(null);
            }} className="btn-back">← Voltar</button>
            <div className="product-detail-container">
              <div className="carousel-container">
                <div className="carousel">
                  <img 
                    src={selectedProduct.images ? selectedProduct.images[currentImageIndex] : selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="carousel-image active" 
                  />
                  <button className="carousel-nav carousel-prev" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="carousel-nav carousel-next" onClick={nextImage}>
                    ›
                  </button>
                </div>
              </div>
              <div className="product-detail-info">
                <h1 className="product-detail-title">{selectedProduct.name}</h1>
                <p className="product-detail-description">{selectedProduct.description}</p>
                <div className="product-detail-specs">
                  <p><strong>Tamanho:</strong> {selectedProduct.size}</p>
                  <p><strong>Tipo:</strong> {selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1)}</p>
                  <p><strong>Condição:</strong> {selectedProduct.condition}</p>
                  <div className="product-donor">
                    <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                    <span><strong>Doador:</strong> {selectedProduct.donor}</span>
                  </div>
                </div>
                <div className="product-detail-actions">
                  {selectedProduct.chatEnabled && <button className="btn btn-primary" onClick={() => startChat(selectedProduct.id)}>Chat</button>}
                  {selectedProduct.whatsapp && <a href={`https://wa.me/55${selectedProduct.whatsapp}`} className="btn btn-secondary">WhatsApp</a>}
                  {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={() => handleProductInterest(selectedProduct.id)}>Tenho Interesse</button>}
                </div>
              </div>
            </div>
            
            <div style={{marginTop: '4rem'}}>
              <h2 className="section-title">Veja também</h2>
              <div className="recent-grid">
                {products.filter(p => p.id !== selectedProduct.id).slice(0, 4).map(product => (
                  <div key={product.id} className="recent-card" onClick={() => setSelectedProduct(product)}>
                    <img src={product.image} alt={product.name} className={`product-image ${product.status === 'donated' ? 'donated' : ''}`} />
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-details">{product.size} • {product.condition}</p>
                      <div className="product-donor">
                        <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                        <span>{product.donor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowLoginModal(false)}>&times;</span>
            <h2>Entrar</h2>
            <form onSubmit={handleLogin}>
              <input type="email" name="loginEmail" placeholder="E-mail" required />
              <input type="password" name="loginPassword" placeholder="Senha" required />
              <button type="submit">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowRegisterModal(false)}>&times;</span>
            <h2>Cadastrar</h2>
            <form onSubmit={handleRegister}>
              <input type="text" name="name" placeholder="Nome completo" required />
              <input type="email" name="email" placeholder="E-mail" required />
              <input type="password" name="password" placeholder="Senha" required />
              <select name="userType" required>
                <option value="">Selecione o tipo de usuário</option>
                <option value="doador">Doador</option>
                <option value="donatario">Donatário</option>
              </select>
              <button type="submit">Cadastrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddProductModal(false)}>&times;</span>
            <h2>Adicionar Produto</h2>
            <form onSubmit={handleAddProduct}>
              <input type="text" name="name" placeholder="Nome do item" required />
              <textarea name="description" placeholder="Descrição"></textarea>
              <select name="type" required>
                <option value="">Tipo de roupa</option>
                <option value="camiseta">Camiseta</option>
                <option value="calca">Calça</option>
                <option value="moletom">Moletom</option>
                <option value="tenis">Tênis</option>
                <option value="shorts">Shorts</option>
              </select>
              <select name="size" required>
                <option value="">Tamanho</option>
                <option value="PP">PP</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>
              <select name="condition" required>
                <option value="">Estado de conservação</option>
                <option value="novo">Novo</option>
                <option value="seminovo">Seminovo</option>
                <option value="usado">Usado</option>
              </select>
              <input type="tel" name="whatsapp" placeholder="WhatsApp (opcional)" />
              <label>
                <input type="checkbox" name="chatEnabled" /> Permitir chat interno
              </label>
              <button type="submit">Adicionar Produto</button>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal - Only for Recent Products */}
      {selectedProduct && currentPage === 'home' && (
        <div className="modal" style={{display: 'block'}}>
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedProduct(null)}>&times;</span>
            <div className="product-detail-container">
              <div className="carousel-container">
                <div className="carousel">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="carousel-image active" />
                </div>
              </div>
              <div className="product-detail-info">
                <h1 className="product-detail-title">{selectedProduct.name}</h1>
                <p className="product-detail-description">{selectedProduct.description}</p>
                <div className="product-detail-specs">
                  <p><strong>Tamanho:</strong> {selectedProduct.size}</p>
                  <p><strong>Tipo:</strong> {selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1)}</p>
                  <p><strong>Condição:</strong> {selectedProduct.condition}</p>
                  <div className="product-donor">
                    <img src="images/avatar2.webp" alt="Avatar" className="donor-avatar" />
                    <span><strong>Doador:</strong> {selectedProduct.donor}</span>
                  </div>
                </div>
                <div className="product-detail-actions">
                  {selectedProduct.chatEnabled && <button className="btn btn-primary" onClick={() => startChat(selectedProduct.id)}>Chat</button>}
                  {selectedProduct.whatsapp && <a href={`https://wa.me/55${selectedProduct.whatsapp}`} className="btn btn-secondary">WhatsApp</a>}
                  {currentUser && currentUser.type === 'donatario' && <button className="btn btn-outline" onClick={() => handleProductInterest(selectedProduct.id)}>Tenho Interesse</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
1
export default App
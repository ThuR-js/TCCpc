import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const { products, setProducts, currentUser, resetProducts } = useApp()
  const navigate = useNavigate()

  const pendingProducts = products ? products.filter(p => p.status === 'pending') : []
  const allProducts = products || []

  console.log('Current user admin status:', currentUser?.isAdmin)
  console.log('All products count:', allProducts.length)

  if (!currentUser?.isAdmin) {
    return (
      <div className="container">
        <h2 style={{color: 'white'}}>Acesso Negado</h2>
        <p style={{color: 'white'}}>Você não tem permissão para acessar esta página.</p>
        <button 
          onClick={() => {
            const adminUser = { ...currentUser, isAdmin: true }
            localStorage.setItem('currentUser', JSON.stringify(adminUser))
            window.location.reload()
          }} 
          className="btn btn-primary"
        >
          Tornar Admin (Teste)
        </button>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Fazer Login
        </button>
      </div>
    )
  }

  const approveProduct = (productId) => {
    if (!products) return
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'available', approvedDate: new Date().toISOString() } : p
    )
    setProducts(updatedProducts)
    // Salva para todos os usuários
    localStorage.setItem('products_global', JSON.stringify(updatedProducts))
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    // Dispara evento para atualizar outros componentes
    window.dispatchEvent(new Event('localStorageUpdate'))
  }

  const rejectProduct = (productId) => {
    if (!products) return
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    localStorage.setItem('products_global', JSON.stringify(updatedProducts))
    // Dispara evento para atualizar outros componentes
    window.dispatchEvent(new Event('localStorageUpdate'))
  }

  const removeProduct = (productId) => {
    if (!products) return
    if (confirm('Tem certeza que deseja remover este anúncio?')) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      localStorage.setItem('products', JSON.stringify(updatedProducts))
      localStorage.setItem('products_global', JSON.stringify(updatedProducts))
      // Dispara evento para atualizar outros componentes
      window.dispatchEvent(new Event('localStorageUpdate'))
    }
  }

  const removeJeffersonProducts = () => {
    if (confirm('Remover todos os produtos do Jefferson?')) {
      const jeffersonProducts = products.filter(p => 
        p.donor?.toLowerCase().includes('jefferson') || 
        p.donor?.toLowerCase().includes('jeferson')
      )
      
      jeffersonProducts.forEach(product => {
        const updatedProducts = products.filter(p => p.id !== product.id)
        setProducts(updatedProducts)
        localStorage.setItem('products', JSON.stringify(updatedProducts))
      })
      
      alert(`${jeffersonProducts.length} produtos do Jefferson removidos`)
    }
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/login')} className="btn-back">← Sair</button>
      <h2 style={{color: 'white', marginBottom: '2rem'}}>Painel Administrativo</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Anúncios Pendentes</h3>
          <span>{pendingProducts.length}</span>
        </div>
        <div className="stat-card">
          <h3>Total de Anúncios</h3>
          <span>{allProducts.length}</span>
        </div>
        <div className="stat-card">
          <button 
            onClick={removeJeffersonProducts}
            className="btn btn-danger"
            style={{width: '100%', padding: '10px', marginBottom: '10px'}}
          >
            Remover Produtos Jefferson
          </button>
          <button 
            onClick={resetProducts}
            className="btn btn-primary"
            style={{width: '100%', padding: '10px'}}
          >
            Resetar Produtos
          </button>
        </div>
      </div>

      <div className="pending-products">
        <h3 style={{color: 'white', marginBottom: '1rem'}}>Anúncios para Validação</h3>
        
        {pendingProducts.length === 0 ? (
          <p style={{color: 'white'}}>Nenhum anúncio pendente</p>
        ) : (
          <div className="products-grid">
            {pendingProducts.map(product => (
              <div key={product.id} className="product-card admin-card">
                <img 
                  src={product.image?.startsWith('data:') ? product.image : `/${product.image}`} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg'
                    e.target.onerror = null
                  }}
                />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p><strong>Doador:</strong> {product.donor}</p>
                  <p><strong>Categoria:</strong> {product.type}</p>
                  <p><strong>Tamanho:</strong> {product.size}</p>
                  <p><strong>Condição:</strong> {product.condition}</p>
                </div>
                <div className="admin-actions">
                  <button 
                    onClick={() => approveProduct(product.id)}
                    className="btn btn-success"
                  >
                    Aprovar
                  </button>
                  <button 
                    onClick={() => rejectProduct(product.id)}
                    className="btn btn-danger"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{marginTop: '3rem', borderTop: '2px solid #333', paddingTop: '2rem'}}>
        <h3 style={{color: 'white', marginBottom: '1rem'}}>REMOVER ANÚNCIOS ({allProducts.length})</h3>
        
        <div className="products-grid">
          {allProducts.map(product => (
            <div key={product.id} className="product-card admin-card">
              <img 
                src={product.image?.startsWith('data:') ? product.image : `/${product.image}`} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'
                  e.target.onerror = null
                }}
              />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p><strong>Doador:</strong> {product.donor}</p>
                <p><strong>Status:</strong> {product.status}</p>
              </div>
              <div className="admin-actions">
                <button 
                  onClick={() => removeProduct(product.id)}
                  className="btn btn-danger"
                >
                  REMOVER
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
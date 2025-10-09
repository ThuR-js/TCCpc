import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const { products, setProducts, currentUser } = useApp()
  const navigate = useNavigate()

  if (!currentUser?.isAdmin) {
    navigate('/login')
    return null
  }

  const pendingProducts = products.filter(p => p.status === 'pending')

  const approveProduct = (productId) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, status: 'available' } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  const rejectProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
  }

  return (
    <div className="container">
      <h2 style={{color: 'white', marginBottom: '2rem'}}>Painel Administrativo</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Anúncios Pendentes</h3>
          <span>{pendingProducts.length}</span>
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
                <img src={product.image} alt={product.name} />
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
    </div>
  )
}

export default AdminPanel
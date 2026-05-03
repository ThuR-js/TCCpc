// Importações necessárias para navegação e contexto
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useEffect, useRef, useState } from 'react'

// Componente do cabeçalho da aplicação
const Header = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  
  // Estados locais para o dropdown de busca
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchPlaceholder, setSearchPlaceholder] = useState('Buscar roupas...')
  
  // Desestruturação do contexto global
  const { 
    currentUser, // Usuário atualmente logado
    setCurrentUser, // Função para alterar usuário atual
    searchTerm, // Termo de busca atual
    setSearchTerm, // Função para alterar termo de busca
    favorites, // Lista de produtos favoritos
    showDropdown, // Estado do menu dropdown
    setShowDropdown, // Função para controlar dropdown
    products, // Lista de produtos
    setFilters // Função para definir filtros
  } = useApp()

  // Função para buscar produtos em tempo real
  const searchProducts = (term) => {
    if (!term.trim()) {
      setSearchResults([])
      setShowSearchDropdown(false)
      setSearchPlaceholder('Buscar roupas...')
      return
    }

    // Verificar se é uma categoria reconhecida
    const termLower = term.toLowerCase().trim()
    const routeMap = {
      'camiseta': '/camisetas', 'camisetas': '/camisetas', 'camisa': '/camisetas', 'camisas': '/camisetas', 'cropped': '/camisetas', 'camis': '/camisetas',
      'calça': '/calcas', 'calças': '/calcas', 'calca': '/calcas', 'calcas': '/calcas', 'jeans': '/calcas', 'calc': '/calcas',
      'moletom': '/blusas', 'moletons': '/blusas', 'blusa': '/blusas', 'blusas': '/blusas', 'casaco': '/blusas', 'jaqueta': '/blusas', 'molet': '/blusas',
      'tênis': '/tenis', 'tenis': '/tenis', 'sapato': '/tenis', 'sapatos': '/tenis', 'calçado': '/tenis', 'calçados': '/tenis', 'chuteira': '/tenis', 'bota': '/tenis', 'ten': '/tenis',
      'short': '/shorts', 'shorts': '/shorts', 'bermuda': '/shorts', 'bermudas': '/shorts', 'shor': '/shorts'
    }
    
    let isCategory = false
    for (const [key, value] of Object.entries(routeMap)) {
      if (termLower.includes(key) || key.includes(termLower)) {
        isCategory = true
        const categoryNames = {
          '/camisetas': 'Camisetas',
          '/calcas': 'Calças', 
          '/blusas': 'Blusas',
          '/tenis': 'Tênis',
          '/shorts': 'Shorts'
        }
        setSearchPlaceholder(`Pressione Enter para ir para ${categoryNames[value]}`)
        break
      }
    }
    
    if (!isCategory) {
      setSearchPlaceholder('Buscar roupas...')
    }

    const filtered = products
      .filter(product => {
        const nameMatch = product.name.toLowerCase().includes(term.toLowerCase())
        const typeMatch = product.type.toLowerCase().includes(term.toLowerCase())
        return (nameMatch || typeMatch) && product.status === 'available'
      })
      .slice(0, 6) // Limita a 6 resultados

    setSearchResults(filtered)
    setShowSearchDropdown(filtered.length > 0)
  }

  // Atualiza resultados quando searchTerm muda
  useEffect(() => {
    searchProducts(searchTerm)
  }, [searchTerm, products])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowDropdown])

  // Função para selecionar um produto do dropdown
  const selectProduct = (product) => {
    setSearchTerm('')
    setShowSearchDropdown(false)
    navigate(`/product/${product.id}`)
  }

  // Função para lidar com Enter na busca
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const term = searchTerm.toLowerCase().trim()
      
      // Mapear termos de busca para rotas específicas
      const routeMap = {
        // Camisetas
        'camiseta': '/camisetas',
        'camisetas': '/camisetas', 
        'camisa': '/camisetas',
        'camisas': '/camisetas',
        'cropped': '/camisetas',
        'camis': '/camisetas',
        // Calças
        'calça': '/calcas',
        'calças': '/calcas',
        'calca': '/calcas',
        'calcas': '/calcas',
        'jeans': '/calcas',
        'calc': '/calcas',
        // Moletons/Blusas
        'moletom': '/blusas',
        'moletons': '/blusas',
        'blusa': '/blusas',
        'blusas': '/blusas',
        'casaco': '/blusas',
        'jaqueta': '/blusas',
        'molet': '/blusas',
        // Tênis
        'tênis': '/tenis',
        'tenis': '/tenis',
        'sapato': '/tenis',
        'sapatos': '/tenis',
        'calçado': '/tenis',
        'calçados': '/tenis',
        'chuteira': '/tenis',
        'bota': '/tenis',
        'ten': '/tenis',
        // Shorts
        'short': '/shorts',
        'shorts': '/shorts',
        'bermuda': '/shorts',
        'bermudas': '/shorts',
        'shor': '/shorts'
      }
      
      // Verificar correspondência exata primeiro
      let route = routeMap[term]
      
      // Se não encontrou correspondência exata, verificar se o termo contém alguma palavra-chave
      if (!route) {
        for (const [key, value] of Object.entries(routeMap)) {
          if (term.includes(key) || key.includes(term)) {
            route = value
            break
          }
        }
      }
      
      if (route) {
        // Navegar para a página específica da categoria
        navigate(route)
      }
      
      // Limpar busca e fechar dropdown
      setSearchTerm('')
      setShowSearchDropdown(false)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>DoeConect+</h1>
        </div>
        <div className="header-search" ref={searchRef}>
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowSearchDropdown(true)}
            onKeyDown={handleSearchSubmit}
          />
          {showSearchDropdown && (
            <div className="search-dropdown">
              {searchResults.map(product => (
                <div 
                  key={product.id} 
                  className="search-result-item"
                  onClick={() => selectProduct(product)}
                >
                  <img 
                    src={product.image.startsWith('data:') ? product.image : `/${product.image}`} 
                    alt={product.name}
                    className="search-result-image"
                  />
                  <div className="search-result-info">
                    <div className="search-result-name">{product.name}</div>
                    <div className="search-result-details">
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)} • Tam. {product.size} • {product.condition}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <nav className="nav">
          {currentUser ? (
            <>
              <span>Olá, {currentUser.name || currentUser.nome}{currentUser.isGuest ? ' (Convidado)' : ''}</span>
              <button onClick={() => navigate('/')}>Início</button>
              <button onClick={() => navigate('/profile')}>Perfil</button>
              {currentUser.isGuest ? (
                <div className="user-menu" ref={dropdownRef}>
                  <button onClick={() => setShowDropdown(!showDropdown)} className="menu-trigger">
                    ⋮
                  </button>
                  {showDropdown && (
                    <div className="menu-dropdown show">
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                        setShowDropdown(false);
                      }}>Entrar</a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate('/register');
                        setShowDropdown(false);
                      }}>Cadastrar</a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="user-menu" ref={dropdownRef}>
                  <button onClick={() => setShowDropdown(!showDropdown)} className="menu-trigger">
                    ⋮
                  </button>
                  {showDropdown && (
                    <div className="menu-dropdown show">
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate('/chat');
                        setShowDropdown(false);
                      }}>Chats</a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate('/favorites');
                        setShowDropdown(false);
                      }}>Favoritos ({favorites.length})</a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        navigate('/requests');
                        setShowDropdown(false);
                      }}>Validação de Anúncios</a>
                      {(currentUser.type === 'doador' || currentUser.nivelAcesso === 'DOADOR') && (
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          navigate('/add-product');
                          setShowDropdown(false);
                        }}>Adicionar Produto</a>
                      )}
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        sessionStorage.removeItem('currentUser');
                        setCurrentUser(null);
                        navigate('/login');
                        setShowDropdown(false);
                      }}>Sair</a>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <a href="#" onClick={() => navigate('/')}>Início</a>
              <span>Olá, Convidado</span>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
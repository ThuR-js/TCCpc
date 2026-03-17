// Importações necessárias para navegação e contexto
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useEffect, useRef } from 'react'

// Componente do cabeçalho da aplicação
const Header = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  
  // Desestruturação do contexto global
  const { 
    currentUser, // Usuário atualmente logado
    setCurrentUser, // Função para alterar usuário atual
    searchTerm, // Termo de busca atual
    setSearchTerm, // Função para alterar termo de busca
    favorites, // Lista de produtos favoritos
    showDropdown, // Estado do menu dropdown
    setShowDropdown // Função para controlar dropdown
  } = useApp()

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowDropdown])

  return (
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
                      }}>Solicitações</a>
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
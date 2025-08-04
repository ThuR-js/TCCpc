import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Header = () => {
  const navigate = useNavigate()
  const { 
    currentUser, 
    setCurrentUser, 
    searchTerm, 
    setSearchTerm, 
    favorites, 
    showDropdown, 
    setShowDropdown 
  } = useApp()

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
              <span>Olá, {currentUser.name}{currentUser.isGuest ? ' (Convidado)' : ''}</span>
              <button onClick={() => navigate('/')}>Início</button>
              {!currentUser.isGuest && (
                <button onClick={() => navigate(currentUser.type === 'doador' ? '/donor' : '/recipient')}>
                  Painel
                </button>
              )}
              {currentUser.isGuest ? (
                <div className="user-menu">
                  <button onClick={() => setShowDropdown(!showDropdown)} className="menu-trigger">
                    ⋮
                  </button>
                  {showDropdown && (
                    <div className="menu-dropdown">
                      <a href="#" onClick={() => {
                        navigate('/login');
                        setShowDropdown(false);
                      }}>Entrar</a>
                      <a href="#" onClick={() => {
                        navigate('/register');
                        setShowDropdown(false);
                      }}>Cadastrar</a>
                      <a href="#" onClick={() => {
                        navigate('/favorites');
                        setShowDropdown(false);
                      }}>Favoritos ({favorites.length})</a>
                      <a href="#" onClick={() => {
                        navigate('/chat');
                        setShowDropdown(false);
                      }}>Chats</a>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => {
                  localStorage.removeItem('currentUser');
                  setCurrentUser(null);
                  navigate('/login');
                }}>Sair</button>
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
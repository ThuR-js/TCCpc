// Importações necessárias para navegação, contexto da aplicação e componente de tela de login
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoginScreen from '../LoginScreen'

// Componente principal de Login
const Login = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  // Hook para acessar e modificar o usuário atual no contexto global
  const { setCurrentUser } = useApp()

  // Função que processa o login do usuário
  const handleInitialLogin = async (email, password) => {
    // Verificação especial para conta de administrador (hardcoded)
    if (email === 'admin@doeconect.com' && password === 'admin123') {
      // Cria objeto do usuário administrador
      const adminUser = {
        id: 999,
        name: 'Administrador',
        email: 'admin@doeconect.com',
        isAdmin: true // Flag que identifica como admin
      }
      // Define o usuário atual no contexto global
      setCurrentUser(adminUser)
      // Salva no localStorage para persistir entre sessões
      localStorage.setItem('currentUser', JSON.stringify(adminUser))
      // Redireciona para a página inicial
      navigate('/')
      return
    }

    try {
      // Faz requisição para a API do back-end para buscar todos os usuários
      const response = await fetch('http://localhost:8080/api/v1/usuario')
      if (response.ok) {
        // Converte a resposta para JSON
        const users = await response.json()
        // Procura o usuário com email e senha correspondentes
        const user = users.find(u => u.email === email && u.senha === password)
        
        if (user) {
          // Se encontrou o usuário, define como usuário atual
          setCurrentUser(user)
          // Salva no localStorage para persistir
          localStorage.setItem('currentUser', JSON.stringify(user))
          localStorage.setItem('lastUser', JSON.stringify(user))
          // Redireciona baseado no tipo de usuário (DOADOR ou DONATARIO)
          navigate(user.nivelAcesso === 'DOADOR' ? '/donor' : '/recipient')
        } else {
          // Se não encontrou, mostra erro
          alert('Email ou senha incorretos')
        }
      } else {
        // Se a API retornou erro
        alert('Erro ao conectar com o servidor')
      }
    } catch (error) {
      // Se houve erro de conexão
      alert('Erro de conexão')
    }
  }

  // Função para permitir acesso como convidado (sem login)
  const handleContinueWithoutLogin = () => {
    // Recupera dados do último usuário logado (se houver)
    const lastUser = localStorage.getItem('lastUser')
    // Cria objeto de usuário convidado
    const guestUser = {
      id: 'guest',
      name: 'Convidado',
      email: 'convidado@temp.com',
      type: 'convidado',
      isGuest: true, // Flag que identifica como convidado
      lastUserData: lastUser ? JSON.parse(lastUser) : null // Dados do último usuário para referência
    }
    // Define o convidado como usuário atual
    setCurrentUser(guestUser)
    // Salva no localStorage
    localStorage.setItem('currentUser', JSON.stringify(guestUser))
    // Redireciona para a página inicial
    navigate('/')
  }

  // Renderiza o componente LoginScreen passando as funções como props
  return (
    <LoginScreen 
      onLogin={handleInitialLogin} // Função de login
      onContinueWithoutLogin={handleContinueWithoutLogin} // Função de acesso como convidado
    />
  )
}

export default Login
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
    console.log('Login attempt:', email)
    // Verificação especial para conta de administrador (hardcoded)
    if (email === 'admin@doeconect.com' && password === 'admin1') {
      // Cria objeto do usuário administrador
      const adminUser = {
        id: 999,
        name: 'Administrador',
        email: 'admin@doeconect.com',
        isAdmin: true // Flag que identifica como admin
      }
      console.log('Admin login successful, setting user:', adminUser)
      // Define o usuário atual no contexto global
      setCurrentUser(adminUser)
      // Salva no sessionStorage para persistir apenas nesta aba
      sessionStorage.setItem('currentUser', JSON.stringify(adminUser))
      console.log('Navigating to /')
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
          console.log('User found in API:', user)
          
          // Verificar se a conta está inativa e reativar
          if (user.statusUsuario === 'INATIVO') {
            try {
              const reactivateResponse = await fetch(`http://localhost:8080/api/v1/usuario/${user.id}/reativar`, {
                method: 'PUT'
              })
              
              if (reactivateResponse.ok) {
                const reactivatedUser = await reactivateResponse.json()
                console.log('Account reactivated:', reactivatedUser)
                setCurrentUser(reactivatedUser)
                sessionStorage.setItem('currentUser', JSON.stringify(reactivatedUser))
                alert('Sua conta foi reativada com sucesso!')
                navigate('/')
              } else {
                alert('Erro ao reativar conta')
              }
            } catch (error) {
              console.error('Error reactivating account:', error)
              alert('Erro ao reativar conta')
            }
          } else {
            // Conta ativa - login normal
            try {
              setCurrentUser(user)
              sessionStorage.setItem('currentUser', JSON.stringify(user))
              console.log('User saved, navigating to /')
              navigate('/')
            } catch (error) {
              console.error('Error setting user:', error)
              alert('Erro ao fazer login')
            }
          }
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
    console.log('Guest login attempt')
    // Cria objeto de usuário convidado
    const guestUser = {
      id: 'guest',
      name: 'Convidado',
      email: 'convidado@temp.com',
      type: 'convidado',
      isGuest: true // Flag que identifica como convidado
    }
    console.log('Guest user created:', guestUser)
    // Define o convidado como usuário atual
    setCurrentUser(guestUser)
    // Salva no sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser))
    console.log('Guest user saved, navigating to /')
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
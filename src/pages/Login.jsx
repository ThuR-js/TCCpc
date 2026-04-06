// Importações necessárias para navegação, contexto da aplicação e componente de tela de login
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoginScreen from '../LoginScreen'
import { apiRequest, API_CONFIG } from '../api'

// Componente principal de Login
const Login = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  // Hook para acessar e modificar o usuário atual no contexto global
  const { setCurrentUser } = useApp()

  // Função que processa o login do usuário
  const handleInitialLogin = async (email, password) => {
    if (email === 'admin@doeconect.com' && password === 'admin1') {
      const adminUser = {
        id: 999,
        name: 'Administrador',
        email: 'admin@doeconect.com',
        isAdmin: true
      }
      setCurrentUser(adminUser)
      sessionStorage.setItem('currentUser', JSON.stringify(adminUser))
      navigate('/')
      return
    }

    try {
      // Faz requisição para a API do back-end para buscar todos os usuários
      const users = await apiRequest(API_CONFIG.ENDPOINTS.USUARIO)
      // Procura o usuário com email e senha correspondentes
      const user = users.find(u => u.email === email && u.senha === password)
        if (user) {
          if (user.statusUsuario === 'INATIVO') {
            try {
              const reactivatedUser = await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${user.id}/reativar`, {
                method: 'PUT'
              })
              setCurrentUser(reactivatedUser)
              sessionStorage.setItem('currentUser', JSON.stringify(reactivatedUser))
              alert('Sua conta foi reativada com sucesso!')
              navigate('/')
            } catch (error) {
              alert('Erro ao reativar conta')
            }
          } else {
            // Conta ativa - login normal
            try {
              let userData = { ...user }
              if (user.nivelAcesso === 'DOADOR') {
                try {
                  const doador = await apiRequest(`${API_CONFIG.ENDPOINTS.DOADOR}/usuario/${user.id}`)
                  userData.doadorId = doador.id
                } catch (e) {}
              }
              setCurrentUser(userData)
              sessionStorage.setItem('currentUser', JSON.stringify(userData))
              navigate('/')
            } catch (error) {
              alert('Erro ao fazer login')
            }
          }
        } else {
          // Se não encontrou, mostra erro
          alert('Email ou senha incorretos')
        }
    } catch (error) {
      alert('Erro de conexão: ' + error.message)
    }
  }

  // Função para permitir acesso como convidado (sem login)
  const handleContinueWithoutLogin = () => {
    const guestUser = {
      id: 'guest',
      name: 'Convidado',
      email: 'convidado@temp.com',
      type: 'convidado',
      isGuest: true
    }
    setCurrentUser(guestUser)
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser))
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
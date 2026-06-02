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
      const data = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, senha: password })
      })

      if (data.nivelAcesso === 'DONATARIO') {
        alert('Acesso negado. Donatários devem usar o aplicativo mobile.')
        return
      }

      let userData = {
        ...data,
        type: 'doador'
      }

      if (data.nivelAcesso === 'DOADOR') {
        try {
          const doador = await apiRequest(`${API_CONFIG.ENDPOINTS.DOADOR}/usuario/${data.id}`)
          userData.doadorId = doador.id
          userData.cpf = doador.cpf
          userData.cep = doador.cep
          userData.dataNascimento = doador.dataNascimento
        } catch (e) {}
      }

      setCurrentUser(userData)
      sessionStorage.setItem('currentUser', JSON.stringify(userData))
      navigate('/')
    } catch (error) {
      alert('Email ou senha incorretos')
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
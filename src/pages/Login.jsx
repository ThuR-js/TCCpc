import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoginScreen from '../LoginScreen'

const Login = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()

  const handleInitialLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('lastUser', JSON.stringify(user))
      navigate(user.type === 'doador' ? '/donor' : '/recipient')
    } else {
      alert('Email ou senha incorretos')
    }
  }

  const handleContinueWithoutLogin = () => {
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
    localStorage.setItem('currentUser', JSON.stringify(guestUser))
    navigate('/')
  }

  return (
    <LoginScreen 
      onLogin={handleInitialLogin}
      onContinueWithoutLogin={handleContinueWithoutLogin}
    />
  )
}

export default Login
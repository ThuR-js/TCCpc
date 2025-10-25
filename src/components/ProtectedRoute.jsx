import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { currentUser } = useApp()

  console.log('ProtectedRoute - currentUser:', currentUser)

  useEffect(() => {
    console.log('ProtectedRoute useEffect - currentUser:', currentUser)
    if (!currentUser) {
      console.log('No user found, redirecting to login')
      navigate('/login')
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    console.log('Rendering null - no user')
    return null
  }

  console.log('Rendering children - user found')
  return children
}

export default ProtectedRoute
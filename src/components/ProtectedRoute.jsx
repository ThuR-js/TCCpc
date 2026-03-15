import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { currentUser, authChecked } = useApp()

  useEffect(() => {
    if (authChecked && !currentUser) {
      navigate('/login')
    }
  }, [currentUser, authChecked, navigate])

  if (!authChecked) return null
  if (!currentUser) return null

  return children
}

export default ProtectedRoute
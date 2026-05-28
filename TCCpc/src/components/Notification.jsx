import { useState, useEffect } from 'react'

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose && onClose(), 300) // Aguarda animação
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeClass = () => {
    switch (type) {
      case 'success': return 'notification-success'
      case 'error': return 'notification-error'
      case 'warning': return 'notification-warning'
      default: return 'notification-info'
    }
  }

  return (
    <div className={`notification ${getTypeClass()} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close" 
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose && onClose(), 300)
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

// Hook para gerenciar notificações
export const useNotification = () => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    const notification = { id, message, type, duration }
    
    setNotifications(prev => [...prev, notification])
    
    // Remove automaticamente após a duração
    setTimeout(() => {
      removeNotification(id)
    }, duration + 300)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (message, duration) => addNotification(message, 'success', duration)
  const showError = (message, duration) => addNotification(message, 'error', duration)
  const showWarning = (message, duration) => addNotification(message, 'warning', duration)
  const showInfo = (message, duration) => addNotification(message, 'info', duration)

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

// Container de notificações
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  )
}

export default Notification
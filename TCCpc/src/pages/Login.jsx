import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoginScreen from '../LoginScreen'
import { apiRequest, API_CONFIG } from '../api'

const Login = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()
  const [contaInativa, setContaInativa] = useState(false)
  const [emailInativo, setEmailInativo] = useState('')
  const [reativando, setReativando] = useState(false)

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

      let userData = {
        ...data,
        type: data.nivelAcesso === 'DOADOR' ? 'doador' : 'donatario'
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
      const msg = error.message || ''
      if (msg.toLowerCase().includes('inativa')) {
        setEmailInativo(email)
        setContaInativa(true)
      } else {
        alert('Email ou senha incorretos')
      }
    }
  }

  const handleReativar = async () => {
    setReativando(true)
    try {
      const usuarios = await apiRequest(API_CONFIG.ENDPOINTS.USUARIO)
      const usuario = usuarios.find(u => u.email === emailInativo || u.username === emailInativo)
      if (!usuario) throw new Error('Usuário não encontrado')
      await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${usuario.id}/reativar`, { method: 'PUT' })
      alert('Conta reativada! Você já pode fazer login normalmente.')
      setContaInativa(false)
    } catch (err) {
      alert(err.message || 'Não foi possível reativar a conta.')
    }
    setReativando(false)
  }

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

  return (
    <>
      <LoginScreen
        onLogin={handleInitialLogin}
        onContinueWithoutLogin={handleContinueWithoutLogin}
      />
      {contaInativa && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#2a1a0a',
            border: '2px solid rgba(255,152,0,0.6)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <p style={{ color: '#FFD180', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              ⚠️ Sua conta está inativa.
            </p>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Deseja reativar sua conta?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleReativar}
                disabled={reativando}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255,152,0,0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: reativando ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  opacity: reativando ? 0.6 : 1
                }}
              >
                {reativando ? 'Reativando...' : 'Reativar minha conta'}
              </button>
              <button
                onClick={() => setContaInativa(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Login
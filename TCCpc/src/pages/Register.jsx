import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'
import '../LoginScreen.css'
import './Register_new.css'

const Register = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [cpf, setCpf] = useState('')
  const [cep, setCep] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!birthDate || !cpf || !cep) {
      alert('Todos os campos são obrigatórios')
      return
    }

    const usuario = {
      nome: name,
      email: email,
      senha: password,
      nivelAcesso: 'DOADOR'
    }

    try {
      const newUser = await apiRequest(API_CONFIG.ENDPOINTS.USUARIO, {
        method: 'POST',
        body: JSON.stringify(usuario)
      })

      const doador = await apiRequest(API_CONFIG.ENDPOINTS.DOADOR, {
        method: 'POST',
        body: JSON.stringify({
          nome: name,
          dataNascimento: birthDate,
          cpf: cpf,
          cep: cep,
          usuario: { id: newUser.id }
        })
      })

      const userData = {
        ...newUser,
        doadorId: doador.id,
        cpf,
        cep,
        dataNascimento: birthDate,
        type: 'doador'
      }

      setCurrentUser(userData)
      sessionStorage.setItem('currentUser', JSON.stringify(userData))
      navigate('/')
    } catch (error) {
      alert('Erro de conexão')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-form-section">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="back-button"
          >
            ← Voltar
          </button>
          <form onSubmit={handleSubmit} className="login-form">
            <h2 style={{marginBottom: '20px'}}>Criar Conta — Doador</h2>

            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label>Endereço de email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  if (e.target.value.length <= 6) setPassword(e.target.value)
                }}
                placeholder="Digite sua senha (máx 6 dígitos)"
                maxLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 11) setCpf(value)
                }}
                placeholder="00000000000"
                maxLength="11"
                required
              />
            </div>

            <div className="form-group">
              <label>CEP</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 8) setCep(value)
                }}
                placeholder="00000000"
                maxLength="8"
                required
              />
            </div>

            <button type="submit" className="login-btn">Criar Conta</button>

            <p style={{textAlign: 'center', marginTop: '15px', fontSize: '14px'}}>
              Já tem uma conta? <a href="/login" style={{color: '#007bff', textDecoration: 'none'}}>Faça login</a>
            </p>
          </form>

          <div className="login-footer">
            <p>Copyright © 2025 DoeConect+. Todos os direitos reservados.</p>
            <div className="footer-links">
              <a href="#">Termos de Serviço</a> | <a href="#">Política de Privacidade</a>
            </div>
          </div>
        </div>

        <div className="login-illustration-section">
          <div className="illustration-container">
            <div className="company-logo">
              <img
                src="/logo-doeconect.jpg"
                alt="DoeConect+"
                className="logo-image"
                onError={(e) => {
                  e.target.src = '/logo-doeconect.jpeg'
                  e.target.onerror = () => { e.target.style.display = 'none' }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

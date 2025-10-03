import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../LoginScreen.css'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cep, setCep] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('donatario')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      type: userType
    }
    
    setCurrentUser(newUser)
    localStorage.setItem('currentUser', JSON.stringify(newUser))
    navigate('/')
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-header">
            <button onClick={() => navigate('/login')} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '14px', marginBottom: '10px', padding: '0'}}>← Voltar</button>
            <h2>Criar Conta</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>👤 Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label>📧 Endereço de email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>📱 Telefone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
              <small style={{fontSize: '12px', color: '#666', marginTop: '4px', display: 'block'}}>opcional</small>
            </div>

            {userType === 'doador' && (
              <div className="form-group">
                <label>📍 CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>🔒 Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <div className="form-group">
              <label>👥 Tipo de usuário</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option value="donatario">Quero receber doações</option>
                <option value="doador">Quero doar roupas</option>
              </select>
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
              <img src="/logo-doeconect.jpeg" alt="DoeConect+" className="logo-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
import { useState } from 'react'
import './LoginScreen.css'

function LoginScreen({ onLogin, onContinueWithoutLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-header">
            <h2>Entrar</h2>
            <p>Não tem uma conta? <a href="#" onClick={() => alert('Cadastro em desenvolvimento')}>Cadastre-se agora</a></p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>📧 Endereço de Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

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

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar de mim
              </label>
            </div>

            <button type="submit" className="login-btn">Entrar</button>

            <div className="forgot-password">
              <a href="#" onClick={onContinueWithoutLogin}>
                Continuar sem login
              </a>
            </div>
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

export default LoginScreen
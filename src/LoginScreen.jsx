import { useState } from 'react'
import './LoginScreen.css'

function LoginScreen({ onLogin, onContinueWithoutLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* Lado Esquerdo - Branco com Logo */}
        <div className="login-illustration-section">
          <div className="illustration-container">
            <div className="company-logo">
              <img 
                src="/logo-doeconect.jpg" 
                alt="DoeConect+" 
                className="logo-image"
                onError={(e) => {
                  console.log('Erro ao carregar logo, tentando .jpeg')
                  e.target.src = '/logo-doeconect.jpeg'
                  e.target.onerror = () => {
                    console.log('Logo não encontrada')
                    e.target.style.display = 'none'
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Lado Direito - Marrom com Login */}
        <div className="login-form-section">
          <div className="login-header">
            <h2>Login</h2>
            <p>Não tem uma conta? <a href="/register">Criar minha conta</a></p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>📧 Endereço de Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
              />
            </div>

            <div className="form-group">
              <label>🔒 Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  maxLength="6"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
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
              <a href="#" className="forgot-password-link">Esqueci minha senha</a>
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
      </div>
    </div>
  )
}

export default LoginScreen
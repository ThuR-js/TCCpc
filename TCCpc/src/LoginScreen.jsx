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
    <div className="reg-screen">
      <div className="reg-card">

        {/* ── Coluna Esquerda: Formulário ── */}
        <div className="reg-form-col">
          <div className="reg-form-inner">
            <h2 className="reg-title">Bem-vindo</h2>
            <p className="reg-subtitle">Faça login na sua conta</p>
            <div className="reg-divider">• • •</div>

            <form onSubmit={handleSubmit} className="reg-form">

              <div className="reg-field">
                <label className="reg-label">Endereço de E-mail</label>
                <input
                  className="reg-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">Senha</label>
                <div className="reg-input-wrap">
                  <input
                    className="reg-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    maxLength="6"
                    required
                  />
                  <button
                    type="button"
                    className="reg-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="login-options-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Lembrar de mim
                </label>
                <a href="#" className="login-forgot-link">Esqueci minha senha</a>
              </div>

              <button type="submit" className="reg-submit-btn">Entrar</button>

              <p className="reg-login-link">
                Não tem uma conta?{' '}
                <span onClick={() => window.location.href = '/register'}>Criar minha conta</span>
              </p>

              <div style={{ textAlign: 'center' }}>
                <a
                  href="#"
                  className="login-guest-link"
                  onClick={(e) => { e.preventDefault(); onContinueWithoutLogin() }}
                >
                  Continuar sem login
                </a>
              </div>
            </form>
          </div>

          <div className="reg-footer">
            <p>Copyright © 2025 DoeConect+. Todos os direitos reservados.</p>
            <div>
              <a href="#">Termos de Serviço</a> | <a href="#">Política de Privacidade</a>
            </div>
          </div>
        </div>

        {/* ── Coluna Direita: Logo ── */}
        <div className="reg-logo-col">
          <div className="reg-logo-decor reg-blob-1" />
          <div className="reg-logo-decor reg-blob-2" />
          <div className="reg-logo-wrap">
            <img
              src="/logo-doeconect.jpg"
              alt="DoeConect+"
              className="reg-logo-img"
              onError={(e) => {
                e.target.src = '/logo-doeconect.jpeg'
                e.target.onerror = () => { e.target.style.display = 'none' }
              }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginScreen

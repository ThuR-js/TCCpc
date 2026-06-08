import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'
import '../LoginScreen.css'

const Register = () => {
  const navigate = useNavigate()
  const { setCurrentUser } = useApp()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="reg-screen">
      <div className="reg-card">

        {/* ── Coluna Esquerda: Formulário ── */}
        <div className="reg-form-col">
          <button
            type="button"
            className="reg-back-btn"
            onClick={() => navigate('/login')}
          >
            ← Voltar
          </button>

          <div className="reg-form-inner">
            <h2 className="reg-title">Criar Conta</h2>
            <p className="reg-subtitle">Doador</p>
            <div className="reg-divider">• • •</div>

            <form onSubmit={handleSubmit} className="reg-form">

              <div className="reg-field">
                <label className="reg-label">Nome</label>
                <input
                  className="reg-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

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
                    onChange={(e) => {
                      if (e.target.value.length <= 6) setPassword(e.target.value)
                    }}
                    placeholder="Máx. 6 dígitos"
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
                      /* olho aberto */
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      /* olho riscado */
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Data de Nascimento</label>
                <div className="reg-input-wrap">
                  <input
                    className="reg-input"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                  <span className="reg-cal-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </span>
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">CPF</label>
                <input
                  className="reg-input"
                  type="text"
                  value={cpf}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '')
                    if (v.length <= 11) setCpf(v)
                  }}
                  placeholder="00000000000"
                  maxLength="11"
                  required
                />
              </div>

              <div className="reg-field">
                <label className="reg-label">CEP</label>
                <input
                  className="reg-input"
                  type="text"
                  value={cep}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '')
                    if (v.length <= 8) setCep(v)
                  }}
                  placeholder="00000000"
                  maxLength="8"
                  required
                />
              </div>

              <button type="submit" className="reg-submit-btn">Criar Conta</button>

              <p className="reg-login-link">
                Já tem uma conta?{' '}
                <span onClick={() => navigate('/login')}>Faça login</span>
              </p>
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

export default Register

// Importações necessárias para estado, navegação, contexto e estilos
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../LoginScreen.css'
import './Register.css'

// Componente de registro de novos usuários
const Register = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  // Hook para acessar o contexto global da aplicação
  const { setCurrentUser } = useApp()
  
  // Estados para armazenar os dados do formulário
  const [name, setName] = useState('') // Nome do usuário
  const [email, setEmail] = useState('') // Email do usuário



  const [password, setPassword] = useState('') // Senha do usuário
  const [userType, setUserType] = useState('donatario') // Tipo: donatario ou doador
  const [birthDate, setBirthDate] = useState('') // Data nascimento (só doador)
  const [cpf, setCpf] = useState('') // CPF (só doador)
  const [cep, setCep] = useState('') // CEP (só doador)

  // Função que processa o envio do formulário de registro
  const handleSubmit = async (e) => {
    // Previne o comportamento padrão do formulário (recarregar a página)
    e.preventDefault()
    
    // Cria objeto com os dados do usuário no formato esperado pela API
    const usuario = {
      nome: name,
      email: email,
      senha: password,
      nivelAcesso: userType === 'doador' ? 'DOADOR' : 'DONATARIO'
    }
    
    // Se for doador, valida campos obrigatórios
    if (userType === 'doador') {
      if (!birthDate || !cpf || !cep) {
        alert('Para doadores, todos os campos são obrigatórios')
        return
      }
    }
    
    try {
      // Log para debug - mostra os dados que serão enviados
      console.log('Enviando dados:', usuario)
      // Faz requisição POST para a API de criação de usuários
      const response = await fetch('http://localhost:8080/api/v1/usuario', {
        method: 'POST', // Método HTTP POST
        headers: { 'Content-Type': 'application/json' }, // Especifica que está enviando JSON
        body: JSON.stringify(usuario) // Converte objeto para JSON
      })
      // Log para debug - mostra o status da resposta
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const newUser = await response.json()
        
        // TODO: Implementar CRUD do doador no back-end
        // Se for doador, criar registro na tabela doador
        // if (userType === 'doador') {
        //   const doadorData = {
        //     nome: name,
        //     dataNascimento: birthDate,
        //     cpf: cpf,
        //     cep: cep,
        //     usuarioId: newUser.id
        //   }
        //   
        //   const doadorResponse = await fetch('http://localhost:8080/api/v1/doador', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(doadorData)
        //   })
        // }
        
        setCurrentUser(newUser)
        sessionStorage.setItem('currentUser', JSON.stringify(newUser))
        navigate('/')
      } else {
        // Se houve erro na requisição
        const errorData = await response.json() // Tenta obter detalhes do erro
        alert('Erro: ' + (errorData.message || 'Erro ao criar usuário')) // Mostra erro
      }
    } catch (error) {
      // Se houve erro de conexão
      alert('Erro de conexão')
    }
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-header">
            <button onClick={() => navigate('/login')} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '14px', marginBottom: '20px', padding: '0'}}>← Voltar</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2 style={{marginBottom: '20px'}}>Criar Conta</h2>
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
                  if (e.target.value.length <= 6) {
                    setPassword(e.target.value)
                  }
                }}
                placeholder="Digite sua senha (máx 6 dígitos)"
                maxLength="6"
                required
              />
            </div>

            {userType === 'doador' && (
              <>
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
                      if (value.length <= 11) {
                        setCpf(value)
                      }
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
                      if (value.length <= 8) {
                        setCep(value)
                      }
                    }}
                    placeholder="00000000"
                    maxLength="8"
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Tipo de usuário</label>
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
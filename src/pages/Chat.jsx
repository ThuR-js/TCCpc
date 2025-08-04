import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Chat = () => {
  const navigate = useNavigate()
  const [currentChat, setCurrentChat] = useState('chat1')
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const messageElement = document.createElement('div')
    messageElement.className = 'message sent'
    messageElement.innerHTML = `<strong>Você:</strong> ${newMessage}`
    
    const chatMessages = document.getElementById('chatMessages')
    chatMessages.appendChild(messageElement)
    
    setNewMessage('')
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>Conversas</h3>
          <div className={`chat-item ${currentChat === 'chat1' ? 'active' : ''}`} onClick={() => setCurrentChat('chat1')}>
            <div className="chat-preview">
              <strong>Maria Silva</strong>
              <p>Camiseta Hellstar disponível!</p>
            </div>
          </div>
          <div className={`chat-item ${currentChat === 'chat2' ? 'active' : ''}`} onClick={() => setCurrentChat('chat2')}>
            <div className="chat-preview">
              <strong>João Santos</strong>
              <p>Calça baggy ainda disponível</p>
            </div>
          </div>
          <div className={`chat-item ${currentChat === 'chat3' ? 'active' : ''}`} onClick={() => setCurrentChat('chat3')}>
            <div className="chat-preview">
              <strong>Ana Costa</strong>
              <p>Obrigada pelo interesse!</p>
            </div>
          </div>
          <div className={`chat-item ${currentChat === 'chat4' ? 'active' : ''}`} onClick={() => setCurrentChat('chat4')}>
            <div className="chat-preview">
              <strong>Carlos Lima</strong>
              <p>Shorts Nike perfeito para verão</p>
            </div>
          </div>
        </div>
        <div className="chat-main">
          <div id="chatMessages">
            {currentChat === 'chat1' && (
              <>
                <div className="message received">
                  <strong>Maria Silva:</strong> Oi! Vi que você se interessou pela camiseta Hellstar. Ela está em ótimo estado!
                </div>
                <div className="message received">
                  <strong>Maria Silva:</strong> Comprei há uns 6 meses mas quase não usei, só umas 3 vezes.
                </div>
                <div className="message sent">
                  <strong>Você:</strong> Que legal! Ainda está disponível?
                </div>
                <div className="message received">
                  <strong>Maria Silva:</strong> Sim! Posso separar pra você. Me chama no WhatsApp: (11) 99999-9999
                </div>
              </>
            )}
            {currentChat === 'chat2' && (
              <>
                <div className="message received">
                  <strong>João Santos:</strong> Olá! A calça baggy ainda está disponível sim!
                </div>
                <div className="message received">
                  <strong>João Santos:</strong> É uma calça bem estilosa, usei bastante mas ainda está em bom estado.
                </div>
                <div className="message sent">
                  <strong>Você:</strong> Perfeito! Como podemos combinar a retirada?
                </div>
                <div className="message received">
                  <strong>João Santos:</strong> Posso deixar na portaria do meu prédio. Te passo o endereço por aqui mesmo.
                </div>
              </>
            )}
            {currentChat === 'chat3' && (
              <>
                <div className="message sent">
                  <strong>Você:</strong> Oi Ana! Vi o shorts Eric Emanuel, ainda está disponível?
                </div>
                <div className="message received">
                  <strong>Ana Costa:</strong> Oi! Infelizmente já foi doado ontem 😔
                </div>
                <div className="message received">
                  <strong>Ana Costa:</strong> Mas obrigada pelo interesse! Vou postar mais roupas em breve.
                </div>
                <div className="message sent">
                  <strong>Você:</strong> Sem problemas! Vou ficar de olho nas próximas doações.
                </div>
              </>
            )}
            {currentChat === 'chat4' && (
              <>
                <div className="message received">
                  <strong>Carlos Lima:</strong> Oi! O shorts Nike é perfeito para o verão!
                </div>
                <div className="message received">
                  <strong>Carlos Lima:</strong> Usei poucas vezes, é bem confortável para exercícios.
                </div>
                <div className="message sent">
                  <strong>Você:</strong> Que tamanho é mesmo?
                </div>
                <div className="message received">
                  <strong>Carlos Lima:</strong> É tamanho M. Quer que eu tire mais fotos?
                </div>
                <div className="message sent">
                  <strong>Você:</strong> Seria ótimo! Pode mandar por aqui mesmo.
                </div>
              </>
            )}
          </div>
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Digite sua mensagem..." 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
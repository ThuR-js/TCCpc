// Importações necessárias para estado, navegação e contexto
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Componente para adicionar novos produtos (apenas doadores)
const AddProduct = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  // Acessa função de adicionar produto e usuário atual do contexto
  const { addProduct, currentUser } = useApp()
  
  // Estado para armazenar dados do formulário do produto
  const [formData, setFormData] = useState({
    nome: '', // Nome do anúncio
    descricao: '', // Descrição do anúncio
    tamanho: '', // Tamanho (P, M, G ou números para tênis)
    condicao: '', // Condição (novo, seminovo, usado)
    whatsapp: '' // Número do WhatsApp (opcional)
  })
  
  // Estados para gerenciar as imagens do produto
  const [images, setImages] = useState([]) // Arquivos de imagem originais
  const [imagePreviews, setImagePreviews] = useState([]) // URLs das imagens para preview

  // Função para atualizar dados do formulário quando usuário digita
  const handleInputChange = (e) => {
    setFormData({
      ...formData, // Mantém os dados existentes
      [e.target.name]: e.target.value // Atualiza apenas o campo que foi modificado
    })
  }

  // Função para processar seleção de imagens
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files) // Converte FileList para array
    
    // Verifica limite máximo de 5 imagens
    if (files.length + images.length > 5) {
      alert('Máximo 5 imagens permitidas')
      return
    }

    // Adiciona novos arquivos à lista existente
    setImages([...images, ...files])
    
    // Cria previews das imagens para mostrar na tela
    files.forEach(file => {
      const reader = new FileReader() // Leitor de arquivos
      reader.onload = (e) => {
        // Quando a leitura terminar, adiciona a URL do preview
        setImagePreviews(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file) // Lê o arquivo como URL de dados (base64)
    })
  }

  // Função para remover uma imagem específica
  const removeImage = (index) => {
    // Remove da lista de arquivos originais
    setImages(images.filter((_, i) => i !== index))
    // Remove da lista de previews
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  // Função para processar envio do formulário de novo produto
  const handleSubmit = (e) => {
    // Previne comportamento padrão do formulário
    e.preventDefault()
    
    // Validação: pelo menos uma imagem é obrigatória
    if (images.length === 0) {
      alert('Adicione pelo menos uma imagem')
      return
    }

    // Cria objeto do novo anúncio com todos os dados
    const newProduct = {
      ...formData, // Inclui todos os dados do formulário
      caminhoFoto: imagePreviews[0], // Primeira imagem como caminho da foto
      images: imagePreviews, // Array com todas as imagens (para compatibilidade front-end)
      image: imagePreviews[0], // Primeira imagem como imagem principal (para compatibilidade front-end)
      name: formData.nome, // Para compatibilidade com front-end existente
      description: formData.descricao, // Para compatibilidade com front-end existente
      size: formData.tamanho, // Para compatibilidade com front-end existente
      condition: formData.condicao, // Para compatibilidade com front-end existente
      donor: currentUser.name || currentUser.nome, // Nome do doador
      donorId: currentUser.id, // ID do doador para identificação
      statusAnuncio: 'PENDENTE', // Status inicial conforme back-end
      status: 'pending', // Para compatibilidade com front-end existente
      chatEnabled: true // Habilita chat para este produto
    }

    // Logs para debug
    console.log('Criando produto:', newProduct)
    // Adiciona o produto à lista global
    addProduct(newProduct)
    console.log('Produto adicionado')
    
    // Notifica o usuário e redireciona
    alert('Produto enviado para análise! Aguarde a aprovação do administrador.')
    navigate('/') // Volta para a página inicial
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn-back">← Voltar</button>
      <h2 style={{marginBottom: '2rem', color: 'white'}}>Adicionar Produto</h2>
      
      <div className="add-product-container">
        <div className="image-upload-section">
          <h3>Imagens do Produto</h3>
          <div className="image-upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{display: 'none'}}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-button">
              + Adicionar Imagens
            </label>
            <p>Máximo 5 imagens</p>
          </div>
          
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-preview">
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button 
                  type="button" 
                  onClick={() => removeImage(index)}
                  className="remove-image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="product-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome do Produto</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Camiseta Nike"
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva o produto..."
                rows="4"
                required
              />
            </div>



            <div className="form-group">
              <label>Tamanho</label>
              <select
                name="tamanho"
                value={formData.tamanho}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione o tamanho</option>
                {formData.tamanho && formData.nome && formData.nome.toLowerCase().includes('tenis') ? (
                  Array.from({length: 15}, (_, i) => i + 34).map(size => (
                    <option key={size} value={size.toString()}>{size}</option>
                  ))
                ) : (
                  <>
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Condição</label>
              <select
                name="condicao"
                value={formData.condicao}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione a condição</option>
                <option value="novo">Novo</option>
                <option value="seminovo">Seminovo</option>
                <option value="usado">Usado</option>
              </select>
            </div>

            <div className="form-group">
              <label>WhatsApp (opcional)</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="11999999999"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '1rem'}}>
              Adicionar Produto
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
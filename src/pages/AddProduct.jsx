// Importações necessárias para estado, navegação e contexto
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ProductService } from '../services'
import { useApiState, useFormValidation } from '../hooks'
import { isValidImageType, isValidFileSize } from '../utils'

// Componente para adicionar novos produtos (apenas doadores)
const AddProduct = () => {
  // Hook para navegação entre páginas
  const navigate = useNavigate()
  // Acessa função de adicionar produto e usuário atual do contexto
  const { addProduct, currentUser } = useApp()
  const { loading, error, execute } = useApiState()
  
  // Validação do formulário
  const { values: formData, errors, setValue, validate, setValues } = useFormValidation(
    {
      nome: '',
      descricao: '',
      tamanho: '',
      condicao: '',
      whatsapp: ''
    },
    {
      nome: { required: true, minLength: 3 },
      descricao: { required: true, minLength: 10 },
      tamanho: { required: true },
      condicao: { required: true }
    }
  )
  
  // Estados para gerenciar as imagens do produto
  const [images, setImages] = useState([]) // Arquivos de imagem originais
  const [imagePreviews, setImagePreviews] = useState([]) // URLs das imagens para preview

  // Função para atualizar dados do formulário quando usuário digita
  const handleInputChange = (e) => {
    setValue(e.target.name, e.target.value)
  }

  // Função para processar seleção de imagens
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Verifica limite máximo de 5 imagens
    if (files.length + images.length > 5) {
      alert('Máximo 5 imagens permitidas')
      return
    }

    // Validação de tipo e tamanho de arquivo
    for (const file of files) {
      if (!isValidImageType(file)) {
        alert('Apenas imagens JPG, PNG e WEBP são permitidas')
        return
      }
      if (!isValidFileSize(file, 5)) {
        alert('Cada imagem deve ter no máximo 5MB')
        return
      }
    }

    setImages([...images, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
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
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      alert('Preencha todos os campos obrigatórios corretamente')
      return
    }
    
    if (images.length === 0) {
      alert('Adicione pelo menos uma imagem')
      return
    }

    const newProduct = {
      ...formData,
      caminhoFoto: imagePreviews[0],
      images: imagePreviews,
      image: imagePreviews[0],
      name: formData.nome,
      description: formData.descricao,
      size: formData.tamanho,
      condition: formData.condicao,
      donor: currentUser.name || currentUser.nome,
      donorId: currentUser.id,
      statusAnuncio: 'PENDENTE',
      status: 'pending',
      chatEnabled: true
    }

    try {
      await execute(async () => {
        // TODO: Quando API de produtos estiver pronta, usar:
        // await ProductService.create(newProduct)
        
        // Por enquanto, usa o método local
        addProduct(newProduct)
      })
      
      alert('Produto enviado para análise! Aguarde a aprovação do administrador.')
      navigate('/')
    } catch (error) {
      alert('Erro ao criar produto: ' + error.message)
    }
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
              {errors.nome && <span className="error-message">{errors.nome}</span>}
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
              {errors.descricao && <span className="error-message">{errors.descricao}</span>}
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
                {formData.nome && formData.nome.toLowerCase().includes('tenis') ? (
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
              {errors.tamanho && <span className="error-message">{errors.tamanho}</span>}
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
              {errors.condicao && <span className="error-message">{errors.condicao}</span>}
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

            <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '1rem'}} disabled={loading}>
              {loading ? 'Adicionando...' : 'Adicionar Produto'}
            </button>
            
            {error && (
              <div className="error-message" style={{marginTop: '1rem', textAlign: 'center', color: '#ff4444'}}>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
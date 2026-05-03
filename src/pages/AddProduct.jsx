// Importações necessárias para estado, navegação e contexto
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useApiState, useFormValidation } from '../hooks'
import { isValidImageType, isValidFileSize } from '../utils'
import { apiRequest, API_CONFIG } from '../api'

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
      categoria: '',
      tamanho: '',
      condicao: '',
      regiao: ''
    },
    {
      nome: { required: true, minLength: 3 },
      descricao: { required: true, minLength: 10 },
      categoria: { required: true },
      tamanho: { required: true },
      condicao: { required: true },
      regiao: { required: true }
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

  const uploadImgBB = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    const res = await fetch('https://api.cloudinary.com/v1_1/dod8l2rsn/image/upload', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!data.secure_url) throw new Error('Falha no upload da imagem')
    return data.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      alert('Preencha todos os campos obrigatórios corretamente')
      return
    }
    
    if (!currentUser.doadorId) {
      alert('Seu perfil de doador ainda não foi configurado. Complete seu cadastro antes de adicionar produtos.')
      return
    }

    if (images.length === 0) {
      alert('Adicione pelo menos uma imagem')
      return
    }

    try {
      await execute(async () => {
        const fotoUrl = await uploadImgBB(images[0])

        const novoAnuncio = {
          nome: formData.nome,
          descricao: formData.descricao,
          tamanho: formData.tamanho,
          condicao: formData.condicao,
          regiao: formData.regiao,
          foto: fotoUrl,
          categoria: { id: formData.categoria },
          doador: { id: currentUser.doadorId || currentUser.id }
        }

        await apiRequest(API_CONFIG.ENDPOINTS.ANUNCIO, {
          method: 'POST',
          body: JSON.stringify(novoAnuncio)
        })
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
              <label>Categoria</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="1">Camiseta</option>
                <option value="2">Calça</option>
                <option value="3">Moletom</option>
                <option value="4">Tênis</option>
                <option value="5">Shorts</option>
              </select>
              {errors.categoria && <span className="error-message">{errors.categoria}</span>}
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
                {formData.categoria === '4' ? (
                  Array.from({length: 20}, (_, i) => i + 30).map(size => (
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
              <label>Região</label>
              <input
                type="text"
                name="regiao"
                value={formData.regiao}
                onChange={handleInputChange}
                placeholder="Ex: Barueri, São Paulo"
                required
              />
              {errors.regiao && <span className="error-message">{errors.regiao}</span>}
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
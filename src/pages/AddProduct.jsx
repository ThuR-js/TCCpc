import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const AddProduct = () => {
  const navigate = useNavigate()
  const { addProduct, currentUser } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    size: '',
    condition: '',
    whatsapp: ''
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      alert('Máximo 5 imagens permitidas')
      return
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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (images.length === 0) {
      alert('Adicione pelo menos uma imagem')
      return
    }

    const newProduct = {
      ...formData,
      images: imagePreviews,
      image: imagePreviews[0],
      donor: currentUser.name,
      donorId: currentUser.id,
      status: 'available',
      chatEnabled: true
    }

    addProduct(newProduct)
    alert('Produto adicionado com sucesso!')
    navigate('/')
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Camiseta Nike"
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o produto..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione a categoria</option>
                <option value="camiseta">Camiseta</option>
                <option value="calca">Calça</option>
                <option value="moletom">Moletom</option>
                <option value="shorts">Shorts</option>
                <option value="tenis">Tênis</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tamanho</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione o tamanho</option>
                {formData.type === 'tenis' ? (
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
                name="condition"
                value={formData.condition}
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
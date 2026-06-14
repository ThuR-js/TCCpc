import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'

const ValidateAd = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useApp()
  const [anuncio, setAnuncio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (currentUser?.isAdmin && id) {
      fetchAnuncio()
    }
  }, [currentUser, id])

  const fetchAnuncio = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`)
      setAnuncio(data)
    } catch (e) {
      console.error('Erro ao buscar anúncio:', e)
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const aprovar = async () => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ statusAnuncio: 'ATIVO' })
      })
      navigate('/admin', { state: { message: 'Anúncio aprovado com sucesso!' } })
    } catch (e) {
      alert('Erro ao aprovar: ' + e.message)
    }
  }

  const rejeitar = async () => {
    if (!confirm('Tem certeza de que deseja rejeitar este anúncio? Esta ação não pode ser desfeita.')) {
      return
    }
    
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'DELETE'
      })
      navigate('/admin', { state: { message: 'Anúncio rejeitado com sucesso!' } })
    } catch (e) {
      alert('Erro ao rejeitar: ' + e.message)
    }
  }

  const nextImage = () => {
    if (anuncio?.imagens && anuncio.imagens.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % anuncio.imagens.length)
    }
  }

  const prevImage = () => {
    if (anuncio?.imagens && anuncio.imagens.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + anuncio.imagens.length) % anuncio.imagens.length)
    }
  }

  const getImageSrc = (img) => {
    if (!img) return '/images/avatar2.webp'
    if (img.startsWith('http') || img.startsWith('data:')) return img
    return `/${img}`
  }

  if (!currentUser?.isAdmin) {
    return (
      <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
        <div className="container">
          <h2 style={{ color: '#3B2415', textAlign: 'center', paddingTop: '4rem' }}>Acesso Negado</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
        <div className="container">
          <p style={{ color: '#3B2415', textAlign: 'center', paddingTop: '4rem' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (erro || !anuncio) {
    return (
      <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
        <div className="container">
          <button 
            onClick={() => navigate('/admin')}
            style={{
              background: '#FFFFFF',
              border: '1px solid #8B5E3C',
              color: '#8B5E3C',
              borderRadius: '999px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '2rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#8B5E3C'
              e.target.style.color = '#FFFFFF'
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#FFFFFF'
              e.target.style.color = '#8B5E3C'
            }}
          >
            ← Voltar
          </button>
          <p style={{ color: 'red', textAlign: 'center' }}>
            {erro || 'Anúncio não encontrado'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F8F4EF', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px'
      }}>
        {/* Cabeçalho da página */}
        <button 
          onClick={() => navigate('/admin')}
          style={{
            background: '#FFFFFF',
            border: '1px solid #8B5E3C',
            color: '#8B5E3C',
            borderRadius: '999px',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '2rem',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#8B5E3C'
            e.target.style.color = '#FFFFFF'
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#FFFFFF'
            e.target.style.color = '#8B5E3C'
          }}
        >
          ← Voltar
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 700, 
            color: '#3B2415', 
            margin: '0 0 0.5rem 0',
            lineHeight: 1.1
          }}>
            Validação de Anúncio
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#7B6B5E', 
            margin: 0 
          }}>
            Revise as informações antes de disponibilizar o item no catálogo.
          </p>
        </div>

        {/* Card principal */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8DDD2',
          borderRadius: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          padding: '32px',
          display: 'flex',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* Coluna Esquerda - Imagem */}
          <div style={{
            width: '480px',
            height: '540px',
            flexShrink: 0
          }}>
            <div style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid #E8DDD2',
              borderRadius: '18px',
              overflow: 'hidden',
              height: '540px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={anuncio.imagens && anuncio.imagens.length > 0 
                  ? getImageSrc(anuncio.imagens[currentImageIndex])
                  : getImageSrc(anuncio.imagem)
                }
                alt={anuncio.nome}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => { 
                  e.target.src = '/images/avatar2.webp'
                  e.target.onerror = null 
                }}
              />
              
              {/* Navegação de imagens */}
              {anuncio.imagens && anuncio.imagens.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#FFFFFF',
                      border: '1px solid #E8DDD2',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      fontSize: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      color: '#6B3E1F',
                      zIndex: 2
                    }}
                  >
                    ‹
                  </button>
                  <button 
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#FFFFFF',
                      border: '1px solid #E8DDD2',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      fontSize: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      color: '#6B3E1F',
                      zIndex: 2
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {anuncio.imagens && anuncio.imagens.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '16px',
                flexWrap: 'wrap'
              }}>
                {anuncio.imagens.map((img, i) => (
                  <img
                    key={i}
                    src={getImageSrc(img)}
                    alt={`foto ${i + 1}`}
                    onClick={() => setCurrentImageIndex(i)}
                    style={{
                      width: '72px',
                      height: '72px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: i === currentImageIndex ? '2px solid #8B5E3C' : '2px solid transparent',
                      cursor: 'pointer',
                      opacity: i === currentImageIndex ? 1 : 0.65
                    }}
                    onError={(e) => { 
                      e.target.src = '/images/avatar2.webp'
                      e.target.onerror = null 
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Coluna Direita - Informações */}
          <div style={{ paddingLeft: '40px' }}>
            {/* Nome do item */}
            <h1 style={{
              fontSize: '52px',
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#3B2415',
              margin: '0 0 20px 0'
            }}>
              {anuncio.nome}
            </h1>

            {/* Descrição */}
            {anuncio.descricao && (
              <p style={{
                fontSize: '22px',
                lineHeight: 1.6,
                color: '#7B6B5E',
                margin: '0 0 32px 0'
              }}>
                {anuncio.descricao}
              </p>
            )}

            {/* Informações do produto */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E8DDD2',
              borderRadius: '18px',
              overflow: 'hidden',
              padding: '0 32px',
              marginBottom: '32px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px',
                borderBottom: '1px solid #F0E8E0'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  color: '#7A6254',
                  fontWeight: 500
                }}>
                  <span className="material-icons" style={{ color: '#6B3E1F', fontSize: '20px', marginRight: '8px' }}>
                    checkroom
                  </span>
                  Categoria
                </span>
                <span style={{
                  fontSize: '0.92rem',
                  color: '#4A3428',
                  fontWeight: 600
                }}>
                  {anuncio.categoria?.nome || 'Não informado'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px',
                borderBottom: '1px solid #F0E8E0'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  color: '#7A6254',
                  fontWeight: 500
                }}>
                  <span className="material-icons" style={{ color: '#6B3E1F', fontSize: '20px', marginRight: '8px' }}>
                    straighten
                  </span>
                  Tamanho
                </span>
                <span style={{
                  fontSize: '0.92rem',
                  color: '#4A3428',
                  fontWeight: 600
                }}>
                  {anuncio.tamanho || 'Não informado'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px',
                borderBottom: '1px solid #F0E8E0'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  color: '#7A6254',
                  fontWeight: 500
                }}>
                  <span className="material-icons" style={{ color: '#6B3E1F', fontSize: '20px', marginRight: '8px' }}>
                    check_circle_outline
                  </span>
                  Condição
                </span>
                <span style={{
                  fontSize: '0.92rem',
                  color: '#4A3428',
                  fontWeight: 600
                }}>
                  {anuncio.condicao || 'Não informado'}
                </span>
              </div>

              {anuncio.doador?.endereco && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '56px',
                  borderBottom: '1px solid #F0E8E0'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.88rem',
                    color: '#7A6254',
                    fontWeight: 500
                  }}>
                    <span className="material-icons" style={{ color: '#6B3E1F', fontSize: '20px', marginRight: '8px' }}>
                      location_on
                    </span>
                    Região
                  </span>
                  <span style={{
                    fontSize: '0.92rem',
                    color: '#4A3428',
                    fontWeight: 600
                  }}>
                    {anuncio.doador.endereco}
                  </span>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px',
                borderBottom: '1px solid #F0E8E0'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  color: '#7A6254',
                  fontWeight: 500
                }}>
                  <span className="material-icons" style={{ color: '#6B3E1F', fontSize: '20px', marginRight: '8px' }}>
                    person_outline
                  </span>
                  Doador
                </span>
                <span style={{
                  fontSize: '0.92rem',
                  color: '#4A3428',
                  fontWeight: 600
                }}>
                  {anuncio.doador?.nome || 'Não informado'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  color: '#7A6254',
                  fontWeight: 500
                }}>
                  <span className="material-icons" style={{ color: '#6B3E1F', fontSize: '20px', marginRight: '8px' }}>
                    calendar_today
                  </span>
                  Data de envio
                </span>
                <span style={{
                  fontSize: '0.92rem',
                  color: '#4A3428',
                  fontWeight: 600
                }}>
                  {anuncio.dataCadastro ? new Date(anuncio.dataCadastro).toLocaleDateString('pt-BR') : 'Não informado'}
                </span>
              </div>
            </div>

            {/* Botões */}
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              <button 
                onClick={aprovar}
                style={{
                  flex: 1,
                  height: '64px',
                  background: '#8B5E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '20px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = '0.9'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 24px rgba(139, 94, 60, 0.3)'
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = '1'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                Aprovar Anúncio
              </button>

              <button 
                onClick={rejeitar}
                style={{
                  flex: 1,
                  height: '64px',
                  background: 'white',
                  border: '2px solid #8B5E3C',
                  color: '#8B5E3C',
                  borderRadius: '14px',
                  fontSize: '20px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#F5EDE3'
                  e.target.style.color = '#6B3E1F'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white'
                  e.target.style.color = '#8B5E3C'
                }}
              >
                Rejeitar Anúncio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValidateAd
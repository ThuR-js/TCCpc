import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { apiRequest, API_CONFIG } from '../api'

const Requests = () => {
  const navigate = useNavigate()
  const { currentUser, fetchProducts } = useApp()
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchAnuncios = async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/admin`)
      setAnuncios(Array.isArray(data) ? data : [])
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnuncios()
  }, [])

  const aprovar = async (id) => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ statusAnuncio: 'ATIVO' })
      })
      await fetchProducts()
      setAnuncios(prev => prev.map(a => a.id === id ? { ...a, statusAnuncio: 'ATIVO' } : a))
      setSelectedItem(prev => prev?.id === id ? { ...prev, statusAnuncio: 'ATIVO' } : prev)
    } catch (e) {
      alert('Erro ao aprovar: ' + e.message)
    }
  }

  const rejeitar = async (id) => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${id}`, {
        method: 'DELETE'
      })
      setAnuncios(prev => prev.filter(a => a.id !== id))
      setSelectedItem(null)
    } catch (e) {
      alert('Erro ao rejeitar: ' + e.message)
    }
  }

  const pendentes = anuncios.filter(a => a.statusAnuncio === 'PENDENTE')

  if (!currentUser?.isAdmin) {
    return (
      <div className="container">
        <h2 style={{ color: 'white' }}>Acesso Negado</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">Voltar</button>
      </div>
    )
  }

  const getStatusColor = (status) => {
    if (status === 'APROVADO') return '#28a745'
    if (status === 'PENDENTE') return '#ffc107'
    return '#dc3545'
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
          onClick={() => navigate('/')}
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

        {/* Lista de anúncios pendentes para seleção */}
        {!loading && !erro && pendentes.length > 0 && !selectedItem && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#3B2415',
              margin: '0 0 24px 0'
            }}>
              Selecione um anúncio para validar ({pendentes.length})
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {pendentes.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => setSelectedItem(a)}
                  style={{
                    background: '#FFFFFF',
                    border: '2px solid #E8DDD2',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 94, 60, 0.15)'
                    e.currentTarget.style.borderColor = '#8B5E3C'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                    e.currentTarget.style.borderColor = '#E8DDD2'
                  }}
                >
                  <img
                    src={a.foto || '/images/avatar2.webp'}
                    alt={a.nome}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/avatar2.webp'
                      e.target.onerror = null
                    }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#3B2415',
                      margin: '0 0 8px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {a.nome}
                    </h4>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#7B6B5E',
                      margin: '0 0 12px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {a.descricao || 'Sem descrição'}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: '#6B3E1F' }}>
                      <p style={{ margin: '0 0 4px 0' }}><strong>Doador:</strong> {a.doador?.nome || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão para voltar à lista */}
        {selectedItem && (
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <button 
              onClick={() => setSelectedItem(null)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #8B5E3C',
                color: '#8B5E3C',
                borderRadius: '999px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
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
              ← Voltar à lista
            </button>
          </div>
        )}

        {/* Card principal */}
        {loading ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#7B6B5E', fontSize: '18px' }}>Carregando...</p>
          </div>
        ) : erro ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#7B6B5E', fontSize: '18px' }}>Erro: {erro}</p>
          </div>
        ) : pendentes.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#7B6B5E', fontSize: '18px' }}>Nenhum anúncio pendente.</p>
          </div>
        ) : selectedItem ? (
          /* Layout de duas colunas - Imagem | Informações */
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
              <img
                src={selectedItem.foto || '/images/avatar2.webp'}
                alt={selectedItem.nome}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '18px'
                }}
                onError={(e) => { 
                  e.target.src = '/images/avatar2.webp'
                  e.target.onerror = null 
                }}
              />
            </div>

            {/* Coluna Direita - Informações */}
            <div style={{ flex: 1, paddingLeft: '40px' }}>
              {/* Nome do item */}
              <h1 style={{
                fontSize: '52px',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#3B2415',
                margin: '0 0 20px 0'
              }}>
                {selectedItem.nome}
              </h1>

              {/* Descrição */}
              {selectedItem.descricao && (
                <p style={{
                  fontSize: '22px',
                  lineHeight: 1.6,
                  color: '#7B6B5E',
                  margin: '0 0 32px 0'
                }}>
                  {selectedItem.descricao}
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
                  borderBottom: '1px solid #E8DDD2'
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
                    {selectedItem.categoria?.nome || 'Não informado'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '56px',
                  borderBottom: '1px solid #E8DDD2'
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
                    {selectedItem.tamanho || 'Não informado'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '56px',
                  borderBottom: '1px solid #E8DDD2'
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
                    {selectedItem.condicao || 'Não informado'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '56px',
                  borderBottom: '1px solid #E8DDD2'
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
                    {selectedItem.doador?.nome || 'Não informado'}
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
                    {selectedItem.dataCadastro || 'Não informado'}
                  </span>
                </div>
              </div>

              {/* Botões */}
              {currentUser?.isAdmin && selectedItem.statusAnuncio === 'PENDENTE' && (
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  <button 
                    onClick={() => aprovar(selectedItem.id)}
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
                    onClick={() => rejeitar(selectedItem.id)}
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
              )}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8DDD2',
            borderRadius: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#7B6B5E', fontSize: '18px' }}>Selecione um anúncio para ver os detalhes</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Requests

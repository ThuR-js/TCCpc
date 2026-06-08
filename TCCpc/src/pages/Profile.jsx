import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'
import { apiRequest, API_CONFIG } from '../api'
import { isValidImageType, isValidFileSize } from '../utils'
import { User, Mail, Calendar, BadgeCheck, Lock, ClipboardList, AlertTriangle } from 'lucide-react'

/* ─── Inline Styles ─────────────────────────────────────── */
const S = {
  page: {
    background: '#FAF7F2',
    minHeight: '100vh',
  },
  wrapper: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '32px',
  },
  breadcrumb: {
    color: '#8D8178',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  bcLink: {
    cursor: 'pointer',
    color: '#8D8178',
    textDecoration: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '45% 55%',
    gap: 40,
    marginBottom: 40,
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #ECE4DA',
    borderRadius: 20,
    padding: 40,
  },
  photoCard: {
    background: '#FFFFFF',
    border: '1px solid #ECE4DA',
    borderRadius: 20,
    padding: 40,
    height: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  avatar: {
    width: 220,
    height: 220,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #8B4A20',
    boxShadow: '0 8px 24px rgba(139,74,32,0.2)',
  },
  selectPhotoLabel: {
    background: '#8B4A20',
    color: 'white',
    borderRadius: 12,
    height: 52,
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 600,
    border: 'none',
    transition: 'background 0.2s',
  },
  savePhotoBtn: {
    background: '#4CAF50',
    color: 'white',
    borderRadius: 12,
    height: 52,
    padding: '0 32px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  removePhotoBtn: {
    background: 'white',
    color: '#E74C3C',
    borderRadius: 12,
    height: 44,
    padding: '0 24px',
    border: '1px solid #E74C3C',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  photoHint: {
    color: '#9C928A',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  infoTitle: {
    fontSize: 38,
    fontWeight: 700,
    color: '#2E241E',
    marginBottom: 32,
    lineHeight: 1.1,
  },
  infoRow: {
    height: 72,
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ECE4DA',
    gap: 16,
  },
  infoIcon: {
    color: '#8B4A20',
    flexShrink: 0,
  },
  infoLabel: {
    color: '#6F665F',
    fontSize: '0.9rem',
    fontWeight: 500,
    minWidth: 140,
    flexShrink: 0,
  },
  infoValue: {
    color: '#2E241E',
    fontSize: '0.95rem',
    fontWeight: 500,
    flex: 1,
  },
  editBtn: {
    height: 40,
    padding: '0 20px',
    borderRadius: 10,
    border: '1px solid #D6C7B7',
    background: 'transparent',
    color: '#6F665F',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    flexShrink: 0,
    transition: 'background 0.2s',
  },
  editInput: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #D6C7B7',
    fontSize: '0.9rem',
    outline: 'none',
    flex: 1,
  },
  saveBtn: {
    padding: '6px 14px',
    background: '#8B4A20',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  cancelBtn: {
    padding: '6px 14px',
    background: '#9C928A',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  select: {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #D6C7B7',
    fontSize: '0.9rem',
    background: 'white',
    color: '#2E241E',
    outline: 'none',
    flex: 1,
  },
  sectionCard: (mt = 40) => ({
    background: '#FFFFFF',
    border: '1px solid #ECE4DA',
    borderRadius: 20,
    padding: 32,
    marginTop: mt,
  }),
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#2E241E',
  },
  sectionSub: {
    color: '#6F665F',
    fontSize: '0.9rem',
    marginTop: 4,
    marginLeft: 36,
  },
  primaryBtn: {
    background: '#8B4A20',
    color: 'white',
    height: 52,
    borderRadius: 12,
    padding: '0 28px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'background 0.2s',
  },
  dangerCard: {
    background: '#FFF8F7',
    border: '1px solid #F3C7C2',
    borderRadius: 20,
    padding: 32,
    marginTop: 40,
  },
  dangerTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#C0392B',
    marginLeft: 12,
  },
  dangerText: {
    color: '#6F665F',
    fontSize: '0.9rem',
    marginTop: 4,
    marginLeft: 36,
    marginBottom: 20,
  },
  dangerBtns: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  inactivateBtn: {
    background: 'white',
    border: '1px solid #E74C3C',
    color: '#E74C3C',
    height: 48,
    padding: '0 24px',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  deleteBtn: {
    background: '#E74C3C',
    color: 'white',
    height: 48,
    padding: '0 24px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'background 0.2s',
  },
  pwForm: {
    marginTop: 20,
    padding: 24,
    background: '#FAF7F2',
    borderRadius: 12,
    border: '1px solid #ECE4DA',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  pwLabel: {
    display: 'block',
    color: '#6F665F',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: 6,
  },
  pwInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #D6C7B7',
    fontSize: '0.9rem',
    outline: 'none',
    background: 'white',
  },
  errorBox: {
    padding: '10px 16px',
    background: '#FFEBEE',
    border: '1px solid #FFCDD2',
    borderRadius: 10,
    color: '#C0392B',
    fontSize: '0.85rem',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modalBox: (danger) => ({
    background: 'white',
    borderRadius: 20,
    padding: 40,
    maxWidth: 440,
    width: '90%',
    textAlign: 'center',
    border: danger ? '2px solid #E74C3C' : '1px solid #ECE4DA',
  }),
  modalTitle: (danger) => ({
    fontSize: '1.3rem',
    fontWeight: 700,
    color: danger ? '#C0392B' : '#2E241E',
    marginBottom: 12,
  }),
  modalText: {
    color: '#6F665F',
    fontSize: '0.9rem',
    marginBottom: 24,
    lineHeight: 1.6,
  },
  modalBtns: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  doadorForm: {
    marginTop: 24,
    padding: 24,
    background: '#FAF7F2',
    borderRadius: 16,
    border: '2px solid #8B4A20',
  },
  doadorTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#8B4A20',
    marginBottom: 20,
    textAlign: 'center',
  },
  doadorRow: {
    marginBottom: 16,
  },
  doadorLabel: {
    color: '#6F665F',
    fontSize: '0.85rem',
    fontWeight: 500,
    display: 'block',
    marginBottom: 6,
  },
  doadorInputRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  savedBadge: {
    color: '#4CAF50',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
}

/* ─── Component ─────────────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, requests, products, updateUser, setProducts, resetProducts, setCurrentUser } = useApp()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(currentUser?.name || currentUser?.nome || '')
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState(currentUser?.email || '')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [showDoadorForm, setShowDoadorForm] = useState(
    currentUser?.nivelAcesso === 'DOADOR' && !currentUser?.doadorId
  )
  const [doadorCpf, setDoadorCpf] = useState('')
  const [doadorDataNasc, setDoadorDataNasc] = useState('')
  const [doadorCep, setDoadorCep] = useState('')
  const [cpfSaved, setCpfSaved] = useState(false)
  const [dataSaved, setDataSaved] = useState(false)
  const [cepSaved, setCepSaved] = useState(false)

  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(currentUser?.foto || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const userRequests = requests.filter(req => req.userId === currentUser?.id)
  const pendingRequests = userRequests.filter(req => req.status === 'pending')
  const donorRequests = requests.filter(req => req.donorId === currentUser?.id)
  const pendingDonorRequests = donorRequests.filter(req => req.status === 'pending')
  const approvedDonations = donorRequests.filter(req => req.status === 'approved').length
  const userProducts = products.filter(product => product.donorId === currentUser?.id)

  const getRegistrationDate = () => {
    if (currentUser?.id) {
      const date = new Date(currentUser.id)
      return date.toLocaleDateString()
    }
    return new Date().toLocaleDateString()
  }

  const removeProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja remover este anúncio?')) return
    const apiId = String(productId).startsWith('api_') ? String(productId).replace('api_', '') : null
    if (apiId) {
      try {
        await apiRequest(`${API_CONFIG.ENDPOINTS.ANUNCIO}/${apiId}`, { method: 'DELETE' })
      } catch (e) {
        alert('Erro ao remover anúncio')
        return
      }
    }
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleDeactivateAccount = async () => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${currentUser.id}/inativar`, { method: 'PUT' })
      alert('Conta inativada com sucesso!')
      setCurrentUser(null)
      sessionStorage.removeItem('currentUser')
      navigate('/login')
    } catch (error) {
      alert('Erro de conexão')
    }
    setShowDeactivateModal(false)
  }

  const handleDeleteAccount = async () => {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${currentUser.id}`, { method: 'DELETE' })
      alert('Conta excluída permanentemente!')
      setCurrentUser(null)
      sessionStorage.removeItem('currentUser')
      navigate('/')
    } catch (error) {
      alert('Erro ao excluir conta')
    }
    setShowDeleteModal(false)
  }

  const handlePasswordChange = async () => {
    setPasswordError('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos os campos são obrigatórios')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('A nova senha e a confirmação não são iguais')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres')
      return
    }
    if (currentPassword === newPassword) {
      setPasswordError('A nova senha deve ser diferente da senha atual')
      return
    }
    setIsChangingPassword(true)
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${currentUser.id}/alterar-senha`, {
        method: 'PUT',
        body: JSON.stringify({ senhaAtual: currentPassword, novaSenha: newPassword }),
      })
      alert('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (error) {
      setPasswordError('Erro ao alterar senha. Verifique se a senha atual está correta.')
    }
    setIsChangingPassword(false)
  }

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    const response = await fetch('https://api.cloudinary.com/v1_1/dod8l2rsn/image/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (!data.secure_url) throw new Error('Falha no upload da imagem')
    return data.secure_url
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!isValidImageType(file)) { alert('Apenas imagens JPG, PNG e WEBP são permitidas'); return }
    if (!isValidFileSize(file, 5)) { alert('A imagem deve ter no máximo 5MB'); return }
    setProfileImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setProfileImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfileImage = async () => {
    if (!profileImage) { alert('Selecione uma imagem primeiro'); return }
    setIsUploadingImage(true)
    try {
      const imageUrl = await uploadImageToCloudinary(profileImage)
      const result = await updateUser({ foto: imageUrl })
      if (result.success) {
        setProfileImagePreview(imageUrl)
        alert('Foto de perfil atualizada com sucesso!')
        setProfileImage(null)
      } else {
        alert(result.error || 'Erro ao atualizar foto de perfil')
      }
    } catch (error) {
      alert('Erro ao fazer upload da imagem: ' + error.message)
    }
    setIsUploadingImage(false)
  }

  const handleRemoveProfileImage = async () => {
    if (!confirm('Tem certeza que deseja remover sua foto de perfil?')) return
    setIsUploadingImage(true)
    try {
      const result = await updateUser({ fotoPerfil: null })
      if (result.success) {
        setProfileImagePreview(null)
        setProfileImage(null)
        alert('Foto de perfil removida com sucesso!')
      } else {
        alert(result.error || 'Erro ao remover foto de perfil')
      }
    } catch (error) {
      alert('Erro ao remover foto de perfil')
    }
    setIsUploadingImage(false)
  }

  if (!currentUser) {
    return (
      <div style={S.page}>
        <div style={S.wrapper}>
          <p style={{ color: '#6F665F' }}>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  const isDonor = currentUser?.type === 'doador' || currentUser?.nivelAcesso === 'DOADOR'

  const accountType = currentUser?.isAdmin
    ? 'Administrador'
    : isDonor ? 'Doador' : 'Donatário'

  return (
    <div style={S.page}>
      <div style={S.wrapper}>
        {/* ── Breadcrumb ─────────────────────────── */}
        <div style={S.breadcrumb}>
          <span style={S.bcLink} onClick={() => navigate('/')}>Início</span>
          <span>›</span>
          <span>Perfil</span>
        </div>

        {/* ── Main Grid: Foto + Informações ─────── */}
        <div style={S.grid}>
          {/* Foto de Perfil */}
          <div style={S.photoCard}>
            <img
              src={profileImagePreview || currentUser?.fotoPerfil || '/images/avatar2.webp'}
              alt="Foto de perfil"
              style={S.avatar}
              onError={(e) => { e.target.src = '/images/avatar2.webp'; e.target.onerror = null }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                  id="profile-image-input"
                />
                <label htmlFor="profile-image-input" style={S.selectPhotoLabel}>
                  Selecionar Foto
                </label>

                {profileImage && (
                  <button
                    onClick={handleSaveProfileImage}
                    disabled={isUploadingImage}
                    style={S.savePhotoBtn}
                  >
                    {isUploadingImage ? 'Salvando...' : 'Salvar Foto'}
                  </button>
                )}
              </div>

              {(currentUser?.fotoPerfil || profileImagePreview) && (
                <button
                  onClick={handleRemoveProfileImage}
                  disabled={isUploadingImage}
                  style={S.removePhotoBtn}
                >
                  Remover Foto
                </button>
              )}
            </div>

            <p style={S.photoHint}>
              Formatos aceitos: JPG, PNG, WEBP<br />
              Tamanho máximo: 5MB
            </p>
          </div>

          {/* Informações da Conta */}
          <div style={S.card}>
            <h1 style={S.infoTitle}>Informações da Conta</h1>

            {/* Nome */}
            <div style={S.infoRow}>
              <User size={20} style={S.infoIcon} />
              <span style={S.infoLabel}>Nome</span>
              {isEditingName ? (
                <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}>
                  <input
                    style={S.editInput}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <button style={S.saveBtn} disabled={isLoading} onClick={async () => {
                    if (!newName.trim()) { alert('Nome não pode estar vazio'); return }
                    setIsLoading(true)
                    const result = await updateUser({ nome: newName.trim() })
                    if (result.success) { setIsEditingName(false); alert('Nome atualizado!') }
                    else alert(result.error || 'Erro ao atualizar nome')
                    setIsLoading(false)
                  }}>
                    {isLoading ? '...' : 'Salvar'}
                  </button>
                  <button style={S.cancelBtn} onClick={() => { setIsEditingName(false); setNewName(currentUser?.name || currentUser?.nome || '') }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span style={S.infoValue}>{currentUser?.name || currentUser?.nome}</span>
                  <button
                    style={S.editBtn}
                    onMouseEnter={e => e.target.style.background = '#FAF1E8'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                    onClick={() => setIsEditingName(true)}
                  >
                    Editar
                  </button>
                </>
              )}
            </div>

            {/* Email */}
            <div style={S.infoRow}>
              <Mail size={20} style={S.infoIcon} />
              <span style={S.infoLabel}>Email</span>
              {isEditingEmail ? (
                <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}>
                  <input
                    type="email"
                    style={S.editInput}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button style={S.saveBtn} disabled={isLoading} onClick={async () => {
                    if (!newEmail.trim()) { alert('Email não pode estar vazio'); return }
                    setIsLoading(true)
                    const result = await updateUser({ email: newEmail.trim() })
                    if (result.success) { setIsEditingEmail(false); alert('Email atualizado!') }
                    else alert(result.error || 'Erro ao atualizar email')
                    setIsLoading(false)
                  }}>
                    {isLoading ? '...' : 'Salvar'}
                  </button>
                  <button style={S.cancelBtn} onClick={() => { setIsEditingEmail(false); setNewEmail(currentUser?.email || '') }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span style={S.infoValue}>{currentUser?.email}</span>
                  <button
                    style={S.editBtn}
                    onMouseEnter={e => e.target.style.background = '#FAF1E8'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                    onClick={() => setIsEditingEmail(true)}
                  >
                    Editar
                  </button>
                </>
              )}
            </div>

            {/* Data de Registro */}
            <div style={S.infoRow}>
              <Calendar size={20} style={S.infoIcon} />
              <span style={S.infoLabel}>Data de Registro</span>
              <span style={S.infoValue}>{currentUser?.dataCadastro || getRegistrationDate()}</span>
            </div>

            {/* Tipo de Conta */}
            <div style={S.infoRow}>
              <BadgeCheck size={20} style={S.infoIcon} />
              <span style={S.infoLabel}>Tipo de Conta</span>
              {currentUser?.isAdmin ? (
                <span style={S.infoValue}>Administrador</span>
              ) : (
                <>
                  <select
                    style={S.select}
                    value={currentUser?.nivelAcesso || (currentUser?.type === 'donatario' ? 'DONATARIO' : 'DOADOR')}
                    disabled={isLoading}
                    onChange={async (e) => {
                      const newType = e.target.value
                      if (newType === 'DOADOR') { setShowDoadorForm(true); return }
                      setIsLoading(true)
                      try {
                        const updatedUser = await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${currentUser.id}`, {
                          method: 'PUT',
                          body: JSON.stringify({ ...currentUser, nivelAcesso: newType }),
                        })
                        const merged = { ...currentUser, ...updatedUser, nivelAcesso: newType }
                        setCurrentUser(merged)
                        sessionStorage.setItem('currentUser', JSON.stringify(merged))
                        alert(`Tipo de conta alterado para ${newType === 'DOADOR' ? 'Doador' : 'Donatário'}!`)
                      } catch { alert('Erro de conexão') }
                      setIsLoading(false)
                    }}
                  >
                    <option value="DONATARIO">Donatário</option>
                    <option value="DOADOR">Doador</option>
                  </select>
                  {isLoading && <span style={{ fontSize: 12, color: '#9C928A', marginLeft: 8 }}>Salvando...</span>}
                </>
              )}
            </div>

            {/* CPF / CEP / Data Nascimento (somente doadores) */}
            {currentUser?.nivelAcesso === 'DOADOR' && currentUser?.doadorId && (
              <>
                <div style={S.infoRow}>
                  <User size={20} style={S.infoIcon} />
                  <span style={S.infoLabel}>CPF</span>
                  <span style={S.infoValue}>{currentUser?.cpf || 'Não informado'}</span>
                </div>
                <div style={S.infoRow}>
                  <User size={20} style={S.infoIcon} />
                  <span style={S.infoLabel}>CEP</span>
                  <span style={S.infoValue}>{currentUser?.cep || 'Não informado'}</span>
                </div>
                <div style={{ ...S.infoRow, borderBottom: 'none' }}>
                  <Calendar size={20} style={S.infoIcon} />
                  <span style={S.infoLabel}>Data de Nascimento</span>
                  <span style={S.infoValue}>
                    {currentUser?.dataNascimento
                      ? new Date(currentUser.dataNascimento).toLocaleDateString('pt-BR')
                      : 'Não informado'}
                  </span>
                </div>
              </>
            )}

            {/* Form novo doador */}
            {showDoadorForm && (
              <div style={S.doadorForm}>
                <p style={S.doadorTitle}>Informações de Doador</p>

                {[
                  { label: 'CPF (obrigatório)', val: doadorCpf, set: setDoadorCpf, saved: cpfSaved, setSaved: setCpfSaved, max: 11, placeholder: '00000000000', validate: v => v.length === 11 || 'CPF deve ter 11 dígitos', sanitize: v => v.replace(/\D/g, '') },
                  { label: 'Data de Nascimento (obrigatório)', val: doadorDataNasc, set: setDoadorDataNasc, saved: dataSaved, setSaved: setDataSaved, type: 'date', validate: v => !!v || 'Data é obrigatória' },
                  { label: 'CEP (obrigatório)', val: doadorCep, set: setDoadorCep, saved: cepSaved, setSaved: setCepSaved, max: 8, placeholder: '00000000', validate: v => v.length === 8 || 'CEP deve ter 8 dígitos', sanitize: v => v.replace(/\D/g, '') },
                ].map(({ label, val, set, saved, setSaved, max, placeholder, validate, type, sanitize }) => (
                  <div key={label} style={S.doadorRow}>
                    <label style={S.doadorLabel}>{label}</label>
                    <div style={S.doadorInputRow}>
                      <input
                        type={type || 'text'}
                        maxLength={max}
                        placeholder={placeholder}
                        value={val}
                        onChange={e => set(sanitize ? sanitize(e.target.value) : e.target.value)}
                        style={{ ...S.editInput, border: saved ? '2px solid #4CAF50' : '1px solid #D6C7B7', background: saved ? '#E8F5E9' : 'white' }}
                      />
                      {saved
                        ? <span style={S.savedBadge}>✓ Salvo</span>
                        : <button style={S.saveBtn} onClick={() => {
                          const err = validate(val)
                          if (err !== true && typeof err === 'string') { alert(err); return }
                          setSaved(true)
                        }}>Salvar</button>
                      }
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    style={{ ...S.primaryBtn, height: 44, opacity: (cpfSaved && dataSaved && cepSaved) ? 1 : 0.5 }}
                    disabled={isLoading || !cpfSaved || !dataSaved || !cepSaved}
                    onClick={async () => {
                      setIsLoading(true)
                      try {
                        const updatedUser = await apiRequest(`${API_CONFIG.ENDPOINTS.USUARIO}/${currentUser.id}`, {
                          method: 'PUT',
                          body: JSON.stringify({ ...currentUser, nivelAcesso: 'DOADOR', cpf: doadorCpf, dataNascimento: doadorDataNasc, cep: doadorCep }),
                        })
                        const merged = { ...currentUser, ...updatedUser, nivelAcesso: 'DOADOR', cpf: doadorCpf, dataNascimento: doadorDataNasc, cep: doadorCep }
                        setShowDoadorForm(false)
                        const doador = await apiRequest(API_CONFIG.ENDPOINTS.DOADOR, {
                          method: 'POST',
                          body: JSON.stringify({ nome: currentUser.nome || currentUser.name, cpf: doadorCpf, dataNascimento: doadorDataNasc, cep: doadorCep, usuario: { id: currentUser.id } }),
                        })
                        merged.doadorId = doador.id
                        setCurrentUser(merged)
                        sessionStorage.setItem('currentUser', JSON.stringify(merged))
                        alert('Conta alterada para Doador!')
                      } catch { alert('Erro de conexão') }
                      setIsLoading(false)
                    }}
                  >
                    {isLoading ? 'Enviando...' : 'Confirmar'}
                  </button>
                  <button style={{ ...S.inactivateBtn, height: 44 }} onClick={() => {
                    setShowDoadorForm(false)
                    setDoadorCpf(''); setDoadorDataNasc(''); setDoadorCep('')
                    setCpfSaved(false); setDataSaved(false); setCepSaved(false)
                  }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Segurança ──────────────────────────── */}
        <div style={S.sectionCard()}>
          <div style={S.sectionHeader}>
            <div>
              <div style={S.sectionTitleRow}>
                <Lock size={22} color="#8B4A20" />
                <span style={S.sectionTitle}>Segurança</span>
              </div>
              <p style={S.sectionSub}>Mantenha sua conta protegida.</p>
            </div>
            <button
              style={{ ...S.primaryBtn, background: showPasswordForm ? '#9C928A' : '#8B4A20' }}
              onMouseEnter={e => e.currentTarget.style.background = showPasswordForm ? '#6F665F' : '#6F3816'}
              onMouseLeave={e => e.currentTarget.style.background = showPasswordForm ? '#9C928A' : '#8B4A20'}
              onClick={() => {
                setShowPasswordForm(!showPasswordForm)
                if (showPasswordForm) {
                  setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordError('')
                }
              }}
            >
              {showPasswordForm ? 'Cancelar' : 'Alterar Senha'}
            </button>
          </div>

          {showPasswordForm && (
            <div style={S.pwForm}>
              {passwordError && <div style={S.errorBox}>{passwordError}</div>}
              {[
                { label: 'Senha Atual', val: currentPassword, set: setCurrentPassword, placeholder: 'Digite sua senha atual' },
                { label: 'Nova Senha', val: newPassword, set: setNewPassword, placeholder: 'Mínimo 6 caracteres' },
                { label: 'Confirmar Nova Senha', val: confirmPassword, set: setConfirmPassword, placeholder: 'Repita a nova senha', err: confirmPassword && newPassword !== confirmPassword },
              ].map(({ label, val, set, placeholder, err }) => (
                <div key={label}>
                  <label style={S.pwLabel}>{label}</label>
                  <input
                    type="password"
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder={placeholder}
                    style={{ ...S.pwInput, border: err ? '2px solid #E74C3C' : '1px solid #D6C7B7' }}
                  />
                  {err && <p style={{ color: '#E74C3C', fontSize: 12, marginTop: 4 }}>As senhas não coincidem</p>}
                </div>
              ))}
              <button
                style={{ ...S.primaryBtn, opacity: (currentPassword && newPassword && confirmPassword && newPassword === confirmPassword) ? 1 : 0.5 }}
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {isChangingPassword ? 'Alterando...' : 'Confirmar Alteração'}
              </button>
            </div>
          )}
        </div>

        {/* ── Validações ─────────────────────────── */}
        <div style={S.sectionCard()}>
          <div style={S.sectionTitleRow}>
            <ClipboardList size={22} color="#8B4A20" />
            <span style={S.sectionTitle}>Validações de Anúncios em Andamento</span>
          </div>

          {isDonor ? (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
                <div>
                  <p style={{ color: '#9C928A', fontSize: '0.85rem' }}>Produtos Cadastrados</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2E241E' }}>{userProducts.length}</p>
                </div>
                <div>
                  <p style={{ color: '#9C928A', fontSize: '0.85rem' }}>Doações Realizadas</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2E241E' }}>{approvedDonations}</p>
                </div>
                <div>
                  <p style={{ color: '#9C928A', fontSize: '0.85rem' }}>Total de Validações</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2E241E' }}>{donorRequests.length}</p>
                </div>
              </div>
              <button
                style={S.primaryBtn}
                onMouseEnter={e => e.currentTarget.style.background = '#6F3816'}
                onMouseLeave={e => e.currentTarget.style.background = '#8B4A20'}
                onClick={() => navigate('/received-requests')}
              >
                Ver Todas as Validações
              </button>
            </div>
          ) : pendingRequests.length === 0 ? (
            <p style={{ color: '#9C928A', marginTop: 16, fontSize: '0.95rem' }}>Nenhuma validação pendente.</p>
          ) : (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingRequests.map(request => (
                <div key={request.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#FAF7F2', borderRadius: 12, border: '1px solid #ECE4DA' }}>
                  <img
                    src={request.productImage?.startsWith('data:') ? request.productImage : `/${request.productImage}`}
                    alt={request.productName}
                    style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <strong style={{ color: '#2E241E', display: 'block', marginBottom: 4 }}>{request.productName}</strong>
                    <p style={{ color: '#9C928A', fontSize: '0.85rem', margin: 0 }}>Validado em: {new Date(request.date).toLocaleDateString()}</p>
                    <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', background: '#FFF3CD', color: '#856404', borderRadius: 20, fontSize: '0.8rem' }}>
                      Aguardando resposta
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Admin panel ────────────────────────── */}
        {currentUser?.isAdmin && (
          <div style={{ ...S.sectionCard(), borderTop: '3px solid #E74C3C' }}>
            <div style={S.sectionTitleRow}>
              <AlertTriangle size={22} color="#E74C3C" />
              <span style={{ ...S.sectionTitle, color: '#C0392B' }}>Painel Administrativo – Remover Anúncios</span>
            </div>
            <p style={{ color: '#9C928A', fontSize: '0.85rem', marginTop: 4, marginBottom: 20 }}>
              Total de anúncios: {products.length}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
              {products.slice(0, 10).map(product => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '1px solid #ECE4DA', borderRadius: 12 }}>
                  <img
                    src={product.image?.startsWith('data:') ? product.image : `/${product.image}`}
                    alt={product.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                    onError={e => { e.target.src = '/images/placeholder.jpg'; e.target.onerror = null }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#2E241E' }}>{product.name}</strong>
                    <p style={{ color: '#9C928A', fontSize: '0.85rem', margin: '2px 0' }}>Por: {product.donor}</p>
                  </div>
                  <button style={S.deleteBtn} onClick={() => removeProduct(product.id)}>Remover</button>
                </div>
              ))}
              {products.length > 10 && (
                <p style={{ textAlign: 'center', color: '#9C928A', fontSize: '0.85rem' }}>
                  Mostrando 10 de {products.length} anúncios.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Zona de Perigo ─────────────────────── */}
        <div style={S.dangerCard}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <AlertTriangle size={22} color="#C0392B" />
            <span style={S.dangerTitle}>Zona de Perigo</span>
          </div>
          <p style={S.dangerText}>
            Inativar sua conta irá desabilitar o acesso.<br />
            Você poderá reativá-la fazendo login novamente.
          </p>
          <div style={S.dangerBtns}>
            <button
              style={S.inactivateBtn}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF0EE'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
              onClick={() => setShowDeactivateModal(true)}
            >
              Inativar Conta
            </button>
            <button
              style={S.deleteBtn}
              onMouseEnter={e => e.currentTarget.style.background = '#C0392B'}
              onMouseLeave={e => e.currentTarget.style.background = '#E74C3C'}
              onClick={() => setShowDeleteModal(true)}
            >
              Excluir Conta
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal Inativar ─────────────────────── */}
      {showDeactivateModal && (
        <div style={S.modal}>
          <div style={S.modalBox(false)}>
            <h3 style={S.modalTitle(false)}>Confirmar Inativação</h3>
            <p style={S.modalText}>
              Tem certeza que deseja inativar sua conta?<br />
              Você pode reativar fazendo login novamente.
            </p>
            <div style={S.modalBtns}>
              <button style={S.deleteBtn} onClick={handleDeactivateAccount}>Sim, Inativar</button>
              <button style={S.editBtn} onClick={() => setShowDeactivateModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Excluir ──────────────────────── */}
      {showDeleteModal && (
        <div style={S.modal}>
          <div style={S.modalBox(true)}>
            <h3 style={S.modalTitle(true)}>⚠️ Excluir Conta Permanentemente</h3>
            <p style={S.modalText}>
              <strong>Esta ação é irreversível!</strong><br />
              Todos os seus dados, anúncios e histórico serão perdidos para sempre.
            </p>
            <div style={S.modalBtns}>
              <button style={S.deleteBtn} onClick={handleDeleteAccount}>Sim, Excluir</button>
              <button style={S.editBtn} onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

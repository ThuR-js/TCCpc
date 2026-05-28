// Script para limpar dados antigos do localStorage
console.log('Limpando dados antigos...')

// Limpar localStorage
localStorage.removeItem('products')
localStorage.removeItem('requests')

console.log('Dados limpos! Recarregue a página.')

// Recarregar a página automaticamente
window.location.reload()
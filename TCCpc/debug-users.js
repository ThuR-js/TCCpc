// Utilitário para desenvolvimento - Dados de usuários fictícios
// Este arquivo é apenas para desenvolvimento e teste

const usuarios_desenvolvimento = [
  {
    id: 1,
    email: "matheus@gmail.com",
    nome: "Matheus Silva",
    nivelAcesso: "DOADOR",
    senha_original: "123456", // Senha fictícia para desenvolvimento
    // A senha no banco estará criptografada (BCrypt ou similar)
  },
  {
    id: 2, 
    email: "admin@doeconect.com",
    nome: "Administrador",
    nivelAcesso: "ADMIN",
    senha_original: "admin123",
  },
  {
    id: 3,
    email: "donatario@teste.com", 
    nome: "João Donatário",
    nivelAcesso: "DONATARIO",
    senha_original: "teste123",
  }
];

// Função para testar login no sistema
console.log("=== DADOS DE DESENVOLVIMENTO ===");
console.log("Para testar o sistema, use:");
console.log("Email: matheus@gmail.com");
console.log("Senha: 123456");
console.log("");
console.log("Outros usuários de teste:");
usuarios_desenvolvimento.forEach(user => {
  console.log(`Email: ${user.email} | Senha: ${user.senha_original} | Tipo: ${user.nivelAcesso}`);
});

export default usuarios_desenvolvimento;
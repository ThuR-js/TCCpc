import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [products, setProducts] = useState([])
  const [favorites, setFavorites] = useState([1, 4])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({ type: '', size: '', condition: '' })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  const sampleProducts = [
    {
      id: 1,
      name: "Camiseta Hellstar Cinza",
      description: "Camiseta 100% algodão em ótimo estado",
      type: "camiseta",
      size: "P",
      condition: "seminovo",
      donor: "Maria Silva",
      donorId: 1,
      image: "images/Camisetas/camiseta-hellstar.webp",
      images: [
        "images/Camisetas/camiseta-hellstar.webp",
        "images/Camisetas/camiseta-hellstar2.webp"
      ],
      status: "available",
      whatsapp: "11999999999",
      chatEnabled: true
    },
    {
      id: 2,
      name: "Calça Baggy Lavagem Preta",
      description: "Calça jeans azul, tamanho 40",
      type: "calca",
      size: "G",
      condition: "usado",
      donor: "João Santos",
      donorId: 2,
      image: "images/Calças/calca-baggy.webp",
      images: [
        "images/Calças/calca-baggy.webp",
        "images/Calças/calca-baggy2.webp",
        "images/Calças/calca-baggy3.webp"
      ],
      status: "analyzing",
      whatsapp: "",
      chatEnabled: true
    },
    {
      id: 3,
      name: "Shorts Eric Emanuel",
      description: "Vestido estampado, nunca usado",
      type: "shorts",
      size: "GG",
      condition: "novo",
      donor: "Ana Costa",
      donorId: 3,
      image: "images/Shorts/shorts-eric.webp",
      images: [
        "images/Shorts/shorts-eric.webp",
        "images/Shorts/shorts-eric.webp",
        "images/Shorts/shorts-eric.webp"
      ],
      status: "donated",
      whatsapp: "11888888888",
      chatEnabled: false
    },
    {
      id: 4,
      name: "Shorts Nike",
      description: "Tênis para corrida, pouco usado",
      type: "shorts",
      size: "M",
      condition: "seminovo",
      donor: "Carlos Lima",
      donorId: 4,
      image: "images/Shorts/shorts-nike2.webp",
      images: [
        "images/Shorts/shorts-nike.webp",
        "images/Shorts/shorts-nike2.webp"
      ],
      status: "available",
      whatsapp: "11777777777",
      chatEnabled: true
    },
    {
      id: 5,
      name: "Camiseta Stone Island Year of Dragon",
      description: "Casaco de lã quentinho para o inverno",
      type: "camiseta",
      size: "G",
      condition: "usado",
      donor: "Fernanda Oliveira",
      donorId: 5,
      image: "images/Camisetas/camiseta-stone.webp",
      images: [
        "images/Camisetas/camiseta-stone.webp",
        "images/Camisetas/camiseta-stone2.webp",
        "images/Camisetas/camiseta-stone3.webp",
        "images/Camisetas/camiseta-stone4.webp"
      ],
      status: "available",
      whatsapp: "",
      chatEnabled: true
    },
    {
      id: 6,
      name: "Calça Corteiz Devil Island",
      description: "Saia social preta, ideal para trabalho",
      type: "calca",
      size: "P",
      condition: "novo",
      donor: "Patricia Mendes",
      donorId: 6,
      image: "images/Calças/calca-corteiz.webp",
      images: [
        "images/Calças/calca-corteiz.webp",
        "images/Calças/calca-corteiz2.webp",
        "images/Calças/calca-corteiz3.webp",
        "images/Calças/calca-corteiz4.webp"
      ],
      status: "analyzing",
      whatsapp: "11666666666",
      chatEnabled: true
    },
    {
      id: 7,
      name: "Corta Vento The North Face",
      description: "Corta vento The North Face original, perfeito para atividades ao ar livre",
      type: "moletom",
      size: "M",
      condition: "seminovo",
      donor: "Rafael Costa",
      donorId: 7,
      image: "images/Moletons/CortaVentoTheNorthFace.webp",
      images: [
        "images/Moletons/CortaVentoTheNorthFace.webp",
        "images/Moletons/CortaVentoTheNorthFace2.webp"
      ],
      status: "available",
      whatsapp: "11333333333",
      chatEnabled: true
    },
    {
      id: 8,
      name: "Jaqueta Amiri",
      description: "Jaqueta Amiri de luxo, design exclusivo e alta qualidade",
      type: "moletom",
      size: "M",
      condition: "novo",
      donor: "Gustavo Silva",
      donorId: 8,
      image: "images/Moletons/JaquetaAmiri.webp",
      images: [
        "images/Moletons/JaquetaAmiri.webp",
        "images/Moletons/JaquetaAmiri2.webp",
        "images/Moletons/JaquetaAmiri3.webp"
      ],
      status: "available",
      whatsapp: "11222222222",
      chatEnabled: true
    },
    {
      id: 9,
      name: "Jaqueta Palace Stella",
      description: "Jaqueta Palace Stella em ótimo estado, pouco usada",
      type: "moletom",
      size: "M",
      condition: "seminovo",
      donor: "Lucas Ferreira",
      donorId: 9,
      image: "images/Moletons/Jaquetapalacestella.webp",
      images: [
        "images/Moletons/Jaquetapalacestella.webp",
        "images/Moletons/Jaquetapalacestella2.webp",
        "images/Moletons/Jaquetapalacestella3.webp"
      ],
      status: "available",
      whatsapp: "11555555555",
      chatEnabled: true
    },
    {
      id: 10,
      name: "Moletom Champion",
      description: "Moletom Champion original, muito confortável",
      type: "moletom",
      size: "GG",
      condition: "usado",
      donor: "Beatriz Santos",
      donorId: 10,
      image: "images/Moletons/MoletomChampion.webp",
      images: [
        "images/Moletons/MoletomChampion.webp",
        "images/Moletons/MoletomChampion2.webp",
        "images/Moletons/MoletomChampion3.webp"
      ],
      status: "available",
      whatsapp: "11444444444",
      chatEnabled: true
    },
    {
      id: 11,
      name: "Moletom Champion Capuz Black",
      description: "Moletom Champion preto com capuz, estilo urbano",
      type: "moletom",
      size: "M",
      condition: "seminovo",
      donor: "Diego Almeida",
      donorId: 11,
      image: "images/Moletons/MoletomChampionCapuzBlack.webp",
      images: [
        "images/Moletons/MoletomChampionCapuzBlack.webp",
        "images/Moletons/MoletomChampionCapuzBlack2.webp",
        "images/Moletons/MoletomChampionCapuzBlack3.webp"
      ],
      status: "available",
      whatsapp: "11111111111",
      chatEnabled: true
    },
    {
      id: 12,
      name: "Moletom Essentials",
      description: "Moletom Essentials minimalista, conforto e estilo",
      type: "moletom",
      size: "M",
      condition: "novo",
      donor: "Amanda Rocha",
      donorId: 12,
      image: "images/Moletons/MoletomEssentials.webp",
      images: [
        "images/Moletons/MoletomEssentials.webp",
        "images/Moletons/MoletomEssentials2.webp",
        "images/Moletons/MoletomEssentials3.webp"
      ],
      status: "available",
      whatsapp: "11000000000",
      chatEnabled: true
    },
    {
      id: 13,
      name: "Camiseta Balenciaga",
      description: "Camiseta Balenciaga original, design exclusivo",
      type: "camiseta",
      size: "G",
      condition: "novo",
      donor: "Sophia Lima",
      donorId: 13,
      image: "images/Camisetas/CamisetaBalenciaga.webp",
      images: [
        "images/Camisetas/CamisetaBalenciaga.webp",
        "images/Camisetas/CamisetaBalenciaga2.webp",
        "images/Camisetas/CamisetaBalenciaga3.webp",
        "images/Camisetas/CamisetaBalenciaga4.webp"
      ],
      status: "available",
      whatsapp: "11999888777",
      chatEnabled: true
    },
    {
      id: 14,
      name: "Camiseta Corteiz",
      description: "Camiseta Corteiz streetwear, estilo urbano",
      type: "camiseta",
      size: "M",
      condition: "seminovo",
      donor: "Pedro Santos",
      donorId: 14,
      image: "images/Camisetas/CamisetaCorteiz.webp",
      images: [
        "images/Camisetas/CamisetaCorteiz.webp",
        "images/Camisetas/CamisetaCorteiz2.webp"
      ],
      status: "available",
      whatsapp: "11888777666",
      chatEnabled: true
    },
    {
      id: 15,
      name: "Camiseta Stussy",
      description: "Camiseta Stussy clássica, marca icônica do streetwear",
      type: "camiseta",
      size: "M",
      condition: "usado",
      donor: "Mateus Oliveira",
      donorId: 15,
      image: "images/Camisetas/CamisetaStussy.webp",
      images: [
        "images/Camisetas/CamisetaStussy.webp",
        "images/Camisetas/CamisetaStussy2.webp"
      ],
      status: "available",
      whatsapp: "11777666555",
      chatEnabled: true
    },
    {
      id: 16,
      name: "Calça Louis Vuitton Carpenter",
      description: "Calça Louis Vuitton Carpenter de luxo, design exclusivo",
      type: "calca",
      size: "M",
      condition: "novo",
      donor: "Isabella Costa",
      donorId: 16,
      image: "images/Calças/Calça Louis Vuitton Carpenter3.webp",
      images: [
        "images/Calças/Calça Louis Vuitton Carpenter3.webp",
        "images/Calças/Calça Louis Vuitton Carpenter2.webp",
        "images/Calças/Calça Louis Vuitton Carpenter.webp"
      ],
      status: "available",
      whatsapp: "11666555444",
      chatEnabled: true
    },
    {
      id: 17,
      name: "Calça Denim Tears",
      description: "Calça Denim Tears streetwear, design único e moderno",
      type: "calca",
      size: "GG",
      condition: "seminovo",
      donor: "Gabriel Ferreira",
      donorId: 17,
      image: "images/Calças/CalçaDenim tears.webp",
      images: [
        "images/Calças/CalçaDenim tears.webp",
        "images/Calças/CalçaDenim tears2.webp",
        "images/Calças/CalçaDenim tears3.webp"
      ],
      status: "available",
      whatsapp: "11555444333",
      chatEnabled: true
    },
    {
      id: 18,
      name: "Calça Moletom",
      description: "Calça de moletom confortável, ideal para o dia a dia",
      type: "calca",
      size: "M",
      condition: "usado",
      donor: "Larissa Silva",
      donorId: 18,
      image: "images/Calças/CalçaMoletom.webp",
      images: [
        "images/Calças/CalçaMoletom.webp",
        "images/Calças/CalçaMoletom2.webp",
        "images/Calças/CalçaMoletom3.webp"
      ],
      status: "available",
      whatsapp: "11444333222",
      chatEnabled: true
    },
    {
      id: 19,
      name: "Calça Ed Hardy",
      description: "Calça Ed Hardy com estampas exclusivas, estilo rock",
      type: "calca",
      size: "M",
      condition: "seminovo",
      donor: "Thiago Rocha",
      donorId: 19,
      image: "images/Calças/EDHard.webp",
      images: [
        "images/Calças/EDHard.webp",
        "images/Calças/EDHard2.webp",
        "images/Calças/EDHard3.webp",
        "images/Calças/EDHard4.webp"
      ],
      status: "available",
      whatsapp: "11333222111",
      chatEnabled: true
    },
    {
      id: 20,
      name: "Calça Polar Big",
      description: "Calça Polar Big skate, estilo urbano e confortável",
      type: "calca",
      size: "M",
      condition: "usado",
      donor: "Vinicius Alves",
      donorId: 20,
      image: "images/Calças/CalçaPolarBig.webp",
      images: [
        "images/Calças/CalçaPolarBig.webp",
        "images/Calças/CalçaPolarBig2.webp"
      ],
      status: "available",
      whatsapp: "11222111000",
      chatEnabled: true
    },
    {
      id: 21,
      name: "Short Burberry",
      description: "Short Burberry de luxo, padrão xadrez clássico",
      type: "shorts",
      size: "M",
      condition: "novo",
      donor: "Camila Martins",
      donorId: 21,
      image: "images/Shorts/ShortBurberry.webp",
      images: [
        "images/Shorts/ShortBurberry.webp",
        "images/Shorts/ShortBurberry2.webp",
        "images/Shorts/ShortBurberry3.webp"
      ],
      status: "available",
      whatsapp: "11111000999",
      chatEnabled: true
    },
    {
      id: 22,
      name: "Short Essentials",
      description: "Short Essentials minimalista, conforto e estilo",
      type: "shorts",
      size: "M",
      condition: "seminovo",
      donor: "Rafael Mendes",
      donorId: 22,
      image: "images/Shorts/ShortEssentials2.webp",
      images: [
        "images/Shorts/ShortEssentials2.webp",
        "images/Shorts/ShortEssentials3.webp",
        "images/Shorts/ShortEssentials4.webp"
      ],
      status: "available",
      whatsapp: "11000999888",
      chatEnabled: true
    },
    {
      id: 23,
      name: "Air Force 1 Black",
      description: "Nike Air Force 1 preto clássico, ícone do streetwear",
      type: "tenis",
      size: "P",
      condition: "seminovo",
      donor: "Bruno Silva",
      donorId: 23,
      image: "images/Tenis/Air Force 1 Black.webp",
      images: [
        "images/Tenis/Air Force 1 Black.webp",
        "images/Tenis/Air Force 1 Black2.webp",
        "images/Tenis/Air Force 1 Black3.webp"
      ],
      status: "available",
      whatsapp: "11999888777",
      chatEnabled: true
    },
    {
      id: 24,
      name: "Asics Gel",
      description: "Tênis Asics Gel para corrida, conforto e performance",
      type: "tenis",
      size: "M",
      condition: "usado",
      donor: "Fernanda Costa",
      donorId: 24,
      image: "images/Tenis/AsicsGel.webp",
      images: [
        "images/Tenis/AsicsGel.webp",
        "images/Tenis/AsicsGel2.webp",
        "images/Tenis/AsicsGel3.webp"
      ],
      status: "available",
      whatsapp: "11888777666",
      chatEnabled: true
    },
    {
      id: 25,
      name: "Chuteira Nike Air Zoom Mercurial Superfly 10 Elite TF",
      description: "Chuteira Nike profissional para futebol, alta performance",
      type: "tenis",
      size: "M",
      condition: "novo",
      donor: "Carlos Eduardo",
      donorId: 25,
      image: "images/Tenis/ChuteiraNikeAirZoomMercurialSuperfly10 EliteTF.webp",
      images: [
        "images/Tenis/ChuteiraNikeAirZoomMercurialSuperfly10 EliteTF.webp",
        "images/Tenis/ChuteiraNikeAirZoomMercurialSuperfly10 EliteTF2.webp",
        "images/Tenis/ChuteiraNikeAirZoomMercurialSuperfly10 EliteTF3.webp",
        "images/Tenis/ChuteiraNikeAirZoomMercurialSuperfly10 EliteTF4.webp"
      ],
      status: "available",
      whatsapp: "11777666555",
      chatEnabled: true
    },
    {
      id: 26,
      name: "Dunk Albino Black",
      description: "Nike Dunk Albino Black, edição especial e limitada",
      type: "tenis",
      size: "M",
      condition: "seminovo",
      donor: "Matheus Oliveira",
      donorId: 26,
      image: "images/Tenis/DunkAlbinoBlack.webp",
      images: [
        "images/Tenis/DunkAlbinoBlack.webp",
        "images/Tenis/DunkAlbinoBlack2.webp",
        "images/Tenis/DunkAlbinoBlack3.webp",
        "images/Tenis/DunkAlbinoBlack4.webp"
      ],
      status: "available",
      whatsapp: "11666555444",
      chatEnabled: true
    },
    {
      id: 27,
      name: "Jordan 1 Next Chapter",
      description: "Air Jordan 1 Next Chapter, clássico atemporal do basquete",
      type: "tenis",
      size: "G",
      condition: "novo",
      donor: "Leonardo Santos",
      donorId: 27,
      image: "images/Tenis/Jordan 1 next chapter.webp",
      images: [
        "images/Tenis/Jordan 1 next chapter.webp",
        "images/Tenis/Jordan 1 next chapter2.webp",
        "images/Tenis/Jordan 1 next chapter3.webp",
        "images/Tenis/Jordan 1 next chapter4.webp",
        "images/Tenis/Jordan 1 next chapter5.webp"
      ],
      status: "available",
      whatsapp: "11555444333",
      chatEnabled: true
    },
    {
      id: 28,
      name: "Timberland",
      description: "Bota Timberland clássica, resistência e estilo urbano",
      type: "tenis",
      size: "M",
      condition: "usado",
      donor: "Rodrigo Lima",
      donorId: 28,
      image: "images/Tenis/Timberland.webp",
      images: [
        "images/Tenis/Timberland.webp",
        "images/Tenis/Timberland2.webp",
        "images/Tenis/Timberland3.webp",
        "images/Tenis/Timberland4.webp",
        "images/Tenis/Timberland5.webp"
      ],
      status: "available",
      whatsapp: "11444333222",
      chatEnabled: true
    }
  ]

  useEffect(() => {
    setProducts(sampleProducts)
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const value = {
    currentUser,
    setCurrentUser,
    products,
    setProducts,
    favorites,
    toggleFavorite,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentImageIndex,
    setCurrentImageIndex,
    showDropdown,
    setShowDropdown
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
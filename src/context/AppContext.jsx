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
      size: "M",
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
      size: "M",
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
      size: "M",
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
      size: "M",
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
      size: "M",
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
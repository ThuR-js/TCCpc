import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Chat from './pages/Chat'
import ProductDetails from './pages/ProductDetails'
import Requests from './pages/Requests'
import AddProduct from './pages/AddProduct'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import './AdminStyles.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
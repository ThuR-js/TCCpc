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
            <Route path="/" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <Home />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <Favorites />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <Chat />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/requests" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <Requests />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <AddProduct />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <Profile />
                </main>
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <Header />
                <main className="main">
                  <ProductDetails />
                </main>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
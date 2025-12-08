import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Contact from './components/Contact'
import Admin from './components/Admin'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

// Página principal con hero y formulario de contacto
function LandingPage() {
  return (
    <>
      <Hero />
      <Contact />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

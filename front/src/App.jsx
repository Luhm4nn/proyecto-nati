import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutMe from './pages/AboutMe';
import Login from './components/Login';
import Admin from './components/Admin';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Novedades from './components/Novedades';
import Features from './components/Features';
import Cursos from './components/Cursos';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Login from './components/Login';
import Inscripcion from './components/Inscripcion';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';



function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sobre-mi" element={<AboutMe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscripcion/:id" element={<Inscripcion />} />
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
    </ToastProvider>
  );
}

export default App;

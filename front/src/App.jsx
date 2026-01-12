import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Novedades from './components/Novedades';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import Login from './components/Login';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';


// Landing Page Composition
function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Novedades />
      <Features />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default App;

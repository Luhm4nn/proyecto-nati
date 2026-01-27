import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection("hero");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="navbar-logo-link" onClick={handleLogoClick}>
            <img
              src="/natiluhmannlogofinal2022 (1).jpg"
              alt="Logo"
              className="navbar-logo-img"
            />
            <span className="logo-text">Deutsch für dich</span>
          </Link>
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <button onClick={() => scrollToSection("hero")} className="nav-link">
            Inicio
          </button>
          <button
            onClick={() => scrollToSection("novedades")}
            className="nav-link"
          >
            Novedades
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="nav-link"
          >
            Características
          </button>
          <button
            onClick={() => scrollToSection("cursos")}
            className="nav-link"
          >
            Cursos
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="nav-link"
          >
            Testimonios
          </button>
          <button onClick={() => scrollToSection("faq")} className="nav-link">
            Preguntas
          </button>
          <button
            onClick={() => scrollToSection("cursos")}
            className="nav-cta-mobile"
          >
            Empezar Ahora
          </button>
        </div>

        <div className="navbar-actions">
          <Link to="/admin" className="nav-login">
            Admin
          </Link>
          <button
            onClick={() => scrollToSection("cursos")}
            className="nav-cta"
          >
            Empezar
          </button>
          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

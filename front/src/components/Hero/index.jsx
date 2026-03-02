import { useState, useEffect } from 'react';
import './Hero.css';

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const imagesDesktop = [
    '/hero/desktop/image1.png',
    '/hero/desktop/image2.png',
    //'/hero/desktop/image3.png', comentamos de moemento devido a que la imagen es de baja calidad
  ];
  const imagesMobile = [
    '/hero/mobile/image1m.png',
    '/hero/mobile/image2m.png',
    '/hero/mobile/image3m.png',
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const images = isMobile ? imagesMobile : imagesDesktop;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="hero" className="hero-section">
      <div className="hero-background">
        {images.map((image, index) => (
          <div
            key={index}
            className={`hero-bg-image ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="hero-overlay" />
      </div>
      <div className="hero-header container">
        <div className="hero-logo-title-container">
          <h1 className="hero-brand-name">
            Alemán para vos
            <span className="hero-brand-subtitle">Natalia Luhmann</span>
          </h1>
        </div>
      </div>
    </section>
  );
}

export default Hero;

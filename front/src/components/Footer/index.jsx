import { InstagramIcon } from '../shared/UI/Icons';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span className="logo-text">Deutsch für dich</span>
                        <p>Natalia Luhmann</p>
                    </div>

                    <div className="footer-copyright">
                        <p>&copy; {new Date().getFullYear()} Deutsch für dich. Todos los derechos reservados.</p>
                    </div>

                    <div className="footer-social">
                        <a 
                            href="https://www.instagram.com/alemanparavos_" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Seguinos en Instagram"
                        >
                            <InstagramIcon className="social-icon" />
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

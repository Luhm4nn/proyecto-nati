import './Footer.css';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <span className="logo-text">Deutsch für dich</span>
                        <p>Deutsch für dich</p>
                    </div>

                    <div className="footer-copyright">
                        <p>&copy; {new Date().getFullYear()} Deutsch für dich. Todos los derechos reservados.</p>
                    </div>

                    <div className="footer-social">
                        {/* Social Icons Placeholder */}
                        <span>Instagram</span>
                        <span>LinkedIn</span>
                        <span>Email</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

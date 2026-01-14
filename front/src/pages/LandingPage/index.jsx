import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Novedades from '../../components/Novedades';
import Features from '../../components/Features';
import Testimonials from '../../components/Testimonials';
import FAQ from '../../components/FAQ';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';

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

export default LandingPage;

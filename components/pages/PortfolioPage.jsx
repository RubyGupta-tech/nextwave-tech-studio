import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Portfolio from '../Portfolio';
import ShowcaseSlider from '../ShowcaseSlider';

const PortfolioPage = () => {
    useEffect(() => {
        // Scroll Reveal Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <main className="portfolio-page">
            <section className="portfolio-hero">
                <div className="hero-waves-container">
                    {/* SVG Waves matching Home/About branding */}
                    <svg className="hero-wave wave1" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="rgba(6, 182, 212, 0.05)" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="hero-star-particle" style={{ left: '10%', top: '20%', animationDelay: '0s' }}></div>
                <div className="hero-star-particle" style={{ left: '85%', top: '15%', animationDelay: '1.5s' }}></div>
                <div className="hero-star-particle" style={{ left: '40%', top: '70%', animationDelay: '3s' }}></div>
                <div className="hero-glow" style={{ left: '20%', top: '30%' }}></div>
                <div className="hero-glow" style={{ right: '10%', bottom: '20%' }}></div>

                <div className="container hero-content-wrapper reveal">
                    <div className="section-label">DIGITAL SHOWCASE</div>
                    <h1 className="portfolio-hero-title">
                        Building <span className="innovation-gradient">Impact</span> Through Design
                    </h1>
                    <p className="portfolio-hero-subtitle">
                        Explore a curated collection of high-performance digital solutions crafted for ambitious brands.
                    </p>
                    <div className="hero-cta-group">
                        <Link 
                            to="/?nav=contact" 
                            className="portfolio-hero-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Work With Me
                        </Link>
                    </div>
                </div>

                {/* Bottom Wave Transition */}
                <div className="hero-bottom-divider">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path fill="#0a192f" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>
            
            <Portfolio />
            <ShowcaseSlider />
            <section className="portfolio-cta-wrapper">
                <div className="portfolio-cta-box">
                    <h2 className="portfolio-cta-title">Ready to start your project?</h2>
                    <p className="portfolio-cta-desc">
                        We specialize in high-performance websites that look great and deliver results. Let's build something amazing together.
                    </p>
                    <Link 
                        to="/#contact" 
                        className="portfolio-cta-btn"
                        onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                    >
                        Get in Touch
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default PortfolioPage;

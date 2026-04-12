import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const WebsiteCreation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="subpage">
            <section className="about-hero">
                <div className="hero-waves-container">
                    <svg className="hero-wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="rgba(6, 182, 212, 0.15)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <svg className="hero-wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="rgba(37, 99, 235, 0.2)" d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,192C672,213,768,235,864,224C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <div className="hero-glow-trails">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="hero-star-particle"></div>
                        ))}
                    </div>
                </div>

                <div className="hero-glow hero-glow-1"></div>
                <div className="hero-glow hero-glow-2"></div>

                <div className="container">
                    <div className="about-hero-content reveal">
                        <span className="about-badge">Our Services</span>
                        <h1>Website Creation & <span className="innovation-gradient">Design</span></h1>
                        <p className="lead">
                            Effective websites drive targeted visitors and increase business.
                        </p>
                        <Link 
                            to="/?nav=contact"
                            className="about-cta-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Start Your Project
                        </Link>
                    </div>
                </div>
            </section>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">More Than Just Web Design</h2>
                        <p>
                            We go beyond simply designing and building websites. At NextWave Tech Studio, we
                            take a holistic approach to your online presence. Your website is the core of your
                            digital marketing strategy, built from the ground up to turn casual visitors into loyal customers.
                        </p>
                    </div>

                    <div className="services-grid-premium" style={{ marginTop: '60px' }}>
                        {/* Custom Architecture */}
                        <div className="premium-service-card reveal">
                            <div className="card-layer-bg"></div>
                            <div className="premium-card-content">
                                <div className="card-icon-top">🏛️</div>
                                <h3>Custom Architecture</h3>
                                <p>No cookie-cutter templates. We build bespoke digital experiences tailored to your brand's unique needs and identity.</p>
                            </div>
                        </div>

                        {/* Responsive Design */}
                        <div className="premium-service-card reveal">
                            <div className="card-layer-bg"></div>
                            <div className="premium-card-content">
                                <div className="card-icon-top">📱</div>
                                <h3>Responsive Design</h3>
                                <p>Flawless execution across all devices. We ensure your site looks stunning on desktop, tablet, and mobile.</p>
                            </div>
                        </div>

                        {/* Conversion Focused */}
                        <div className="premium-service-card reveal">
                            <div className="card-layer-bg"></div>
                            <div className="premium-card-content">
                                <div className="card-icon-top">📈</div>
                                <h3>Conversion Focused</h3>
                                <p>Beautiful design paired with highly effective UI/UX functionality. We optimize every touchpoint to drive leads and maximize your ROI.</p>
                            </div>
                        </div>
                    </div>

                    {/* Technical Mastery Showcase */}
                    <div className="tech-mastery-section reveal">
                        <div className="tech-group">
                            <h3 className="tech-group-title">Standard Website Platforms & Builders</h3>
                            <div className="tech-grid">
                                <div className="tech-card wordpress">
                                    <div className="tech-icon">WP</div>
                                    <span>WordPress</span>
                                </div>
                                <div className="tech-card squarespace">
                                    <div className="tech-icon">SQ</div>
                                    <span>Squarespace</span>
                                </div>
                                <div className="tech-card wix">
                                    <div className="tech-icon">WX</div>
                                    <span>Wix</span>
                                </div>
                                <div className="tech-card shopify">
                                    <div className="tech-icon">SH</div>
                                    <span>Shopify</span>
                                </div>
                                <div className="tech-card webflow">
                                    <div className="tech-icon">WF</div>
                                    <span>Webflow</span>
                                </div>
                            </div>
                        </div>

                        <div className="tech-group">
                            <h3 className="tech-group-title">Tailored Design Technology Solutions</h3>
                            <div className="tech-grid">
                                <div className="tech-card nextjs">
                                    <div className="tech-icon">NX</div>
                                    <span>Next.js</span>
                                </div>
                                <div className="tech-card react">
                                    <div className="tech-icon">RE</div>
                                    <span>React</span>
                                </div>
                                <div className="tech-card python">
                                    <div className="tech-icon">PY</div>
                                    <span>Python</span>
                                </div>
                                <div className="tech-card php">
                                    <div className="tech-icon">PH</div>
                                    <span>PHP</span>
                                </div>
                                <div className="tech-card java">
                                    <div className="tech-icon">JV</div>
                                    <span>Java</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Looking for a better website?</h2>
                        <Link 
                            to="/?nav=contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Let's Talk
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteCreation;

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
            <div className="page-hero">
                <h1 className="page-title">Website Creation & Design</h1>
                <p>Effective websites drive targeted visitors and increase business.</p>
            </div>

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
                            to="/#contact" 
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

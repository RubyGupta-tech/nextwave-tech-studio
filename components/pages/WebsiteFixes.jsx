import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const WebsiteFixes = () => {
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
                        <span className="about-badge">Crisis Response</span>
                        <h1>Website Fixes & <span className="innovation-gradient">Repair</span></h1>
                        <p className="lead">
                            Website not working? Need it to load and run faster? We've got you covered.
                        </p>
                        <Link 
                            to="/?nav=contact"
                            className="about-cta-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Get Help Now
                        </Link>
                    </div>
                </div>
            </section>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Expert Troubleshooting & Resolution</h2>
                        <p>
                            A broken website costs you credibility and customers. Whether you are dealing with a
                            mysterious error message, painfully slow loading speeds, or a layout that breaks
                            on mobile devices, NextWave Tech Studio can diagnose and fix the issue quickly.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Bug Fixes & Errors</h3>
                            <p>We squash bugs, resolve plugin conflicts, and eliminate those frustrating white screens of death to get your site back online.</p>
                        </div>
                        <div className="service-block">
                            <h3>Speed Optimization</h3>
                            <p>We audit and compress massive images, minify code, and configure caching to ensure your pages load in fractions of a second.</p>
                        </div>
                        <div className="service-block">
                            <h3>Mobile Responsiveness</h3>
                            <p>We correct broken layouts and styling issues so your website provides a flawless experience on smartphones and tablets.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Is your website down or underperforming?</h2>
                        <Link 
                            to="/?nav=contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Get Help Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteFixes;

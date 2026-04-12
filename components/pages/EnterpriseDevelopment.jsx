import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const EnterpriseDevelopment = () => {
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
                        <span className="about-badge">Scalable Infrastructure</span>
                        <h1>Enterprise Web <span className="innovation-gradient">Applications</span></h1>
                        <p className="lead">
                            Solving complex business problems with scalable, custom-built web applications.
                        </p>
                        <Link 
                            to="/?nav=contact"
                            className="about-cta-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Consult an Engineer
                        </Link>
                    </div>
                </div>
            </section>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Custom Built for Your Operations</h2>
                        <p>
                            We don't do cookie-cutter applications. At NextWave Tech Studio, we
                            architect enterprise-grade software specifically tailored to streamline
                            your unique business workflows. By bridging the gap between beautiful
                            front-end design and powerful back-end infrastructure, we create robust
                            platforms that scale seamlessly as you grow.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Cloud Infrastructure</h3>
                            <p>We deploy high-availability, auto-scaling architectures on modern cloud platforms to keep your vital applications running 24/7.</p>
                        </div>
                        <div className="service-block">
                            <h3>API Integration</h3>
                            <p>We connect the dots between your critical software services, building custom API solutions to unify your data streams.</p>
                        </div>
                        <div className="service-block">
                            <h3>Internal Dashboards</h3>
                            <p>Empower your team with custom-built management portals, real-time analytics dashboards, and secure employee intranets.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Have a complex software problem?</h2>
                        <Link 
                            to="/?nav=contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Consult an Engineer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseDevelopment;

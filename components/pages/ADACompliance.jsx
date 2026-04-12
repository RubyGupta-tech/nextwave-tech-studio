import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const ADACompliance = () => {
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
                <h1 className="page-title">ADA Compliance & Accessibility</h1>
                <p>Ensure your website is accessible to everyone.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Inclusive Digital Experiences</h2>
                        <p>
                            We implement WCAG 2.1 standards to improve user experience and ensure your business meets legal accessibility requirements. An accessible website isn't just a legal necessity—it's a commitment to reaching every potential customer.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Screen Reader Optimization</h3>
                            <p>We ensure your site's structure and ARIA labels are optimized for screen readers, allowing visually impaired users to navigate your content seamlessly.</p>
                        </div>
                        <div className="service-block">
                            <h3>Keyboard Navigation</h3>
                            <p>Full keyboard support is essential for users who cannot use a mouse. We ensure all interactive elements are reachable and functional via keyboard.</p>
                        </div>
                        <div className="service-block">
                            <h3>Color & Contrast</h3>
                            <p>We audit and adjust color contrast ratios to meet WCAG standards, ensuring text is readable for users with low vision or color blindness.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Is your site compliant?</h2>
                        <Link 
                            to="/#contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Get an Accessibility Audit
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ADACompliance;

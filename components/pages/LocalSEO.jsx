import React, { useEffect } from 'react';
import '../../src/styles/global.css';

const LocalSEO = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

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
                <h1 className="page-title">SEO & Marketing</h1>
                <p>Helping businesses get found, chosen, and contacted.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Dominate Your Local Market</h2>
                        <p>
                            We provide local-focused digital marketing that improves visibility in Google Search, Maps, and local results — driving real enquiries, calls, and foot traffic.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Google Business Profile</h3>
                            <p>We optimize your Google Business Profile to ensure you rank in the "Local Map Pack," making it easy for customers to find your location and contact details.</p>
                        </div>
                        <div className="service-block">
                            <h3>Local Keyword Targeting</h3>
                            <p>We target the high-intent keywords your local customers are actually searching for, ensuring you appear when it matters most.</p>
                        </div>
                        <div className="service-block">
                            <h3>Reputation Management</h3>
                            <p>Get more reviews and manage your online reputation. We help you build trust with local customers through social proof and positive engagement.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Ready to get more local customers?</h2>
                        <a href="/#contact" className="primary-btn">Start Local Growth Today</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalSEO;

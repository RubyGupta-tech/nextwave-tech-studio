import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const SEOMarketing = () => {
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
                <h1 className="page-title">SEO & Marketing</h1>
                <p>Helping businesses get found, chosen, and contacted.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Dominate Your Market</h2>
                        <p>
                            We provide results-focused digital marketing that improves visibility in Search Engines and local results — driving real enquiries, calls, and foot traffic.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Search Engine Optimization (SEO)</h3>
                            <p>We optimize your website's structure and content to improve organic rankings, making it easier for potential customers to find you.</p>
                        </div>
                        <div className="service-block">
                            <h3>Targeted Marketing</h3>
                            <p>We target the high-intent keywords your customers are actually searching for, ensuring you appear when it matters most.</p>
                        </div>
                        <div className="service-block">
                            <h3>Reputation Management</h3>
                            <p>Get more reviews and manage your online reputation. We help you build trust with customers through social proof and positive engagement.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Ready to get more customers?</h2>
                        <Link 
                            to="/#contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Start Your Growth Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOMarketing;

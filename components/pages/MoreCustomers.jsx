import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const MoreCustomers = () => {
    return (
        <div className="subpage">
            <div className="page-hero">
                <h1 className="page-title">More Customers & Revenue</h1>
                <p>Turn your website into a powerful, automated lead generation machine.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Data-Driven Growth Strategies</h2>
                        <p>
                            Having a beautiful website is only half the battle. If ideal clients cannot find you,
                            you are leaving money on the table. At NextWave Tech Studio, we
                            specialize in high-visibility digital marketing campaigns designed to capture intent,
                            drive targeted traffic, and maximize your conversions.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Search Engine Optimization (SEO)</h3>
                            <p>Dominate local and national search results. We optimize your content, architecture, and backlinks so you rank higher on Google.</p>
                        </div>
                        <div className="service-block">
                            <h3>Pay-Per-Click Advertising (PPC)</h3>
                            <p>Immediate visibility and highly measurable ROI. We design and manage Google Ads and Social Media ad campaigns that convert.</p>
                        </div>
                        <div className="service-block">
                            <h3>Conversion Rate Optimization</h3>
                            <p>We analyze user behavior, perform A/B split testing, and continuously refine your landing pages to turn more visitors into paying customers.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Ready to scale your business?</h2>
                        <Link 
                            to="/?nav=contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Start Growing Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoreCustomers;

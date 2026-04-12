import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const WebsiteUpdates = () => {
    return (
        <div className="subpage">
            <div className="page-hero">
                <h1 className="page-title">Website Updates & Maintenance</h1>
                <p>Keep your website secure, fresh, and running at peak performance.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Ongoing Website Maintenance</h2>
                        <p>
                            A website is never truly "finished." Digital marketing moves fast,
                            technology updates constantly, and your business naturally evolves. At NextWave Tech Studio, we
                            provide comprehensive maintenance and update plans so you can focus on running your business
                            while we handle the technical heavy lifting.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Security & Backups</h3>
                            <p>Regular platform updates, security patches, and automated daily backups to ensure your data is always safe.</p>
                        </div>
                        <div className="service-block">
                            <h3>Content Updates</h3>
                            <p>Need to add a new service, update pricing, or change team members? We make those edits quickly and seamlessly.</p>
                        </div>
                        <div className="service-block">
                            <h3>Performance Tuning</h3>
                            <p>Ongoing optimization to ensure your site loads fast, performs well, and maintains top-tier search engine rankings.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Need help maintaining your site?</h2>
                        <Link 
                            to="/?nav=contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Secure Your Site Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteUpdates;

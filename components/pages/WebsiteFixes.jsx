import React from 'react';
import '../../src/styles/global.css';

const WebsiteFixes = () => {
    return (
        <div className="subpage">
            <div className="page-hero">
                <h1 className="page-title">Website Fixes & Repair</h1>
                <p>Website not working? Need it to load and run faster? We've got you covered.</p>
            </div>

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
                        <a href="/#contact" className="primary-btn">Get Help Now</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteFixes;

import React from 'react';
import '../../src/styles/global.css';

const WebsiteCreation = () => {
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

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Custom Architecture</h3>
                            <p>No cookie-cutter templates. We build bespoke digital experiences tailored to your brand's unique needs and identity.</p>
                        </div>
                        <div className="service-block">
                            <h3>Responsive Design</h3>
                            <p>Flawless execution across all devices. We ensure your site looks stunning on desktop, tablet, and mobile.</p>
                        </div>
                        <div className="service-block">
                            <h3>Conversion Focused</h3>
                            <p>Beautiful design paired with highly effective UI/UX functionality to drive leads and maximize your ROI.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Looking for a better website?</h2>
                        <a href="/#contact" className="primary-btn">Let's Talk</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteCreation;

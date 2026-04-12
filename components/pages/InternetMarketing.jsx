import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/styles/global.css';

const InternetMarketing = () => {
    return (
        <div className="subpage">
            <div className="page-hero">
                <h1 className="page-title">Internet Marketing</h1>
                <p>Comprehensive digital strategies to amplify your brand and engage your audience.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Connect with Your Audience Everywhere</h2>
                        <p>
                            We build cohesive, omni-channel marketing campaigns that put your brand directly
                            in front of your target demographic. From creating engaging social media content
                            to executing high-converting email campaigns, our marketing solutions are designed
                            to build brand loyalty and maximize your return on investment.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Social Media Management</h3>
                            <p>We craft compelling content, manage your online community, and run targeted campaigns across Facebook, Instagram, LinkedIn, and more.</p>
                        </div>
                        <div className="service-block">
                            <h3>Content Marketing</h3>
                            <p>High-quality blog posts, articles, and video scripts that establish your brand as an industry authority and naturally attract organic traffic.</p>
                        </div>
                        <div className="service-block">
                            <h3>Email Marketing</h3>
                            <p>Automated drip campaigns, engaging newsletters, and promotional blasts designed to consistently nurture leads and re-engage past customers.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Ready to launch your next campaign?</h2>
                        <Link 
                            to="/#contact" 
                            className="primary-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Contact Our Marketing Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternetMarketing;

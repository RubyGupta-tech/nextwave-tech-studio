import React from "react";
import "../src/styles/global.css";

const PartnerBar = () => {
    // These are placeholder high-tech partners for demonstration
    const partners = [
        "Vercel",
        "Canva",
        "Stripe",
        "Mailchimp",
        "Hostinger",
        "Shopify",
        "Adobe"
    ];
    
    return (
        <section className="partner-bar">
            <div className="container">
                <div className="partner-content reveal">
                    <p className="partner-label">STRATEGIC PARTNERS & ECOSYSTEM</p>
                    <div className="partner-logos">
                        {partners.map((partner, index) => (
                            <div key={index} className="partner-item">
                                <span className="partner-name">{partner}</span>
                                <div className="partner-status-dot"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerBar;

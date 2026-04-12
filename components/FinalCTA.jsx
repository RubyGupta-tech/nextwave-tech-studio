import React from "react";
import { Link } from "react-router-dom";
import "../src/styles/global.css";

const FinalCTA = () => {
    return (
        <section className="final-cta-section section-padding">
            <div className="container">
                <div className="final-cta-card reveal">
                    <div className="final-cta-content">
                        <div className="section-label" style={{ color: "rgba(255,255,255,0.7)" }}>NEXT STEP</div>
                        <h2 className="final-cta-heading">Ready to scale your business?</h2>
                        <p className="final-cta-text">
                            We specialize in high-performance websites that look great and deliver real results. 
                            Let's build your next digital masterpiece together.
                        </p>
                        <div className="final-cta-group">
                            <Link 
                                to="/?nav=contact" 
                                className="hero-cta"
                                onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                            >
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                    <div className="final-cta-glow"></div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;

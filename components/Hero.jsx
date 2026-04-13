import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "../src/styles/global.css";

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-waves-container">
                <svg className="hero-wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="rgba(26, 188, 156, 0.05)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <div className="hero-glow-trails">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="hero-star-particle"></div>
                    ))}
                </div>
            </div>

            <div className="container">
                <div className="hero-split-wrapper">
                    <div className="hero-content-left reveal">
                        <div className="hero-badge-glass animate-floating">Freelance Web Developer</div>
                        
                        <h1>
                            We build Powerful websites for{' '}
                            <span className="typing-text">
                                <Typewriter
                                    words={['Small Businesses.', 'Non-Profits.', 'Brands.']}
                                    loop={0}
                                    cursor
                                    cursorStyle='_'
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1500}
                                />
                            </span>
                        </h1>
                        <p className="hero-lead-text">
                            We transform your vision into scalable, high-conversion digital experiences that drive growth.
                        </p>

                        <div className="service-highlights-glass">
                            <span className="highlight-pill">Design</span>
                            <span className="highlight-pill">SEO</span>
                            <span className="highlight-pill">Development</span>
                        </div>

                        <Link 
                            to="/?nav=contact" 
                            className="hero-cta-premium"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Get Started <span>&rarr;</span>
                        </Link>
                    </div>

                    <div className="hero-asset-right animate-floating reveal">
                        <div className="asset-glow-aura"></div>
                        <img 
                            src="/images/hero_tech_showcase.png" 
                            alt="NextWave Tech Showcase" 
                            className="hero-3d-asset"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

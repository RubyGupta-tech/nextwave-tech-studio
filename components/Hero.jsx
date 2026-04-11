import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "../src/styles/global.css";

const Hero = () => {
    return (
        <section className="hero">
            {/* Brand-Aligned Wave Background */}
            <div className="hero-waves-container">
                <svg className="hero-wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="rgba(6, 182, 212, 0.15)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <svg className="hero-wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="rgba(37, 99, 235, 0.2)" d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,192C672,213,768,235,864,224C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <div className="hero-glow-trails">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="hero-star-particle"></div>
                    ))}
                </div>
            </div>

            <div className="hero-glow hero-glow-1"></div>
            <div className="hero-glow hero-glow-2"></div>

            <div className="hero-content">
                <div className="hero-badge animate-fade-in-up" style={{ animationDelay: "0.2s" }}>Freelance Web Developer</div>
                
                <h1 className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    We build powerful websites for{' '}
                    <span className="typing-text">
                        <Typewriter
                            words={['Non-Profits.', 'Small Businesses.', 'Big Businesses.']}
                            loop={0} /* 0 = infinitely loop */
                            cursor
                            cursorStyle='_'
                            typeSpeed={70}
                            deleteSpeed={50}
                            delaySpeed={1500}
                        />
                    </span>
                </h1>
                <p className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>Transforming Ideas into Scalable Digital Experiences</p>

                <div className="service-highlights animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
                    <span className="highlight-pill">Web Design</span>
                    <span className="highlight-pill">SEO & Marketing</span>
                    <span className="highlight-pill">Enterprise Apps</span>
                </div>

                <a href="/#contact" className="hero-cta animate-fade-in-up" style={{ animationDelay: "0.7s" }}>Get Your Free Consultation</a>
            </div>
        </section>
    );
};

export default Hero;

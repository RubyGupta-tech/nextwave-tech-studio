import React from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import "../src/styles/global.css";

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-glow hero-glow-1"></div>
            <div className="hero-glow hero-glow-2"></div>

            <div className="hero-content">
                <h1 className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
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

                <Link to="/services/website-creation" className="hero-cta animate-fade-in-up" style={{ animationDelay: "0.7s" }}>Get Your Free Consultation</Link>
            </div>
        </section>
    );
};

export default Hero;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../src/styles/global.css";

const FloatingCTA = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 600) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <div className="floating-cta animate-fade-in">
            <p>Ready to level up your business?</p>
            <Link to="/#contact" className="cta-button-small">Get Started</Link>
        </div>
    );
};

export default FloatingCTA;

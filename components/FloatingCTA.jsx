import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../src/styles/global.css";

const FloatingCTA = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

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

    const handleClick = (e) => {
        if (location.pathname === "/") {
            e.preventDefault();
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    if (!visible) return null;

    return (
        <div className="floating-cta animate-fade-in">
            <p>Ready to level up your business?</p>
            <Link 
                to="/#contact" 
                className="cta-button-small"
                onClick={handleClick}
            >
                Get Started
            </Link>
        </div>
    );
};

export default FloatingCTA;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../src/styles/global.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand" onClick={closeMenu}>
                <img src="/nextwave_tech_logo.jpeg" alt="NextWave Tech Logo" className="navbar-logo" />
                <div className="brand-title">
                    <span className="footer-brand-next">NEXT</span><span className="footer-brand-wave">WAVE</span>
                    <span className="footer-brand-sub">TECH STUDIO</span>
                </div>
            </Link>

            {/* Hamburger button — visible only on mobile */}
            <button
                className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav className={menuOpen ? "nav-open" : ""}>
                <Link to="/" onClick={closeMenu}>Home</Link>
                <div className="dropdown">
                    <a href="/#services" className="dropbtn" onClick={closeMenu}>Services &#9662;</a>
                    <div className="dropdown-content">
                        <Link to="/services/website-creation" onClick={closeMenu}>Website Creation</Link>
                        <Link to="/services/website-updates" onClick={closeMenu}>Website Updates</Link>
                        <Link to="/services/website-fixes" onClick={closeMenu}>Website Fixes</Link>
                        <Link to="/services/more-customers" onClick={closeMenu}>More Customers</Link>
                        <Link to="/services/internet-marketing" onClick={closeMenu}>Internet Marketing</Link>
                        <Link to="/services/enterprise-development" onClick={closeMenu}>Enterprise Apps</Link>
                    </div>
                </div>
                <a href="/#portfolio" onClick={closeMenu}>Portfolio</a>
                <a href="/#about" onClick={closeMenu}>About</a>
                <a href="/#contact" onClick={closeMenu}>Contact</a>
            </nav>
        </header>
    );
};

export default Navbar;

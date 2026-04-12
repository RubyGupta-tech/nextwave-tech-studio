import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../src/styles/global.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const activeHash = location.hash || (location.pathname === "/" ? "#home" : "");

    const closeMenu = () => setMenuOpen(false);
    const isActive = (hash) => activeHash === hash;

    return (
        <header className="navbar">
            <Link 
                to="/" 
                className="navbar-brand" 
                onClick={closeMenu}
            >
                <img src="/NextWave_logo1.web.jpeg" alt="NextWave Tech Logo" className="navbar-logo" />
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
                <Link to="/" onClick={closeMenu} className={location.pathname === "/" && !location.hash ? "active" : ""}>Home</Link>
                <div className="dropdown">
                    <a href="/#services" className={`dropbtn ${activeHash.includes("services") ? "active" : ""}`} onClick={closeMenu}>Services &#9662;</a>
                    <div className="dropdown-content">
                        <NavLink to="/services/website-creation" onClick={closeMenu}>Website Creation</NavLink>
                        <NavLink to="/services/website-updates" onClick={closeMenu}>Website Updates</NavLink>
                        <NavLink to="/services/website-fixes" onClick={closeMenu}>Website Fixes</NavLink>
                        <NavLink to="/services/more-customers" onClick={closeMenu}>More Customers</NavLink>
                        <NavLink to="/services/seo-marketing" onClick={closeMenu}>SEO & Marketing</NavLink>
                        <NavLink to="/services/internet-marketing" onClick={closeMenu}>Internet Marketing</NavLink>
                        <NavLink to="/services/enterprise-development" onClick={closeMenu}>Enterprise Apps</NavLink>
                        <NavLink to="/services/ada-compliance" onClick={closeMenu}>ADA Compliance</NavLink>
                    </div>
                </div>
                <NavLink to="/portfolio" onClick={closeMenu}>Portfolio</NavLink>
                <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                <Link 
                    to="/?nav=contact" 
                    className={location.search.includes("nav=contact") ? "active" : ""} 
                    onClick={() => {
                        closeMenu();
                        window.sessionStorage.setItem('scroll_to_contact', 'true');
                    }}
                >
                    Contact
                </Link>
            </nav>
        </header>
    );
};

export default Navbar;

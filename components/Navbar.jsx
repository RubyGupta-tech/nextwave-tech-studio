import React from "react";
import { Link } from "react-router-dom";
import "../src/styles/global.css";

const Navbar = () => {
    return (
        <header className="navbar">
            <Link to="/" className="navbar-brand">
                <img src="/nextwave_tech_logo.jpeg" alt="NextWave Tech Logo" className="navbar-logo" />
                <div className="brand-title">
                    <span className="footer-brand-next">NEXT</span><span className="footer-brand-wave">WAVE</span>
                    <span className="footer-brand-sub">TECH STUDIO</span>
                </div>
            </Link>
            <nav>
                <Link to="/">Home</Link>
                <div className="dropdown">
                    <a href="/#services" className="dropbtn">Services &#9662;</a>
                    <div className="dropdown-content">
                        <Link to="/services/website-creation">Website Creation</Link>
                        <Link to="/services/website-updates">Website Updates</Link>
                        <Link to="/services/website-fixes">Website Fixes</Link>
                        <Link to="/services/more-customers">More Customers</Link>
                        <Link to="/services/internet-marketing">Internet Marketing</Link>
                        <Link to="/services/enterprise-development">Enterprise Apps</Link>
                    </div>
                </div>
                <a href="/#portfolio">Portfolio</a>
                <a href="/#about">About</a>
                <a href="/#contact">Contact</a>
            </nav>
        </header>
    );
};

export default Navbar;

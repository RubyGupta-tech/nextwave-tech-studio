import React from "react";
import { Link } from "react-router-dom";
import "../src/styles/global.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Column */}
                <div className="footer-brand">
                    <div className="footer-logo-text">
                        <span className="footer-brand-next">NEXT</span><span className="footer-brand-wave">WAVE</span>
                        <span className="footer-brand-sub">TECH STUDIO</span>
                    </div>
                    <p className="footer-tagline">
                        Transforming Ideas into Scalable Digital Experiences.
                    </p>
                    <div className="footer-socials">
                        <a href="https://www.linkedin.com/in/ruby-gupta-08a1a25b" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">in</a>
                        <a href="https://twitter.com/RubyGupta27" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter">𝕏</a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">f</a>
                    </div>
                </div>

                {/* Services Column */}
                <div className="footer-col">
                    <h4 className="footer-col-heading">Services</h4>
                    <ul className="footer-links">
                        <li><Link to="/services/website-creation">Website Creation</Link></li>
                        <li><Link to="/services/website-updates">Website Updates</Link></li>
                        <li><Link to="/services/website-fixes">Website Fixes</Link></li>
                        <li><Link to="/services/seo-marketing">SEO & Marketing</Link></li>
                        <li><Link to="/services/internet-marketing">Internet Marketing</Link></li>
                        <li><Link to="/services/enterprise-development">Enterprise Apps</Link></li>
                        <li><Link to="/services/ada-compliance">ADA Compliance</Link></li>
                    </ul>
                </div>

                {/* Company Column */}
                <div className="footer-col">
                    <h4 className="footer-col-heading">Company</h4>
                    <ul className="footer-links">
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* Contact Column */}
                <div className="footer-col">
                    <h4 className="footer-col-heading">Contact</h4>
                    <ul className="footer-links footer-contact-list">
                        <li>📧 <a href="https://mail.google.com/mail/?view=cm&to=d.nextwavetech@gmail.com" target="_blank" rel="noreferrer" className="footer-email-link">d.nextwavetech@gmail.com</a></li>
                        <li>📞 <a href="tel:9253181134" className="footer-email-link">925-318-1134</a></li>
                        <li>📍 Serving Clients Nationwide</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} NextWave Tech Studio. All rights reserved.</span>
                <span className="footer-bottom-links">
                    <a href="mailto:d.nextwavetech@gmail.com">d.nextwavetech@gmail.com</a> · <a href="https://www.dnextwave.com">www.dnextwave.com</a>
                </span>
            </div>
        </footer>
    );
};

export default Footer;

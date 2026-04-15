import React from "react";
import { Link } from "react-router-dom";
import "../../src/styles/global.css";

const NotFoundPage = () => {
    return (
        <main className="not-found-page" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 20px',
            background: 'var(--bg-dark)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Orbs */}
            <div className="hero-glow hero-glow-1" style={{ opacity: 0.1 }}></div>
            <div className="hero-glow hero-glow-2" style={{ opacity: 0.1 }}></div>

            <div className="container reveal revealed" style={{ position: 'relative', zIndex: 1 }}>
                <span className="about-badge" style={{ marginBottom: '20px' }}>Error 404</span>
                <h1 style={{ 
                    fontSize: 'clamp(4rem, 15vw, 10rem)', 
                    margin: '0', 
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1'
                }}>
                    Oops!
                </h1>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#94A3B8' }}>
                    The digital wave moved, and this page is gone.
                </h2>
                <p style={{ maxWidth: '500px', margin: '0 auto 40px', color: '#64748B', lineHeight: '1.6' }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/" className="hero-cta-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    Back to Home <span>&rarr;</span>
                </Link>
            </div>
        </main>
    );
};

export default NotFoundPage;

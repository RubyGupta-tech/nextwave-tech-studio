import React from "react";
import "../src/styles/global.css";

const values = [
    { icon: "🎯", title: "Client-First Approach", desc: "Your goals are our goals. We listen first, then build." },
    { icon: "💡", title: "Creative & Strategic", desc: "We combine beautiful design with marketing-driven thinking." },
    { icon: "⚡", title: "Fast Turnaround", desc: "We respect deadlines. Projects delivered on time, every time." },
    { icon: "🔒", title: "Transparent Pricing", desc: "No hidden fees, no surprises. Clear quotes from day one." },
    { icon: "📈", title: "Growth Focused", desc: "We don't just build sites — we build digital growth engines." },
    { icon: "🤝", title: "Long-Term Partner", desc: "We're here after launch. Ongoing support is part of our promise." },
];

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="light-pool" style={{ top: '20%', right: '-10%' }}></div>
            <div className="about-container">
                <div className="about-header reveal">
                    <div className="section-label">WHO WE ARE</div>
                    <h2 className="about-heading">Built on Trust. <span className="innovation-gradient">Driven by Results.</span></h2>
                    <div className="about-intro-split">
                        <p className="about-lead">
                            At NextWave Tech Studio, we combine creativity, technical expertise, and strategic thinking
                            to deliver scalable digital solutions for businesses of all sizes.
                        </p>
                        <p className="about-mission">
                            Our mission is simple: transform your ideas into reality with professional web 
                            and digital services that actually work.
                        </p>
                    </div>
                </div>
                <div className="about-values-grid">
                    {values.map((v, i) => (
                        <div key={i} className="about-value-card glass-panel reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="about-value-icon animate-floating">{v.icon}</div>
                            <h3 className="about-value-title">{v.title}</h3>
                            <p className="about-value-desc">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;

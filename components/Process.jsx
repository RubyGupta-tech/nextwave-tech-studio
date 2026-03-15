import React from "react";
import "../src/styles/global.css";

const steps = [
    { title: "Consult", desc: "We discuss your goals and brand identity.", icon: "💬" },
    { title: "Design", desc: "We craft a bespoke, modern interface.", icon: "🎨" },
    { title: "Launch", desc: "Your site goes live with full SEO optimization.", icon: "🚀" },
];

const Process = () => {
    return (
        <section id="process" className="process-section">
            <div className="section-label">THE PROCESS</div>
            <h2 className="process-heading">How We Build Your Success</h2>
            <div className="process-grid">
                {steps.map((step, index) => (
                    <div key={index} className="process-card">
                        <div className="process-icon">{step.icon}</div>
                        <h3 className="process-title">{step.title}</h3>
                        <p className="process-desc">{step.desc}</p>
                        {index < steps.length - 1 && <div className="process-arrow">→</div>}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Process;

import React from "react";
import "../src/styles/global.css";

const projects = [
    {
        title: "Bloom & Co. Floral Studio",
        description: "Full redesign with e-commerce integration for local florist. 2x more leads in 3 months.",
        tags: ["Web Design", "E-Commerce", "SEO"],
        color: "#06B6D4",
        initials: "BC",
    },
    {
        title: "Hope Forward Foundation",
        description: "Modern non-profit website with donation portal and event management system.",
        tags: ["Non-Profit", "Web App", "CMS"],
        color: "#2563EB",
        initials: "HF",
    },
    {
        title: "Apex Logistics Platform",
        description: "Enterprise-grade logistics tracking dashboard with real-time data integrations.",
        tags: ["Enterprise", "React", "API"],
        color: "#7C3AED",
        initials: "AL",
    },
    {
        title: "GreenLeaf Wellness",
        description: "SEO-optimized wellness clinic site with online booking and blog system.",
        tags: ["Web Design", "Booking", "SEO"],
        color: "#059669",
        initials: "GL",
    },
];

const Portfolio = () => {
    return (
        <section id="portfolio" className="portfolio-section">
            <div className="portfolio-container">
                <div className="section-label">OUR WORK</div>
                <h2 className="portfolio-heading">Featured Projects</h2>
                <p className="portfolio-subheading">
                    A selection of work we're proud of — from local businesses to enterprise platforms.
                </p>
                <div className="portfolio-grid-new">
                    {projects.map((project, index) => (
                        <div key={index} className="portfolio-card">
                            <div className="portfolio-card-visual" style={{ background: `linear-gradient(135deg, ${project.color}22, ${project.color}44)`, borderTop: `3px solid ${project.color}` }}>
                                <div className="portfolio-initials" style={{ color: project.color }}>
                                    {project.initials}
                                </div>
                            </div>
                            <div className="portfolio-card-body">
                                <h3 className="portfolio-card-title">{project.title}</h3>
                                <p className="portfolio-card-desc">{project.description}</p>
                                <div className="portfolio-tags">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="portfolio-tag" style={{ borderColor: project.color, color: project.color }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;

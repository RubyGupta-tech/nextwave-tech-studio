import React from "react";
import "../src/styles/global.css";

import { projects } from "../src/data/projects";

const Portfolio = () => {
    return (
        <section id="portfolio" className="portfolio-section">
            <div className="portfolio-container">
                <div className="section-label">OUR SUCCESS STORIES</div>
                <h2 className="portfolio-heading">Building Digital Impact</h2>
                <p className="portfolio-subheading">
                    A multi-disciplinary portfolio focused on helping businesses grow through high-performance web solutions.
                </p>
                <div className="portfolio-grid-new">
                    {projects.map((project, index) => (
                        <div key={index} className="portfolio-card">
                            <div className="browser-mockup">
                                <div className="browser-header">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <div className="browser-address">{project.title}</div>
                                </div>
                                <div className="browser-body">
                                    <img src={project.image} alt={project.title} />
                                    {/* <div className="portfolio-overlay">
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="visit-site-btn">
                                            Visit Live Site ↗
                                        </a>
                                    </div> */}
                                </div>
                            </div>
                            <div className="portfolio-card-body">
                                <h3 className="portfolio-card-title">{project.title}</h3>
                                <p className="portfolio-card-desc">{project.description}</p>
                                <div className="portfolio-tags">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="portfolio-tag" style={{ color: project.color, borderColor: `${project.color}44` }}>
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

import React, { useState, useEffect } from 'react';

import { projects } from '../src/data/projects';

const ShowcaseSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        let timer;
        if (isAutoPlaying) {
            timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % projects.length);
            }, 6000);
        }
        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const handleTouchStart = (e) => {
        setIsAutoPlaying(false);
        setTouchStart(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches ? e.targetTouches[0].clientX : e.clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) {
            // Swipe Left
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }

        if (touchStart - touchEnd < -75) {
            // Swipe Right
            setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
        }
    };

    const goToSlide = (index) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    return (
        <section className="showcase-slider-section">
            <div className="slider-container">
                <div className="section-label">INTERACTIVE SHOWCASE</div>
                <h2 className="slider-heading">A Closer Look</h2>
                
                <div className="slider-outer">
                    <div 
                        className="slider-track-window"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseMove={handleTouchMove}
                        onMouseUp={handleTouchEnd}
                    >
                        <div className="slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {projects.map((project, index) => (
                                <div key={index} className={`slider-slide ${index === currentIndex ? 'active' : ''}`}>
                                    <div className="slide-content">
                                        <div className="slide-visual">
                                            <div className="premium-mockup">
                                                <div className="mockup-header">
                                                    <div className="mockup-dots">
                                                        <span></span><span></span><span></span>
                                                    </div>
                                                    <div className="mockup-url">{project.link.replace('https://', '')}</div>
                                                </div>
                                                <div className="mockup-screen">
                                                    <img src={project.image} alt={project.title} className="parallax-img" />
                                                    <div className="mockup-overlay">
                                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="mockup-btn">
                                                            Visit Live Site
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slide-info">
                                            <h3 className="slide-title" style={{ color: project.color }}>{project.title}</h3>
                                            <p className="slide-desc">{project.description}</p>
                                            <div className="slide-footer">
                                                <div className="slide-index">0{index + 1} / 0{projects.length}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="slider-pagination">
                    {projects.map((_, index) => (
                        <span 
                            key={index} 
                            className={`pager-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSlider;

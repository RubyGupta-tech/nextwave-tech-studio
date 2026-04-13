import React, { useState, useEffect } from 'react';

import { clientProjects } from '../src/data/projects';

const ShowcaseSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        let timer;
        if (isAutoPlaying) {
            timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % clientProjects.length);
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
            nextSlide();
        }

        if (touchStart - touchEnd < -75) {
            // Swipe Right
            prevSlide();
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % clientProjects.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + clientProjects.length) % clientProjects.length);
        setIsAutoPlaying(false);
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
                
                <div className="slider-display-wrapper">
                    <button className="slider-nav-btn prev" onClick={prevSlide} aria-label="Previous project">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                    </button>

                    <div className="slider-outer">
                        <div 
                            className="slider-track-window"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleTouchStart}
                            onMouseMove={handleTouchMove}
                            onMouseUp={handleTouchEnd}
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                            <div className="slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                {clientProjects.map((project, index) => (
                                    <div key={index} className={`slider-slide ${index === currentIndex ? 'active' : ''}`}>
                                        <div className="slide-content">
                                            <div className="slide-visual">
                                                <div className="premium-mockup">
                                                    <div className="mockup-header">
                                                        <div className="mockup-dots">
                                                            <span></span><span></span><span></span>
                                                        </div>
                                                        <div className="mockup-url">[ Private Client Project ]</div>
                                                    </div>
                                                    <div className="mockup-screen">
                                                        <img src={project.image} alt={project.title} className="parallax-img" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slide-info">
                                                <h3 className="slide-title" style={{ color: project.color }}>{project.title}</h3>
                                                <p className="slide-desc">{project.description}</p>
                                                <div className="slide-footer">
                                                    <div className="slide-index">0{index + 1} / 0{clientProjects.length}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="slider-nav-btn next" onClick={nextSlide} aria-label="Next project">
                        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                    </button>
                </div>
                
                    <div className="slider-pagination">
                        {clientProjects.map((_, index) => (
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

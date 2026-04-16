import React, { useState, useEffect, useRef } from "react";
import "../src/styles/global.css";

import testimonialsData from "../src/data/testimonials.json";

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Group testimonials based on screen size
    const groupedTestimonials = [];
    const itemsPerSlide = isMobile ? 1 : 2;
    for (let i = 0; i < testimonialsData.length; i += itemsPerSlide) {
        groupedTestimonials.push(testimonialsData.slice(i, i + itemsPerSlide));
    }

    const numPages = groupedTestimonials.length;

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % numPages);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, numPages]);

    const goToSlide = (index) => {
        setActiveIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % numPages);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + numPages) % numPages);
        setIsAutoPlaying(false);
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="section-label">TESTIMONIALS</div>
                <h2 className="testimonials-heading">What Our Clients Say</h2>
                <p className="testimonials-subheading">
                    Real results for real businesses — from non-profits to enterprise.
                </p>
                
                <div className="testimonials-display-wrapper">
                    {numPages > 1 && (
                        <button className="slider-nav-btn prev" onClick={prevSlide} aria-label="Previous testimonial">
                            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                        </button>
                    )}

                    <div className="testimonials-viewport">
                        <div 
                            className="testimonials-track"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                            {groupedTestimonials.map((group, groupIndex) => (
                                <div key={groupIndex} className="testimonial-slide">
                                    <div className="testimonial-group">
                                        {group.map((t, index) => (
                                            <div key={index} className="testimonial-card">
                                                <div className="testimonial-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} viewBox="0 0 24 24" className="star-icon"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                                    ))}
                                                </div>
                                                <div className="testimonial-quote-wrapper">
                                                    <svg className="testimonial-quote-svg" width="40" height="30" viewBox="0 0 40 30" fill="currentColor">
                                                        <path d="M0 18.2857C0 14.6667 0.933333 11.2381 2.8 8C4.66667 4.7619 7.4 2.09524 11 0V7.14286C8.86667 7.71429 7.23333 8.7619 6.1 10.2857C4.96667 11.8095 4.4 13.5238 4.4 15.4286V18.2857H11V30H0V18.2857ZM20.4 18.2857C20.4 14.6667 21.3333 11.2381 23.2 8C25.0667 4.7619 27.8 2.09524 31.4 0V7.14286C29.2667 7.71429 27.6333 8.7619 26.5 10.2857C25.3667 11.8095 24.8 13.5238 24.8 15.4286V18.2857H31.4V30H20.4V18.2857Z" />
                                                    </svg>
                                                    <p className="testimonial-text">{t.quote}</p>
                                                </div>
                                                <div className="testimonial-author">
                                                    <div className="testimonial-avatar">{t.avatar}</div>
                                                    <div>
                                                        <div className="testimonial-name">{t.name}</div>
                                                        <div className="testimonial-title">{t.title}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {numPages > 1 && (
                        <button className="slider-nav-btn next" onClick={nextSlide} aria-label="Next testimonial">
                            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                        </button>
                    )}
                </div>

                {numPages > 1 && (
                    <div className="testimonials-dots">
                        {[...Array(numPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="testimonials-wave bottom">
                <svg
                    viewBox="0 0 1440 180"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    {/* Teal wave (replacing gold) */}
                    <path
                        className="wave-line-1"
                        d="M0,90 C240,20 480,160 720,120 960,80 1200,140 1440,90"
                        fill="none"
                        stroke="#1ABC9C"
                        strokeWidth="6"
                    />
            
                    {/* White wave */}
                    <path
                        className="wave-line-2"
                        d="M0,120 C300,60 540,180 780,140 1020,100 1200,160 1440,120"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="4"
                    />
            
                    {/* White fill to blend into form */}
                    <path
                        d="M0,140 C360,80 1080,200 1440,140 L1440,180 L0,180 Z"
                        fill="#ffffff"
                    />
                </svg>
            </div>
        </section>
    );
};

export default Testimonials;

import React, { useState, useEffect, useRef } from "react";
import "../src/styles/global.css";

const testimonialsData = [
    {
        quote: "I strongly recommend Ruby as your go-to person to help with website building. She worked with me on creating my website. I found her to be very professional, time sensitive (which is huge for me), flexible in accommodating my asks and knowledgeable to share her thoughts with me. Thank you Ruby and I look forward to working with you again as I continue to upgrade.",
        name: "Fiona G B",
        title: "Ex-Accenture | Cross Cultural Expertise",
        avatar: "FG",
    },
    {
        quote: "NextWave completely transformed our online presence. Within 3 months of launching our new site, our leads doubled. Truly professional from start to finish.",
        name: "Sarah M.",
        title: "Owner, Bloom & Co. Floral Studio",
        avatar: "SM",
    },
    {
        quote: "We needed a complex web application and they delivered beyond expectations. Their communication was excellent and the product works flawlessly.",
        name: "James T.",
        title: "CTO, Apex Logistics Inc.",
        avatar: "JT",
    },
    {
        quote: "As a non-profit, budget matters. NextWave gave us a stunning, professional website at a price we could afford. Our donations increased by 40% since launch.",
        name: "Linda R.",
        title: "Director, Hope Forward Foundation",
        avatar: "LR",
    },
];

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
                    <button className="slider-nav-btn prev" onClick={prevSlide} aria-label="Previous testimonial">
                        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                    </button>

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
                                                <div className="testimonial-quote-icon">"</div>
                                                <p className="testimonial-text">{t.quote}</p>
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

                    <button className="slider-nav-btn next" onClick={nextSlide} aria-label="Next testimonial">
                        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                    </button>
                </div>

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
            </div>
        </section>
    );
};

export default Testimonials;

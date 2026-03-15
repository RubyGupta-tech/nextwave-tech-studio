import React, { useState, useEffect, useRef } from "react";
import "../src/styles/global.css";

const testimonials = [
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
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    // Handle dot navigation
    const goToSlide = (index) => {
        setActiveIndex(index);
        setIsAutoPlaying(false); // Pause auto-play on manual interaction
        // Resume after 10 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="section-label">TESTIMONIALS</div>
                <h2 className="testimonials-heading">What Our Clients Say</h2>
                <p className="testimonials-subheading">
                    Real results for real businesses — from non-profits to enterprise.
                </p>
                
                <div className="testimonials-viewport">
                    <div 
                        className="testimonials-track"
                        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        {testimonials.map((t, index) => (
                            <div key={index} className="testimonial-slide">
                                <div className="testimonial-card">
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
                            </div>
                        ))}
                    </div>
                </div>

                <div className="testimonials-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

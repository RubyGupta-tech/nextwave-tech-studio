import React, { useEffect } from 'react';
import Portfolio from '../Portfolio';
import ShowcaseSlider from '../ShowcaseSlider';

const PortfolioPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="portfolio-page">
            <ShowcaseSlider />
            <Portfolio />
            <section className="portfolio-cta-wrapper">
                <div className="portfolio-cta-box">
                    <h2 className="portfolio-cta-title">Ready to start your project?</h2>
                    <p className="portfolio-cta-desc">
                        We specialize in high-performance websites that look great and deliver results. Let's build something amazing together.
                    </p>
                    <a href="/#contact" className="portfolio-cta-btn">Get in Touch</a>
                </div>
            </section>
        </main>
    );
};

export default PortfolioPage;

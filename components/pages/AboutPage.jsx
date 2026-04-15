import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import howWeWorkImg from '../../images/howwework.avif';
import letWorkTogetherImg from '../../images/letworktogether_pic.jpg';
import ourExpImg from '../../images/ourexp_pic.jpg';
import uiUxImg from '../../images/ui-ux-design.jpg';
import codeImg from '../../images/code_pics.jpg';
import growthImg from '../../images/GrowthLaunch_pics.webp';
import personalImg from '../../images/personaldedication_pic.avif';
import passionImg from '../../images/passionprecision_pic.png';
import rubyPic from '../../images/ruby-pic01.jpeg';

const AboutPage = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="about-page">
            {/* Dark Hero Section */}
            <section className="about-hero">
                <div className="hero-waves-container">
                    <svg className="hero-wave wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="rgba(6, 182, 212, 0.15)" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <svg className="hero-wave wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="rgba(37, 99, 235, 0.2)" d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,192C672,213,768,235,864,224C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <div className="hero-glow-trails">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="hero-star-particle"></div>
                        ))}
                    </div>
                </div>

                <div className="hero-glow hero-glow-1"></div>
                <div className="hero-glow hero-glow-2"></div>

                <div className="container">
                    <div className="about-hero-content reveal">
                        <span className="about-badge">The Founder's Story</span>
                        <h1>Human-Centric Digital <span className="innovation-gradient">Innovation</span></h1>
                        <p className="lead">
                            I help businesses transcend the ordinary. Every line of code I write and every pixel I place is driven by a single mission: to turn your vision into a high-performance digital asset.
                        </p>
                        <Link
                            to="/?nav=contact"
                            className="about-cta-btn"
                            onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                        >
                            Start Your Project
                        </Link>
                    </div>
                </div>
            </section>

            {/* Intro & Story Section */}
            <section className="about-story-section section-padding">
                <div className="container about-story-grid">
                    <div className="intro-text reveal">
                        <h2 className="section-title-cyan">Crafting the Future of Work</h2>
                        <p className="lead" style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '30px' }}>
                            Hi, I'm the founder of NextWave Tech Studio. For the past 3 years, I've dedicated myself to the freelance digital landscape, delivering live projects that move beyond static templates. My journey began long ago with a passion for web development, evolving into a professional practice where I build functional, production-ready solutions.
                        </p>

                        <div className="story-mini-grid">
                            <div className="story-pill">
                                <h4>Bespoke Design</h4>
                                <p>I focus on creating unique, user-centric interfaces that reflect your brand's identity, ensuring every visual element is designed to engage and convert your visitors.</p>
                            </div>
                            <div className="story-pill">
                                <h4>Robust Development</h4>
                                <p>Using clean, modern coding standards, I transform designs into high-performance, responsive websites that are fast, secure, and built to grow with your business.</p>
                            </div>
                        </div>
                    </div>
                    <div className="intro-image reveal">
                        <div className="aesthetic-frame">
                            <img src={passionImg} alt="Passion & Precision" className="aesthetic-image" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section - ZigZag Pattern (Image Left, Text Right) */}
            <section className="about-values section-padding gray-bg">
                <div className="container grid-2 reverse-on-desktop">
                    <div className="intro-image reveal">
                        <div className="aesthetic-frame-left">
                            <img src={personalImg} alt="Personal Dedication" className="aesthetic-image" />
                        </div>
                    </div>
                    <div className="intro-text reveal">
                        <h2 className="section-title-cyan">Personal Dedication</h2>
                        <p>
                            When you work with NextWave, you're not just another project number. You are working directly with me, every step of the way. I take a limited number of clients to ensure each project gets the "masterpiece" level of attention it deserves.
                        </p>
                        <p>
                            My goal is to build long-term relationships where I act as your technical partner, helping you navigate the ever-changing digital wave with confidence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Expertise Section - ZigZag Pattern (Text Left, Image Right) */}
            <section className="about-expertise section-padding">
                <div className="container grid-2">
                    <div className="intro-text reveal">
                        <h2 className="section-title-cyan">Our Experience</h2>
                        <p>
                            With a track record of delivering high-stakes digital products, I bring a unique blend of technical mastery and strategic design to every project.
                        </p>
                        <div className="expertise-mini-grid">
                            <div className="expertise-item">
                                <h3 style={{ fontSize: '18px', color: '#06B6D4' }}>🚀 High-Velocity</h3>
                                <p style={{ fontSize: '14px' }}>Fast-loading, scalable React apps.</p>
                            </div>
                            <div className="expertise-item">
                                <h3 style={{ fontSize: '18px', color: '#06B6D4' }}>🔍 SEO Growth</h3>
                                <p style={{ fontSize: '14px' }}>Technical SEO that converts.</p>
                            </div>
                        </div>
                    </div>
                    <div className="intro-image reveal">
                        <div className="aesthetic-frame">
                            <img src={ourExpImg} alt="Our Experience" className="aesthetic-image" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Compact Process Section - Mosaic Grid (2x2) */}
            <section className="about-process-compact section-padding dark-bg">
                <div className="container">
                    <div className="process-header reveal" style={{ marginBottom: '60px' }}>
                        <h2 className="section-title-cyan">How We Work</h2>
                        <p className="subtitle">A streamlined, high-velocity workflow designed for results.</p>
                    </div>

                    <div className="process-mosaic">
                        {/* Row 1: Step 01 (Text Left, Image Right) & Step 02 (Image Left, Text Right) */}
                        <div className="mosaic-row">
                            <div className="mosaic-card reveal">
                                <div className="mosaic-content">
                                    <span className="step-count">01</span>
                                    <h3>Strategic Audit</h3>
                                    <p>Deep-dive analysis of your competition and user behavior to map out a high-intent strategy.</p>
                                </div>
                                <div className="mosaic-image">
                                    <img src={howWeWorkImg} alt="Strategy" />
                                </div>
                            </div>

                            <div className="mosaic-card reveal is-reversed">
                                <div className="mosaic-content">
                                    <span className="step-count">02</span>
                                    <h3>Vivid Prototyping</h3>
                                    <p>Interactive, high-fidelity prototypes that allow for rapid iteration before coding begins.</p>
                                </div>
                                <div className="mosaic-image">
                                    <img src={uiUxImg} alt="Vivid Prototyping" />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Step 03 (Image Left, Text Right) & Step 04 (Text Left, Image Right) */}
                        <div className="mosaic-row">
                            <div className="mosaic-card reveal is-reversed">
                                <div className="mosaic-content">
                                    <span className="step-count">03</span>
                                    <h3>High-Velocity Dev</h3>
                                    <p>Clean, scalable React code optimized for speed and performance from the ground up.</p>
                                </div>
                                <div className="mosaic-image">
                                    <img src={codeImg} alt="High-Velocity Dev" />
                                </div>
                            </div>

                            <div className="mosaic-card reveal">
                                <div className="mosaic-content">
                                    <span className="step-count">04</span>
                                    <h3>Growth Launch</h3>
                                    <p>Continuous support and SEO optimization to ensure your asset keeps generating maximum ROI.</p>
                                </div>
                                <div className="mosaic-image">
                                    <img src={growthImg} alt="Growth Launch" className="crop-bottom" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Founder Section */}
            <section className="meet-founder section-padding gray-bg">
                <div className="container">
                    <div className="founder-grid">
                        <div className="founder-image-wrapper reveal">
                            <div className="founder-image-circle">
                                <img src={rubyPic} alt="Ruby - Founder of NextWave" />
                            </div>
                        </div>
                        <div className="founder-info reveal">
                            <span className="founder-badge">Founder & Lead Developer</span>
                            <h2 className="founder-name">Hi, I’m <span className="innovation-gradient">Ruby</span> 👋</h2>
                            <div className="founder-bio">
                                <p>As the Creative Director of NextWave Tech Studio, I lead the mission to transform your vision into high-performance digital excellence.</p>
                                <p>My journey into web development started with a simple curiosity to learn how websites work. Over time, that curiosity turned into passion and then into real projects.</p>
                                <p>I’ve worked on multiple websites, learning through real challenges, improving my skills in design, structure, and functionality. Every project helped me understand not just coding, but how to create websites that actually help businesses grow.</p>
                                <p>dNextWave is my step towards building something meaningful-helping businesses create modern, clean, and scalable digital presence.</p>
                                <p>This is just the beginning, and I’m excited to keep learning and building.</p>
                            </div>
                            <div className="founder-signature">Ruby</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Image Left, Text Right */}
            <section className="about-cta-zigzag section-padding dark-bg">
                <div className="container grid-2 reverse-on-desktop">
                    <div className="intro-image reveal">
                        <div className="aesthetic-frame-left">
                            <img src={letWorkTogetherImg} alt="Let's Work Together" className="aesthetic-image" />
                        </div>
                    </div>
                    <div className="intro-text reveal">
                        <h2 className="section-title-cyan">Let’s Work Together</h2>
                        <p className="subtitle">
                            Ready to transform your vision into a high-performance digital asset? Let's sit down for a quick strategy call and map out your next wave of growth.
                        </p>
                        <div className="cta-wrapper" style={{ marginTop: '30px' }}>
                            <Link
                                to="/?nav=contact"
                                className="cta-btn-primary"
                                onClick={() => window.sessionStorage.setItem('scroll_to_contact', 'true')}
                            >
                                Book Your Strategy Call
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;

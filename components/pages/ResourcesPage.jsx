import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../src/styles/global.css";

const ResourcesPage = () => {
    useEffect(() => {
        // Reveal animation logic
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

    const partnershipTiers = [
        {
            title: "Trusted Partner",
            price: "$50/mo",
            desc: "Brand association via Homepage Logo Grid + Footer link.",
            features: ["Logo on Homepage", "Link in Partnership Section", "Trust Factor Enhancement"],
            accent: "#1ABC9C"
        },
        {
            title: "Toolbox Feature",
            price: "$150 (One-time)",
            desc: "Dedicated card on the Resources Hub with your affiliate link.",
            features: ["Permanent Resource List", "Detailed Description", "Direct Traffic Channel"],
            accent: "#0EA5E9"
        },
        {
            title: "Case Study Integration",
            price: "Trade/Barter",
            desc: "Deep integration in our work walkthroughs and project showcases.",
            features: ["Contextual Mentions", "Practical Use Proof", "Service Exchange Possible"],
            accent: "#8B5CF6"
        }
    ];

    return (
        <main className="resources-page">
            {/* Hero Section */}
            <section className="resource-hero">
                <div className="container reveal">
                    <div className="section-label">THE PROFESSIONAL'S TOOLBOX</div>
                    <h1 className="resource-title">
                        A Curated Stack for <span className="innovation-gradient">Digital Growth</span>
                    </h1>
                    <p className="resource-subtitle">
                        Explore the elite tools and strategic partners we trust to build and scale high-performance brands.
                    </p>
                </div>
            </section>

            {/* Tools Grid Section */}
            <section className="tools-section">
                <div className="container">
                    <div className="tools-grid">
                        <div className="tool-category reveal">
                            <h3>Development & Hosting</h3>
                            <div className="tool-card glass-panel">
                                <h4>Premium Hosting</h4>
                                <p>We recommend industry-standard speed and security for all client projects.</p>
                                <span className="coming-soon">Recommended Tool</span>
                            </div>
                        </div>
                        <div className="tool-category reveal" style={{ transitionDelay: '0.2s' }}>
                            <h3>Design & Branding</h3>
                            <div className="tool-card glass-panel">
                                <h4>Creative Assets</h4>
                                <p>Master your brand's visual identity with our favorite creative platforms.</p>
                                <span className="coming-soon">Recommended Tool</span>
                            </div>
                        </div>
                        <div className="tool-category reveal" style={{ transitionDelay: '0.4s' }}>
                            <h3>SEO & Marketing</h3>
                            <div className="tool-card glass-panel">
                                <h4>Growth Analytics</h4>
                                <p>Dominate search rankings with powerful analytical and SEO research tools.</p>
                                <span className="coming-soon">Recommended Tool</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnership Program Section */}
            <section className="partnership-section">
                <div className="container">
                    <div className="reveal">
                        <div className="section-label">PARTNERSHIP PROGRAM</div>
                        <h2 className="partnership-heading">Ready to Grow Together?</h2>
                        <p className="partnership-subheading">
                            Partnering with NextWave Tech Studio places your brand in front of motivated business owners and visionary entrepreneurs.
                        </p>
                    </div>

                    <div className="partnership-tiers-grid">
                        {partnershipTiers.map((tier, i) => (
                            <div key={i} className="tier-card glass-panel reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="tier-badge" style={{ background: tier.accent }}>{tier.title}</div>
                                <div className="tier-price">{tier.price}</div>
                                <p className="tier-desc">{tier.desc}</p>
                                <ul className="tier-features">
                                    {tier.features.map((feat, fi) => (
                                        <li key={fi}><span>✓</span> {feat}</li>
                                    ))}
                                </ul>
                                <Link 
                                    to="/?nav=contact" 
                                    className="tier-cta"
                                    onClick={() => {
                                        window.sessionStorage.setItem('scroll_to_contact', 'true');
                                        window.sessionStorage.setItem('contact_subject', `New Partnership Inquiry: ${tier.title}`);
                                    }}
                                >
                                    Apply Now
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legal Disclosure */}
            <section className="resource-legal">
                <div className="container">
                    <p>
                        <strong>Transparency Disclosure:</strong> Some of the tools listed on this page may contain affiliate links. 
                        This means we may earn a small commission if you choose to make a purchase, at no additional cost to you. 
                        We only recommend tools we actually use and believe will benefit our community.
                    </p>
                </div>
            </section>
        </main>
    );
};

export default ResourcesPage;

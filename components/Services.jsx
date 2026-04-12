import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../src/styles/global.css";

const Services = () => {
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
    <section id="services" className="services-section">
      <div className="light-pool light-pool-magenta" style={{ top: '10%', left: '-10%' }}></div>
      <div className="services-container">
        {/* Immediate Needs Grid */}
        <div className="services-grid-primary">
          <Link to="/services/website-creation" className="service-block glass-panel reveal">
            <h3>I NEED A WEBSITE</h3>
            <p>We build you a new website or redesign your existing one.</p>
            <span className="cta-link">Build My Site &rarr;</span>
          </Link>
          <Link to="/services/website-updates" className="service-block glass-panel reveal">
            <h3>WEBSITE UPDATES</h3>
            <p>Small changes or regular on-going updates, we can help.</p>
            <span className="cta-link">Help Update My Site &rarr;</span>
          </Link>
          <Link to="/services/website-fixes" className="service-block glass-panel reveal">
            <h3>WEBSITE FIXES</h3>
            <p>Website not working? Need it to load and run faster?</p>
            <span className="cta-link">Help Fix My Site &rarr;</span>
          </Link>
          <Link to="/services/more-customers" className="service-block glass-panel reveal">
            <h3>MORE CUSTOMERS</h3>
            <p>Optimize your website and Paid Ad Campaigns!</p>
            <span className="cta-link">Grow My Business &rarr;</span>
          </Link>
          <Link to="/services/seo-marketing" className="service-block glass-panel reveal">
            <h3>SEO & MARKETING</h3>
            <p>Helping businesses get found, chosen, and contacted.</p>
            <span className="cta-link">Get Found Online &rarr;</span>
          </Link>
          <Link to="/services/ada-compliance" className="service-block glass-panel ada-card-white reveal">
            <h3>ADA COMPLIANCE</h3>
            <p>Make your site accessible to all and ensure legal compliance.</p>
            <span className="cta-link">Check My Site &rarr;</span>
          </Link>
        </div>

        {/* Detailed Services */}
        <div className="services-detailed">
          <div className="service-block glass-panel reveal" style={{ textAlign: 'left', padding: '50px' }}>
            <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>Internet Marketing</h3>
            <p>
              Through modern internet marketing techniques, we help clients increase traffic, improve conversion rates, and get more customers.
            </p>
            <p>
              Our web services include Search Engine Optimization (SEO), Search Engine Marketing (SEM), Pay Per Click (PPC), designing, and building high-converting landing pages. We don't stop there—our marketing efforts include rigorous A/B testing to ensure a positive return on your marketing spend.
            </p>
            <Link to="/services/internet-marketing" className="cta-link">Learn More &rarr;</Link>
          </div>

          <div className="service-block glass-panel reveal" style={{ textAlign: 'left', padding: '50px' }}>
            <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>Enterprise Web App Development</h3>
            <p>
              Our programmers focus on solving complex business problems. We build Enterprise-level web applications using modern, scalable programming methodology.
            </p>
            <p>
              No cookie-cutter applications here. Each application is custom-built to the exact specifications of the client, bringing together beautiful design and highly effective functionality to turn visitors into buying customers.
            </p>
            <Link to="/services/enterprise-development" className="cta-link">Learn More &rarr;</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

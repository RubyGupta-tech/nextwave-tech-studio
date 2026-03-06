import React from 'react';
import '../../src/styles/global.css';

const EnterpriseDevelopment = () => {
    return (
        <div className="subpage">
            <div className="page-hero">
                <h1 className="page-title">Enterprise Web Apps</h1>
                <p>Solving complex business problems with scalable, custom-built web applications.</p>
            </div>

            <div className="page-content">
                <div className="content-container">
                    <div className="content-block">
                        <h2 className="section-heading">Custom Built for Your Operations</h2>
                        <p>
                            We don't do cookie-cutter applications. At NextWave Tech Studio, we
                            architect enterprise-grade software specifically tailored to streamline
                            your unique business workflows. By bridging the gap between beautiful
                            front-end design and powerful back-end infrastructure, we create robust
                            platforms that scale seamlessly as you grow.
                        </p>
                    </div>

                    <div className="services-grid-primary" style={{ marginTop: '40px' }}>
                        <div className="service-block">
                            <h3>Cloud Infrastructure</h3>
                            <p>We deploy high-availability, auto-scaling architectures on modern cloud platforms to keep your vital applications running 24/7.</p>
                        </div>
                        <div className="service-block">
                            <h3>API Integration</h3>
                            <p>We connect the dots between your critical software services, building custom API solutions to unify your data streams.</p>
                        </div>
                        <div className="service-block">
                            <h3>Internal Dashboards</h3>
                            <p>Empower your team with custom-built management portals, real-time analytics dashboards, and secure employee intranets.</p>
                        </div>
                    </div>

                    <div className="cta-section">
                        <h2>Have a complex software problem?</h2>
                        <a href="/#contact" className="primary-btn">Consult an Engineer</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseDevelopment;

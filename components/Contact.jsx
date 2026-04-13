import React, { useState } from "react";
import "../src/styles/global.css";

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    const checkPreFill = () => {
        const subject = window.sessionStorage.getItem('contact_subject');
        if (subject) {
            window.sessionStorage.removeItem('contact_subject');
            return subject;
        }
        return '';
    };

    const initialMessage = checkPreFill();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setError(null);

        const formData = new FormData(e.target);
        const payload = {
            name: e.target[0].value,
            email: e.target[1].value,
            service: e.target[2].value,
            message: e.target[3].value,
            source: 'website_form'
        };

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitted(true);
                e.target.reset();
            } else {
                throw new Error(result.error || 'Failed to send message. Please try again later.');
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section id="contact" className="contact-section" style={{ scrollMarginTop: '100px' }}>
            <div className="contact-split">

                {/* ── LEFT PANEL ── */}
                <div className="contact-left">
                    <div className="contact-eyebrow">Get In Touch</div>
                    <h2 className="contact-left-heading">
                        Let's build<br />
                        <span className="contact-left-accent">something</span><br />
                        great.
                    </h2>
                    <p className="contact-left-body">
                        Have a project in mind? Drop us a message and we'll respond within <strong>24 hours</strong>.
                    </p>

                    <div className="contact-info-list">
                        <a href="https://mail.google.com/mail/?view=cm&to=d.nextwavetech@gmail.com" target="_blank" rel="noreferrer" className="contact-info-row">
                            <div className="contact-info-icon-box">✉</div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Email Us</span>
                                <span className="contact-info-value">d.nextwavetech@gmail.com</span>
                            </div>
                        </a>
                        <a href="tel:9253181134" className="contact-info-row">
                            <div className="contact-info-icon-box">☎</div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Call Us</span>
                                <span className="contact-info-value">925-318-1134</span>
                            </div>
                        </a>
                        <div className="contact-info-row">
                            <div className="contact-info-icon-box">⚡</div>
                            <div className="contact-info-text">
                                <span className="contact-info-label">Response Time</span>
                                <span className="contact-info-value">Within 24 Hours</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative gradient orb */}
                    <div className="contact-orb"></div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="contact-right">
                    {submitted ? (
                        <div className="contact-sent">
                            <div className="contact-sent-icon">🎉</div>
                            <h3>Message Received!</h3>
                            <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form className="contact-right-form" onSubmit={handleSubmit} noValidate>
                            <div className="contact-right-heading">Send a Message</div>

                            <div className="crf-row">
                                <div className="crf-field">
                                    <input type="text" placeholder="Your Name" required />
                                </div>
                                <div className="crf-field">
                                    <input type="email" placeholder="Email Address" required />
                                </div>
                            </div>

                            <div className="crf-field">
                                <select defaultValue="">
                                    <option value="" disabled>Service you need...</option>
                                    <option>Website Creation</option>
                                    <option>Website Updates &amp; Fixes</option>
                                    <option>SEO &amp; Internet Marketing</option>
                                    <option>Enterprise Web App</option>
                                    <option>Not Sure Yet</option>
                                </select>
                            </div>

                            <div className="crf-field">
                                <textarea name="message" placeholder="Tell us about your project..." rows="5" required></textarea>
                            </div>

                            {error && <div className="contact-error-msg" style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}

                            <button type="submit" className="crf-submit" disabled={isSending}>
                                {isSending ? "Sending..." : "Send Message"}
                                {!isSending && (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;

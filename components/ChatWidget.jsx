import React, { useState, useEffect } from 'react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLeadHook, setShowLeadHook] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    // Show the lead hook message after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowLeadHook(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setShowLeadHook(false);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setError(null);

        const payload = {
            name: e.target[0].value,
            email: e.target[1].value,
            service: "Chat Widget Inquiry",
            message: e.target[2].value,
            source: 'chat_widget'
        };

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setFormSubmitted(true);
                e.target.reset();
            } else {
                throw new Error('Failed to send');
            }
        } catch (err) {
            console.error("Chat submission error:", err);
            // Fallback for local dev or network issues
            setError("Could not send. Check your connection or API setup.");
            // For demo purposes, we'll still show success so the UI doesn't feel broken 
            // but in production this should be handled strictly.
            // setFormSubmitted(true); 
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            {/* Background Overlay to close chat on outside click */}
            {isOpen && <div className="chat-overlay" onClick={closeChat}></div>}

            <div className={`chat-widget-wrapper ${isOpen ? 'active' : ''}`}>
            {/* Floating Bubble */}
            <button 
                className="chat-bubble" 
                onClick={toggleChat}
                aria-label="Toggle Chat"
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                )}
            </button>

            {/* Lead Hook Tooltip */}
            {!isOpen && showLeadHook && (
                <div className="lead-hook-tooltip">
                    <p>Hi! Are you looking to get a website? 👋</p>
                    <button onClick={() => setShowLeadHook(false)} className="close-hook">×</button>
                </div>
            )}

            {/* Chat Window */}
            <div className="chat-window">
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="bot-avatar">N</div>
                        <div>
                            <h4>NextWave Assistant</h4>
                            <p>Typically replies in minutes</p>
                        </div>
                    </div>
                </div>

                <div className="chat-body">
                    {!formSubmitted ? (
                        <>
                            <div className="chat-message bot">
                                <p>Hi there! How can we help you grow your business today?</p>
                            </div>
                            <form className="chat-form" onSubmit={handleSubmit}>
                                <div className="chat-input-row">
                                    <input type="text" placeholder="Your Name" required />
                                </div>
                                <div className="chat-input-row">
                                    <input type="email" placeholder="Email Address" required />
                                </div>
                                <div className="chat-input-row">
                                    <textarea placeholder="How can we help?" rows="3" required></textarea>
                                </div>
                                <button type="submit" className="chat-submit-btn" disabled={isSending}>
                                    {isSending ? "Sending..." : "Send Message 🚀"}
                                </button>
                                {error && <p className="chat-error-msg">{error}</p>}
                            </form>
                        </>
                    ) : (
                        <div className="chat-success">
                            <div className="success-icon">✓</div>
                            <h3>Thank You!</h3>
                            <p>We've received your inquiry. One of our strategy experts will be in touch shortly.</p>
                            <button onClick={() => setFormSubmitted(false)} className="reset-btn">
                                Send another message
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="chat-footer">
                    <p>Powered by NextWave Studio</p>
                </div>
            </div>
        </div>
    </>
);
};

export default ChatWidget;

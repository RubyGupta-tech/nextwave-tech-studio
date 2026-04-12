import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Testimonials from "../components/Testimonials";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import TrustBar from "../components/TrustBar";
import Process from "../components/Process";
import FloatingCTA from "../components/FloatingCTA";
import ShowcaseSlider from "../components/ShowcaseSlider";
import ChatWidget from "../components/ChatWidget";
import FinalCTA from "../components/FinalCTA";

// Sub-pages
import WebsiteCreation from "../components/pages/WebsiteCreation";
import WebsiteUpdates from "../components/pages/WebsiteUpdates";
import WebsiteFixes from "../components/pages/WebsiteFixes";
import MoreCustomers from "../components/pages/MoreCustomers";
import InternetMarketing from "../components/pages/InternetMarketing";
import SEOMarketing from "../components/pages/SEOMarketing";
import ADACompliance from "../components/pages/ADACompliance";
import EnterpriseDevelopment from "../components/pages/EnterpriseDevelopment";

import PortfolioPage from "../components/pages/PortfolioPage";
import AboutPage from "../components/pages/AboutPage";

import AdminDashboard from "../components/AdminDashboard";

import "./styles/global.css";

// --- Global Scroll Handler ---
const ScrollToHash = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const checkScroll = () => {
            const isRedirectionActive = window.sessionStorage.getItem('scroll_to_contact') === 'true';
            const hasContactHash = hash === '#contact';
            const shouldScrollToContact = hasContactHash || isRedirectionActive;
            
            if (shouldScrollToContact && pathname === '/') {
                // REDIRECTION SHIELD: Don't allow scroll-to-top if we're headed to contact
                setTimeout(() => {
                    let attempts = 0;
                    const scrollInterval = setInterval(() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                            window.sessionStorage.removeItem('scroll_to_contact');
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                            clearInterval(scrollInterval);
                        }
                        attempts++;
                        if (attempts > 50) clearInterval(scrollInterval);
                    }, 100);
                }, 300);
            } else if (!hash && !isRedirectionActive) {
                // Only reset scroll to top if we're NOT headed to contact
                window.scrollTo({ top: 0, behavior: 'auto' });
            }
        };

        checkScroll();
    }, [pathname, hash]);

    return null;
};


const Home = () => {
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

    return (
        <>
            <Hero />
            <div className="reveal"><TrustBar /></div>
            <div className="reveal"><StatsBar /></div>
            <div className="reveal"><Services /></div>
            <div className="reveal"><Process /></div>
            <div className="reveal"><ShowcaseSlider /></div>
            <div className="reveal"><About /></div>
            <div className="reveal"><Testimonials /></div>
            <div className="reveal"><FinalCTA /></div>
            <Contact />
            <FloatingCTA />
        </>
    );
};

function AppContent() {
    const isAdmin = window.location.pathname === '/admin';
    
    return (
        <div className="App">
            <ScrollToHash />
            {!isAdmin && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services/website-creation" element={<WebsiteCreation />} />
                <Route path="/services/website-updates" element={<WebsiteUpdates />} />
                <Route path="/services/website-fixes" element={<WebsiteFixes />} />
                <Route path="/services/more-customers" element={<MoreCustomers />} />
                <Route path="/services/internet-marketing" element={<InternetMarketing />} />
                <Route path="/services/enterprise-development" element={<EnterpriseDevelopment />} />
                <Route path="/services/seo-marketing" element={<SEOMarketing />} />
                <Route path="/services/ada-compliance" element={<ADACompliance />} />
            </Routes>
            {!isAdmin && <Footer />}
            {!isAdmin && <ChatWidget />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
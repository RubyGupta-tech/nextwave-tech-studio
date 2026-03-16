import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Sub-pages
import WebsiteCreation from "../components/pages/WebsiteCreation";
import WebsiteUpdates from "../components/pages/WebsiteUpdates";
import WebsiteFixes from "../components/pages/WebsiteFixes";
import MoreCustomers from "../components/pages/MoreCustomers";
import InternetMarketing from "../components/pages/InternetMarketing";
import EnterpriseDevelopment from "../components/pages/EnterpriseDevelopment";

import PortfolioPage from "../components/pages/PortfolioPage";
import AboutPage from "../components/pages/AboutPage";

import "./styles/global.css";

const Home = () => {
    React.useEffect(() => {
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
            <div className="reveal"><Contact /></div>
            <FloatingCTA />
        </>
    );
};

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/portfolio" element={<PortfolioPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services/website-creation" element={<WebsiteCreation />} />
                    <Route path="/services/website-updates" element={<WebsiteUpdates />} />
                    <Route path="/services/website-fixes" element={<WebsiteFixes />} />
                    <Route path="/services/more-customers" element={<MoreCustomers />} />
                    <Route path="/services/internet-marketing" element={<InternetMarketing />} />
                    <Route path="/services/enterprise-development" element={<EnterpriseDevelopment />} />
                </Routes>
                <Footer />
                <ChatWidget />
            </div>
        </Router>
    );
}

export default App;
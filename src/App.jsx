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

// Sub-pages
import WebsiteCreation from "../components/pages/WebsiteCreation";
import WebsiteUpdates from "../components/pages/WebsiteUpdates";
import WebsiteFixes from "../components/pages/WebsiteFixes";
import MoreCustomers from "../components/pages/MoreCustomers";
import InternetMarketing from "../components/pages/InternetMarketing";
import EnterpriseDevelopment from "../components/pages/EnterpriseDevelopment";

import "./styles/global.css";

const Home = () => (
    <>
        <Hero />
        <StatsBar />
        <Services />
        <Portfolio />
        <Testimonials />
        <About />
        <Contact />
    </>
);

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services/website-creation" element={<WebsiteCreation />} />
                    <Route path="/services/website-updates" element={<WebsiteUpdates />} />
                    <Route path="/services/website-fixes" element={<WebsiteFixes />} />
                    <Route path="/services/more-customers" element={<MoreCustomers />} />
                    <Route path="/services/internet-marketing" element={<InternetMarketing />} />
                    <Route path="/services/enterprise-development" element={<EnterpriseDevelopment />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
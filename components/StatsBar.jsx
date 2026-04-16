import React, { useState, useEffect, useRef } from "react";
import "../src/styles/global.css";

const Counter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // stop observing once triggered
                }
            },
            { threshold: 0, rootMargin: "0px 0px -50px 0px" }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        // Small delay so the parent reveal animation finishes first
        const delay = setTimeout(() => {
            let startTimestamp = null;
            const endValue = parseFloat(end);
            
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentCount = progress * endValue;
                
                setCount(end.includes('.') ? currentCount.toFixed(1) : Math.floor(currentCount));
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            
            window.requestAnimationFrame(step);
        }, 400); // wait 400ms for parent reveal to complete

        return () => clearTimeout(delay);
    }, [isVisible, end, duration]);

    return <span ref={countRef}>{count}{suffix}</span>;
};

import { projects } from "../src/data/projects";

const stats = [
    { number: "5.0", label: "Client Rating", icon: "⭐", suffix: "/5.0" },
    { number: (projects.length + 1).toString(), label: "Projects Completed", icon: "🚀", suffix: "+" },
    { number: "100", label: "On-Time Delivery", icon: "✅", suffix: "%" },
];

const StatsBar = () => {
    return (
        <section className="stats-bar-premium">
            <div className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon-wrapper">
                            <span className="stat-icon-premium">{stat.icon}</span>
                        </div>
                        <div className="stat-content">
                            <div className="stat-number-glow">
                                <Counter end={stat.number} suffix={stat.suffix} />
                            </div>
                            <div className="stat-label-premium">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsBar;

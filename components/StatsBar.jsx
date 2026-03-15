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
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp = null;
        const endValue = parseFloat(end);
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = progress * endValue;
            
            // Format to 1 decimal if it's a float like 5.0
            setCount(end.includes('.') ? currentCount.toFixed(1) : Math.floor(currentCount));
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return <span ref={countRef}>{count}{suffix}</span>;
};

import { projects } from "../src/data/projects";

const stats = [
    { number: "5.0", label: "Client Rating", icon: "⭐", suffix: "/5.0" },
    { number: projects.length.toString(), label: "Projects Completed", icon: "🚀", suffix: "+" },
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

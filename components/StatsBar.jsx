import React from "react";
import "../src/styles/global.css";

const stats = [
    { number: "98%", label: "Client Satisfaction" },
    { number: "3+", label: "Years of Experience" },
    { number: "24/7", label: "Support Available" },
];

const StatsBar = () => {
    return (
        <section className="stats-bar">
            {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                </div>
            ))}
        </section>
    );
};

export default StatsBar;

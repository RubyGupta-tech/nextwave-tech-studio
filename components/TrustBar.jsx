import React from "react";
import "../src/styles/global.css";

const TrustBar = () => {
    const clients = [
        "FGB Consulting", 
        "Quantum Leap Wealth", 
        "PG Photography", 
        "Desi Bites", 
        "Open Space STL", 
        "Drone Girlz"
    ];
    
    return (
        <section className="trust-bar">
            <p className="trust-label">Empowering Small Businesses & Non-Profits</p>
            <div className="logo-container">
                <div className="logo-track">
                    {clients.concat(clients).map((client, index) => (
                        <span key={index} className="client-logo">{client}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBar;

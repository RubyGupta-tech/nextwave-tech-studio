export const sampleProjects = [
    {
        title: "Local Services Business",
        description: "A high-performance landing page for local service providers, optimized for lead generation and mobile responsiveness.",
        tags: ["Local Business", "Lead Gen", "Modern UI"],
        image: "/images/portfolio/local-services.png",
        link: "https://local-servies-business.vercel.app/",
        color: "#1ABC9C",
    },
    {
        title: "TrainMaster",
        description: "A high-performance training platform for Project Management professionals, featuring masterclasses and dynamic resource hubs.",
        tags: ["Education", "PMP Training", "Enterprise"],
        image: "/images/portfolio/trainmaster.png",
        link: "https://train-master-beige.vercel.app/",
        color: "#0D9488",
    },
    {
        title: "Desi Bites",
        description: "Delicious North Indian dishes, freshly made in our home kitchen – where homemade meets flavor.",
        tags: ["Food & Beverage", "Local Business", "Full Stack"],
        image: "/images/portfolio/desibites.png",
        link: "https://desibitesruby.github.io/desibites-site/index.html",
        color: "#991B1B",
    },
];

export const clientProjects = [
    {
        title: "Kid's Campus Zone",
        description: "A comprehensive school management portal featuring student enrollment and intuitive administrative dashboards.",
        tags: ["Education", "Management Portal", "Full Stack"],
        image: "/images/portfolio/kidscampus.png",
        color: "#10B981",
    },
    {
        title: "FGB Consulting",
        description: "Leadership development and coaching for senior leaders navigating complexity.",
        tags: ["Leadership", "Consulting", "Enterprise"],
        image: "/images/portfolio/fgb.png",
        color: "#EAB308",
    },
    {
        title: "Quantum Leap Wealth",
        description: "Integrated Financial & Real Estate Solutions — personalized strategies to protect and grow wealth.",
        tags: ["Finance", "Wealth Management", "Real Estate"],
        image: "/images/portfolio/quantum.png",
        color: "#D4AF37",
    },
    {
        title: "PG Photography",
        description: "Professional newborn, maternity & family photography capturing timeless memories.",
        tags: ["Photography", "Portfolio", "Creative"],
        image: "/images/portfolio/photography.png",
        color: "#F43F5E",
    },
    {
        title: "Open Space STL",
        description: "Empowering communities through participation with My Giving Circle grants and donations.",
        tags: ["Non-Profit", "Volunteer Project", "Donations"],
        image: "/images/portfolio/openspace.png",
        color: "#0EA5E9",
    },
    {
        title: "Drone Girlz",
        description: "Empowering girls to fly, lead, and innovate through a vibrant community of drone pilots.",
        tags: ["Education", "Volunteer Project", "Innovation"],
        image: "/images/portfolio/dronegirlz.png",
        color: "#8B5CF6",
    },
];

// Fallback for any components still using the old export
export const projects = [...sampleProjects, ...clientProjects];

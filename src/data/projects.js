import portfolioData from './portfolio.json';

export const sampleProjects = portfolioData.sampleProjects;
export const clientProjects = portfolioData.clientProjects;

// Fallback for any components still using the old export
export const projects = [...sampleProjects, ...clientProjects];

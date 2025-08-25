// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm start",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/contact",
        "http://localhost:3000/community",
        "http://localhost:3000/yellow-page",
        "http://localhost:3000/news",
        "http://localhost:3000/auth-entry",
        "http://localhost:3000/projects",
        "http://localhost:3000/admin",
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

// src/data/trendingData.js

const trendingNews = [
  {
    id: "trend-001", // Refactored: String ID for consistency
    slug: "chairman-commissions-new-road-borehole", // ADDED: Unique URL slug
    title: "Oshodi-Isolo LG Chairman Commissions New Road, Borehole Projects",
    category: "Community Development",
    readTime: "3 min read", // Refactored: Consistent format
    trend: "✨ Local Buzz",
    image: "/img/road.webp",
    // ADDED: Excerpt for list view
    excerpt:
      "The Oshodi-Isolo Local Government Chairman, Hon. Dr. Oladele Ayuba, officially commissioned a newly constructed road and a vital borehole project in the Ilasamaja axis yesterday.",
    content: `
      In a landmark move for local infrastructure, the Oshodi-Isolo Local Government Chairman,
      Hon. Dr. Oladele Ayuba, officially commissioned a newly constructed road in the Shogunle area
      and a vital borehole project in the Ilasamaja axis yesterday. The road project,
      which spans over 1.5 kilometers, is expected to significantly ease traffic congestion and
      improve the commute for thousands of residents...
    `,
    date: "2025-09-04", // ADDED: Date for sorting/display
    author: {
      // ADDED: Author for consistency
      name: "LG News Team",
      avatar: "/img/road.webp",
      role: "Local Government Correspondent",
    },
  },
  {
    id: "trend-002",
    slug: "oshodi-market-traders-protest-new-sanitation-regulations",
    title: "Oshodi Market Traders Protest New Sanitation Regulations",
    category: "Local Business",
    readTime: "5 min read",
    trend: "⚠️ Hot Topic",
    image: "/img/market.webp",
    excerpt:
      "A large group of traders from the bustling Oshodi Market staged a peaceful protest against the newly introduced market sanitation and waste management regulations.",
    content: `
      A large group of traders from the bustling Oshodi Market staged a peaceful protest this morning against the newly introduced market sanitation and waste management regulations imposed by the local government authority...
    `,
    date: "2025-08-28",
    author: {
      name: "Local Reporter",
      avatar: "/img/market.webp",
      role: "News Contributor",
    },
  },
  {
    id: "trend-003",
    slug: "neighborhood-watch-call-for-increased-security-patrols-in-mafoluku",
    title:
      "Neighborhood Watch Groups Call for Increased Security Patrols in Mafoluku",
    category: "Security",
    readTime: "4 min read",
    trend: "🚨 Rising Concerns",
    image: "/img/watch.webp",
    excerpt:
      "Neighborhood Watch groups across the Mafoluku-Oshodi axis have collectively petitioned the Divisional Police Officer, urging an immediate increase in security patrols.",
    content: `
      Neighborhood Watch groups across the Mafoluku-Oshodi axis have collectively petitioned the Divisional Police Officer (DPO) and the local government council, urging an immediate increase in security patrols due to a recent spike in reported petty crime...
    `,
    date: "2025-09-01",
    author: {
      name: "Security Desk",
      avatar: "/img/watch.webp",
      role: "Security Analyst",
    },
  },
  {
    id: "trend-004",
    slug: "youths-participate-in-vocational-skills-training-program",
    title: "Youths in Oshodi Participate in Vocational Skills Training Program",
    category: "Empowerment",
    readTime: "6 min read",
    trend: "💪 Making Moves",
    image: "/img/vocational-1.webp",
    excerpt:
      "Over fifty young adults from the Oshodi-Isolo community successfully commenced a free, four-week intensive vocational skills training program aimed at tackling youth unemployment.",
    content: `
      Over fifty young adults from the Oshodi-Isolo community successfully commenced a free, four-week intensive vocational skills training program aimed at tackling youth unemployment and fostering entrepreneurial spirit...
    `,
    date: "2025-08-25",
    author: {
      name: "Empowerment Desk",
      avatar: "/img/vocational-1.webp",
      role: "Program Coordinator",
    },
  },
  {
    id: "trend-005",
    slug: "community-outreach-provides-food-relief-to-elderly",
    title: "Community Outreach Provides Food Relief to Elderly in Oshodi",
    category: "Social",
    readTime: "2 min read",
    trend: "❤️ Viral Kindness",
    image: "/img/food.webp",
    excerpt:
      "A grassroots humanitarian group, 'Kindness Keepers Oshodi,' successfully organized a major food relief outreach that saw essential provisions distributed to over a hundred elderly and vulnerable residents.",
    content: `
      A grassroots humanitarian group, 'Kindness Keepers Oshodi,' successfully organized a major food relief outreach that saw essential provisions distributed to over a hundred elderly and vulnerable residents across the local government area...
    `,
    date: "2025-09-05",
    author: {
      name: "Social Beat Reporter",
      avatar: "/img/food.webp",
      role: "Community Reporter",
    },
  },
];

export default trendingNews;

// src/data/newsData.js

export const newsArticles = [
  {
    id: "news-001",
    slug: "chairman-boosts-neighbourhood-watch",
    title:
      "Oshodi LG Chairman Boosts Neighborhood Watch Morale with Vehicle Donations",
    excerpt:
      "Hon. Kehinde Almaroof Olyede empowers local security volunteers with new patrol vehicles and equipment to enhance community safety.",
    content: `Oshodi Local Government Chairman, Hon. Kehinde Alimi, has demonstrated his commitment to community security by donating five brand new patrol vehicles to the local neighborhood watch group. The donation ceremony, held at the council secretariat, was attended by community leaders, security officials, and residents who expressed their appreciation for the government's support.

The vehicles, equipped with modern communication gadgets and safety equipment, will significantly enhance the group's ability to patrol various communities within the local government. Chairman Alimi emphasized that security remains a top priority of his administration and promised continuous support for all security initiatives.`,
    category: "Security",
    date: "2025-07-30",
    readTime: "2 min read",
    image: "/img/news/watchers.png",
    trend: null, // ADDED for schema consistency
    author: {
      name: "Adebayo Johnson",
      avatar: "/img/news/watchers.png",
      role: "Local Government Correspondent",
    },
  },
  {
    id: "news-002",
    slug: "young-starz-win-bet9ja-youth-league",
    title:
      "Kazeem Oyekan Lifts Annual Bet9ja Youth League as Young Starz FC Triumph",
    excerpt:
      "In a thrilling final clash, Young Starz FC defeated rivals Dynamite United 2-1, securing the prestigious annual Bet9ja Youth League trophy in a spectacular show of local talent.",
    content: `The Oshodi Stadium was electrifying yesterday as Young Starz FC claimed the Bet9ja Youth League title, capping off an intense season of grassroots football. The deciding match against Dynamite United was a fiercely contested affair, ending 2-1 in favor of the Starz.
    
The winning goal came from Captain Kazeem Oyekan in the 78th minute—a stunning 25-yard strike that sent the capacity crowd into a frenzy. Oyekan's stellar performance throughout the tournament also earned him the coveted Most Valuable Player (MVP) award. The win highlights the success of local youth development programs in fostering athletic excellence within the community.`,
    category: "Sports",
    date: "2025-09-26", // Set to a recent date
    readTime: "3 min read",
    image: "/img/news/soccer.webp",
    trend: "Local Champion",
    author: {
      name: "Tunde Ojo",
      avatar: "/img/news/soccer.webp",
      role: "Sports Reporter",
    },
  },
  {
    id: "news-003",
    slug: "youth-empowerment-scheme",
    title: "500 Oshodi Youths Benefit from New Skills Acquisition Program",
    excerpt:
      "Local government launches vocational training initiative to combat unemployment among young residents.",
    content: `Oshodi Local Government has launched an ambitious youth empowerment scheme that will train 500 young people in various vocational skills. The program, which focuses on areas such as fashion design, catering, ICT, and renewable energy installation, aims to reduce unemployment and create sustainable livelihoods for the youth.

Participants will receive six months of intensive training followed by starter packs to help them establish their own businesses. The chairman noted that this initiative is part of his administration's broader strategy to invest in human capital development and create economic opportunities at the grassroots level.`,
    category: "Education",
    date: "2025-07-25",
    readTime: "2 min read",
    image: "/img/news/youth.jpg",
    trend: null,
    author: {
      name: "Funke Adewale",
      avatar: "/img/news/youth.jpg",
      role: "Education Correspondent",
    },
  },
  {
    id: "news-004",
    slug: "health-outreach-program",
    title: "Free Medical Outreach Reaches 2,000 Oshodi Residents",
    excerpt:
      "Local government partners with healthcare providers to offer free medical services to underserved communities.",
    content: `A three-day free medical outreach organized by Oshodi Local Government has provided healthcare services to over 2,000 residents. The program, which took place at the council's primary healthcare center, offered free medical consultations, laboratory tests, and medications for common ailments.

The initiative particularly focused on elderly residents and children, with special attention given to hypertension, diabetes, and malaria treatment. The local government health officer confirmed that similar outreach programs will be conducted quarterly to ensure residents have access to basic healthcare services.`,
    category: "Health",
    date: "2025-07-22",
    readTime: "2 min read",
    image: "/img/news/outreach.jpg",
    trend: null,
    author: {
      name: "Dr. Amina Bello",
      avatar: "/img/news/outreach.jpg",
      role: "Health Correspondent",
    },
  },
  {
    id: "news-005",
    slug: "road-rehabilitation-project",
    title: "Oshodi LG Completes Major Road Rehabilitation Projects",
    excerpt:
      "Five major inner roads receive facelift as local government intensifies infrastructure development.",
    content: `Oshodi Local Government has successfully completed the rehabilitation of five major inner roads, significantly improving transportation within the community. The projects, which covered roads in Isolo, Ajao Estate, and Shogunle areas, involved proper drainage construction, asphalt laying, and street light installation.

Residents have expressed their satisfaction with the quality of work, noting that the improved road network has reduced travel time and vehicle maintenance costs. The local government engineer confirmed that regular maintenance schedules have been established to ensure the roads remain in good condition.`,
    category: "Infrastructure",
    date: "2025-07-18",
    readTime: "2 min read",
    image: "/img/news/road-rehabilitation.webp",
    trend: null, // ADDED for schema consistency
    author: {
      name: "Emeka Nwosu",
      avatar: "/img/news/road-rehabilitation.webp",
      role: "Infrastructure Reporter",
    },
  },
  {
    id: "news-006",
    slug: "environmental-sanitation",
    title: "Monthly Environmental Sanitation Records 85% Compliance in Oshodi",
    excerpt:
      "Residents demonstrate strong commitment to cleanliness as local government enforces environmental laws.",
    content: `The recent monthly environmental sanitation exercise in Oshodi Local Government recorded an impressive 85% compliance rate, according to officials. The exercise, which restricted movement between 7am and 10am, allowed residents to clean their surroundings and dispose of waste properly.

Environmental officers reported that major markets, residential areas, and business premises participated actively in the exercise. The local government has announced plans to introduce rewards for the cleanest streets and neighborhoods to encourage sustained participation in future sanitation exercises.`,
    category: "Environment",
    date: "2025-07-15",
    readTime: "2 min read",
    image: "/img/news/sanitation.jpg",
    trend: null, // ADDED for schema consistency
    author: {
      name: "Bisi Adekunle",
      avatar: "/img/news/sanitation.jpg",
      role: "Environment Correspondent",
    },
  },
];

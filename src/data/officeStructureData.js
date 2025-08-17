//src/data/officeStructureData.js

const officeStructureData = {
  executive: {
    title: "Executive Office",
    head: "Otunba Kehinde Oloyode Almaroof",
    position: "Executive Chairman",
    members: 5,
    color: "from-emerald-500 to-teal-600",
    icon: "👨‍💼",
    departments: [
      {
        name: "Office of the Chairman",
        head: "Otunba Kehinde Almaroof",
        staff: 3,
      },
      {
        name: "Office of the Deputy Chairman",
        head: "Deputy Chairman",
        staff: 2,
      },
    ],
    responsibilities: [
      "Overall policy direction and strategic planning",
      "Community engagement and stakeholder relations",
      "Inter-governmental coordination",
      "Public representation and advocacy",
    ],
  },
  administration: {
    title: "Administration Department",
    head: "Secretary to Local Government",
    position: "Chief Administrative Officer",
    members: 15,
    color: "from-blue-500 to-indigo-600",
    icon: "📊",
    departments: [
      { name: "Human Resources", head: "HR Manager", staff: 4 },
      { name: "Records & Documentation", head: "Records Officer", staff: 3 },
      { name: "Protocol & Events", head: "Protocol Officer", staff: 2 },
      { name: "Legal Affairs", head: "Legal Advisor", staff: 2 },
      { name: "Public Relations", head: "PR Manager", staff: 4 },
    ],
    responsibilities: [
      "Personnel management and development",
      "Administrative coordination across departments",
      "Legal compliance and advisory services",
      "Records management and documentation",
    ],
  },
  works: {
    title: "Works & Infrastructure",
    head: "Director of Works",
    position: "Chief Engineer",
    members: 28,
    color: "from-orange-500 to-red-600",
    icon: "🏗️",
    departments: [
      {
        name: "Road Construction & Maintenance",
        head: "Chief Engineer (Roads)",
        staff: 8,
      },
      {
        name: "Building & Construction",
        head: "Building Engineer",
        staff: 6,
      },
      { name: "Urban Planning", head: "Town Planner", staff: 4 },
      {
        name: "Environmental Services",
        head: "Environmental Officer",
        staff: 5,
      },
      { name: "Waste Management", head: "Waste Manager", staff: 5 },
    ],
    responsibilities: [
      "Infrastructure development and maintenance",
      "Urban planning and development control",
      "Environmental protection and sustainability",
      "Waste management and sanitation services",
    ],
  },
  finance: {
    title: "Finance & Budget",
    head: "Head of Finance",
    position: "Chief Financial Officer",
    members: 12,
    color: "from-green-500 to-emerald-600",
    icon: "💰",
    departments: [
      { name: "Budget & Planning", head: "Budget Officer", staff: 3 },
      { name: "Revenue Generation", head: "Revenue Manager", staff: 4 },
      { name: "Accounts & Audit", head: "Chief Accountant", staff: 3 },
      { name: "Procurement", head: "Procurement Officer", staff: 2 },
    ],
    responsibilities: [
      "Financial planning and budget management",
      "Revenue generation and collection",
      "Financial reporting and transparency",
      "Procurement and contract management",
    ],
  },
  health: {
    title: "Health & Social Services",
    head: "Director of Health Services",
    position: "Chief Medical Officer",
    members: 22,
    color: "from-red-500 to-pink-600",
    icon: "🏥",
    departments: [
      { name: "Primary Healthcare", head: "Medical Officer", staff: 8 },
      { name: "Public Health", head: "Public Health Officer", staff: 6 },
      { name: "Social Welfare", head: "Social Welfare Officer", staff: 4 },
      {
        name: "Community Health",
        head: "Community Health Coordinator",
        staff: 4,
      },
    ],
    responsibilities: [
      "Primary healthcare service delivery",
      "Public health programs and disease prevention",
      "Social welfare and community support",
      "Health education and promotion",
    ],
  },
  education: {
    title: "Education & Youth Development",
    head: "Director of Education",
    position: "Chief Education Officer",
    members: 18,
    color: "from-purple-500 to-pink-600",
    icon: "🎓",
    departments: [
      { name: "Basic Education", head: "Education Supervisor", staff: 6 },
      { name: "Youth Development", head: "Youth Coordinator", staff: 4 },
      {
        name: "Skills Acquisition",
        head: "Skills Development Officer",
        staff: 4,
      },
      { name: "Sports & Recreation", head: "Sports Coordinator", staff: 4 },
    ],
    responsibilities: [
      "Educational oversight and quality assurance",
      "Youth empowerment and development programs",
      "Skills acquisition and vocational training",
      "Sports development and recreational activities",
    ],
  },
};

export default officeStructureData;
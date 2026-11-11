export const experience = [
  {
    company: "Techies Africa",
    role: "Senior Full Stack Engineer",
    period: "Dec 2025 — Present",
    location: "Remote · Lagos, Nigeria",
    focus: "Trading, inventory & supply chain",
    details: [
      "Build Laravel services and REST APIs for trading, inventory and supply-chain workflows.",
      "Develop PostgreSQL queries and filters; investigate production failures across APIs, application logic and data.",
      "Contribute authentication, product and order flows to Bellefest, connecting vendors, farmers, logistics providers and customers.",
    ],
    stack: ["Laravel", "PostgreSQL", "React / Vue", "Docker", "AWS"],
  },
  {
    company: "Bex-IT Digital Solution",
    role: "Full Stack Engineer",
    period: "Sep 2024 — Nov 2025",
    location: "Onsite · Abuja, Nigeria",
    focus: "Full-stack delivery & test coverage",
    details: [
      "Delivered Laravel applications and REST APIs from requirements through implementation and testing.",
      "Built Inertia.js features, database filtering and Redis caching; maintained PHPUnit and Pest tests for APIs and integrations.",
      "Refactored application code and improved Beezlinq user workflows with React and Nuxt.js.",
    ],
    stack: ["Laravel", "Inertia.js", "React", "Nuxt.js", "Pest"],
  },
  {
    company: "Tiqwa Travel Technology",
    role: "Full Stack Engineer",
    period: "Jun 2022 — Aug 2024",
    location: "Remote · Abuja, Nigeria",
    focus: "Travel APIs & booking infrastructure",
    details: [
      "Built Laravel REST APIs for flight and hotel search and booking, integrating supplier APIs and inventory.",
      "Designed supplier-data processing flows to handle variable responses and failures.",
      "Implemented PHPUnit and Pest tests for booking and supplier workflows; delivered React and Vue functionality.",
    ],
    stack: ["Laravel", "REST APIs", "MySQL", "React / Vue", "PHPUnit"],
  },
  {
    company: "VenturSeed",
    role: "Software Engineer",
    period: "Nov 2021 — Apr 2022",
    location: "Contract · Remote · New York, USA",
    focus: "Investment platforms",
    details: [
      "Developed Laravel APIs for investment portfolios and financial transactions.",
      "Debugged services and collaborated on API integrations with Vue.js and Nuxt.js frontends.",
    ],
    stack: ["Laravel", "Vue.js", "Nuxt.js", "REST APIs"],
  },
  {
    company: "Cliff-Edge Networks",
    role: "Full Stack Developer",
    period: "May 2020 — Jul 2021",
    location: "Freelance · Lagos, Nigeria",
    focus: "Client platforms & automation",
    details: [
      "Built PHP/Laravel backends, internal tools, REST APIs and automation scripts.",
      "Refactored and optimized applications, supported production maintenance and shipped enhancements.",
    ],
    stack: ["PHP", "Laravel", "APIs", "Automation"],
  },
  {
    company: "Midtown Tech Hub",
    role: "Full Stack Developer",
    period: "Aug 2018 — Feb 2020",
    location: "Hybrid · Benin, Nigeria",
    focus: "The foundations",
    details: [
      "Built and deployed Laravel, Vue.js and MySQL applications for clients.",
      "Created technical documentation and system diagrams; supported testing and ongoing maintenance.",
    ],
    stack: ["Laravel", "Vue.js", "MySQL", "Testing"],
  },
];
export const education = [
  {
    title: "MSc, Artificial Intelligence",
    school: "Politehnica University of Bucharest",
    period: "2025 — Present",
  },
  {
    title: "BSc, Computer Science",
    school: "University of Benin",
    period: "2015 — 2019",
  },
];
export const assetPath = (path: string) => `/Judeverse${path}`;
export const resumePath = assetPath("/assets/documents/ufuoma-jude-resume.pdf");

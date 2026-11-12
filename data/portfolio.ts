export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  contribution: string;
  stack: string[];
  url?: string;
  embeddedPreview?: boolean;
  github?: string;
  image?: string;
  threejs?: boolean;
  theme: string;
  featured?: boolean;
  status?: string;
};

// Professional contributions below are sourced from the supplied CV.
export const projects: Project[] = [
  {
    id: "flynt",
    number: "01",
    title: "Flynt",
    category: "FRAUD INFRASTRUCTURE",
    summary:
      "Safer retries. Clearer API boundaries. Reliable fraud infrastructure.",
    description:
      "A fraud infrastructure and B2B API product. My work focused on the backend foundations that make sensitive integrations dependable.",
    contribution:
      "As a contract backend engineer, built pseudonymization and API-scope functionality, separate test/live environments, and idempotency and reliability mechanisms for API retries and backend processing.",
    stack: ["Backend APIs", "Idempotency", "Pseudonymization", "API scopes"],
    url: "https://useflynt.com",
    theme: "mint",
    featured: true,
  },
  {
    id: "tiqwa",
    number: "02",
    title: "Tiqwa",
    category: "TRAVEL TECHNOLOGY",
    summary:
      "Connecting travel inventory to dependable search and booking experiences.",
    description:
      "Flight and hotel search and booking services integrating external travel supplier APIs and inventory.",
    contribution:
      "Built Laravel REST APIs and supplier-data processing flows, handled variable supplier responses and failures, added PHPUnit/Pest tests, and delivered React/Vue features during my role from June 2022 to August 2024.",
    stack: [
      "Laravel",
      "Supplier APIs",
      "MySQL",
      "PHPUnit / Pest",
      "React / Vue",
    ],
    url: "https://tiqwa.com",
    theme: "blue",
    featured: true,
  },
  {
    id: "beezlinq",
    number: "03",
    title: "Beezlinq",
    category: "DIGITAL BUSINESS CARDS",
    summary:
      "Digital business cards that make professional connections easier to share.",
    description:
      "A digital business card platform. I worked as a full-stack developer during my time at Bex-IT Digital Solution.",
    contribution:
      "As a full-stack developer, refactored and debugged application code and improved Beezlinq user workflows with React and Nuxt.js.",
    stack: ["React", "Nuxt.js", "Full-stack development"],
    url: "https://beezlinq.com",
    theme: "violet",
    featured: true,
  },
  {
    id: "utilify",
    number: "04",
    title: "Utilify Networks",
    category: "UTILITY PAYMENTS",
    summary:
      "Everyday payments, backed by carefully designed transaction workflows.",
    description:
      "A Nigerian utility payments platform for airtime, data, electricity and wallet transactions.",
    contribution:
      "As co-founder, led PHP/Laravel backend development, payment-status webhooks and queue-based background processing. Used Redis and PostgreSQL, created PHPUnit/Pest tests, and debugged payment and integration issues.",
    stack: ["Laravel", "PostgreSQL", "Redis", "Queues", "Webhooks"],
    url: "https://utilify.ng",
    embeddedPreview: false,
    theme: "amber",
    featured: true,
  },
  {
    id: "cardplot",
    number: "05",
    title: "Cardplot",
    category: "CROSS-BORDER PAYMENTS",
    summary:
      "Backend architecture and wallet workflows for cross-border payments.",
    description: "A cross-border payments and digital-wallet platform.",
    contribution:
      "As a contract full-stack engineer, contributed to Laravel 12 backend architecture and React/Inertia.js features, restructured PostgreSQL database components and queries, and supported Docker, AWS and GitHub Actions delivery.",
    stack: ["Laravel 12", "PostgreSQL", "React", "Inertia.js", "AWS"],
    theme: "rose",
    featured: true,
  },
  {
    id: "atravelikes",
    number: "06",
    title: "Atravelikes",
    category: "TRAVEL TECHNOLOGY",
    summary: "Full-stack product development for a travel platform.",
    description:
      "Atravelikes is a travel platform I worked on as a full-stack developer. Explore the live website to see the product.",
    contribution:
      "Contributed as a full-stack developer across the platform. Get in touch to discuss the implementation and my work in more detail.",
    stack: [],
    url: "https://atravelikes.com",
    theme: "cyan",
    featured: true,
  },
  {
    id: "camera",
    featured: true,
    threejs: true,
    number: "07",
    title: "The Camera",
    category: "CREATIVE DEVELOPMENT / WEBGL",
    summary:
      "A browser-based interactive Three.js experience exploring 3D interaction.",
    description:
      "A creative-development project demonstrating interactive 3D rendering in the browser. Visit the live demo to experience the work.",
    contribution:
      "Interactive development, 3D scene engineering and browser-based user experience.",
    stack: ["Three.js", "WebGL", "JavaScript"],
    url: "https://the-camera.vercel.app/",
    theme: "violet",
  },
  {
    id: "supermarket",
    number: "08",
    title: "Supermarket 3D Explorer",
    category: "CREATIVE DEVELOPMENT / WEBGL",
    summary: "An interactive supermarket exploration project built with Three.js.",
    description: "An interactive supermarket exploration project built with Three.js. Open the live project to explore the experience.",
    contribution: "Developed this Three.js project. Explore the live experience below.",
    stack: ["Three.js", "WebGL"],
    url: "https://supermarket-3d-explorer.vercel.app/",
    theme: "mint",
    featured: true,
    threejs: true,
  },
  {
    id: "duskline",
    number: "09",
    title: "Operation Duskline",
    category: "CREATIVE DEVELOPMENT / WEBGL",
    summary: "A Three.js project exploring an interactive browser-based 3D experience.",
    description: "A Three.js project exploring an interactive browser-based 3D experience. Open the live project to explore the experience.",
    contribution: "Developed this Three.js project. Explore the live experience below.",
    stack: ["Three.js", "WebGL"],
    url: "https://operation-duskline.vercel.app/",
    theme: "amber",
    featured: true,
    threejs: true,
  },
  {
    id: "brain",
    number: "10",
    title: "Human Brain",
    category: "CREATIVE DEVELOPMENT / WEBGL",
    summary: "A browser-based human brain project built with Three.js.",
    description: "A browser-based human brain project built with Three.js. Open the live project to explore the experience.",
    contribution: "Developed this Three.js project. Explore the live experience below.",
    stack: ["Three.js", "WebGL"],
    url: "https://human-brain-zeta.vercel.app/",
    theme: "rose",
    featured: true,
    threejs: true,
  },
  {
    id: "formula",
    number: "11",
    title: "Formula X",
    category: "CREATIVE DEVELOPMENT / WEBGL",
    summary: "An interactive Formula X project built with Three.js.",
    description: "An interactive Formula X project built with Three.js. Open the live project to explore the experience.",
    contribution: "Developed this Three.js project. Explore the live experience below.",
    stack: ["Three.js", "WebGL"],
    url: "https://formula-x-eta.vercel.app/",
    theme: "blue",
    featured: true,
    threejs: true,
  },
  {
    id: "spam",
    number: "12",
    title: "Neural Spam Detection",
    category: "MACHINE LEARNING / NLP",
    summary:
      "Neural network classification experiments using the SMS Spam Collection dataset.",
    description:
      "An academic machine-learning experiment using text preprocessing, TF-IDF features and a feedforward neural network to classify SMS messages.",
    contribution:
      "Dataset processing, feature extraction, model training, evaluation and report preparation.",
    stack: ["Python", "TF-IDF", "Neural Networks", "NLP"],
    theme: "blue",
    status: "ACADEMIC PROJECT",
  },
  {
    id: "pso",
    number: "13",
    title: "Swarm Intelligence",
    category: "OPTIMIZATION / RESEARCH",
    summary:
      "Exploring particle swarm optimization for neural-network parameter search.",
    description:
      "A research-oriented academic project investigating how particle swarms can optimize neural network parameters and comparing strategies for information sharing.",
    contribution:
      "Optimization design, experiments, and comparison with conventional training approaches.",
    stack: ["Python", "PSO", "Neural Networks"],
    theme: "rose",
    status: "RESEARCH / EXPERIMENT",
  },
  {
    id: "environment",
    number: "14",
    title: "Environmental Data Lab",
    category: "BIG DATA / STREAMING",
    summary:
      "Prototype for visualizing real-time environmental data across a streaming pipeline.",
    description:
      "Simulated sensor readings pass through an ingestion and stream-processing pipeline, then into storage and an interactive dashboard.",
    contribution:
      "Pipeline design, PySpark processing, dashboard prototyping, and anomaly visualization.",
    stack: ["Kafka", "PySpark", "MongoDB", "Streamlit"],
    theme: "cyan",
    status: "ACADEMIC PROTOTYPE",
  },
];

export const skillGroups = [
  {
    name: "Frontend craft",
    desc: "Interactive products and expressive interfaces",
    skills: ["React", "Next.js", "Vue", "TypeScript", "Three.js", "WebGL"],
  },
  {
    name: "Backend systems",
    desc: "Robust services, APIs, and integrations",
    skills: ["PHP", "Laravel", "Symfony", "REST APIs", "Queues", "Webhooks"],
  },
  {
    name: "Data & infrastructure",
    desc: "Durable foundations for scalable applications",
    skills: ["PostgreSQL", "MySQL", "Redis", "Docker", "AWS", "GitHub Actions"],
  },
  {
    name: "AI & research",
    desc: "Intelligent software and experimental systems",
    skills: ["Neural Networks", "NLP", "Optimization", "Python"],
  },
];

export const socialLinks = {
  github: "https://github.com/jude4",
  linkedin: "https://www.linkedin.com/in/jude-onohwosafe",
  email: "mailto:judeufuomao@gmail.com",
};

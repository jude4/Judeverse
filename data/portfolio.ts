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
  github?: string;
  image?: string;
  theme: string;
  featured?: boolean;
  status?: string;
};

// All descriptive information is editable here. Replace anything that your latest CV does not confirm.
export const projects: Project[] = [
  {
    id: 'flynt', number: '01', title: 'Flynt', category: 'FINTECH / INTELLIGENT SYSTEMS',
    summary: 'Transaction risk and fraud-assessment platform built around event-driven systems.',
    description: 'An engineering project centered on transaction-risk assessment, real-time processing, and reliable financial workflows. Explore the architectural approach rather than unverified performance claims.',
    contribution: 'Backend architecture, event-driven systems and product engineering. Add your verified individual contributions from the latest CV.',
    stack: ['Python', 'Kafka', 'PostgreSQL', 'Next.js', 'TypeScript'], url: 'https://useflynt.com', theme: 'mint', featured: true
  },
  {
    id: 'utilify', number: '02', title: 'Utilify', category: 'PAYMENTS / PLATFORM',
    summary: 'A digital platform simplifying everyday utility purchases and payments.',
    description: 'A consumer utility-payment experience with product interfaces for airtime, data, electricity and other supported services. Actual feature descriptions and screenshots should be confirmed against the live product.',
    contribution: 'Full-stack product development and payment-related integrations; replace with your precise verified role and impact.',
    stack: ['Laravel', 'React', 'Payments', 'APIs'], url: 'https://utilify.ng', theme: 'amber', featured: true
  },
  {
    id: 'camera', number: '03', title: 'The Camera', category: 'CREATIVE DEVELOPMENT / WEBGL',
    summary: 'A browser-based interactive Three.js experience exploring 3D interaction.',
    description: 'A creative-development project demonstrating interactive 3D rendering in the browser. Visit the live demo to experience the work.',
    contribution: 'Interactive development, 3D scene engineering and browser-based user experience.',
    stack: ['Three.js', 'WebGL', 'JavaScript'], url: 'https://the-camera.vercel.app/', theme: 'violet', featured: true
  },
  {
    id: 'spam', number: '04', title: 'Neural Spam Detection', category: 'MACHINE LEARNING / NLP',
    summary: 'Neural network classification experiments using the SMS Spam Collection dataset.',
    description: 'An academic machine-learning experiment using text preprocessing, TF-IDF features and a feedforward neural network to classify SMS messages.',
    contribution: 'Dataset processing, feature extraction, model training, evaluation and report preparation.',
    stack: ['Python', 'TF-IDF', 'Neural Networks', 'NLP'], theme: 'blue', status: 'ACADEMIC PROJECT'
  },
  {
    id: 'pso', number: '05', title: 'Swarm Intelligence', category: 'OPTIMIZATION / RESEARCH',
    summary: 'Exploring particle swarm optimization for neural-network parameter search.',
    description: 'A research-oriented academic project investigating how particle swarms can optimize neural network parameters and comparing strategies for information sharing.',
    contribution: 'Optimization design, experiments, and comparison with conventional training approaches.',
    stack: ['Python', 'PSO', 'Neural Networks'], theme: 'rose', status: 'RESEARCH / EXPERIMENT'
  },
  {
    id: 'environment', number: '06', title: 'Environmental Data Lab', category: 'BIG DATA / STREAMING',
    summary: 'Prototype for visualizing real-time environmental data across a streaming pipeline.',
    description: 'Simulated sensor readings pass through an ingestion and stream-processing pipeline, then into storage and an interactive dashboard.',
    contribution: 'Pipeline design, PySpark processing, dashboard prototyping, and anomaly visualization.',
    stack: ['Kafka', 'PySpark', 'MongoDB', 'Streamlit'], theme: 'cyan', status: 'ACADEMIC PROTOTYPE'
  }
];

export const skillGroups = [
  { name: 'Frontend craft', desc: 'Interactive products and expressive interfaces', skills: ['React', 'Next.js', 'Vue', 'TypeScript', 'Three.js', 'WebGL'] },
  { name: 'Backend systems', desc: 'Robust services, APIs, and integrations', skills: ['PHP', 'Laravel', 'Symfony', 'Node.js', 'Python', 'REST APIs'] },
  { name: 'Data & infrastructure', desc: 'Durable foundations for scalable applications', skills: ['PostgreSQL', 'Redis', 'MongoDB', 'Kafka', 'Docker', 'AWS', 'CI/CD'] },
  { name: 'AI & research', desc: 'Intelligent software and experimental systems', skills: ['Neural Networks', 'NLP', 'Computer Vision', 'Optimization', 'PyTorch'] }
];

export const socialLinks = {
  github: 'https://github.com/jude4',
  linkedin: 'https://www.linkedin.com/in/jude-onohwosafe',
  email: 'mailto:judeufuomao@gmail.com'
};

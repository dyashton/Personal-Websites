export const education = [
  {
    name: 'University of Tennessee',
    year: '2023 – Present',
    description:
      "Pursuing a Bachelor of Science in Computer Science with a minor in machine learning. Expected graduation May 2027. Member of the Chancellor's Honors Program, Cook Grand Challenge Honors Program, and Dean's List. Explored research labs from microelectronics to computational chemistry. Served as a Resident Assistant and as events director for the Society of Asian Scientists and Engineers.",
  },
  {
    name: 'Merrol Hyde Magnet School',
    year: '2019 – 2023',
    description:
      'Graduated in 2023 with a 4.0 GPA and six AP classes (four scores of 5). National Honor Society member. Wrestled all four years and captained the team junior and senior year.',
  },
]

export const research = [
  {
    name: "Dr. Vogiatzis' Lab",
    bullets: [
      'Developed and fine-tuned Transpharmer, a transformer-based molecular generator, for de novo design of NLRP3 inhibitors relevant to Alzheimer’s disease.',
      'Implemented unconditional and conditional generation workflows, benchmarking against GDC-2394 for scaffold novelty.',
      'Integrated a custom XGBoost binding affinity predictor trained on MD simulation outputs to guide reinforcement learning.',
      'Designed a reinforcement learning pipeline with policy gradient optimization and drug-likeness constraints (Lipinski, MW, logP).',
    ],
  },
  {
    name: "Dr. Coble's Lab",
    bullets: [
      'Architected a LangGraph-based multi-agent stack with meta-optimizing policies, orchestration, and tool use.',
      'Built a knowledge graph for sheet metal forming insight.',
      'Integrated knowledge graphs and vector databases into an LLM generation process for an enhanced RAG pipeline.',
      'Used Gemini and LangChain for the pipeline; curated a domain-specific dataset for graphs and vector stores.',
    ],
  },
  {
    name: "Dr. Zhao's Lab",
    bullets: [
      'Worked on a Unitree Go2 quadrupedal robot workshop exploring assistive use for caregivers of persons with dementia.',
      'Presented at EURēCA (Exhibition of Undergraduate Research and Creative Achievement) at UTK.',
    ],
  },
  {
    name: 'Epic Lab',
    bullets: [
      'Built a classification model for temporally recorded hand-motion voltage signals (labeling, preprocessing, training).',
      'Contributed to the frontend of an electric wheelchair app that uses reinforcement learning to gauge assistance needs.',
    ],
  },
  {
    name: 'AURAS Lab',
    bullets: [
      'Supported a computer-vision project on correspondence between 2D human demonstration and 3D point-cloud video.',
      'Labeled over 30,000 images for the project.',
    ],
  },
]

export const jobs = [
  {
    name: 'Clayton',
    position: 'Software Engineer Intern',
    date: 'May 2025 – August 2025',
    bullets: [
      'Spearheaded the first AI-powered internal tool: an MCP-based RAG pipeline used by 10,000+ employees.',
      'Built an MCP-powered AI chatbot with Confluence, SharePoint, Jira, and GitHub via AWS Kendra.',
      'Deployed backend with Docker and ECS behind an ALB; frontend on S3 + CloudFront.',
      'Used AWS Bedrock for hosted LLMs; configured IAM roles, permissions, and policies.',
      'Practiced Agile: sprint planning, ticketing, and daily stand-ups.',
    ],
  },
  {
    name: 'Functional Solutions',
    position: 'Software Engineer Intern',
    date: 'November 2024 – March 2025',
    bullets: [
      'Designed a HIPAA-compliant medical data tracking system for the Tennessee Department of Correction (320+ patients).',
      'Implemented JWTs and encryption to protect patient information.',
    ],
  },
]

export const courses = [
  { code: 'COSC 102', name: 'Introduction to Computer Science II', category: 'Computer Science' },
  { code: 'COSC 230', name: 'Computer Organization and Architecture', category: 'Computer Science' },
  { code: 'COSC 202', name: 'Data Structures and Algorithms I', category: 'Computer Science' },
  { code: 'COSC 307', name: 'Honors Data Structures and Algorithms II', category: 'Computer Science' },
  { code: 'COSC 317', name: 'Honors Discrete Structures', category: 'Computer Science' },
  { code: 'COSC 312', name: 'Algorithm Analysis/Automata', category: 'Computer Science' },
  { code: 'COSC 325', name: 'Introduction to Machine Learning', category: 'Computer Science' },
  { code: 'COSC 340', name: 'Software Engineering', category: 'Computer Science' },
  { code: 'COSC 360', name: 'Systems Programming', category: 'Computer Science' },
  { code: 'COSC 361', name: 'Operating Systems', category: 'Computer Science' },
  { code: 'ECE 414', name: 'Introduction to Reinforcement Learning', category: 'Computer Science' },
  { code: 'COSC 366', name: 'Cybersecurity', category: 'Computer Science', active: true },
  { code: 'COSC 420', name: 'Biologically-Inspired Computing', category: 'Computer Science', active: true },
  { code: 'COSC 424', name: 'Deep Learning', category: 'Computer Science', active: true },
  { code: 'COSC 429', name: 'Adv LLMs: Reason, Agents & Int', category: 'Computer Science', active: true },
  { code: 'EF 157', name: 'Honors Engineering Fundamentals I', category: 'Mathematics' },
  { code: 'EF 158', name: 'Honors Engineering Fundamentals II', category: 'Mathematics' },
  { code: 'MATH 148', name: 'Honors Calculus II', category: 'Mathematics' },
  { code: 'MATH 251', name: 'Linear Algebra', category: 'Mathematics' },
  { code: 'ECE 313', name: 'Probability and Random Variables', category: 'Mathematics' },
  { code: 'MATH 231', name: 'Differential Equations', category: 'Mathematics' },
  { code: 'CHEM 260', name: 'Foundations of Organic Chemistry', category: 'Chemistry' },
  { code: 'CHEM 370', name: 'Physical Chemistry', category: 'Chemistry', active: true },
  { code: 'ECE 491', name: 'Robotics', category: 'Robotics' },
]

export const gpa = '3.98'

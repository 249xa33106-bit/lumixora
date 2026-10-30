export const DOMAINS = [
  {
    id: 'AI & Machine Learning',
    title: 'AI & Machine Learning',
    description: 'Build transformer models, RAG pipelines, fine-tune open-weights LLMs, and deploy inference engines.',
    icon: 'Brain',
    popularSkills: ['Python', 'PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'Scikit-Learn', 'Vector DBs', 'DeepSpeed'],
    tools: ['Jupyter', 'Weights & Biases', 'CUDA', 'FastAPI', 'Docker', 'Google Colab'],
    domainFields: [
      { key: 'frameworks', label: 'Primary AI/ML Frameworks & Libraries Used', placeholder: 'e.g. PyTorch, Hugging Face Transformers, vLLM' },
      { key: 'kaggleOrHuggingFaceUrl', label: 'Hugging Face or Kaggle Profile URL', placeholder: 'https://huggingface.co/your-handle' }
    ]
  },
  {
    id: 'Full-Stack Web Development',
    title: 'Full-Stack Web Development',
    description: 'Design modern web applications, scalable backend microservices, real-time collaboration, and state-of-the-art UIs.',
    icon: 'Layers',
    popularSkills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'GraphQL', 'Express'],
    tools: ['Git', 'Docker', 'Vite', 'Postman', 'Redis', 'Vercel', 'Prisma'],
    domainFields: [
      { key: 'preferredStack', label: 'Preferred Tech Stack', placeholder: 'e.g. Next.js + TypeScript + Node.js + PostgreSQL' },
      { key: 'deployedProjectUrl', label: 'Best Deployed Live Project URL', placeholder: 'https://your-project.vercel.app' }
    ]
  },
  {
    id: 'Software Testing & Quality Assurance',
    title: 'Software Testing & Quality Assurance',
    description: 'Ensure rock-solid software quality through automated unit, integration, end-to-end testing, and CI/CD pipelines.',
    icon: 'CheckCircle2',
    popularSkills: ['Test Automation', 'Jest', 'Cypress', 'Playwright', 'Selenium', 'API Testing', 'Performance Testing'],
    tools: ['Postman', 'GitHub Actions', 'Jira', 'JMeter', 'Selenium WebDriver', 'k6'],
    domainFields: [
      { key: 'testingTools', label: 'Automated Testing Frameworks & Tools Used', placeholder: 'e.g. Cypress, Playwright, Jest, Postman' },
      { key: 'qaExperience', label: 'Summary of Test Automation or Bug Hunting Experience', placeholder: 'e.g. Wrote 150+ end-to-end tests for college portal' }
    ]
  },
  {
    id: 'UI/UX & Product Design',
    title: 'UI/UX & Product Design',
    description: 'Craft human-centered user experiences, design systems, interactive prototypes, and intuitive software interfaces.',
    icon: 'Palette',
    popularSkills: ['Figma', 'UI Design', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
    tools: ['Figma', 'Adobe Creative Cloud', 'Miro', 'Lottie', 'Notion', 'Maze'],
    domainFields: [
      { key: 'designTools', label: 'Primary Design Tools Mastered', placeholder: 'e.g. Figma (Variables, Auto Layout), Adobe Illustrator' },
      { key: 'portfolioLink', label: 'Behance / Dribbble / Design Portfolio URL', placeholder: 'https://behance.net/your-profile' }
    ]
  },
  {
    id: 'Digital Marketing & Growth',
    title: 'Digital Marketing & Growth',
    description: 'Drive user acquisition, lead conversion campaigns, SEO optimization, and data-driven marketing funnels.',
    icon: 'TrendingUp',
    popularSkills: ['SEO', 'Content Strategy', 'Google Analytics', 'Growth Marketing', 'Email Automation', 'Conversion Rate Optimization'],
    tools: ['Google Search Console', 'Ahrefs', 'HubSpot', 'Meta Ads Manager', 'Mailchimp', 'Looker Studio'],
    domainFields: [
      { key: 'marketingFocus', label: 'Core Marketing Specialization', placeholder: 'e.g. Performance Marketing, SEO & Content Distribution' },
      { key: 'campaignMetric', label: 'Notable Growth Result or Metric Achieved', placeholder: 'e.g. Grew college club newsletter to 4,000 subscribers' }
    ]
  },
  {
    id: 'Content Creation & Social Media',
    title: 'Content Creation & Social Media',
    description: 'Produce engaging visual content, short-form reels, technical explainers, and manage brand community channels.',
    icon: 'Video',
    popularSkills: ['Video Editing', 'Scriptwriting', 'Social Media Strategy', 'Storytelling', 'Copywriting', 'Graphic Design'],
    tools: ['Adobe Premiere Pro', 'CapCut', 'Canva', 'DaVinci Resolve', 'Audacity', 'Buffer'],
    domainFields: [
      { key: 'contentLinks', label: 'Links to Published Content / Videos / Reels', placeholder: 'e.g. YouTube video or Instagram reel link' },
      { key: 'editingSoftware', label: 'Primary Video & Editing Software', placeholder: 'e.g. Premiere Pro, CapCut, Canva' }
    ]
  },
  {
    id: 'Business Development & College Partnerships',
    title: 'Business Development & College Partnerships',
    description: 'Expand Lumixora’s university footprint, establish student ambassador chapters, and lead strategic campus outreach.',
    icon: 'Briefcase',
    popularSkills: ['Partnership Outreach', 'Public Speaking', 'Negotiation', 'Event Management', 'Campus Networking', 'Sales Funnel'],
    tools: ['CRM (Notion/HubSpot)', 'LinkedIn Sales Navigator', 'Google Workspace', 'Slack', 'Pitch Decks'],
    domainFields: [
      { key: 'leadershipRole', label: 'Campus Leadership or Student Body Roles Held', placeholder: 'e.g. President of College Developer Club' },
      { key: 'partnershipIdeas', label: 'How would you introduce Lumixora to your college campus?', placeholder: 'Brief 2-3 sentence outreach plan' }
    ]
  },
  {
    id: 'Research & Product Strategy',
    title: 'Research & Product Strategy',
    description: 'Analyze emerging tech trends, evaluate market opportunities, draft product requirement specs, and guide roadmap decisions.',
    icon: 'Search',
    popularSkills: ['Market Research', 'Competitive Analysis', 'Product Requirements (PRD)', 'Data Analysis', 'User Interviews'],
    tools: ['Notion', 'Google Sheets', 'Miro', 'Tableau', 'Statista', 'SurveyMonkey'],
    domainFields: [
      { key: 'researchTopics', label: 'Key Technology or Product Areas Researched', placeholder: 'e.g. AI Copilot interfaces, Developer tooling economics' },
      { key: 'writingSampleUrl', label: 'Link to Case Study, Article, or Research Paper', placeholder: 'https://medium.com/@your-analysis' }
    ]
  }
];

export const DURATIONS = ['1 Month', '2 Months', '3 Months', '6 Months'];

export const WORKING_ARRANGEMENTS = ['Remote', 'Hybrid', 'On-site'];

export const DEGREES = [
  'B.Tech',
  'B.E.',
  'BCA',
  'MCA',
  'B.Sc Computer Science / IT',
  'M.Sc Computer Science / IT',
  'B.Des',
  'M.Tech',
  'MBA',
  'Other'
];

export const YEARS_OF_STUDY = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Post-Graduate (1st / 2nd Year)',
  'Recent Graduate (Class of 2024 / 2025 / 2026)'
];

export const GRADUATION_YEARS = ['2024', '2025', '2026', '2027', '2028', '2029'];

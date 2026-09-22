// Alumni & Referral Database for Vyomra

export const INITIAL_ALUMNI = [
  {
    id: 'alum-1',
    name: 'Sravan Kumar',
    college: 'G. Pulla Reddy Engineering College',
    department: 'CSE',
    batch: '2022',
    company: 'Google',
    role: 'Software Engineer II',
    location: 'Bangalore, India',
    experience: '2.5 Years',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Google',
    github: 'https://github.com',
    referralSlots: 4,
    skills: ['Distributed Systems', 'C++', 'Go', 'GCP', 'System Design'],
    bio: 'Ex-GPREC coding lead. Passionate about helping juniors crack Google L3/L4 technical interviews.',
    acceptedReferrals: 12,
    openForMentorship: true,
    hiringRoles: ['Software Engineer - Early Career', 'Software Engineer University Grad 2025/2026', 'Cloud Infrastructure Engineer']
  },
  {
    id: 'alum-2',
    name: 'Priyanka Reddy',
    college: 'G. Pulla Reddy Engineering College',
    department: 'CSE',
    batch: '2021',
    company: 'Amazon',
    role: 'SDE-2 (AWS DynamoDB)',
    location: 'Hyderabad, India',
    experience: '3.5 Years',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Amazon',
    github: 'https://github.com',
    referralSlots: 5,
    skills: ['Java', 'AWS', 'DynamoDB', 'Microservices', 'High-Concurrency'],
    bio: 'AWS Cloud backend engineer from GPREC. Can refer for SDE-1, SDE-2, and 6-month Software Intern roles.',
    acceptedReferrals: 18,
    openForMentorship: true,
    hiringRoles: ['SDE-1 (Off-Campus)', 'SDE 6-Month Intern', 'Frontend Engineer (React)']
  },
  {
    id: 'alum-3',
    name: 'Sai Charan',
    college: 'G. Pulla Reddy Engineering College',
    department: 'CSM (AI/ML)',
    batch: '2023',
    company: 'Microsoft',
    role: 'Software Engineer (Azure AI)',
    location: 'Hyderabad, India',
    experience: '1.5 Years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Microsoft',
    github: 'https://github.com',
    referralSlots: 3,
    skills: ['Python', 'Azure AI', 'PyTorch', 'LLMs', 'C#/.NET'],
    bio: 'GPREC alumni working on Azure OpenAI integrations. Happy to review resumes with strong AI/ML or fullstack projects.',
    acceptedReferrals: 8,
    openForMentorship: true,
    hiringRoles: ['Software Engineer - AI Services', 'Data Scientist Trainee']
  },
  {
    id: 'alum-4',
    name: 'Ananya Sharma',
    college: 'G. Pulla Reddy Engineering College',
    department: 'ECE',
    batch: '2022',
    company: 'Atlassian',
    role: 'Full Stack Engineer (Jira Core)',
    location: 'Bangalore, India (Remote)',
    experience: '2.5 Years',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Atlassian',
    github: 'https://github.com',
    referralSlots: 2,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    bio: 'Cracked Atlassian off-campus from GPREC ECE background. Ready to mentor and refer driven scholars.',
    acceptedReferrals: 9,
    openForMentorship: false,
    hiringRoles: ['Associate Software Engineer', 'Product Designer']
  },
  {
    id: 'alum-5',
    name: 'Karthik Varma',
    college: 'G. Pulla Reddy Engineering College',
    department: 'CSE',
    batch: '2020',
    company: 'Razorpay',
    role: 'Senior Backend Engineer (Payments)',
    location: 'Bangalore, India',
    experience: '4.5 Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Razorpay',
    github: 'https://github.com',
    referralSlots: 6,
    skills: ['Golang', 'Redis', 'Kafka', 'PostgreSQL', 'Payment Gateways'],
    bio: 'GPREC graduate & FinTech scale enthusiast. Looking for candidates who understand idempotency, rate limiting, and clean API design.',
    acceptedReferrals: 24,
    openForMentorship: true,
    hiringRoles: ['Backend Engineer (Go/Node)', 'DevOps & Site Reliability Engineer']
  },
  {
    id: 'alum-6',
    name: 'Rohit Kulkarni',
    college: 'G. Pulla Reddy Engineering College',
    department: 'EEE',
    batch: '2021',
    company: 'Goldman Sachs',
    role: 'Associate (Quantitative Tech)',
    location: 'Bangalore, India',
    experience: '3 Years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Goldman%20Sachs',
    github: 'https://github.com',
    referralSlots: 3,
    skills: ['Java', 'Spring Boot', 'Data Structures', 'Financial Modeling'],
    bio: 'Goldman Sachs Engineering division. Can refer GPREC students for Summer Analyst and Full-time New Analyst roles.',
    acceptedReferrals: 11,
    openForMentorship: true,
    hiringRoles: ['Summer Analyst 2026', 'New Analyst 2025/2026']
  },
  {
    id: 'alum-7',
    name: 'Deepika S.',
    college: 'G. Pulla Reddy Engineering College',
    department: 'CSE',
    batch: '2023',
    company: 'Swiggy',
    role: 'SDE-1 (Delivery Logistics)',
    location: 'Bangalore, India',
    experience: '1 Year',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20Swiggy',
    github: 'https://github.com',
    referralSlots: 4,
    skills: ['Java', 'Distributed Caching', 'Microservices', 'Kafka'],
    bio: 'GPREC alumni placed through off-campus challenge! Reach out if you have strong DSA and 2+ solid fullstack projects.',
    acceptedReferrals: 7,
    openForMentorship: true,
    hiringRoles: ['SDE-1 Backend', 'QA Automation Engineer']
  },
  {
    id: 'alum-8',
    name: 'Manoj Kumar',
    college: 'G. Pulla Reddy Engineering College',
    department: 'Civil',
    batch: '2020',
    company: 'TCS Digital',
    role: 'Lead Systems Engineer',
    location: 'Chennai, India',
    experience: '4 Years',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    linkedIn: 'https://www.linkedin.com/search/results/people/?keywords=G%20Pulla%20Reddy%20Engineering%20College%20TCS%20Digital',
    github: 'https://github.com',
    referralSlots: 8,
    skills: ['Cloud Migration', 'Java', 'Oracle DB', 'Enterprise Architecture'],
    bio: 'Helped 50+ GPREC students upgrade from TCS Ninja to TCS Digital / Prime. Happy to refer anyone from core branches.',
    acceptedReferrals: 35,
    openForMentorship: true,
    hiringRoles: ['TCS Digital Cadre (7 LPA)', 'TCS Prime Cadre (9 LPA)']
  }
];

export const INITIAL_INTERVIEW_ARCHIVES = [
  {
    id: 'int-1',
    company: 'Google',
    role: 'Software Engineer - University Grad',
    batch: '2024 Passed Out',
    contributor: 'Sravan Kumar (Google L4)',
    rounds: [
      {
        roundName: 'Round 1: Online Coding Assessment (OA)',
        focus: '2 Algorithmic Questions in 60 Minutes on HackerEarth platform.',
        questions: '1. Sliding Window Maximum with Monotonic Queue. 2. Graph Shortest Path with Vertex Weights (Modified Dijkstra).',
        tips: 'Time complexity is strictly monitored. Edge cases with negative numbers and integer overflow ($10^9$) are tested.'
      },
      {
        roundName: 'Round 2: Technical Interview 1 (Data Structures)',
        focus: '45-minute 1-on-1 Google Meet with Google London SDE.',
        questions: 'Design an LRU Cache with $O(1)$ lookup and custom expiration timestamps. Follow-up: Thread-safe concurrency.',
        tips: 'Think out loud continuously. Google interviewers care more about communication and test case verification than instant perfect code.'
      },
      {
        roundName: 'Round 3: Technical Interview 2 (Algorithms & DP)',
        focus: '45-minute coding session on Google Docs sandbox.',
        questions: 'Given a 2D matrix of terrain elevations, find the longest downhill continuous hiking trail with backtracking.',
        tips: 'Use clear variable names (e.g. `longestPath` instead of `x`). Avoid global variables.'
      },
      {
        roundName: 'Round 4: Googleyness & Leadership',
        focus: 'Behavioral and ethical decision making.',
        questions: 'Tell me about a time you had a technical disagreement with a team member. How did you resolve it without ego?',
        tips: 'Use the STAR method (Situation, Task, Action, Result) with measurable metrics.'
      }
    ],
    ctcRange: '₹32,00,000 - ₹45,00,000 CTC (Base + Stocks + Sign-on)',
    keyResources: ['LeetCode Top 150 Interview Questions', 'NeetCode 150', 'Grokking the System Design Interview']
  },
  {
    id: 'int-2',
    company: 'Amazon',
    role: 'SDE-1 (Full Time)',
    batch: '2023 Passed Out',
    contributor: 'Priyanka Reddy (AWS SDE-2)',
    rounds: [
      {
        roundName: 'Round 1: Online Assessment (OA 1 + OA 2)',
        focus: 'Coding (90 mins) + Work Simulation & Leadership Principles survey.',
        questions: '1. Two Sum variation with Target Pairs. 2. Amazon Fresh Delivery Route Optimization (BFS / Priority Queue).',
        tips: 'Do not neglect the Leadership Principles behavioral survey. It carries 50% weightage.'
      },
      {
        roundName: 'Round 2 & 3: Technical Loops (Problem Solving & LP)',
        focus: 'Each round has 20 mins Leadership Principles + 25 mins coding.',
        questions: 'Binary Tree Right Side View, Connect Nodes at Same Level, Rate Limiter token-bucket implementation.',
        tips: 'Relate your project stories directly to Amazon Leadership Principles: "Customer Obsession" and "Bias for Action".'
      }
    ],
    ctcRange: '₹28,00,000 - ₹34,00,000 CTC',
    keyResources: ['Striver SDE Sheet', 'Amazon Leadership Principles Guide']
  },
  {
    id: 'int-3',
    company: 'Razorpay',
    role: 'Backend Software Engineer',
    batch: '2023 Passed Out',
    contributor: 'Karthik Varma (Senior Backend)',
    rounds: [
      {
        roundName: 'Round 1: Machine Coding Round (90 Minutes)',
        focus: 'Build a working in-memory Pub-Sub Messaging System or Parking Lot in Java/Golang/Node.js.',
        questions: 'Implement Publisher, Subscriber, Topic queue with async consumer dispatch and thread safety.',
        tips: 'Write clean Object-Oriented code with Interfaces, Singleton, and Factory patterns. Code MUST run without errors.'
      },
      {
        roundName: 'Round 2: Low-Level Design & Database Concurrency',
        focus: 'Database locking, ACID transactions, Redis caching strategy.',
        questions: 'How would you prevent double deductions when 2 simultaneous UPI payments hit the same bank account?',
        tips: 'Explain Optimistic vs Pessimistic locking and idempotency keys.'
      }
    ],
    ctcRange: '₹20,00,000 - ₹26,00,000 CTC',
    keyResources: ['Designing Data-Intensive Applications by Martin Kleppmann']
  }
];

export const COMPANY_LOGOS = {
  'Google': '🌐',
  'Amazon': '📦',
  'Microsoft': '💻',
  'Atlassian': '🚀',
  'Razorpay': '💳',
  'Goldman Sachs': '📈',
  'Swiggy': '🛵',
  'TCS Digital': '🏢',
  'Uber': '🚗',
  'Flipkart': '🛍️',
  'Adobe': '🎨',
  'Oracle': '🗄️'
};

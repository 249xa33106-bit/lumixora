// ============================================================================
// GPREC AUTHENTIC RECRUITER ATS BENCHMARKS & HIGH-CONVERSION KEYWORDS BANK
// ============================================================================
// Curated specifically for campus placements at G. Pulla Reddy Engineering College
// Evaluates candidate resumes against real automated screening filters (Workday,
// Taleo, Greenhouse, Eightfold.ai, and in-house recruiter parsing engines).
// ============================================================================

export const GPREC_COMPANY_ATS_BENCHMARKS = [
  {
    id: 'amazon',
    name: 'Amazon SDE-1',
    role: 'Software Development Engineer - 1',
    tier: 'Super-Dream (₹28 – ₹45 LPA)',
    badge: 'Bar Raiser Calibrated',
    color: 'from-amber-500 to-orange-600',
    accent: '#f59e0b',
    passingThreshold: 80,
    requiredKeywords: [
      { name: 'Distributed Systems', category: 'Architecture', weight: 3 },
      { name: 'REST API', category: 'Backend', weight: 2 },
      { name: 'Microservices', category: 'Architecture', weight: 3 },
      { name: 'Low-Level Design', category: 'Design', weight: 3 },
      { name: 'Concurrency / Multithreading', category: 'Core CS', weight: 3 },
      { name: 'AWS / Cloud Services', category: 'Cloud', weight: 2 },
      { name: 'Redis / In-Memory Caching', category: 'Backend', weight: 2 },
      { name: 'PostgreSQL / NoSQL', category: 'Database', weight: 2 },
      { name: 'Unit Testing / JUnit', category: 'Testing', weight: 2 },
      { name: 'p99 Latency Optimization', category: 'Metrics', weight: 3 },
      { name: 'High-Throughput / RPS', category: 'Metrics', weight: 3 },
      { name: 'Asynchronous Processing / Kafka', category: 'Architecture', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'amz_b1',
        title: 'High-Throughput Backend & Caching',
        weak: 'Worked on backend APIs with Node.js and database for candidate processing.',
        improved: 'Architected high-throughput RESTful microservices in Node.js and Redis, handling 4,200 RPS while reducing p99 response latency by 38% (from 240ms to 85ms).',
        reason: 'Adds concrete throughput metrics (4,200 RPS), quantified latency reduction (38%), and demonstrates caching expertise expected by Amazon SDE-1 ATS.'
      },
      {
        id: 'amz_b2',
        title: 'Database Schema & Concurrency Defense',
        weak: 'Created database schemas and queries for storing user and assessment information.',
        improved: 'Engineered normalized PostgreSQL relational schemas with B-Tree composite indexes, optimizing query execution plans under heavy concurrent read/write loads and eliminating sequential table scans.',
        reason: 'Highlights low-level query execution plan optimization and concurrency defense, directly fulfilling Bar Raiser low-level design criteria.'
      },
      {
        id: 'amz_b3',
        title: 'Fault Tolerance & Distributed Architecture',
        weak: 'Handled errors and API failures in the application.',
        improved: 'Implemented distributed circuit-breaker patterns and exponential backoff retry mechanisms, ensuring zero cascading service thread exhaustion during peak network spikes with 99.9% availability.',
        reason: 'Cites Amazon Leadership Principle "Deliver Results" and "Bias for Action" through bulletproof fault-tolerance patterns.'
      }
    ]
  },
  {
    id: 'tcs_prime',
    name: 'TCS Digital / Prime',
    role: 'TCS Prime / Digital Software Engineer',
    tier: 'Premier Digital (₹7.5 – ₹9.0 LPA)',
    badge: 'NQT Prime Benchmarked',
    color: 'from-blue-600 to-indigo-700',
    accent: '#4f46e5',
    passingThreshold: 78,
    requiredKeywords: [
      { name: 'Data Structures & Algorithms', category: 'DSA', weight: 3 },
      { name: 'Dynamic Programming', category: 'DSA', weight: 3 },
      { name: 'Java / Python Core', category: 'Language', weight: 3 },
      { name: 'B+ Tree Indexing', category: 'Database', weight: 2 },
      { name: 'ACID Transactions', category: 'Database', weight: 2 },
      { name: 'Time & Space Complexity', category: 'Core CS', weight: 3 },
      { name: 'Graph Theory / BFS / DFS', category: 'DSA', weight: 2 },
      { name: 'Object-Oriented Design', category: 'Design', weight: 2 },
      { name: 'SQL Query Tuning', category: 'Database', weight: 2 },
      { name: 'Relational Normalization', category: 'Database', weight: 2 },
      { name: 'Git Version Control', category: 'Tools', weight: 1 }
    ],
    bulletRewrites: [
      {
        id: 'tcs_b1',
        title: 'Algorithmic Optimization & Complexity',
        weak: 'Built a search feature to find items in large datasets quickly.',
        improved: 'Implemented an optimized binary-search and hash-trie indexing algorithm in Java, reducing lookup algorithmic time complexity from O(N) to O(1) across 80,000+ data nodes.',
        reason: 'Explicitly proves O(1) algorithmic optimization and data structures mastery required for TCS Prime candidate tier.'
      },
      {
        id: 'tcs_b2',
        title: 'Database Transactions & ACID',
        weak: 'Wrote database queries to save user payments and scores.',
        improved: 'Designed ACID-compliant relational transactions in PostgreSQL with strict isolation levels and row-level locking, preventing duplicate entry race conditions across 15,000+ test submissions.',
        reason: 'Demonstrates concurrency safety, transactional isolation, and enterprise database fundamentals valued by TCS Digital recruiters.'
      }
    ]
  },
  {
    id: 'cognizant',
    name: 'Cognizant GenC Next',
    role: 'Full-Stack Digital Developer',
    tier: 'Product Track (₹6.75 – ₹9.0 LPA)',
    badge: 'GenC Next Calibrated',
    color: 'from-cyan-600 to-blue-600',
    accent: '#0284c7',
    passingThreshold: 75,
    requiredKeywords: [
      { name: 'Spring Boot / Node.js', category: 'Backend', weight: 3 },
      { name: 'React.js / Frontend', category: 'Frontend', weight: 3 },
      { name: 'RESTful Architecture', category: 'API', weight: 2 },
      { name: 'JWT Authentication', category: 'Security', weight: 2 },
      { name: 'PostgreSQL / MongoDB', category: 'Database', weight: 2 },
      { name: 'Docker / Containerization', category: 'DevOps', weight: 2 },
      { name: 'CI/CD Pipelines', category: 'DevOps', weight: 2 },
      { name: 'Clean Code Principles', category: 'Quality', weight: 2 },
      { name: 'State Management', category: 'Frontend', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'cog_b1',
        title: 'Full-Stack Integration & Authentication',
        weak: 'Made a full stack web app with React and backend login system.',
        improved: 'Developed a full-stack digital web portal using React 18, Node.js, and MongoDB, integrating secure stateless JWT authentication and role-based access control (RBAC) across 4 user tiers.',
        reason: 'Highlights production-grade JWT security and modular full-stack engineering tested during GenC Next assessments.'
      },
      {
        id: 'cog_b2',
        title: 'Containerization & DevOps Deployment',
        weak: 'Deployed the project on server using docker.',
        improved: 'Containerized microservices into multi-stage Docker builds, slashing image size by 62% and orchestrating automated GitHub Actions CI/CD deployment pipelines with zero-downtime rollouts.',
        reason: 'Validates modern cloud-native deployment competency sought after by Cognizant digital product teams.'
      }
    ]
  },
  {
    id: 'infosys',
    name: 'Infosys Specialist Programmer (SP/DSE)',
    role: 'Specialist Programmer / DSE',
    tier: 'Marquee Track (₹9.5 – ₹11.0 LPA)',
    badge: 'HackWithInfy Benchmarked',
    color: 'from-indigo-700 to-purple-800',
    accent: '#4338ca',
    passingThreshold: 82,
    requiredKeywords: [
      { name: 'Algorithmic Problem Solving', category: 'DSA', weight: 3 },
      { name: 'Dynamic Programming (2D/3D)', category: 'DSA', weight: 3 },
      { name: 'Graph Traversal (BFS/DFS/Dijkstra)', category: 'DSA', weight: 3 },
      { name: 'Trie / Segment Tree', category: 'DSA', weight: 3 },
      { name: 'Disjoint Set Union (DSU)', category: 'DSA', weight: 2 },
      { name: 'Asymptotic Analysis', category: 'Core CS', weight: 2 },
      { name: 'Memory Allocation Tuning', category: 'Systems', weight: 2 },
      { name: 'High-Performance Computing', category: 'Systems', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'infy_b1',
        title: 'Advanced Algorithmic Graph Optimization',
        weak: 'Wrote pathfinding code to find shortest routes on a map.',
        improved: 'Engineered a high-performance shortest-path route optimizer utilizing Dijkstra with a binary min-heap and Disjoint Set Union (DSU), processing 100,000+ graph vertices in under 45ms.',
        reason: 'Demonstrates advanced graph algorithms and asymptotic optimization, the #1 evaluation benchmark in Infosys SP / DSE hiring.'
      }
    ]
  },
  {
    id: 'accenture',
    name: 'Accenture Advanced ASE',
    role: 'Advanced Associate Software Engineer',
    tier: 'Premier ASE (₹6.5 – ₹8.5 LPA)',
    badge: 'Cognitive & Cloud Calibrated',
    color: 'from-purple-600 to-violet-800',
    accent: '#7c3aed',
    passingThreshold: 74,
    requiredKeywords: [
      { name: 'Cloud Computing / AWS', category: 'Cloud', weight: 3 },
      { name: 'Object-Oriented Programming', category: 'Core CS', weight: 3 },
      { name: 'REST APIs & Integration', category: 'Backend', weight: 2 },
      { name: 'DevOps / Automated Pipelines', category: 'DevOps', weight: 2 },
      { name: 'Agile & Scrum Delivery', category: 'Methodology', weight: 2 },
      { name: 'Unit Testing / Mockito', category: 'Testing', weight: 2 },
      { name: 'Relational Database / SQL', category: 'Database', weight: 2 },
      { name: 'Security & Input Sanitization', category: 'Security', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'acc_b1',
        title: 'Cloud Service Integration & Security',
        weak: 'Created cloud endpoints to handle file uploads and user profiles.',
        improved: 'Architected secure cloud microservices with AWS S3 pre-signed URLs and input sanitization, reducing server load by 44% while achieving 100% test coverage with JUnit and Mockito.',
        reason: 'Highlights cloud architecture, unit testing rigor, and security safeguards valued by Accenture Advanced ASE recruiters.'
      }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft IDC',
    role: 'Software Development Engineer',
    tier: 'Super-Dream (₹32 – ₹51 LPA)',
    badge: 'Redmond Core Calibrated',
    color: 'from-blue-700 via-sky-600 to-cyan-500',
    accent: '#0284c7',
    passingThreshold: 85,
    requiredKeywords: [
      { name: 'Data Structures & Algorithms', category: 'DSA', weight: 3 },
      { name: 'System Scalability', category: 'Systems', weight: 3 },
      { name: 'Concurrency & Thread Safety', category: 'Core CS', weight: 3 },
      { name: 'Memory Footprint Optimization', category: 'Systems', weight: 3 },
      { name: 'Distributed Caching', category: 'Backend', weight: 2 },
      { name: 'Object-Oriented Design Patterns', category: 'Design', weight: 2 },
      { name: 'C++ / C# / Java Core', category: 'Language', weight: 3 },
      { name: 'Telemetry & Observability', category: 'Observability', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'msft_b1',
        title: 'Memory Footprint & Concurrency',
        weak: 'Optimized memory usage in a multi-threaded application.',
        improved: 'Profiled and eliminated memory leak bottlenecks using asynchronous thread pools and atomic references, decreasing heap memory consumption by 45% and eliminating thread deadlock risks.',
        reason: 'Addresses memory efficiency and lock-free thread safety, primary pillars of Microsoft engineering bars.'
      }
    ]
  },
  {
    id: 'zoho',
    name: 'Zoho Corporation',
    role: 'Product Engineer / Software Developer',
    tier: 'Product Core (₹8.5 – ₹12 LPA)',
    badge: 'Zero-Library Systems Evaluated',
    color: 'from-red-600 to-amber-600',
    accent: '#dc2626',
    passingThreshold: 78,
    requiredKeywords: [
      { name: 'Core Java / C Implementation', category: 'Language', weight: 3 },
      { name: 'Custom Data Structures', category: 'DSA', weight: 3 },
      { name: 'Low-Level System Modeling', category: 'Architecture', weight: 3 },
      { name: 'OOP from Scratch', category: 'Design', weight: 2 },
      { name: 'CLI / Interactive Architecture', category: 'Systems', weight: 2 },
      { name: 'Raw SQL & Database Design', category: 'Database', weight: 2 },
      { name: 'Garbage Collection & Memory Management', category: 'Core CS', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'zoho_b1',
        title: 'Custom In-Memory Data Engine',
        weak: 'Implemented user storage without using built-in libraries.',
        improved: 'Developed a custom circular buffer and linked-node hash table from scratch in Core Java without third-party collections, achieving O(1) collision resolution and sub-10ms lookup times.',
        reason: 'Directly mirrors Zoho Round 2 & 3 custom data structures philosophy, significantly increasing screening shortlist probability.'
      }
    ]
  },
  {
    id: 'wipro',
    name: 'Wipro Limited',
    role: 'Project Engineer / Turbo Track',
    tier: 'Turbo Track (₹6.5 – ₹8.0 LPA)',
    badge: 'NLTH Turbo Benchmarked',
    color: 'from-emerald-600 to-teal-700',
    accent: '#059669',
    passingThreshold: 72,
    requiredKeywords: [
      { name: 'Java / Python Programming', category: 'Language', weight: 3 },
      { name: 'Relational Database / SQL', category: 'Database', weight: 3 },
      { name: 'REST Web Services', category: 'Backend', weight: 2 },
      { name: 'Object-Oriented Design', category: 'Core CS', weight: 2 },
      { name: 'Data Cleansing & Validation', category: 'Backend', weight: 2 },
      { name: 'Automated Unit Tests', category: 'Testing', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'wip_b1',
        title: 'Enterprise Web Services & SQL Integrity',
        weak: 'Wrote Java code to process and store customer form inputs.',
        improved: 'Engineered RESTful web services in Java with robust data sanitization layers and parameterized SQL queries, reducing API processing exceptions by 52% across 30,000 monthly transactions.',
        reason: 'Demonstrates enterprise stability and SQL injection immunity expected by Wipro Turbo recruiters.'
      }
    ]
  },
  {
    id: 'deloitte',
    name: 'Deloitte USI',
    role: 'Analyst - Technology Consulting',
    tier: 'Consulting Track (₹7.6 – ₹9.2 LPA)',
    badge: 'Enterprise Advisory Benchmarked',
    color: 'from-lime-600 to-green-700',
    accent: '#65a30d',
    passingThreshold: 74,
    requiredKeywords: [
      { name: 'Data Pipeline & ETL', category: 'Data', weight: 3 },
      { name: 'SQL Optimization & Indexing', category: 'Database', weight: 3 },
      { name: 'Cloud Platform (AWS/Azure/GCP)', category: 'Cloud', weight: 2 },
      { name: 'Business Intelligence & Dashboards', category: 'Analytics', weight: 2 },
      { name: 'Python / Automated Scripting', category: 'Language', weight: 2 },
      { name: 'Enterprise Architecture', category: 'Architecture', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'del_b1',
        title: 'Automated Data Pipeline & Analysis',
        weak: 'Extracted data from databases and created reports for users.',
        improved: 'Architected automated Python and SQL ETL data pipelines syncing 500,000+ transactional records into PostgreSQL, reducing manual report compilation overhead by 85% with 99.9% accuracy.',
        reason: 'Highlights enterprise business value, automation efficiency, and large dataset handling sought by Deloitte USI.'
      }
    ]
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    role: 'Exceller Senior Analyst',
    tier: 'Exceller Track (₹7.5 – ₹10 LPA)',
    badge: 'Exceller Engineering Calibrated',
    color: 'from-sky-600 to-blue-700',
    accent: '#0284c7',
    passingThreshold: 75,
    requiredKeywords: [
      { name: 'Modern Java / Spring Framework', category: 'Backend', weight: 3 },
      { name: 'Cloud Native Microservices', category: 'Cloud', weight: 3 },
      { name: 'Test-Driven Development (TDD)', category: 'Testing', weight: 2 },
      { name: 'Relational & NoSQL Databases', category: 'Database', weight: 2 },
      { name: 'Continuous Integration / Git', category: 'DevOps', weight: 2 }
    ],
    bulletRewrites: [
      {
        id: 'cap_b1',
        title: 'Microservices & Test-Driven Development',
        weak: 'Wrote unit tests and created microservices for our app.',
        improved: 'Adopted Test-Driven Development (TDD) using Spring Boot and Mockito to build decoupled microservices, achieving 94% automated test coverage and zero regression defects across 8 sprint cycles.',
        reason: 'Validates industry-standard TDD practices and Spring microservices engineering valued by Capgemini Exceller evaluators.'
      }
    ]
  }
];

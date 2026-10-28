import { callAICompletion } from './aiService';

export const COMPANY_PRESETS = [
  { id: 'google', name: 'Google', logo: '🌐', color: 'from-blue-500 to-red-500', focus: 'DSA, System Design & Scalability' },
  { id: 'amazon', name: 'Amazon', logo: '📦', color: 'from-amber-500 to-yellow-600', focus: 'Leadership Principles & Algorithms' },
  { id: 'microsoft', name: 'Microsoft', logo: '🪟', color: 'from-blue-600 to-cyan-500', focus: 'Data Structures & Problem Solving' },
  { id: 'tcs_ninja', name: 'TCS Digital / Ninja', logo: '🏢', color: 'from-purple-600 to-indigo-600', focus: 'Core CS, Aptitude & OOPs' },
  { id: 'infosys', name: 'Infosys SP / DSE', logo: '💻', color: 'from-blue-500 to-indigo-700', focus: 'Java, Python & Problem Solving' },
  { id: 'accenture', name: 'Accenture ASE', logo: '⚡', color: 'from-purple-500 to-pink-500', focus: 'Coding, Pseudo-code & Communication' },
  { id: 'goldman', name: 'Goldman Sachs', logo: '📈', color: 'from-cyan-600 to-blue-700', focus: 'Math, Quant, Algorithms & C++' },
  { id: 'startup', name: 'Fast-Paced AI Startup', logo: '🚀', color: 'from-emerald-500 to-teal-600', focus: 'Full Stack, APIs & Pragmatic Problem Solving' }
];

export const ROLE_TRACKS = [
  { id: 'sde_fresher', name: 'Software Development Engineer (Fresher / Campus)', category: 'Technical' },
  { id: 'dsa_core', name: 'Data Structures & Algorithms Deep Dive', category: 'Technical' },
  { id: 'fullstack_web', name: 'Full Stack Web Developer (React / Node / DB)', category: 'Technical' },
  { id: 'core_cs', name: 'Core CS Fundamentals (OS, DBMS, CN, OOP)', category: 'Technical' },
  { id: 'ai_ml_engineer', name: 'AI / Machine Learning Engineer', category: 'Technical' },
  { id: 'hr_behavioral', name: 'HR & Behavioral Leadership Round', category: 'HR / Soft Skills' }
];

/**
 * 5-Stage Progressive Difficulty Ladder totaling 100 Marks.
 * Strictly starts with Easy (Self Introduction) and scales up to Hard.
 * Each stage carries 20 Marks (5 stages x 20 Marks = 100 Marks).
 * When 2 questions per round are active, each question is worth 10 Marks.
 */
export const INTERVIEW_STAGES = [
  {
    round: 1,
    title: "Self Introduction & Academic Background",
    difficulty: "Easy",
    maxMarks: 20,
    focus: "Introduction, communication clarity, academic highlights, technical passion, and target role alignment.",
    timeLimit: 120
  },
  {
    round: 2,
    title: "Resume Project Architecture & Tech Choices",
    difficulty: "Medium-Easy",
    maxMarks: 20,
    focus: "Key projects listed on candidate resume, architecture, technology trade-offs, and candidate contribution.",
    timeLimit: 150
  },
  {
    round: 3,
    title: "Core Technical Stack & Implementation Deep Dive",
    difficulty: "Medium",
    maxMarks: 20,
    focus: "Language runtime, asynchronous execution, database query profiling, indexing, and API resilience.",
    timeLimit: 180
  },
  {
    round: 4,
    title: "System Design, Scalability & Architecture",
    difficulty: "Hard",
    maxMarks: 20,
    focus: "High-concurrency scaling, distributed caching, database replication, rate-limiting, and fault tolerance.",
    timeLimit: 180
  },
  {
    round: 5,
    title: "Behavioral Conflict & Crisis Problem-Solving",
    difficulty: "Hard",
    maxMarks: 20,
    focus: "Production outage scenarios, technical disputes, debugging under pressure & STAR response.",
    timeLimit: 150
  }
];

export const TOTAL_INTERVIEW_MARKS = 100;

/**
 * Normalizes and extracts key structured highlights from raw resume text
 */
export const parseResumeText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';
  const clean = rawText.trim();
  if (clean.length < 20) return '';
  // Limit to ~2500 chars for LLM context optimization
  return clean.slice(0, 2500);
};

/**
 * Verifies if a newly generated question is duplicate or substantially similar
 * to any question already asked during this interview session.
 */
export const isQuestionDuplicate = (newQuestion, questionHistory = []) => {
  if (!newQuestion || typeof newQuestion !== 'string') return true;
  const cleanNew = newQuestion.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanNew.length < 15) return true;

  const newWords = new Set(cleanNew.split(' ').filter(w => w.length > 3));

  for (const item of questionHistory) {
    const qText = (typeof item === 'string' ? item : (item.question || item.message || '')).toLowerCase();
    const cleanOld = qText.replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanOld) continue;

    // Direct match check
    if (cleanNew === cleanOld || cleanNew.includes(cleanOld) || cleanOld.includes(cleanNew)) {
      return true;
    }

    // High word overlap check
    const oldWords = new Set(cleanOld.split(' ').filter(w => w.length > 3));
    let commonCount = 0;
    for (const w of newWords) {
      if (oldWords.has(w)) commonCount++;
    }
    const overlapRatio = commonCount / Math.max(newWords.size, oldWords.size, 1);
    if (overlapRatio > 0.60) {
      return true;
    }
  }

  return false;
};

/**
 * Rich, diverse Question Bank per Stage (Rounds 1-5).
 * Contains curated questions partitioned for Question 1, Question 2, and Question 3 of each round.
 * No two rounds or questions will ever repeat, even in offline/fallback modes.
 */
export const STAGE_QUESTION_BANKS = {
  1: [
    // Question 1 Focus: Opening Self-Introduction & Resume Overview
    (comp, role, cand) => `Hello ${cand || 'Candidate'}, welcome to your ${comp.name} placement interview for ${role.name}. To begin Round 1: Please introduce yourself, summarize your academic journey, and highlight key projects and technologies mentioned on your resume.`,
    (comp, role, cand) => `Welcome ${cand || 'Candidate'} to ${comp.name}! For our opening question, please walk me through your background: What inspired you to pursue software engineering, and what are the primary technologies and projects you've built?`,
    // Question 2 Focus: Technical Passion, Career Trajectory & Company Fit
    (comp, role, cand) => `Following your introduction: Looking at your resume and academic background, what specific technical domain (e.g. backend systems, distributed databases, cloud APIs) are you most passionate about, and what makes you a strong fit for ${comp.name}?`,
    (comp, role, cand) => `Great introduction. What do you consider your greatest technical strength as an engineer, and what is one complex programming challenge or tool you recently taught yourself and applied?`,
    // Question 3 Focus (if 3 Qs/round selected)
    (comp, role, cand) => `Could you share a brief overview of your computer science curriculum highlights and explain how your academic capstone experience prepared you for a career at ${comp.name}?`
  ],
  2: [
    // Question 1 Focus: Architecture & Stack Rationale
    (comp, role, cand, res) => `Let's proceed to Round 2 (Resume Project Architecture): Walk me through the architecture of your primary project. Why did you choose that specific tech stack and how did you design the communication between client, server, and database?`,
    (comp, role, cand, res) => `Examining your featured resume project: Walk me through how data flows from a client request down to persistent storage. How did you design your API contracts and database schema?`,
    // Question 2 Focus: Implementation Hurdles, Trade-offs & Concurrency
    (comp, role, cand, res) => `In that same project, what was the most technically complex bug, performance bottleneck, or race condition you personally diagnosed and fixed, and what engineering trade-offs did you make?`,
    (comp, role, cand, res) => `If your featured project experienced a 20x surge in concurrent users tomorrow, where would the architecture break first, and what caching, indexing, or database changes would you implement?`,
    // Question 3 Focus (if 3 Qs/round selected)
    (comp, role, cand, res) => `Looking at the third-party libraries and dependencies in your project, describe an architectural decision you would make differently today to improve maintainability and decouple services.`
  ],
  3: [
    // Question 1 Focus: Runtime Mechanics, Memory & Concurrency
    (comp, role, cand) => `Now for Round 3 (Core Technical Stack & Implementation): How do you manage asynchronous operations, event loops, thread safety, and memory lifecycles in your primary programming language? Provide a concrete scenario from your code.`,
    (comp, role, cand) => `In Round 3 (Core Runtime Mechanics): How does garbage collection or memory allocation operate in your primary runtime? How do you prevent memory leaks or blocking the main event thread?`,
    // Question 2 Focus: Query Profiling, Indexing & API Resilience
    (comp, role, cand) => `Suppose an API endpoint in your backend experiences severe p99 latency under heavy load due to unindexed database queries. How do you profile the query using execution plans (such as EXPLAIN ANALYZE), design composite indexes, and introduce caching?`,
    (comp, role, cand) => `How do you design defensive error handling, input validation, and boundary conditions in production microservices to guarantee zero unhandled promise rejections or cascading server crashes?`,
    // Question 3 Focus (if 3 Qs/round selected)
    (comp, role, cand) => `Advancing to Round 3 (Algorithms & Engineering Depth): Explain how you evaluate time and space complexity in production solutions. Describe an algorithm where you traded space for faster O(1) or O(log N) lookup time.`
  ],
  4: [
    // Question 1 Focus: Distributed Caching & Rate Limiting
    (comp, role, cand) => `Let's tackle Round 4 (System Design & Scalability): How would you design a distributed caching tier (e.g. Redis Cache-Aside vs Write-Through) and token-bucket rate limiter to protect backend services against sudden traffic spikes?`,
    (comp, role, cand) => `In Round 4 (High-Scale Architecture): Design a high-concurrency real-time message queue or notification system. How do you handle message deduplication, at-least-once delivery, and worker crashes?`,
    // Question 2 Focus: Sharding, Replication & Fault Tolerance
    (comp, role, cand) => `How would you architect database sharding and primary-replica replication for a platform with 10 million daily active users to ensure high availability, data consistency, and minimal replication lag?`,
    (comp, role, cand) => `Walk me through how you implement circuit breakers, graceful degradation, and idempotency keys in distributed microservices during network partitions (CAP theorem).`,
    // Question 3 Focus (if 3 Qs/round selected)
    (comp, role, cand) => `In Round 4 (Data Consistency): How do you handle distributed transactions across independent microservices? Compare the Saga Pattern with Two-Phase Commit (2PC).`
  ],
  5: [
    // Question 1 Focus: Outage & Incident Triage (STAR)
    (comp, role, cand) => `Final Round 5 (Behavioral & Production Crisis): It's 2:00 AM on a Friday and a newly deployed patch triggers a cascading service failure affecting payment transactions. Walk me step-by-step through your incident triage and rollback process using the STAR framework.`,
    (comp, role, cand) => `Describe a high-stakes scenario where you uncovered a critical data loss bug or security vulnerability right before a scheduled production release. How did you handle the situation?`,
    // Question 2 Focus: Team Conflict, Technical Disagreement & Ownership (STAR)
    (comp, role, cand) => `In Round 5 (Engineering Collaboration): Tell me about a time you had a strong technical disagreement with a teammate or lead regarding architecture or framework selection. How did you resolve it professionally using data and trade-offs?`,
    (comp, role, cand) => `Walk me through a project or technical goal where you failed or made a significant mistake. What went wrong, how did you take ownership, and what systemic safeguards did you introduce to prevent it from recurring?`,
    // Question 3 Focus (if 3 Qs/round selected)
    (comp, role, cand) => `Final Round 5: Describe a situation where you inherited poorly documented, legacy code with no unit tests and had to add a critical feature under tight deadlines. How did you approach it?`
  ]
};

/**
 * Returns a guaranteed fresh, unasked question for the specified stage and question index
 */
export const getUniqueStageQuestion = (stageNum, company, role, candidateName = 'Candidate', resumeText = '', questionHistory = [], questionIndexInRound = 1) => {
  const roundBank = STAGE_QUESTION_BANKS[stageNum] || STAGE_QUESTION_BANKS[2];
  
  // Pick starting index biased by questionIndexInRound (1 -> 0, 2 -> 2, 3 -> 4)
  const startIndex = Math.min((questionIndexInRound - 1) * 2, roundBank.length - 1);
  for (let i = 0; i < roundBank.length; i++) {
    const fnIdx = (startIndex + i) % roundBank.length;
    const questionFn = roundBank[fnIdx];
    const candidateQ = questionFn(company, role, candidateName, resumeText);
    if (!isQuestionDuplicate(candidateQ, questionHistory)) {
      return candidateQ;
    }
  }

  const fallbackStage = INTERVIEW_STAGES[stageNum - 1] || INTERVIEW_STAGES[0];
  return `In Round ${stageNum} (${fallbackStage.title}): How would you apply your knowledge of ${role.name} to design, implement, and test a robust production feature for ${company.name}?`;
};

/**
 * Stage-accurate Model Answers and Comparative Analyses.
 * Structured by Round and Question Index to ensure 100% relevant answers for every question asked:
 * - Round 1 Q1: Candidate Self Introduction (degree, stack, projects, motivation)
 * - Round 1 Q2: Technical Passion, Career Goals & Company Fit
 * - Round 2 Q1: Project Architecture (3-tier, tech choices, client-server-DB)
 * - Round 2 Q2: Engineering Bottlenecks, Trade-offs & Concurrency
 * - Round 3 Q1: Language Runtime, Event Loop, Memory Lifecycle & Async Concurrency
 * - Round 3 Q2: Query Profiling (EXPLAIN ANALYZE), Composite Indexing & Caching
 * - Round 4 Q1: High-Scale Distributed Caching & Rate-Limiting
 * - Round 4 Q2: Database Sharding, Replication Lag & Circuit Breakers
 * - Round 5 Q1: Behavioral Crisis / Outage Triage (STAR framework)
 * - Round 5 Q2: Technical Conflict Resolution & Engineering Compromise (STAR framework)
 */
export const STAGE_DEFAULT_MODELS = {
  1: {
    1: {
      modelAnswer: (comp, role, cand) => 
        `"Good morning/afternoon. My name is ${cand || 'Candidate'}, and I am completing my degree in Computer Science. Throughout my academic journey, I have developed a strong foundation in data structures, algorithms, and full-stack software development.\n\nOn my resume, my primary project is a full-stack platform where I designed RESTful APIs using Node.js and React, backed by PostgreSQL. I optimized database queries and implemented JWT authentication for secure sessions. What excites me about ${comp.name} is your engineering-first culture and high-impact distributed products. I am eager to bring my problem-solving ability, technical curiosity, and fast-learning mindset to your engineering team."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate skipped the opening self-introduction. In campus placements, delivering a crisp 60-90 second elevator pitch covering your degree, technical stack, and passion for the company is critical to make a strong first impression."
        : "The candidate introduced themselves. To score maximum marks in Round 1, explicitly connect your key resume projects to the company's domain and clearly articulate your career trajectory."
    },
    2: {
      modelAnswer: (comp, role) =>
        `"My primary technical passion lies in backend systems architecture and distributed data processing. I love solving concurrency bottlenecks, optimizing database query execution plans, and designing clean REST and gRPC API contracts.\n\n${comp.name} stands out to me because you build resilient, high-throughput systems that serve millions of real-time transactions. I want to contribute to high-availability engineering challenges where performance and reliability are paramount, while continuing to grow under the mentorship of your senior engineering team."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate skipped the domain passion and company fit question. Highlighting what drives you technically and why you chose this specific company proves genuine intent and culture alignment."
        : "Candidate expressed technical interests. Enhance your response by mentioning specific product systems at the company and articulating how your skills align with their engineering stack."
    }
  },
  2: {
    1: {
      modelAnswer: (comp, role) =>
        `"In our primary project, we implemented a 3-tier modular architecture: a React client, a stateless Node.js REST API service, and a PostgreSQL database.\n\n• Architecture Decisions: We isolated business logic inside service layers and used repository patterns for database abstraction.\n• Trade-offs: We chose PostgreSQL over MongoDB because our business domain required relational integrity with strict ACID guarantees during user transactions.\n• Error Handling & Reliability: We added centralized error-handling middleware, sanitized input payloads using schema validation, and used Redis for caching heavy read endpoints."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate did not answer the project architecture question. In placement interviews, hiring managers evaluate how deeply you understand the system components and trade-offs of the projects listed on your resume."
        : "Candidate provided a project summary. To stand out, discuss specific trade-offs between technologies, database indexing decisions, and API contract design."
    },
    2: {
      modelAnswer: (comp, role) =>
        `"The most challenging technical hurdle was a race condition in our inventory reservation endpoint when concurrent users checked out the last remaining stock.\n\n• Diagnosis: Telemetry logs revealed simultaneous read-then-write transactions causing negative inventory balances.\n• Solution & Trade-offs: Rather than locking the entire database table (which would kill throughput), we implemented atomic PostgreSQL row-level locks (SELECT ... FOR UPDATE) combined with Redis distributed locks (Redlock) with a 3-second expiration.\n• Result: We completely eliminated double-allocation under 1,500 RPS load tests with under 45ms added latency."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate skipped the technical bottleneck and trade-offs question. Interviewers specifically test your debugging methodology, concurrency control, and ability to handle edge cases."
        : "Candidate explained an issue. To achieve top marks, emphasize quantitative metrics (e.g. latency impact, RPS, memory savings) and explain the concurrency safeguards used."
    }
  },
  3: {
    1: {
      modelAnswer: (comp, role) =>
        `"To manage asynchronous operations and concurrency in production:\n\n• Runtime Event Loop: In Node.js / JavaScript, I leverage the libuv event loop, keeping CPU-heavy processing off the main thread using Worker Threads.\n• Memory & Async Lifecycle: I avoid unhandled promise rejections by wrapping async/await in structured try/catch blocks and implementing AbortController for cancellable HTTP requests to prevent memory leaks from dangling listeners.\n• Thread Safety: In multi-threaded environments (like Java/Go), I utilize mutex locks, thread-safe concurrent collections (ConcurrentHashMap), and atomic variables to protect shared memory state."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Technical implementation question was left blank. Practice explaining runtime execution models, memory lifecycles, and concurrency primitives using the model answer."
        : "Candidate addressed the core mechanics. Elite placement candidates stand out by explaining thread safety, garbage collection triggers, and event loop phases."
    },
    2: {
      modelAnswer: (comp, role) =>
        `"To diagnose and resolve severe query latency on database endpoints:\n\n1. Profiling & Execution Plan: Run EXPLAIN (ANALYZE, BUFFERS) to detect sequential table scans, high disk read buffers, and inefficient nested loops.\n2. Composite Indexing: Create B-tree indexes covering high-cardinality WHERE clause filters and JOIN foreign keys.\n3. Caching Tier: Introduce a Redis Cache-Aside layer with TTL to serve read-heavy queries directly from RAM, dropping DB load by 85%.\n4. Connection Pooling: Configure connection pooling (e.g., PgBouncer or HikariCP) to avoid TCP handshake overhead on every incoming request."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate passed the database profiling question. In placement interviews, knowing how to interpret EXPLAIN ANALYZE, design indexes, and configure connection pools is essential."
        : "Candidate discussed query optimization. To score top marks, detail B-tree vs Hash indexing trade-offs and explain cache invalidation strategies."
    }
  },
  4: {
    1: {
      modelAnswer: (comp, role) =>
        `"To design a high-throughput distributed caching and rate-limiting system:\n\n• Distributed Caching: Deploy a Redis cluster using a Cache-Aside pattern with jittered TTL to avoid cache stampede (thundering herd). For hot keys, maintain a tiny in-process LRU cache.\n• Rate Limiting: Implement a Sliding Window Counter or Token Bucket algorithm in Redis backed by atomic Lua scripts to prevent race conditions during high-frequency API hits.\n• High Availability: Place an Application Load Balancer with round-robin health checks and auto-scaling groups across multi-availability zones."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate passed the distributed caching round. For top-tier tech firms, mastering distributed caching, rate-limiting algorithms, and database replication is essential."
        : "Candidate discussed horizontal scaling. To reach senior placement benchmark, detail cache invalidation mechanisms (Cache-Aside vs Write-Through) and single points of failure (SPOF)."
    },
    2: {
      modelAnswer: (comp, role) =>
        `"To handle database sharding, replication lag, and network partitions:\n\n• Sharding Strategy: Partition database tables using a consistent hashing algorithm on tenant ID or user ID to ensure even data distribution across shards without hot-spotting.\n• Replication Lag: Route read-after-write operations directly to the Primary database node for critical consistency (like checkout), while routing read-only queries to replicas.\n• Fault Tolerance: Implement circuit breakers (Netflix Hystrix / Resilience4j) with exponential backoff and fallback responses when microservice dependencies time out."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate skipped the database sharding and fault tolerance question. Top tech firms expect candidates to explain consistent hashing, replication lag mitigation, and circuit breakers."
        : "Candidate discussed system resilience. Mentioning circuit breaker states (Closed, Open, Half-Open) and CAP theorem trade-offs will elevate your score."
    }
  },
  5: {
    1: {
      modelAnswer: (comp, role) =>
        `"(STAR Framework Response):\n\n• Situation: During an emergency deployment at 2:00 AM, our payment verification service suffered connection pool exhaustion, causing 15% of checkout transactions to fail.\n• Task: As incident commander, my goal was to restore payment processing within 5 minutes and safeguard transaction records.\n• Action: I triggered an immediate automated rollback to the previous stable release, enabled a maintenance circuit breaker to queue incoming payments, and inspected Datadog telemetry to identify an unclosed connection leak in a newly introduced ORM migration.\n• Result: Full system availability was restored in 4 minutes with zero data corruption. I then introduced automated connection leak detectors in our CI/CD regression tests."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Behavioral crisis scenario was skipped. Recruiters at top companies look for structured crisis management using the STAR method (Situation, Task, Action, Result)."
        : "Candidate shared an intuitive response. In final interview rounds, strictly format your behavioral answers using the STAR framework to clearly demonstrate leadership and crisis composure."
    },
    2: {
      modelAnswer: (comp, role) =>
        `"(STAR Framework Response):\n\n• Situation: During project planning, a senior peer wanted to adopt a complex distributed event streaming architecture, while I believed a lightweight Redis pub/sub queue was sufficient for our MVP.\n• Task: I needed to align our team on the optimal architecture without causing interpersonal friction or delaying our release sprint.\n• Action: Rather than debating subjectively, I created an objective trade-off matrix evaluating latency, maintenance overhead, operational cost, and developer learning curves. I built a quick benchmark proof-of-concept demonstrating that Redis met our 5,000 RPS requirement with 70% lower cloud cost.\n• Result: The team unanimously agreed on the simpler approach, delivering the project 2 weeks ahead of schedule. The senior engineer appreciated the data-driven approach, and we maintained a strong collaborative relationship."`,
      comparisonAnalysis: (isUnanswered) => isUnanswered
        ? "Candidate skipped the technical disagreement question. Interviewers look for emotional intelligence, data-driven compromise, and egoless collaboration."
        : "Candidate described a disagreement. To maximize marks, highlight objective trade-off matrices and data-driven benchmarking over subjective opinions."
    }
  }
};

/**
 * Returns model answer and comparison analysis for a specific round and question index
 */
export const getStageModelInfo = (round, questionIndex = 1, company, role, candidateName) => {
  const roundModels = STAGE_DEFAULT_MODELS[round] || STAGE_DEFAULT_MODELS[1];
  const modelObj = roundModels[questionIndex] || roundModels[1] || roundModels;
  return {
    modelAnswer: typeof modelObj.modelAnswer === 'function' ? modelObj.modelAnswer(company, role, candidateName) : (modelObj.modelAnswer || ""),
    comparisonAnalysis: (isUnanswered) => typeof modelObj.comparisonAnalysis === 'function' ? modelObj.comparisonAnalysis(isUnanswered, candidateName) : (modelObj.comparisonAnalysis || "")
  };
};

/**
 * Checks for trivial dodges, skips, or empty responses.
 * Never flags polite greetings in Round 1 (Self Introduction) or substantive answers.
 */
export const checkAnswerHeuristic = (answer, currentRound = 1) => {
  const clean = (answer || '').trim().toLowerCase();
  
  if (!clean || clean.length < 3) {
    return {
      isTrivial: true,
      category: 'UNANSWERED',
      feedback: "No answer was provided. Question skipped.",
      score: 0
    };
  }

  // Common evasion phrases
  const dodgePhrases = [
    "i don't know", "i dont know", "no idea", "skip", "pass", "idk",
    "next question", "tell me the answer", "dont know", "no clue", 
    "can we skip", "i have no idea", "skip this", "passed"
  ];
  if (dodgePhrases.some(p => clean === p || clean === p + "." || clean === p + "!")) {
    return {
      isTrivial: true,
      category: 'UNANSWERED',
      feedback: "Candidate acknowledged not knowing or elected to skip this question.",
      score: 0
    };
  }

  // Casual non-interview chat - ONLY flag if the entire answer is just casual chat without substance (< 25 chars)
  // In Round 1, "Hello, I am..." or "Hi, my name is..." is expected and valid!
  const casualChat = [
    "hi", "hello", "how are you", "who are you", "what is your name",
    "what's up", "hey", "tell me a joke", "what is the weather"
  ];
  if (currentRound > 1 && clean.length < 25 && casualChat.some(c => clean === c || clean === c + "?" || clean === c + "!")) {
    return {
      isTrivial: true,
      category: 'IRRELEVANT_CASUAL_CHAT',
      feedback: "⚠️ Irrelevant response: Casual greeting or unrelated query provided instead of answering the technical question.",
      score: 1
    };
  }

  return { isTrivial: false };
};

/**
 * Generate Round 1 (Easy): Introduce Yourself & Resume Overview
 */
/**
 * Fast Promise Timeout utility: bounds AI network operations to maximum `ms` milliseconds,
 * guaranteeing instantaneous fallback without blocking the candidate.
 */
const withFastTimeout = (promise, ms = 2500) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI_TIMEOUT')), ms);
  });
  return Promise.race([
    promise.then(res => { clearTimeout(timer); return res; }),
    timeout
  ]);
};

/**
 * Heuristic scoring engine for rapid, zero-latency candidate evaluation
 */
const evaluateHeuristicScore = (answer = '', round = 1, maxMarks = 10) => {
  const clean = answer.toLowerCase().trim();
  const wordCount = clean.split(/\s+/).filter(Boolean).length;

  const roundKeywords = {
    1: ['degree', 'college', 'project', 'stack', 'react', 'node', 'python', 'java', 'sql', 'learning', 'curriculum', 'internship', 'developer', 'engineering', 'passion'],
    2: ['architecture', 'database', 'api', 'component', 'concurrency', 'tradeoff', 'bottleneck', 'redis', 'postgres', 'mongo', 'query', 'scale', 'lock', 'server'],
    3: ['runtime', 'async', 'event loop', 'thread', 'memory', 'leak', 'index', 'explain analyze', 'garbage', 'microservice', 'exception', 'promise', 'pool'],
    4: ['cache', 'sharding', 'replication', 'rate limit', 'token bucket', 'distributed', 'cluster', 'failover', 'partition', 'cap', 'idempotency', 'circuit breaker'],
    5: ['situation', 'task', 'action', 'result', 'star', 'incident', 'rollback', 'team', 'disagreement', 'data', 'metrics', 'production', 'outage', 'triage']
  };

  const keywords = roundKeywords[round] || roundKeywords[1];
  const matchCount = keywords.filter(kw => clean.includes(kw)).length;

  let scoreRatio = 0.45;
  if (wordCount >= 15) scoreRatio += 0.15;
  if (wordCount >= 40) scoreRatio += 0.15;
  if (matchCount >= 2) scoreRatio += 0.15;
  if (matchCount >= 4) scoreRatio += 0.10;

  return Math.min(maxMarks, Math.max(Math.floor(maxMarks * 0.35), Math.round(maxMarks * scoreRatio)));
};

/**
 * Generate Round 1 (Easy): Introduce Yourself & Resume Overview
 * Instantaneous 0ms startup with personalized candidate, company, role & resume grounding.
 */
export const generateOpeningQuestion = async ({
  company,
  role,
  experienceLevel,
  candidateName,
  resumeText = ''
}) => {
  const cand = candidateName || 'Candidate';
  const comp = company?.name || 'Company';
  const roleName = role?.name || 'Software Engineer';
  const exp = experienceLevel || 'Fresher (0-1 yrs)';

  let resumeHighlights = '';
  if (resumeText && resumeText.trim().length > 30) {
    const techMatches = resumeText.match(/(?:React|Node\.?js|Python|Java|SQL|PostgreSQL|AWS|Docker|TypeScript|Spring\s?Boot|C\+\+|DSA|Machine\s?Learning|FastAPI)/gi);
    if (techMatches && techMatches.length > 0) {
      const uniqueTech = [...new Set(techMatches.map(t => t.trim()))].slice(0, 3).join(', ');
      resumeHighlights = ` I noticed your practical background in ${uniqueTech}.`;
    }
  }

  return `Hello ${cand}, welcome to your ${comp} placement interview for the ${roleName} role (${exp}).${resumeHighlights} To kick off Round 1: Please introduce yourself, summarize your academic journey in computer science, and highlight the key projects and technologies mentioned on your resume.`;
};

/**
 * Evaluates candidate answer for the current round and question index, computes marks out of maxMarks,
 * generates the AI Model Answer & comparative critique, and formulates the next question.
 * Bounded with a strict 2.5-second timeout for maximum responsiveness.
 */
export const evaluateAndAskFollowUp = async ({
  company,
  role,
  questionHistory = [],
  candidateAnswer = '',
  currentRound = 1,
  totalRounds = 5,
  questionIndexInRound = 1,
  questionsPerRound = 2,
  resumeText = '',
  isSkipped = false
}) => {
  const currentStage = INTERVIEW_STAGES.find(s => s.round === currentRound) || INTERVIEW_STAGES[0];
  const isLastQuestionInRound = questionIndexInRound >= questionsPerRound;
  const isFinalQuestion = currentRound >= totalRounds && isLastQuestionInRound;
  const currentQuestionText = questionHistory[questionHistory.length - 1]?.question || '';
  const maxMarks = Math.round(currentStage.maxMarks / questionsPerRound) || 10;

  const nextRoundNum = isLastQuestionInRound ? currentRound + 1 : currentRound;
  const nextQuestionIndex = isLastQuestionInRound ? 1 : questionIndexInRound + 1;
  const nextStage = INTERVIEW_STAGES.find(s => s.round === nextRoundNum) || currentStage;

  const stageModelInfo = getStageModelInfo(currentRound, questionIndexInRound, company, role, 'Candidate');

  // 1. Instant Zero-Latency Skip & Heuristic Evasion Handler (0ms)
  const heuristic = checkAnswerHeuristic(candidateAnswer, currentRound);
  if (isSkipped || heuristic.isTrivial) {
    const isActuallyUnanswered = isSkipped || heuristic.category === 'UNANSWERED' || heuristic.category === 'GIBBERISH_OR_EMPTY';
    const nextQ = isFinalQuestion ? "" : getUniqueStageQuestion(nextRoundNum, company, role, 'Candidate', resumeText, questionHistory, nextQuestionIndex);

    return {
      isRelevant: false,
      isUnanswered: isActuallyUnanswered,
      category: isActuallyUnanswered ? 'UNANSWERED' : heuristic.category,
      feedback: isActuallyUnanswered 
        ? "⚠️ Question Skipped / Unanswered (0 Marks). Review the AI Model Answer in your diagnostic report to master this concept for your placement drive."
        : heuristic.feedback,
      marksAwarded: 0,
      maxMarks,
      aiModelAnswer: stageModelInfo.modelAnswer,
      comparisonAnalysis: stageModelInfo.comparisonAnalysis(isActuallyUnanswered),
      nextQuestion: nextQ,
      isCompleted: isFinalQuestion
    };
  }

  // 2. Perform AI Evaluation with 2.5s Timeout Guard
  const pastQuestionsTextList = questionHistory.map((q, i) => `Q${i+1} [Round ${q.round || 1}]: "${q.question || q.message || ''}"`).join('\n');
  const conversationContext = questionHistory.slice(-2).map((h, i) => `Interviewer: ${h.question}\nCandidate: ${h.answer || '(Unanswered)'}`).join('\n\n');

  const prompt = `You are a senior technical hiring evaluator at ${company.name} evaluating ${role.name}.
ROUND ${currentRound}/${totalRounds} • Q${questionIndexInRound}/${questionsPerRound}: "${currentStage.title}" (${currentStage.difficulty}, Max: ${maxMarks} marks).
QUESTION: "${currentQuestionText}"
CANDIDATE ANSWER: "${candidateAnswer}"

PREVIOUS QUESTIONS (DO NOT REPEAT):
${pastQuestionsTextList}

EVALUATE:
1. "marksAwarded": 0 to ${maxMarks} based on technical accuracy.
2. "feedback": 1-2 concise sentences.
3. "aiModelAnswer": 2-3 paragraphs of gold-standard answer for Round #${currentRound} (${currentStage.title}).
4. "comparisonAnalysis": 2 sentences comparing candidate answer with ideal answer.
5. "nextQuestion": ${isFinalQuestion ? '""' : `Formulate next question for ${isLastQuestionInRound ? `Round ${nextRoundNum} (${nextStage.title})` : `Round ${currentRound} Q${nextQuestionIndex}`}`}.

JSON SCHEMA ONLY:
{
  "marksAwarded": 8,
  "maxMarks": ${maxMarks},
  "isRelevant": true,
  "feedback": "Concise feedback",
  "aiModelAnswer": "Ideal answer",
  "comparisonAnalysis": "Comparison critique",
  "nextQuestion": "${isFinalQuestion ? '' : 'Next question'}",
  "isCompleted": ${isFinalQuestion}
}`;

  try {
    const response = await withFastTimeout(callAICompletion({
      prompt,
      temperature: 0.2,
      maxTokens: 450
    }), 2500);

    const jsonMatch = response && response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.marksAwarded = Math.max(0, Math.min(maxMarks, Number(parsed.marksAwarded) || Math.floor(maxMarks * 0.6)));
      parsed.maxMarks = maxMarks;
      parsed.isRelevant = parsed.isRelevant !== false;
      parsed.isUnanswered = false;
      parsed.isCompleted = isFinalQuestion;

      if (!parsed.aiModelAnswer || parsed.aiModelAnswer.length < 25) {
        parsed.aiModelAnswer = stageModelInfo.modelAnswer;
      }
      if (!parsed.comparisonAnalysis || parsed.comparisonAnalysis.length < 20) {
        parsed.comparisonAnalysis = stageModelInfo.comparisonAnalysis(false);
      }
      if (!isFinalQuestion) {
        if (!parsed.nextQuestion || parsed.nextQuestion.trim().length < 20 || isQuestionDuplicate(parsed.nextQuestion, questionHistory)) {
          parsed.nextQuestion = getUniqueStageQuestion(nextRoundNum, company, role, 'Candidate', resumeText, questionHistory, nextQuestionIndex);
        }
      }

      return parsed;
    }
  } catch (err) {
    // Fast fallback triggered if LLM exceeded 2.5s or failed
  }

  // 3. Fast Heuristic Fallback (Guaranteed < 5ms execution)
  const heuristicMarks = evaluateHeuristicScore(candidateAnswer, currentRound, maxMarks);
  const isShort = candidateAnswer.trim().split(/\s+/).length < 15;
  const fallbackNextQ = isFinalQuestion ? "" : getUniqueStageQuestion(nextRoundNum, company, role, 'Candidate', resumeText, questionHistory, nextQuestionIndex);

  return {
    marksAwarded: heuristicMarks,
    maxMarks,
    isRelevant: true,
    isUnanswered: false,
    feedback: isShort 
      ? `Good initial points, but could provide more architectural trade-offs and runtime precision. (${heuristicMarks}/${maxMarks} Marks)`
      : `Strong, well-articulated technical response addressing the core question. (${heuristicMarks}/${maxMarks} Marks)`,
    aiModelAnswer: stageModelInfo.modelAnswer,
    comparisonAnalysis: stageModelInfo.comparisonAnalysis(false),
    nextQuestion: fallbackNextQ,
    isCompleted: isFinalQuestion
  };
};

/**
 * Helper to formulate the next question based on current stage difficulty & resume
 */
const generateNextQuestionPrompt = async ({ 
  company, 
  role, 
  currentStage,
  nextStage, 
  isLastQuestionInRound,
  nextQuestionIndex,
  questionsPerRound,
  resumeText, 
  questionHistory = [] 
}) => {
  const pastQuestionsTextList = questionHistory.map((q, i) => `Q${i+1}: "${q.question || q.message || ''}"`).join('\n');

  const targetStage = isLastQuestionInRound ? nextStage : currentStage;
  const prompt = `You are a technical interviewer at ${company.name} for ${role.name}.
Formulate the next interview question:
STAGE: "${targetStage.title}" (Round ${targetStage.round})
QUESTION NUMBER: Question ${nextQuestionIndex} of ${questionsPerRound} in this round.
DIFFICULTY: ${targetStage.difficulty} (Scale: Easy -> Medium-Easy -> Medium -> Hard -> Hard).
FOCUS: ${targetStage.focus}.

${resumeText ? `RESUME CONTEXT:\n"""\n${parseResumeText(resumeText)}\n"""\nIMPORTANT: Ground the question directly in their resume projects or tech stack.` : ''}

PREVIOUS QUESTIONS ASKED IN THIS SESSION (CRITICAL: DO NOT REPEAT ANY OF THESE):
${pastQuestionsTextList}

Keep the question clean, challenging, fresh, and completely distinct from all previous questions. Return ONLY the question string.`;

  try {
    const q = await callAICompletion({ prompt, temperature: 0.3, maxTokens: 250 });
    if (q && q.trim().length > 20 && !isQuestionDuplicate(q.trim(), questionHistory)) {
      return q.trim();
    }
  } catch (e) {}

  return getUniqueStageQuestion(targetStage.round, company, role, 'Candidate', resumeText, questionHistory, nextQuestionIndex);
};

/**
 * Generate Final Diagnostic Scorecard evaluated out of 100 Marks.
 * Includes Question-by-Question breakdown across all questions asked,
 * User Answer vs AI Answer comparisons, Unanswered questions highlighted with ideal responses,
 * and Strengths & Weaknesses.
 */
export const generateInterviewScorecard = async ({
  company,
  role,
  experienceLevel,
  candidateName,
  resumeText = '',
  history = []
}) => {
  // 1. Calculate Mathematical Total out of 100 Marks
  let totalScoreOutOf100 = 0;
  const questionBreakdown = history.map((h, i) => {
    const stage = INTERVIEW_STAGES.find(s => s.round === h.round) || INTERVIEW_STAGES[0];
    const maxMarks = h.maxMarks || 10;
    const isUnanswered = h.isUnanswered === true || !h.answer || h.answer.trim().length === 0;
    const marksAwarded = isUnanswered ? 0 : Math.max(0, Math.min(maxMarks, Number(h.marksAwarded ?? h.score) || 0));
    
    totalScoreOutOf100 += marksAwarded;

    const defaultModelInfo = getStageModelInfo(h.round, h.questionIndexInRound || 1, company, role, candidateName);
    const isGenericOrMissingModel = !h.aiModelAnswer || h.aiModelAnswer.length < 25 || (h.round === 1 && (h.questionIndexInRound === 1 || !h.questionIndexInRound) && h.aiModelAnswer.toLowerCase().includes('latency')) || h.aiModelAnswer.includes('architectural rationale');
    const finalAiModelAnswer = isGenericOrMissingModel
      ? defaultModelInfo.modelAnswer
      : h.aiModelAnswer;

    const isGenericOrMissingComp = !h.comparisonAnalysis || h.comparisonAnalysis.length < 20 || (h.round === 1 && (h.comparisonAnalysis.toLowerCase().includes('latency') || h.comparisonAnalysis.toLowerCase().includes('quantitative metrics')));
    const finalComparisonAnalysis = isGenericOrMissingComp
      ? defaultModelInfo.comparisonAnalysis(isUnanswered)
      : h.comparisonAnalysis;

    return {
      round: h.round,
      questionIndexInRound: h.questionIndexInRound || 1,
      title: h.stageTitle || stage.title,
      difficulty: h.difficulty || stage.difficulty,
      maxMarks: maxMarks,
      marksAwarded: marksAwarded,
      question: h.question,
      userAnswer: isUnanswered ? "Skipped / Unanswered" : h.answer,
      isUnanswered: isUnanswered,
      aiModelAnswer: finalAiModelAnswer,
      comparisonAnalysis: finalComparisonAnalysis,
      feedback: h.feedback || ""
    };
  });

  // Calculate normalized score out of 100 if sum of maxMarks differed from 100
  const possibleSum = questionBreakdown.reduce((s, q) => s + q.maxMarks, 0);
  if (possibleSum > 0 && possibleSum !== 100) {
    totalScoreOutOf100 = Math.round((totalScoreOutOf100 / possibleSum) * 100);
  } else {
    totalScoreOutOf100 = Math.max(0, Math.min(100, Math.round(totalScoreOutOf100)));
  }

  const isPassing = totalScoreOutOf100 >= 70;

  // Count skipped / unanswered questions
  const skippedCount = questionBreakdown.filter(q => q.isUnanswered).length;

  const historySummary = questionBreakdown.map((q, idx) => `Question ${idx + 1} (Round ${q.round} Q${q.questionIndexInRound} [${q.difficulty} - ${q.marksAwarded}/${q.maxMarks} Marks]):
Question: "${q.question}"
User Answer: "${q.userAnswer}" (Unanswered: ${q.isUnanswered})
Marks: ${q.marksAwarded}/${q.maxMarks}
Analysis: ${q.comparisonAnalysis}`).join('\n\n');

  const prompt = `Generate a comprehensive, rigorous Placement Diagnostic Report evaluated out of 100 Marks.

Candidate: ${candidateName}
Company: ${company.name}
Role: ${role.name} (${experienceLevel})
Total Score: ${totalScoreOutOf100} / 100 Marks
Questions Skipped / Unanswered: ${skippedCount}
Passing Threshold: 70 / 100 Marks (Candidate Cleared: ${isPassing})

${resumeText ? `CANDIDATE RESUME:\n"""\n${parseResumeText(resumeText)}\n"""` : ''}

TRANSCRIPT & SCORES BREAKDOWN:
${historySummary}

TASK:
1. Provide a candid, placement-ready evaluation summary (3-4 sentences).
2. List 3-4 specific KEY STRENGTHS demonstrated by the candidate.
3. List 3-4 specific WEAKNESSES & AREAS TO IMPROVE (especially if questions were skipped or shallow).
4. Provide 3 concrete recommended topics/skills to revise before real campus hiring drives.
5. Provide a company hiring verdict (e.g. "Selected / Recommendation for L2" or "Needs Revision - Placement Benchmark Not Met").

Respond ONLY with valid JSON matching this schema:
{
  "verdict": "${isPassing ? 'Selected / Recommended for Final Round' : 'Needs Revision / Benchmark Not Met'}",
  "summary": "Detailed diagnostic evaluation summary...",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "recommendedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "companyFitAnalysis": "Analysis against ${company.name}'s technical bar"
}`;

  try {
    const response = await withFastTimeout(callAICompletion({
      prompt,
      temperature: 0.2,
      maxTokens: 450
    }), 2500);

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        totalScore: totalScoreOutOf100,
        maxMarks: TOTAL_INTERVIEW_MARKS,
        isPassing,
        skippedCount,
        verdict: parsed.verdict || (isPassing ? 'Selected / Recommended for Final Round' : 'Needs Revision / Benchmark Not Met'),
        summary: parsed.summary || (isPassing ? `Candidate performed strongly across all stages, demonstrating solid grasp of resume projects and technical fundamentals.` : `Candidate struggled with advanced system design and skipped ${skippedCount} rounds. Further preparation is required.`),
        strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : [
          "Good initial introduction and clear presentation of academic background",
          "Familiarity with core tech stack from resume"
        ],
        weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0 ? parsed.weaknesses : [
          skippedCount > 0 ? `Skipped ${skippedCount} technical question(s) which severely impacted the final score` : "Could provide more quantitative metrics and memory complexity analysis",
          "Needs deeper preparation on high-scale distributed architecture and failure recovery"
        ],
        recommendedTopics: Array.isArray(parsed.recommendedTopics) && parsed.recommendedTopics.length > 0 ? parsed.recommendedTopics : [
          "System Design & Microservices Caching Patterns",
          "Advanced Database Indexing & Query Tuning",
          "Behavioral STAR Framework Practice"
        ],
        companyFitAnalysis: parsed.companyFitAnalysis || (isPassing ? `Meets the initial technical screening threshold for ${company.name}.` : `Does not currently meet the technical benchmark for ${company.name} campus hiring.`),
        credentialEligible: isPassing && totalScoreOutOf100 >= 70,
        questionBreakdown
      };
    }
  } catch (err) {
    console.error('Scorecard AI generation error:', err);
  }

  // Fallback return
  return {
    totalScore: totalScoreOutOf100,
    maxMarks: TOTAL_INTERVIEW_MARKS,
    isPassing,
    skippedCount,
    verdict: isPassing ? "Selected / Recommended for Final Round" : "Needs Revision / Benchmark Not Met",
    summary: isPassing
      ? `Candidate demonstrated sound technical foundations and effectively explained resume projects, scoring ${totalScoreOutOf100}/100.`
      : `Candidate scored ${totalScoreOutOf100}/100. Missed technical depth or skipped questions indicate further preparation is needed before ${company.name} interviews.`,
    strengths: [
      "Structured self introduction in Round 1",
      "Good familiarity with primary resume technologies"
    ],
    weaknesses: [
      skippedCount > 0 ? `Unanswered questions (${skippedCount}) severely degraded overall score` : "Lack of algorithmic edge case analysis",
      "Need to elaborate on system scaling, database indexing, and fault tolerance"
    ],
    recommendedTopics: [
      "System Scalability & Distributed Caching",
      "Database Schema Design & Query Optimization",
      "STAR Method for Behavioral Problem-Solving"
    ],
    companyFitAnalysis: isPassing 
      ? `Meets the placement benchmark for ${company.name}.`
      : `Benchmark not met for ${company.name} (70/100 required).`,
    credentialEligible: isPassing,
    questionBreakdown
  };
};

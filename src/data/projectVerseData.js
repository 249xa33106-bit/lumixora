// ============================================================================
// LUMIXORA PROJECTVERSE™ — Core Data Models & Curated Project Blueprints
// "Build the right projects. Prove your skills. Stand out."
// A Product of VYOMRA Networks · Global Innovation Division
// ============================================================================

export const PROJECTVERSE_META = {
  name: "Lumixora ProjectVerse™",
  tagline: "Build the right projects. Prove your skills. Stand out.",
  centralPromise: "Every project should prove a skill.",
  organization: "Vyomra Networks",
  version: "1.0.0-PROD",
  rubricVersion: "2026.1",
  disclaimer: "This score measures the quality and relevance of project evidence. It does not guarantee job offers, hiring decisions, or exact interview outcomes."
};

// Target Career Roles with required and bonus skills
export const TARGET_CAREER_ROLES = [
  {
    id: "ai_engineer",
    title: "AI / Machine Learning Engineer",
    category: "Artificial Intelligence",
    description: "Builds production-grade AI pipelines, RAG systems, LLM evaluation workflows, and machine learning models.",
    keySkills: ["Python", "PyTorch", "LLMs", "RAG", "Vector Databases", "LangChain / LlamaIndex", "Evaluation Metrics", "Docker", "FastAPI"],
    growthRate: "+38% (High Demand)",
    avgStarterDuration: "3-4 weeks",
    recommendedDomain: "ai_ml"
  },
  {
    id: "fullstack_engineer",
    title: "Full-Stack Software Engineer",
    category: "Web & Enterprise Systems",
    description: "Architects scalable client-server applications, distributed APIs, and responsive web user experiences.",
    keySkills: ["React / Next.js", "Node.js / Express", "PostgreSQL", "REST / GraphQL APIs", "WebSockets", "Docker", "Redis", "Unit Testing", "Tailwind CSS"],
    growthRate: "+28% (Steady Demand)",
    avgStarterDuration: "2-3 weeks",
    recommendedDomain: "fullstack"
  },
  {
    id: "backend_systems",
    title: "Backend & Systems Architect",
    category: "Distributed Systems",
    description: "Specializes in high-throughput microservices, data persistence, concurrency, and caching architectures.",
    keySkills: ["Go / Python / Java", "Redis", "Kafka / RabbitMQ", "PostgreSQL / DynamoDB", "Docker", "Microservices", "API Gateways", "System Design"],
    growthRate: "+25% (High Salary)",
    avgStarterDuration: "3-4 weeks",
    recommendedDomain: "backend"
  },
  {
    id: "cloud_devops",
    title: "Cloud & DevOps Engineer",
    category: "Infrastructure & Platform",
    description: "Automates CI/CD delivery pipelines, manages Kubernetes clusters, containerization, and cloud infrastructure.",
    keySkills: ["Docker", "Kubernetes", "AWS / GCP", "GitHub Actions CI/CD", "Terraform / IaC", "Linux & Shell", "Prometheus / Grafana", "Networking"],
    growthRate: "+32% (Critical Need)",
    avgStarterDuration: "3-5 weeks",
    recommendedDomain: "cloud_devops"
  },
  {
    id: "data_engineer",
    title: "Data Platform & Analytics Engineer",
    category: "Data Systems",
    description: "Designs robust ETL/ELT pipelines, real-time streaming architectures, and data lakehouse infrastructures.",
    keySkills: ["Python", "SQL", "Apache Kafka", "Apache Spark / DuckDB", "PostgreSQL", "dbt", "Airflow / Prefect", "Data Modeling"],
    growthRate: "+30% (High Demand)",
    avgStarterDuration: "3-4 weeks",
    recommendedDomain: "data_engineering"
  },
  {
    id: "cybersecurity_engineer",
    title: "Cybersecurity & DevSecOps Engineer",
    category: "Security & Trust",
    description: "Secures distributed architectures, performs vulnerability scanning, zero-trust auth, and automated auditing.",
    keySkills: ["Network Security", "OWASP Top 10", "Cryptography", "Container Auditing", "Python / Go", "Linux Hardening", "OAuth / JWT", "Trivy / Snyk"],
    growthRate: "+35% (Top Growth)",
    avgStarterDuration: "3-4 weeks",
    recommendedDomain: "security"
  },
  {
    id: "mobile_engineer",
    title: "Mobile App Architect (iOS & Android)",
    category: "Client Engineering",
    description: "Builds smooth, offline-first mobile applications with biometric authentication and real-time cloud sync.",
    keySkills: ["React Native / Flutter", "TypeScript", "SQLite / Realm", "State Management", "Push Notifications", "REST APIs", "App Store Release"],
    growthRate: "+22% (Consistent)",
    avgStarterDuration: "2-3 weeks",
    recommendedDomain: "mobile"
  }
];

// The 6-Category Transparent Resume Impact Scoring Rubric
export const SCORING_RUBRIC = {
  roleRelevance: {
    weight: 0.25,
    percentage: 25,
    title: "Role Relevance",
    description: "How directly the project demonstrates the core engineering competencies required for your target role.",
    criteria: [
      { id: "core_tech_aligned", label: "Implements minimum 3 core tech stack requirements of target role", points: 40 },
      { id: "problem_context", label: "Solves an authentic problem representative of industry workflows", points: 30 },
      { id: "best_practices", label: "Adheres to idiomatic conventions, directory structure, and clean architecture", points: 30 }
    ]
  },
  technicalDepth: {
    weight: 0.20,
    percentage: 20,
    title: "Technical Depth",
    description: "Architectural complexity, asynchronous processing, data isolation, and non-trivial engineering decisions.",
    criteria: [
      { id: "architecture_layers", label: "Separated multi-tier architecture (controllers, services, database, workers)", points: 35 },
      { id: "async_concurrency", label: "Asynchronous task queue, background jobs, or streaming protocols", points: 35 },
      { id: "edge_case_handling", label: "Robust error recovery, schema validation, and rate limiting", points: 30 }
    ]
  },
  workingImplementation: {
    weight: 0.20,
    percentage: 20,
    title: "Working Implementation",
    description: "A functional, testable system with automated tests and a live runnable deployment.",
    criteria: [
      { id: "live_deployment", label: "Publicly accessible live URL with functioning demo environment", points: 40 },
      { id: "automated_tests", label: "Automated test suite (unit, integration, or end-to-end) passing in CI", points: 35 },
      { id: "zero_critical_bugs", label: "Smooth error-free primary user journey verified", points: 25 }
    ]
  },
  originality: {
    weight: 0.15,
    percentage: 15,
    title: "Originality & Problem Solving",
    description: "Differentiated design choices and custom improvements that distinguish the project from basic tutorial clones.",
    criteria: [
      { id: "unique_feature", label: "At least 2 differentiated features not present in standard YouTube/Medium tutorials", points: 40 },
      { id: "custom_dataset", label: "Custom domain datasets, unique business logic, or novel API integration", points: 35 },
      { id: "tradeoff_documentation", label: "Documented technical tradeoffs explaining WHY specific technologies were chosen", points: 25 }
    ]
  },
  measurableImpact: {
    weight: 0.10,
    percentage: 10,
    title: "Measurable Impact",
    description: "Quantified benchmarks, observed performance metrics, latency improvements, or user feedback.",
    criteria: [
      { id: "benchmark_recorded", label: "Documented benchmark (e.g. latency in ms, throughput, memory savings)", points: 50 },
      { id: "baseline_comparison", label: "Comparative analysis vs unoptimized baseline or standard solution", points: 50 }
    ]
  },
  proofDocumentation: {
    weight: 0.10,
    percentage: 10,
    title: "Proof & Documentation",
    description: "Public GitHub repository, clear architectural README, demo video/Loom, and contribution verification.",
    criteria: [
      { id: "professional_readme", label: "Comprehensive README with setup instructions, architecture diagram & API spec", points: 40 },
      { id: "clean_git_history", label: "Healthy, semantic Git commit history reflecting iterative development", points: 30 },
      { id: "demo_walkthrough", label: "Video walkthrough or interactive demo link clearly showcasing features", points: 30 }
    ]
  }
};

// Curated Catalogue of Differentiated Projects across Engineering Disciplines
export const PROJECT_CATALOGUE = [
  // ── 1. AI & MACHINE LEARNING ──
  {
    id: "pv-ai-eval-hallucination",
    title: "AI Evaluation & Hallucination Detection Lab",
    tagline: "Automated truth-grounding and citation evaluation suite for RAG and LLM systems.",
    domain: "ai_ml",
    domainLabel: "AI / ML & LLMs",
    targetRoles: ["ai_engineer", "data_engineer"],
    tier: "recommended",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
    estimatedWeeks: "4–6 weeks",
    estimatedHours: "40–50 hours",
    estimatedCost: "₹0 (Free Tier / Local LLM via Ollama)",
    potentialImpactScore: 94,
    skillsDemonstrated: ["RAG Architecture", "LLM Evaluation", "Python", "Vector Databases", "Prompt Engineering", "TruLens / DeepEval", "FastAPI"],
    problemStatement: "Most students build simple chatbots with OpenAI wrappers. However, real enterprise AI engineering demands proving hallucination rates, measuring grounding faithfulness, and verifying citation passages against source documents.",
    solutionOverview: "A standalone web service that takes prompt-completion pairs and context passages, executes automated evaluation heuristics (Faithfulness, Answer Relevance, Context Precision), and outputs a visual dashboard with confidence metrics.",
    differentiation: [
      "Avoids simple wrapper trap: measures exact grounding ratio instead of just generating text",
      "Supports both local models (Ollama/Llama 3) and cloud APIs (Gemini/OpenAI)",
      "Includes a test benchmark suite with 50 intentional hallucination edge cases to prove detector accuracy"
    ],
    architecture: {
      frontend: "React + Tailwind CSS + Recharts (evaluation radar & timeline)",
      backend: "Python 3.11 + FastAPI (REST endpoints for batch test suites)",
      evalEngine: "Ragas / DeepEval heuristics + custom NLI entailment model",
      vectorDb: "ChromaDB / FAISS for source passage semantic indexing",
      storage: "SQLite / PostgreSQL for audit logs and test run history"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Evaluation Taxonomy & Dataset Design",
        tasks: [
          "Define evaluation metrics: Faithfulness, Answer Relevance, Context Recall",
          "Assemble test dataset of 30 passage-answer pairs with known synthetic hallucinations",
          "Set up local Python virtual environment with FastAPI and PyTest"
        ]
      },
      {
        id: "m2",
        title: "Milestone 2: RAG Pipeline with Semantic Source Attribution",
        tasks: [
          "Implement chunking and embedding pipeline using LangChain/LlamaIndex and ChromaDB",
          "Add strict quote-attribution metadata tracking to every retrieved passage",
          "Expose FastAPI endpoint `/api/evaluate/single` accepting source doc and generated answer"
        ]
      },
      {
        id: "m3",
        title: "Milestone 3: Hallucination Detection Engine",
        tasks: [
          "Implement sentence-level NLI contradiction checking against retrieved context",
          "Calculate overall Faithfulness Score (0.0 to 1.0) and flag unsubstantiated sentences",
          "Generate visual color-coded highlight tokens for ungrounded claims"
        ]
      },
      {
        id: "m4",
        title: "Milestone 4: Interactive Web Studio & Dashboard",
        tasks: [
          "Build responsive React frontend to run live evaluations and inspect highlighted text",
          "Add Recharts visualizations comparing model performance across benchmark runs",
          "Implement CSV/JSON export for compliance and auditing reports"
        ]
      },
      {
        id: "m5",
        title: "Milestone 5: CI/CD, Containerization & Verification",
        tasks: [
          "Dockerize application with multi-stage build (`Dockerfile` + `docker-compose.yml`)",
          "Write 15+ automated unit tests in PyTest testing hallucination scoring boundaries",
          "Deploy demo to Render or HuggingFace Spaces and publish public GitHub repository"
        ]
      }
    ],
    resumeBullets: [
      "Architected an automated AI Evaluation and Hallucination Detection platform in Python and FastAPI, reducing ungrounded LLM claims by measuring Faithfulness and Context Precision across 50+ benchmark test sets.",
      "Engineered sentence-level NLI entailment checker and ChromaDB vector retrieval pipeline, achieving <180ms evaluation latency for multi-paragraph answers.",
      "Containerized service using Docker and implemented automated PyTest suites covering 18 validation edge cases with 92% code coverage."
    ]
  },
  {
    id: "pv-adaptive-agent-benchmark",
    title: "Adaptive Autonomous Multi-Agent Benchmark Framework",
    tagline: "Controlled execution and stress-testing harness for multi-agent LLM workflows.",
    domain: "ai_ml",
    domainLabel: "AI / ML & LLMs",
    targetRoles: ["ai_engineer", "backend_systems"],
    tier: "ambitious",
    difficulty: "Advanced",
    difficultyColor: "text-rose-700 bg-rose-50 border-rose-200",
    estimatedWeeks: "8–10 weeks",
    estimatedHours: "75–90 hours",
    estimatedCost: "₹0–₹300 (Local LLM via Ollama / Free tier APIs)",
    potentialImpactScore: 98,
    skillsDemonstrated: ["Multi-Agent Orchestration", "Async Python", "Docker Isolation", "Tool Calling", "Observability", "Benchmarking"],
    problemStatement: "Multi-agent systems (e.g. researcher + coder + reviewer) frequently get stuck in infinite loops, fail tool execution silently, or rack up catastrophic API costs without standardized reliability benchmarking.",
    solutionOverview: "A reproducible harness that pit agents against complex multi-step reasoning challenges, logs step-by-step tool invocations with OpenTelemetry traces, and measures tool success rates, cost per solved task, and failure recovery agility.",
    differentiation: [
      "Simulates real API failure modes (rate limits, malformed JSON, timeouts) to test agent resilience",
      "Implements dynamic max-budget circuit breakers to prevent runaway token spend",
      "Generates interactive Gantt execution charts showing inter-agent communication overhead"
    ],
    architecture: {
      frontend: "Next.js / React + Tailwind + SVG Execution Flow Graph",
      backend: "Python AsyncIO + LangGraph / AutoGen primitives",
      tracing: "OpenTelemetry / SQLite trace collector",
      sandbox: "Docker container sandboxes for executing agent-generated bash/code",
      metrics: "Custom scoring algorithms for task completion vs cost ratio"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Agent Protocol & Mock Tooling Registry",
        tasks: [
          "Design unified Agent message protocol (Role, ToolCalls, ThoughtTrace, State)",
          "Implement mock tool sandbox (Web Search, File System, Code Execution, SQL Query)",
          "Build chaos test harness that injects random 500 errors and malformed responses"
        ]
      },
      {
        id: "m2",
        title: "Milestone 2: Orchestration & State Machine",
        tasks: [
          "Implement multi-agent workflow: Planner -> Researcher -> Executor -> Critic",
          "Add cycle-detection and hard token/call budget limiters",
          "Store full execution traces with step timestamps in SQLite"
        ]
      },
      {
        id: "m3",
        title: "Milestone 3: Benchmark Suite (20 Tasks)",
        tasks: [
          "Author 20 standardized multi-step reasoning tasks across coding, analysis, and research",
          "Automate scoring criteria with ground truth assertion verifiers",
          "Calculate Task Completion Rate (%), Tool Precision, and Recovery Rate"
        ]
      },
      {
        id: "m4",
        title: "Milestone 4: Web Observability Dashboard",
        tasks: [
          "Build real-time execution trace viewer with expandable thoughts and tool payloads",
          "Render cost vs accuracy Pareto frontier charts comparing different model backends",
          "Implement run replays with step-by-step playback"
        ]
      },
      {
        id: "m5",
        title: "Milestone 5: Production Runbook & Documentation",
        tasks: [
          "Create reproducible Docker Compose environment with 1-command startup",
          "Record 5-minute video walkthrough analyzing failure recovery on edge cases",
          "Publish detailed technical case study comparing Llama 3 vs Mistral vs Gemini"
        ]
      }
    ],
    resumeBullets: [
      "Engineered an Adaptive Multi-Agent Benchmark framework evaluating autonomous agent tool usage, cost efficiency, and recovery rates across 20 multi-step engineering challenges.",
      "Implemented asynchronous execution engine with OpenTelemetry tracing and chaos-injected tool faults, achieving 88% automatic error recovery.",
      "Developed interactive observability dashboard visualizing agent thought trees, token spend, and execution latency."
    ]
  },
  {
    id: "pv-paper-intelligence",
    title: "Research Paper Intelligence & Citation Engine",
    tagline: "Deep PDF layout extraction, semantic claim verification, and citation linking.",
    domain: "ai_ml",
    domainLabel: "AI / ML & LLMs",
    targetRoles: ["ai_engineer", "fullstack_engineer"],
    tier: "starter",
    difficulty: "Beginner–Intermediate",
    difficultyColor: "text-blue-700 bg-blue-50 border-blue-200",
    estimatedWeeks: "2–3 weeks",
    estimatedHours: "20–25 hours",
    estimatedCost: "₹0 (Free / Open-Source)",
    potentialImpactScore: 86,
    skillsDemonstrated: ["Python", "FastAPI", "Vector Search", "Document Parsing", "React", "Semantic Chunking"],
    problemStatement: "Standard PDF chatbots lose table data, misquote page numbers, and invent citations because they use naive text dump chunking.",
    solutionOverview: "A specialized research assistant that parses academic PDFs with section awareness (Abstract, Methods, Results), extracts tabular figures, and provides clickable bounding-box citations to source passages.",
    differentiation: [
      "Section-aware semantic chunking instead of naive fixed-character splits",
      "Clicking a citation automatically scrolls and highlights the exact PDF passage",
      "Includes export to BibTeX and Markdown synthesis summaries"
    ],
    architecture: {
      frontend: "React + PDF.js + Tailwind CSS",
      backend: "FastAPI + PyMuPDF / pdfplumber for structural layout parsing",
      vectorDb: "FAISS with sentence-transformers/all-MiniLM-L6-v2 (runs on CPU)",
      orchestration: "Lightweight Python retrieval pipeline without heavy external frameworks"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Structural PDF Extractor",
        tasks: ["Set up PyMuPDF parser extracting headings, paragraphs, and page coordinates", "Create test set of 5 ArXiv scientific papers"]
      },
      {
        id: "m2",
        title: "Milestone 2: Vector Search & Chunking",
        tasks: ["Implement section-aware chunker retaining section metadata", "Generate embeddings with FAISS and write top-k similarity retrieval endpoint"]
      },
      {
        id: "m3",
        title: "Milestone 3: Question Answering with Bounding Box Citations",
        tasks: ["Connect retrieval to local LLM or Gemini API with strict context prompt", "Return source bounding box coordinates alongside answer text"]
      },
      {
        id: "m4",
        title: "Milestone 4: Interactive Dual-Pane UI",
        tasks: ["Build split-screen React view with PDF viewer on left and Q&A chat on right", "Add click-to-highlight jumping between citation badge and PDF canvas"]
      },
      {
        id: "m5",
        title: "Milestone 5: Deployment & GitHub Polish",
        tasks: ["Deploy backend to Render and frontend to Vercel", "Document architecture and write PyTest retrieval precision tests"]
      }
    ],
    resumeBullets: [
      "Built section-aware Research Paper Intelligence platform in FastAPI and React with exact PDF bounding-box citation grounding.",
      "Engineered layout-aware PDF parser and local FAISS vector search, achieving sub-100ms retrieval without heavy cloud infrastructure.",
      "Constructed interactive dual-pane document visualizer with synchronized citation navigation and BibTeX export."
    ]
  },

  // ── 2. FULL-STACK & DISTRIBUTED SYSTEMS ──
  {
    id: "pv-distributed-code-judge",
    title: "Distributed Real-Time Code Execution Judge",
    tagline: "Microservices-based code sandbox executing untrusted code with resource isolation.",
    domain: "fullstack",
    domainLabel: "Full-Stack & Backend",
    targetRoles: ["fullstack_engineer", "backend_systems"],
    tier: "recommended",
    difficulty: "Intermediate–Advanced",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
    estimatedWeeks: "4–6 weeks",
    estimatedHours: "45–55 hours",
    estimatedCost: "₹0 (Docker on local machine / Free cloud tier)",
    potentialImpactScore: 95,
    skillsDemonstrated: ["Node.js / Express", "Docker / Linux cgroups", "Redis Task Queues", "WebSockets", "React + Monaco Editor", "System Security"],
    problemStatement: "Most student project web apps have standard CRUD operations (To-Do list, eCommerce clones). Employers want to see systems that handle untrusted compute, concurrent queues, memory limits, and real-time execution feedback.",
    solutionOverview: "A production-pattern online code judge supporting Python, JavaScript, and C++. Submissions are placed on a Redis queue, picked up by isolated worker sandboxes enforcing strict memory and CPU timeouts, and streamed back over WebSockets.",
    differentiation: [
      "Isolated containerized sandbox preventing filesystem escapes and infinite loop freezes",
      "Redis job queue with BullMQ supporting concurrent worker scaling",
      "Monaco editor interface with test case execution status (Passed, TLE, MLE, Runtime Error)"
    ],
    architecture: {
      frontend: "React + Monaco Editor + Tailwind CSS + WebSocket Client",
      apiGateway: "Node.js / Express API routing submissions and authentication",
      queue: "Redis with BullMQ for reliable FIFO job distribution",
      executionWorkers: "Worker processes managing ephemeral Docker / gVisor sandboxes with strict cgroup limits (50MB RAM, 2s CPU timeout)",
      database: "PostgreSQL with Prisma for submission records and problem statements"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Isolated Code Runner Engine",
        tasks: [
          "Create hardened Docker execution container with non-root user and disabled network access",
          "Implement execution wrapper enforcing memory (50MB) and CPU timeout (2000ms)",
          "Verify security isolation against fork bombs and malicious system calls"
        ]
      },
      {
        id: "m2",
        title: "Milestone 2: Distributed Queue & Worker Pipeline",
        tasks: [
          "Set up Redis BullMQ queue distributing submission jobs to concurrent worker processes",
          "Capture stdout, stderr, execution time, and memory usage",
          "Classify verdicts: Accepted (AC), Time Limit Exceeded (TLE), Memory Limit Exceeded (MLE)"
        ]
      },
      {
        id: "m3",
        title: "Milestone 3: Real-Time WebSocket Streaming",
        tasks: [
          "Implement WebSocket gateway streaming live progress (Queued -> Running -> Test 1/4 -> Completed)",
          "Build Monaco Code Editor frontend with language switching and starter boilerplates",
          "Add testcase runner view showing input, expected output, and actual output diff"
        ]
      },
      {
        id: "m4",
        title: "Milestone 4: Problem Bank & Rate Limiting",
        tasks: [
          "Create PostgreSQL schema for problems, test cases, and student submissions",
          "Add sliding-window rate limiter preventing submission spamming",
          "Implement submission history view with execution time graphs"
        ]
      },
      {
        id: "m5",
        title: "Milestone 5: Load Testing & Architecture Writeup",
        tasks: [
          "Execute k6 load test simulating 50 concurrent code submissions",
          "Document system architecture diagram and security mitigation strategies in README",
          "Deploy web tier to Vercel/Render and worker infrastructure with Docker Compose"
        ]
      }
    ],
    resumeBullets: [
      "Architected distributed online code judge in Node.js, Docker, and Redis handling concurrent code execution across Python, C++, and JavaScript.",
      "Engineered sandboxed worker environments with Linux cgroup constraints (50MB RAM, 2s timeout), securing host systems against malicious payloads.",
      "Implemented real-time WebSocket communication and BullMQ job queues, maintaining <400ms round-trip latency under 50 concurrent requests."
    ]
  },
  {
    id: "pv-multi-tenant-collaboration",
    title: "Real-Time Collaborative Document Canvas with CRDTs",
    tagline: "Conflict-free collaborative editor supporting offline editing, presence, and revision histories.",
    domain: "fullstack",
    domainLabel: "Full-Stack & Systems",
    targetRoles: ["fullstack_engineer", "frontend_architect"],
    tier: "ambitious",
    difficulty: "Advanced",
    difficultyColor: "text-rose-700 bg-rose-50 border-rose-200",
    estimatedWeeks: "7–9 weeks",
    estimatedHours: "70–80 hours",
    estimatedCost: "₹0 (Free Tier)",
    potentialImpactScore: 97,
    skillsDemonstrated: ["CRDTs (Yjs)", "WebSockets", "React / TypeScript", "IndexedDB", "Concurrency", "Awareness Protocol"],
    problemStatement: "Most apps lose changes during disconnections or require continuous database locking. Modern software like Google Docs, Figma, and Notion rely on Conflict-Free Replicated Data Types (CRDTs).",
    solutionOverview: "A peer-collaborative rich-text and block canvas where multiple users type concurrently. Changes are merged mathematically without conflicts using Yjs, synced over WebSockets, and cached locally in IndexedDB for full offline resilience.",
    differentiation: [
      "True offline-first: write notes on a plane, reconnect to WiFi, and merge seamlessly without losing edits",
      "Live multi-cursor awareness showing user avatars, carets, and active selection ranges",
      "Time-travel slider allowing replay of document evolution keystroke by keystroke"
    ],
    architecture: {
      frontend: "React + TypeScript + Tiptap/ProseMirror + Yjs + Tailwind",
      syncServer: "Node.js WebSocket server (y-websocket) with room-based multiplexing",
      persistence: "IndexedDB on client for zero-latency local edits; PostgreSQL / LevelDB on server",
      stateModel: "Conflict-free Replicated Data Type (CRDT) state vectors"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Yjs & ProseMirror Core Integration",
        tasks: ["Initialize React + TypeScript project with Tiptap editor", "Bind Yjs document state to local editor buffer"]
      },
      {
        id: "m2",
        title: "Milestone 2: Real-Time WebSocket Synchronization",
        tasks: ["Set up Node.js WebSocket room server propagating Yjs updates", "Verify two browser tabs converge on identical content with concurrent typing"]
      },
      {
        id: "m3",
        title: "Milestone 3: User Presence & Multi-Cursor Avatars",
        tasks: ["Implement Yjs awareness protocol broadcasting cursor positions and colors", "Render live user avatars with real-time selection highlights"]
      },
      {
        id: "m4",
        title: "Milestone 4: Offline Resilience with IndexedDB",
        tasks: ["Persist Yjs state vector to browser IndexedDB", "Test offline mode: disconnect network, type 50 words, reconnect, and verify clean auto-merge"]
      },
      {
        id: "m5",
        title: "Milestone 5: Time Travel Replay & Deployment",
        tasks: ["Build document version history scrubber replaying state snapshots", "Deploy sync server to Render/Fly.io and frontend to Cloudflare Pages"]
      }
    ],
    resumeBullets: [
      "Engineered real-time collaborative document platform using Yjs CRDTs and WebSockets, enabling conflict-free multi-user editing with zero data loss.",
      "Implemented client-side persistence with IndexedDB, supporting seamless offline document manipulation with automatic reconciliation on reconnect.",
      "Developed live user presence protocol with sub-30ms cursor position broadcasting and revision history scrubbing."
    ]
  },
  {
    id: "pv-api-rate-limit-gateway",
    title: "High-Throughput API Gateway & Dynamic Rate Limiter",
    tagline: "Token-bucket reverse proxy with JWT authentication and telemetry metrics.",
    domain: "fullstack",
    domainLabel: "Backend & Systems",
    targetRoles: ["backend_systems", "cloud_devops"],
    tier: "starter",
    difficulty: "Beginner–Intermediate",
    difficultyColor: "text-blue-700 bg-blue-50 border-blue-200",
    estimatedWeeks: "2–3 weeks",
    estimatedHours: "20–25 hours",
    estimatedCost: "₹0 (Redis + Node.js/Go)",
    potentialImpactScore: 88,
    skillsDemonstrated: ["Node.js / Go", "Redis", "Rate Limiting Algorithms", "Reverse Proxy", "JWT Auth", "Prometheus Metrics"],
    problemStatement: "Web servers crash when hit by sudden traffic spikes or scraping bots. Building a dedicated gateway teaches fundamental networking, caching, and concurrency concepts.",
    solutionOverview: "A reverse proxy that intercepts client requests, checks token bucket and sliding-window limits in Redis, validates JWT credentials, and forwards permitted traffic to backend microservices.",
    differentiation: [
      "Implements both Sliding Window Counter and Token Bucket algorithms with Redis Lua scripts",
      "Dynamic tier limits (Free tier: 10 req/min; Pro tier: 100 req/min; Internal: Unlimited)",
      "Exposes Prometheus `/metrics` endpoint with latency histograms and 429 response counters"
    ],
    architecture: {
      gateway: "Node.js / Express or Go HTTP reverse proxy",
      cache: "Redis with atomic Lua scripts for zero race conditions",
      telemetry: "Prometheus exporter + Grafana / web visualizer",
      downstream: "Mock downstream services simulating variable response latencies"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Reverse Proxy Routing Core",
        tasks: ["Build HTTP reverse proxy forwarding requests to downstream services", "Add request-id tracing header to every inbound request"]
      },
      {
        id: "m2",
        title: "Milestone 2: Atomic Rate Limiter with Redis",
        tasks: ["Write atomic Redis Lua script implementing sliding-window rate limiting", "Return standard rate-limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`"]
      },
      {
        id: "m3",
        title: "Milestone 3: JWT Verification & Tier Management",
        tasks: ["Add JWT middleware extracting user tiers (Free vs Premium)", "Apply configurable per-tier quotas with custom 429 Too Many Requests payloads"]
      },
      {
        id: "m4",
        title: "Milestone 4: Telemetry & Web Analytics",
        tasks: ["Collect latency metrics and request counts", "Build clean admin dashboard inspecting live request rates and blocked IPs"]
      },
      {
        id: "m5",
        title: "Milestone 5: Benchmark & Documentation",
        tasks: ["Run Apache Bench (ab) or autocannon measuring 2,000 req/sec throughput", "Publish comprehensive README with architecture diagram"]
      }
    ],
    resumeBullets: [
      "Engineered high-throughput API Gateway in Node.js and Redis utilizing atomic Lua scripts for sliding-window rate limiting.",
      "Implemented JWT authentication with tiered rate quotas, defending microservices against traffic spikes and DoS attempts.",
      "Benchmarked gateway processing over 1,800 requests/second with <12ms overhead and real-time Prometheus telemetry."
    ]
  },

  // ── 3. CLOUD & DEVOPS ──
  {
    id: "pv-ephemeral-preview-cloud",
    title: "Automated Pull Request Preview Environment Orchestrator",
    tagline: "Lightweight preview environment system spinning up isolated container deployments for GitHub PRs.",
    domain: "cloud_devops",
    domainLabel: "Cloud & DevOps",
    targetRoles: ["cloud_devops", "backend_systems"],
    tier: "recommended",
    difficulty: "Intermediate–Advanced",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
    estimatedWeeks: "4–6 weeks",
    estimatedHours: "45–55 hours",
    estimatedCost: "₹0 (Docker on local VPS / Minikube / Free cloud)",
    potentialImpactScore: 96,
    skillsDemonstrated: ["Docker API", "GitHub Webhooks", "Reverse Proxy (Traefik / Nginx)", "Linux / Bash", "TTL Garbage Collection", "Node.js / Go"],
    problemStatement: "Engineering teams need to test PRs before merging, but hosted preview environments (like Vercel for backend or full stacks) are expensive or complex to self-host.",
    solutionOverview: "A self-hosted orchestrator listening to GitHub Pull Request webhooks. When a PR is opened, it clones the branch, builds Docker containers, provisions a unique subdomain (`pr-42.preview.lumixora.internal`), and comments back on GitHub. When closed, it deletes the containers.",
    differentiation: [
      "Custom dynamic subdomain routing via Traefik / Caddy API without restarting proxies",
      "Automatic TTL reaper that shuts down idle preview environments after 2 hours to save resources",
      "GitHub bot integration automatically posting preview links and build logs directly to PR conversations"
    ],
    architecture: {
      orchestrator: "Node.js / Go daemon interacting with Docker Engine API via socket",
      ingress: "Traefik or Caddy with dynamic routing provider",
      webhook: "GitHub App / Webhook listener with secret HMAC verification",
      storage: "SQLite for PR state, container IDs, and TTL timestamps"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Webhook Ingestion & Security",
        tasks: ["Set up HMAC-SHA256 verified GitHub webhook listener", "Parse pull_request opened, synchronize, and closed events"]
      },
      {
        id: "m2",
        title: "Milestone 2: Docker Engine Provisioning Daemon",
        tasks: ["Connect to Docker socket (`/var/run/docker.sock`) to programmatically build and start containers", "Assign dynamic ports and custom labels for ingress routing"]
      },
      {
        id: "m3",
        title: "Milestone 3: Dynamic Ingress Subdomain Routing",
        tasks: ["Configure Traefik dynamic configuration provider", "Route `pr-{number}.example.com` to the designated container port without downtime"]
      },
      {
        id: "m4",
        title: "Milestone 4: GitHub PR Status Bot & TTL Garbage Collection",
        tasks: ["Use Octokit to post status comment with live preview URL on GitHub PR", "Implement automated cron reaper stopping containers inactive for >120 minutes"]
      },
      {
        id: "m5",
        title: "Milestone 5: Web Management Dashboard & Tests",
        tasks: ["Build web view listing all active preview environments with logs and manual teardown", "Write integration test suite simulating full PR lifecycle from open to merge"]
      }
    ],
    resumeBullets: [
      "Engineered automated Pull Request Preview environment orchestrator using Docker API and GitHub Webhooks, provisioning isolated staging environments in <45s.",
      "Configured dynamic reverse proxy routing with Traefik, providing isolated preview subdomains with automated TLS certificates.",
      "Implemented automated TTL garbage collection and Octokit bot integration, reducing staging compute costs by 65%."
    ]
  },

  // ── 4. DATA ENGINEERING ──
  {
    id: "pv-realtime-cdc-stream",
    title: "Real-Time Change Data Capture (CDC) Lakehouse Pipeline",
    tagline: "Zero-loss event streaming pipeline replicating transactional database changes to an analytical store.",
    domain: "data_engineering",
    domainLabel: "Data Engineering",
    targetRoles: ["data_engineer", "backend_systems"],
    tier: "recommended",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
    estimatedWeeks: "4–5 weeks",
    estimatedHours: "40–48 hours",
    estimatedCost: "₹0 (Docker Compose / Local Kafka)",
    potentialImpactScore: 93,
    skillsDemonstrated: ["PostgreSQL WAL", "Apache Kafka / Redpanda", "Debezium", "DuckDB / ClickHouse", "Python / SQL", "Streamlit"],
    problemStatement: "Traditional batch ETL runs nightly, leaving analytics 24 hours stale. Industry data platforms require continuous Change Data Capture (CDC) streaming to analytical stores.",
    solutionOverview: "Streams row-level database changes (INSERT, UPDATE, DELETE) directly from PostgreSQL's Write-Ahead Log (WAL) via Debezium into a Kafka topic, and materializes them into ClickHouse or DuckDB for sub-second analytical querying.",
    differentiation: [
      "True zero-impact database capture reading binary WAL logs without table polling queries",
      "Handles out-of-order events with event-timestamp deduplication logic in Python",
      "Interactive Streamlit dashboard displaying live streaming metrics and schema evolution"
    ],
    architecture: {
      sourceDb: "PostgreSQL with `wal_level=logical` enabled",
      cdcConnector: "Debezium CDC Connector / Kafka Connect",
      messageBus: "Redpanda / Apache Kafka for distributed event streaming",
      sinkDb: "DuckDB / ClickHouse for columnar analytical aggregation",
      monitoring: "Python consumer calculating end-to-end replication lag in milliseconds"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: PostgreSQL Logical Replication Setup",
        tasks: ["Configure PostgreSQL with logical decoding", "Create transactional eCommerce schema (Orders, Customers, OrderItems)"]
      },
      {
        id: "m2",
        title: "Milestone 2: Debezium & Kafka Event Stream",
        tasks: ["Deploy Debezium connector monitoring Postgres WAL", "Stream JSON change events with before/after payloads to Kafka topic"]
      },
      {
        id: "m3",
        title: "Milestone 3: Analytical Lakehouse Sink Consumer",
        tasks: ["Build Python consumer streaming events into ClickHouse / DuckDB", "Implement upsert logic handling out-of-order updates gracefully"]
      },
      {
        id: "m4",
        title: "Milestone 4: Latency & Data Integrity Verification",
        tasks: ["Benchmark end-to-end replication lag under 1,000 simulated transactions", "Write reconciliation script proving zero row discrepancies between source and sink"]
      },
      {
        id: "m5",
        title: "Milestone 5: Visual Dashboard & Documentation",
        tasks: ["Build Streamlit / React dashboard showing live orders and real-time revenue analytics", "Document complete architecture diagram and pipeline setup instructions"]
      }
    ],
    resumeBullets: [
      "Built real-time Change Data Capture (CDC) streaming pipeline from PostgreSQL WAL logs to DuckDB analytical sink using Debezium and Kafka.",
      "Engineered idempotent Python consumer handling schema evolution, out-of-order events, and sub-250ms end-to-end data latency.",
      "Developed automated reconciliation test suite validating zero data loss across 10,000 simulated concurrent transactions."
    ]
  },

  // ── 5. CYBERSECURITY ──
  {
    id: "pv-zero-trust-access-proxy",
    title: "Zero-Trust Identity-Aware Microservice Access Proxy",
    tagline: "Cryptographic micro-segmentation proxy validating device health, identity tokens, and RBAC policies.",
    domain: "security",
    domainLabel: "Cybersecurity & Infrastructure",
    targetRoles: ["cybersecurity_engineer", "cloud_devops"],
    tier: "ambitious",
    difficulty: "Advanced",
    difficultyColor: "text-rose-700 bg-rose-50 border-rose-200",
    estimatedWeeks: "7–9 weeks",
    estimatedHours: "70–80 hours",
    estimatedCost: "₹0 (Open-Source / Go / Docker)",
    potentialImpactScore: 97,
    skillsDemonstrated: ["mTLS", "Go / Python", "OIDC / OAuth 2.0", "Zero-Trust Architecture", "eBPF / Reverse Proxy", "Audit Logging"],
    problemStatement: "Internal corporate networks used to trust everything behind the VPN. Modern zero-trust architecture assumes the network is compromised and validates identity, context, and role on every single request.",
    solutionOverview: "A lightweight reverse proxy sitting in front of internal web services. It intercepts requests, validates OIDC identity tokens, enforces fine-grained attribute-based access control (ABAC) policies, and establishes mutual TLS (mTLS) upstream.",
    differentiation: [
      "No perimeter trust: validates signed JWT and device posture header on every request",
      "Tamper-proof structured audit log signed with Ed25519 cryptographic signatures",
      "Centralized policy file written in YAML with instant hot-reloading without service restarts"
    ],
    architecture: {
      proxyCore: "Go or Python AsyncIO reverse proxy with TLS termination",
      authProvider: "OIDC / Google OAuth integration with token verification",
      policyEngine: "Open Policy Agent (OPA) or custom lightweight Rego evaluator",
      logging: "Cryptographically signed JSON audit logs to SQLite / Elastic"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: TLS Termination & Reverse Proxy Core",
        tasks: ["Build high-performance HTTP reverse proxy terminating TLS", "Implement mTLS upstream communication with internal services"]
      },
      {
        id: "m2",
        title: "Milestone 2: Identity & OIDC Token Validation",
        tasks: ["Integrate Google/GitHub OIDC token verification with JWKS public key caching", "Extract user identity, email, and group claims"]
      },
      {
        id: "m3",
        title: "Milestone 3: Attribute-Based Policy Engine (ABAC)",
        tasks: ["Design YAML policy rules: e.g. `/admin/*` requires role `finance` and IP subnet", "Implement sub-millisecond policy evaluation engine"]
      },
      {
        id: "m4",
        title: "Milestone 4: Signed Audit Trail & Security Hardening",
        tasks: ["Sign every audit log entry with Ed25519 private key preventing tampering", "Block OWASP Top 10 injection attempts (SQLi, path traversal) at proxy level"]
      },
      {
        id: "m5",
        title: "Milestone 5: Demonstration Lab & Security Report",
        tasks: ["Package testbed lab with 3 microservices and automated attack simulation scripts", "Author detailed Security Architecture Review document in GitHub repo"]
      }
    ],
    resumeBullets: [
      "Architected Zero-Trust Identity-Aware Access Proxy in Go enforcing attribute-based access control (ABAC) and mTLS across microservices.",
      "Integrated OIDC authentication with JWKS caching and cryptographic Ed25519 audit logging, reducing unauthorized access surface by 100%.",
      "Benchmarked policy evaluation latency at <3ms per request with automated OWASP vulnerability protection."
    ]
  },

  // ── 6. MOBILE & CLIENT ──
  {
    id: "pv-offline-health-sync",
    title: "Offline-First Health & Vitals App with Bi-Directional Sync",
    tagline: "Resilient mobile app with conflict resolution, biometric security, and background delta sync.",
    domain: "mobile",
    domainLabel: "Mobile & Full-Stack",
    targetRoles: ["mobile_engineer", "fullstack_engineer"],
    tier: "recommended",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-200",
    estimatedWeeks: "4–6 weeks",
    estimatedHours: "40–50 hours",
    estimatedCost: "₹0 (React Native / Flutter + Firebase)",
    potentialImpactScore: 92,
    skillsDemonstrated: ["React Native / Flutter", "SQLite / WatermelonDB", "Offline-First Sync", "Conflict Resolution", "Biometric Auth", "TypeScript"],
    problemStatement: "Healthcare apps used in clinics or rural areas lose critical patient vitals during connectivity blackouts. Building an offline-first app requires mastering local databases and complex sync reconciliation.",
    solutionOverview: "A mobile health logger where clinic staff record vitals offline with immediate sub-10ms UI response. When online, a background sync engine reconciles state with a remote server using a vector timestamp algorithm.",
    differentiation: [
      "Zero loading spinners: UI reads and writes exclusively to local SQLite for instant feel",
      "Three-way merge conflict resolution for concurrent updates on multiple devices",
      "Encrypted SQLite storage using SQLCipher protecting sensitive patient data at rest"
    ],
    architecture: {
      client: "React Native (Expo) + TypeScript + WatermelonDB / SQLite",
      security: "Biometric authentication (FaceID / Fingerprint) + SQLCipher AES-256",
      backend: "Node.js REST API + PostgreSQL with change revision tracking tables",
      syncEngine: "Last-write-wins with manual conflict review fallback"
    },
    milestones: [
      {
        id: "m1",
        title: "Milestone 1: Local Encrypted Database Architecture",
        tasks: ["Set up React Native app with SQLite local schema for Patients and Vitals", "Implement AES-256 encryption at rest"]
      },
      {
        id: "m2",
        title: "Milestone 2: Instant-Response Offline UI",
        tasks: ["Build patient vitals entry forms (Blood Pressure, Heart Rate, Glucose, Notes)", "Verify zero network dependency for viewing and saving patient records"]
      },
      {
        id: "m3",
        title: "Milestone 3: Sync Protocol & Delta Ingestion",
        tasks: ["Design delta-sync backend endpoint accepting changes since last sync timestamp", "Implement background sync queue with retry backoff on reconnection"]
      },
      {
        id: "m4",
        title: "Milestone 4: Conflict Resolution & Edge Testing",
        tasks: ["Simulate concurrent edits from 2 offline devices on the same patient", "Build visual Conflict Resolution dialog letting doctor choose winning record"]
      },
      {
        id: "m5",
        title: "Milestone 5: Video Demo & Architecture Documentation",
        tasks: ["Record video demonstrating offline mode flight mode test, vitals entry, and seamless auto-sync", "Publish clean repository with testing guidelines"]
      }
    ],
    resumeBullets: [
      "Developed offline-first mobile healthcare application in React Native and SQLite with local AES-256 encryption.",
      "Engineered bi-directional delta synchronization engine with conflict resolution algorithms, enabling zero-latency clinical data recording in low-connectivity areas.",
      "Implemented biometric authentication and background sync workers with 99.4% data reconciliation accuracy."
    ]
  }
];

// Calculate transparent 100-point score based on student's actual submitted evidence
export function calculateResumeImpactScore(project, evidence = {}, rubric = SCORING_RUBRIC) {
  if (!project) return { potentialScore: 0, verifiedScore: 0, breakdown: {}, verifiedBreakdown: {} };

  const potentialBreakdown = {};
  const verifiedBreakdown = {};

  let potentialTotal = 0;
  let verifiedTotal = 0;

  // 1. Role Relevance (25%)
  const hasCoreTech = Boolean(evidence.githubUrl || evidence.claimedCoreTech);
  const relevancePoints = hasCoreTech ? 95 : 70;
  potentialBreakdown.roleRelevance = 95;
  verifiedBreakdown.roleRelevance = evidence.githubUrl ? 95 : 30;

  // 2. Technical Depth (20%)
  const hasArchitecture = Boolean(evidence.architectureDiagramUrl || evidence.hasDetailedArch);
  potentialBreakdown.technicalDepth = 92;
  verifiedBreakdown.technicalDepth = (hasArchitecture ? 45 : 0) + (evidence.testSuiteResults ? 45 : 0);

  // 3. Working Implementation (20%)
  const hasLiveDemo = Boolean(evidence.liveDemoUrl && evidence.liveDemoUrl.startsWith("http"));
  const hasTests = Boolean(evidence.testSuiteResults && evidence.testSuiteResults.testsCount > 0);
  potentialBreakdown.workingImplementation = 95;
  verifiedBreakdown.workingImplementation = (hasLiveDemo ? 50 : 0) + (hasTests ? 45 : 0);

  // 4. Originality (15%)
  const hasDifferentiated = Boolean(evidence.differentiatedFeatures && evidence.differentiatedFeatures.length > 0);
  potentialBreakdown.originality = 90;
  verifiedBreakdown.originality = hasDifferentiated ? 85 : 40;

  // 5. Measurable Impact (10%)
  const hasMetrics = Boolean(evidence.measuredMetricValue && evidence.measuredMetricValue.trim().length > 0);
  potentialBreakdown.measurableImpact = 88;
  verifiedBreakdown.measurableImpact = hasMetrics ? 90 : 0;

  // 6. Proof & Documentation (10%)
  const hasReadme = Boolean(evidence.githubUrl);
  const hasVideo = Boolean(evidence.demoVideoUrl && evidence.demoVideoUrl.startsWith("http"));
  potentialBreakdown.proofDocumentation = 95;
  verifiedBreakdown.proofDocumentation = (hasReadme ? 50 : 0) + (hasVideo ? 45 : 0);

  // Weighted sums
  Object.keys(rubric).forEach((key) => {
    const weight = rubric[key].weight;
    potentialTotal += (potentialBreakdown[key] || 0) * weight;
    verifiedTotal += (verifiedBreakdown[key] || 0) * weight;
  });

  return {
    potentialScore: Math.round(potentialTotal * 10) / 10,
    verifiedScore: Math.round(verifiedTotal * 10) / 10,
    potentialBreakdown,
    verifiedBreakdown
  };
}

// Generate Personalized Project Recommendations based on Student Profile
export function getPersonalizedRecommendations(studentProfile, catalogue = PROJECT_CATALOGUE) {
  const targetRole = studentProfile?.targetRole || "ai_engineer";
  const currentSkills = (studentProfile?.skills || []).map(s => s.toLowerCase().trim());
  const hoursPerWeek = Number(studentProfile?.availableHours || 10);
  const experienceLevel = studentProfile?.experienceLevel || "Intermediate";

  // Filter or score catalogue projects
  const roleProjects = catalogue.filter(p => p.targetRoles.includes(targetRole));
  const pool = roleProjects.length >= 3 ? roleProjects : catalogue;

  // Identify Starter, Recommended, and Ambitious options
  let starter = pool.find(p => p.tier === "starter");
  let recommended = pool.find(p => p.tier === "recommended");
  let ambitious = pool.find(p => p.tier === "ambitious");

  // Fallbacks if tier missing in filtered pool
  if (!starter) starter = catalogue.find(p => p.tier === "starter") || catalogue[2];
  if (!recommended) recommended = catalogue.find(p => p.tier === "recommended") || catalogue[0];
  if (!ambitious) ambitious = catalogue.find(p => p.tier === "ambitious") || catalogue[1];

  // Adjust estimated duration dynamically based on student available hours
  const adjustWeeks = (p) => {
    const baseHours = p.estimatedHours ? parseInt(p.estimatedHours.split("-")[0]) || 40 : 40;
    const weeksNeeded = Math.max(2, Math.ceil(baseHours / Math.max(5, hoursPerWeek)));
    return `${weeksNeeded}–${weeksNeeded + 2} weeks (${hoursPerWeek} hrs/wk)`;
  };

  return {
    starter: { ...starter, dynamicDuration: adjustWeeks(starter) },
    recommended: { ...recommended, dynamicDuration: adjustWeeks(recommended) },
    ambitious: { ...ambitious, dynamicDuration: adjustWeeks(ambitious) }
  };
}

// Skill Gap Analysis: compares student's current skills against target role requirements
export function analyzeSkillGap(studentSkills = [], targetRoleId = "ai_engineer") {
  const role = TARGET_CAREER_ROLES.find(r => r.id === targetRoleId) || TARGET_CAREER_ROLES[0];
  const normalizedStudentSkills = studentSkills.map(s => s.toLowerCase().trim());

  const acquired = [];
  const missing = [];

  role.keySkills.forEach(skill => {
    const isAcquired = normalizedStudentSkills.some(s => 
      s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
    );
    if (isAcquired) {
      acquired.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const readinessPercent = role.keySkills.length > 0
    ? Math.round((acquired.length / role.keySkills.length) * 100)
    : 50;

  return {
    targetRole: role.title,
    readinessPercent,
    acquiredSkills: acquired,
    missingSkills: missing,
    totalRequired: role.keySkills.length
  };
}

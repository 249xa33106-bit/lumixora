export const BRANCHES = [
  { id: 'CSE', name: 'Computer Science & Engineering', icon: '💻', color: 'from-cyan-500 to-blue-600' },
  { id: 'CSM', name: 'CSE (AI & Machine Learning)', icon: '🤖', color: 'from-purple-500 to-indigo-600' },
  { id: 'ECE', name: 'Electronics & Communication', icon: '⚡', color: 'from-amber-500 to-orange-600' },
  { id: 'EEE', name: 'Electrical & Electronics', icon: '💡', color: 'from-yellow-500 to-amber-600' },
  { id: 'Civil', name: 'Civil Engineering', icon: '🏗️', color: 'from-emerald-500 to-teal-600' },
  { id: 'Mechanical', name: 'Mechanical Engineering', icon: '⚙️', color: 'from-rose-500 to-red-600' },
];

export const SEMESTERS = [
  'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'
];

export const INITIAL_SYLLABUS_VIDEOS = [
  // =========================================================================
  // --- 1.1 MANAGERIAL ECONOMICS AND FINANCIAL ANALYSIS (MEFA) ---
  // Scheme: 2023 | Code: HSM 202 | Category: BS&H | Credits: 2
  // Common to CSE, CSB, CE, ECE & EEE
  // =========================================================================
  {
  "id": "common-sem3-hsm202-mefa",
  "branch": "CSE",
  "branchesApplicable": [
    "CSE",
    "CSM",
    "ECE",
    "EEE",
    "Civil",
    "Mechanical"
  ],
  "semester": "Sem 3",
  "semestersApplicable": [
    "Sem 3",
    "Sem 4"
  ],
  "subjectCode": "HSM 202",
  "subjectName": "Managerial Economics and Financial Analysis (MEFA)",
  "credits": 2,
  "scheme": "2023 Scheme",
  "category": "BS&H",
  "description": "Managerial Economics, Demand Analysis, Elasticity of Demand, Production & Cost Functions, Break-Even Analysis (BEA), Market Structures (Monopoly, Oligopoly, Perfect Competition), Capital Budgeting (NPV, IRR, Payback), Double-Entry Accounting, Final Accounts & Financial Ratio Analysis.",
  "thumbnail": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000",
  "oneShotVideo": {
    "title": "Managerial Economics and Financial Analysis (MEFA) Complete Playlist & Masterclass",
    "channel": "Devika's Commerce & Management Academy",
    "url": "https://www.youtube.com/watch?v=356_pioFiss",
    "duration": "4h 30m",
    "views": "780K"
  },
  "playlistUrl": "https://www.youtube.com/playlist?list=PLLhSIFfDZcUW8eZFwPrZjj_TBdelHfHho",
  "units": [
    {
      "unitNumber": 1,
      "unitTitle": "UNIT I: Managerial Economics and Demand Analysis",
      "description": "Introduction – Meaning, Nature & Scope and Uses of Managerial Economics, Role of Managerial Economist. Demand – Concepts, Law of Demand, Exceptions of Law of Demand, Law of Diminishing Marginal Utility, Indifference Curve. Elasticity of Demand – Types, Measurement and Significance.",
      "videos": [
        {
          "id": "v-mefa-u1-1",
          "title": "Meaning, Nature, Scope & Significance of Managerial Economics & Role of Managerial Economist",
          "channel": "Devika's Commerce Academy",
          "duration": "18:45",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Fundamental concepts of Managerial Economics, integration of economic theory with business practices, and responsibilities of a managerial economist."
        },
        {
          "id": "v-mefa-u1-2",
          "title": "Demand Analysis: Law of Demand, Demand Schedule & Exceptions to Law of Demand",
          "channel": "Devika's Commerce Academy",
          "duration": "16:20",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Demand function, determinants of demand, graphical representation of demand curves, and Giffen goods / Veblen goods exceptions."
        },
        {
          "id": "v-mefa-u1-3",
          "title": "Law of Diminishing Marginal Utility & Indifference Curve Analysis",
          "channel": "Devika's Commerce Academy",
          "duration": "22:10",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Assumptions, tabular schedule, marginal rate of substitution (MRS), consumer equilibrium, and properties of indifference curves."
        },
        {
          "id": "v-mefa-u1-4",
          "title": "Elasticity of Demand: Price, Income, Cross Elasticity & Measurement Methods",
          "channel": "Devika's Commerce Academy",
          "duration": "24:30",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Degrees of elasticity (perfectly elastic, inelastic, unitary), percentage method, point elasticity, total outlay method, and business significance."
        }
      ]
    },
    {
      "unitNumber": 2,
      "unitTitle": "UNIT II: Production and Cost Analysis",
      "description": "Introduction – Production Function – Meaning, Features and types. Short run and long run Production Function, Isoquants and Isocosts, Least-cost combination. Cost – Cost concepts and Cost behaviour in Short-run and Long-run. Break-Even Analysis (BEA) – Determination of Break-Even Point (Simple Problems).",
      "videos": [
        {
          "id": "v-mefa-u2-1",
          "title": "Production Function: Short-Run vs Long-Run & Law of Variable Proportions",
          "channel": "Devika's Commerce Academy",
          "duration": "20:15",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Total Product (TP), Marginal Product (MP), Average Product (AP) with 3 stages of production and returns to scale."
        },
        {
          "id": "v-mefa-u2-2",
          "title": "Isoquants, Isocost Lines, MRTS & Least-Cost Factor Combination",
          "channel": "Devika's Commerce Academy",
          "duration": "18:50",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Marginal Rate of Technical Substitution (MRTS), producer equilibrium tangent condition, and expansion path."
        },
        {
          "id": "v-mefa-u2-3",
          "title": "Cost Concepts & Short-Run / Long-Run Cost Curves (FC, VC, TC, MC, AC)",
          "channel": "Devika's Commerce Academy",
          "duration": "25:40",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Explicit vs implicit costs, opportunity costs, fixed vs variable costs, U-shaped short-run curves, and envelope long-run average cost (LAC)."
        },
        {
          "id": "v-mefa-u2-4",
          "title": "Break-Even Analysis (BEA): BEP Formula, P/V Ratio, Margin of Safety & Numerical Problems",
          "channel": "Devika's Commerce Academy",
          "duration": "28:30",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Break-even chart, BEP in units and rupees, profit-volume ratio calculations, margin of safety formulas with solved semester exam problems."
        }
      ]
    },
    {
      "unitNumber": 3,
      "unitTitle": "UNIT III: Business Organizations and Markets",
      "description": "Introduction – Forms of Business Organizations – Sole Proprietary - Partnership - Joint Stock Companies. Types of Markets - Perfect and Imperfect Markets; Features of Perfect Competition, Monopoly, Monopolistic and Oligopoly; Price-Output Determination under Perfect and Monopoly.",
      "videos": [
        {
          "id": "v-mefa-u3-1",
          "title": "Forms of Business Organizations: Sole Proprietorship, Partnership & Joint Stock Companies",
          "channel": "Devika's Commerce Academy",
          "duration": "21:10",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Features, advantages, limitations, liability comparison, and company incorporation process (Memorandum & Articles of Association)."
        },
        {
          "id": "v-mefa-u3-2",
          "title": "Market Structures Classification: Perfect Competition vs Imperfect Competition Markets",
          "channel": "Devika's Commerce Academy",
          "duration": "17:30",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Number of buyers/sellers, product differentiation, barriers to entry, pricing power across market models."
        },
        {
          "id": "v-mefa-u3-3",
          "title": "Monopoly, Monopolistic Competition, Duopoly & Oligopoly (Kinked Demand Curve)",
          "channel": "Devika's Commerce Academy",
          "duration": "23:45",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Characteristics, price leadership, non-price competition, Paul Sweezy kinked demand curve in oligopoly."
        },
        {
          "id": "v-mefa-u3-4",
          "title": "Price-Output Determination under Perfect Competition and Monopoly Equilibrium",
          "channel": "Devika's Commerce Academy",
          "duration": "26:15",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "MR = MC equilibrium condition, supernormal profits, normal profits and subnormal losses in short-run and long-run."
        }
      ]
    },
    {
      "unitNumber": 4,
      "unitTitle": "UNIT IV: Capital and its Significance & Capital Budgeting",
      "description": "Capital and its Significance: Types of Capital, Estimation of fixed and working capital requirements, Methods and sources of raising fixed and working capital. Capital Budgeting: Meaning, Significance and Complications involved in Capital Budgeting decisions, Methods of Capital Budgeting - Traditional Methods (Payback period, ARR), Discounted Cash flow methods (NPV, IRR, PI with Simple Problems).",
      "videos": [
        {
          "id": "v-mefa-u4-1",
          "title": "Capital & Working Capital: Classification, Estimation of Requirements & Sources of Finance",
          "channel": "Devika's Commerce Academy",
          "duration": "19:40",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Fixed vs working capital, operating cycle calculation, short-term vs long-term sources (Shares, Debentures, Retained Earnings, Bank Overdraft)."
        },
        {
          "id": "v-mefa-u4-2",
          "title": "Capital Budgeting: Meaning, Importance, Complications & Project Cash Flow Estimation",
          "channel": "Devika's Commerce Academy",
          "duration": "15:20",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Long-term investment appraisal, time value of money, sunk costs, and risk complications in capital budgeting."
        },
        {
          "id": "v-mefa-u4-3",
          "title": "Traditional Methods of Capital Budgeting: Payback Period (PBP) & Accounting Rate of Return (ARR)",
          "channel": "Devika's Commerce Academy",
          "duration": "27:50",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "PBP formulas for even and uneven cash flows, ARR calculation based on average profit / average investment, and solved exam problems."
        },
        {
          "id": "v-mefa-u4-4",
          "title": "Discounted Cash Flow Methods: Net Present Value (NPV), IRR & Profitability Index (PI)",
          "channel": "Devika's Commerce Academy",
          "duration": "32:10",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Present Value discounting factor, NPV = PV of Inflows - Initial Outflow, Internal Rate of Return trial & interpolation, and PI decision criteria."
        }
      ]
    },
    {
      "unitNumber": 5,
      "unitTitle": "UNIT V: Financial Accounting and Analysis",
      "description": "Financial Accounting and Analysis Introduction – Concepts and Conventions - Double-Entry System of Bookkeeping, Journal, Ledger, Trial Balance - Final Accounts (Trading Account, Profit and Loss Account and Balance Sheet with Simple adjustments). Introduction to Financial Analysis – Analysis and Interpretation of Liquidity Ratios, Activity Ratios, and Capital structure Ratios and Profitability Ratios. Income tax calculation and filing income tax returns (ITR).",
      "videos": [
        {
          "id": "v-mefa-u5-1",
          "title": "Accounting Concepts & Conventions, Double-Entry System, Rules of Debit & Credit, Journal Entries",
          "channel": "Devika's Commerce Academy",
          "duration": "29:30",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Golden rules of accounting (Personal, Real, Nominal accounts), duality principle, business entity concept, and journal posting."
        },
        {
          "id": "v-mefa-u5-2",
          "title": "Ledger Accounts, Trial Balance & Preparation of Final Accounts with Balance Sheet",
          "channel": "Devika's Commerce Academy",
          "duration": "34:40",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Trading Account (Gross Profit), Profit & Loss Account (Net Profit), and Balance Sheet (Assets & Liabilities) with closing stock adjustments."
        },
        {
          "id": "v-mefa-u5-3",
          "title": "Financial Ratio Analysis: Liquidity Ratios (Current Ratio, Quick Ratio) & Activity / Turnover Ratios",
          "channel": "Devika's Commerce Academy",
          "duration": "26:15",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Interpretation of liquidity, Inventory Turnover Ratio, Debtors/Creditors Turnover Ratio, and Working Capital Turnover."
        },
        {
          "id": "v-mefa-u5-4",
          "title": "Capital Structure & Profitability Ratios: Debt-Equity, Gross Profit Ratio, Net Profit Ratio, ROI & EPS",
          "channel": "Devika's Commerce Academy",
          "duration": "25:10",
          "url": "https://www.youtube.com/watch?v=356_pioFiss",
          "summary": "Solvency metrics, leverage evaluation, Operating Profit Ratio, Return on Capital Employed (ROCE) and earnings per share."
        }
      ]
    }
  ]
},

  // =========================================================================
  // --- 1.2 DATABASE MANAGEMENT SYSTEMS (DBMS) ---
  // Scheme: 2023 | Code: CS401 | Category: PCC | Credits: 3
  // CSE & CSM Semester 4
  // =========================================================================
  {
  "id": "cse-sem4-cs401-dbms",
  "branch": "CSE",
  "branchesApplicable": [
    "CSE",
    "CSM"
  ],
  "semester": "Sem 4",
  "subjectCode": "CS401",
  "subjectName": "Database Management Systems (DBMS)",
  "credits": 3,
  "scheme": "2023 Scheme",
  "category": "PCC",
  "description": "Database System Architecture, ER Modeling, Relational Algebra, SQL Queries, Normalization (1NF to BCNF), Transaction Processing, Concurrency Control Protocols (2PL, Timestamp), and Indexing B/B+ Trees.",
  "thumbnail": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000",
  "oneShotVideo": {
    "title": "Database Management Systems (DBMS) Complete One-Shot Revision Marathon",
    "channel": "Gate Smashers",
    "url": "https://www.youtube.com/watch?v=kBdlM6hNDAE",
    "duration": "6h 15m",
    "views": "2.1M"
  },
  "playlistUrl": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8C9AzFiPrgPM6wDLy",
  "units": [
    {
      "unitNumber": 1,
      "unitTitle": "UNIT I: Introduction & Database Architecture",
      "description": "Data Models, Schemas, Instances, Three-Schema Architecture, Data Independence, Database Languages, ER Modeling, Entities, Attributes, Relationships, Extended ER Features.",
      "videos": [
        {
          "id": "v-dbms-u1-1",
          "title": "Introduction to DBMS, File System vs DBMS & 3-Tier Architecture",
          "channel": "Gate Smashers",
          "duration": "18:15",
          "url": "https://www.youtube.com/watch?v=3EJlovevfcA",
          "summary": "Database design life cycle, physical and logical data independence, data abstraction."
        },
        {
          "id": "v-dbms-u1-2",
          "title": "ER Diagram: Entity, Attributes, Relationship Types & Cardinality with Solved Examples",
          "channel": "Gate Smashers",
          "duration": "24:40",
          "url": "https://www.youtube.com/watch?v=gbV_G7u_g_Y",
          "summary": "Strong/weak entity sets, composite/multivalued attributes, primary/foreign keys, ER to relational schema mapping."
        }
      ]
    },
    {
      "unitNumber": 2,
      "unitTitle": "UNIT II: Relational Model & SQL",
      "description": "Relational Model Concepts, Relational Constraints, Relational Algebra (Select, Project, Joins, Set Operations), Tuple Relational Calculus, SQL DDL, DML, DCL, Complex Queries, Views.",
      "videos": [
        {
          "id": "v-dbms-u2-1",
          "title": "Relational Algebra: Selection, Projection, Cross Product, Natural Join & Division",
          "channel": "Gate Smashers",
          "duration": "28:10",
          "url": "https://www.youtube.com/watch?v=yL_7_kC6w3s",
          "summary": "Procedural query language operations, theta join, outer join, and university schema queries."
        },
        {
          "id": "v-dbms-u2-2",
          "title": "Complete SQL Tutorial: DDL, DML, Subqueries, Aggregate Functions & Joins",
          "channel": "freeCodeCamp / Gate Smashers",
          "duration": "45:00",
          "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          "summary": "CREATE, ALTER, INSERT, UPDATE, GROUP BY, HAVING, nested subqueries, and triggers."
        }
      ]
    },
    {
      "unitNumber": 3,
      "unitTitle": "UNIT III: Database Normalization",
      "description": "Functional Dependencies, Closure of Attribute Sets, Canonical Cover, Normal Forms: 1NF, 2NF, 3NF, BCNF, Multi-Valued Dependencies and 4NF, Lossless Join & Dependency Preservation.",
      "videos": [
        {
          "id": "v-dbms-u3-1",
          "title": "Functional Dependencies, Candidate Key Finding & Closure of Attribute Sets",
          "channel": "Gate Smashers",
          "duration": "22:30",
          "url": "https://www.youtube.com/watch?v=5fs1PRflmD8",
          "summary": "Armstrong axioms, attribute closure algorithm, finding candidate keys of relational schema."
        },
        {
          "id": "v-dbms-u3-2",
          "title": "Normalization Step-by-Step: 1NF, 2NF, 3NF, and BCNF with Solved Examples",
          "channel": "Gate Smashers",
          "duration": "32:15",
          "url": "https://www.youtube.com/watch?v=UrYLYV7WSHM",
          "summary": "Eliminating insertion, deletion, update anomalies through lossless decomposition."
        }
      ]
    },
    {
      "unitNumber": 4,
      "unitTitle": "UNIT IV: Transaction Processing & Concurrency Control",
      "description": "ACID Properties, Transaction States, Schedules: Serial, Serializable, Conflict & View Serializability, Recoverable Schedules, Two-Phase Locking (2PL), Timestamp Ordering, Deadlock Prevention.",
      "videos": [
        {
          "id": "v-dbms-u4-1",
          "title": "ACID Properties of Transactions & Transaction State Diagram",
          "channel": "Gate Smashers",
          "duration": "16:40",
          "url": "https://www.youtube.com/watch?v=a3fI_j8B_rM",
          "summary": "Atomicity, Consistency, Isolation, Durability with real-world banking transaction flow."
        },
        {
          "id": "v-dbms-u4-2",
          "title": "Conflict Serializability & Precedence Graph (Testing Serializability)",
          "channel": "Gate Smashers",
          "duration": "21:50",
          "url": "https://www.youtube.com/watch?v=7hR9qQ0H6nI",
          "summary": "Read-write conflicts, cycle detection in precedence graph, and strict schedules."
        },
        {
          "id": "v-dbms-u4-3",
          "title": "Concurrency Control Protocols: Two Phase Locking (Strict 2PL, Rigorous 2PL) & Timestamp Ordering",
          "channel": "Gate Smashers",
          "duration": "26:20",
          "url": "https://www.youtube.com/watch?v=gT_u4m9L0vM",
          "summary": "Growing phase, shrinking phase, lock conversion, cascading abort prevention, and Thomas write rule."
        }
      ]
    },
    {
      "unitNumber": 5,
      "unitTitle": "UNIT V: Indexing & Storage Structures",
      "description": "File Organizations, Primary Index, Clustering Index, Secondary Index, Multi-level Indexing, B-Trees and B+ Trees Search, Insertion and Deletion Algorithms.",
      "videos": [
        {
          "id": "v-dbms-u5-1",
          "title": "Indexing in Databases: Primary, Secondary, Clustered & Dense vs Sparse Indexing",
          "channel": "Gate Smashers",
          "duration": "24:10",
          "url": "https://www.youtube.com/watch?v=T_rG_q0uK4w",
          "summary": "Data blocks, index records, block access calculations, and multi-level indexing."
        },
        {
          "id": "v-dbms-u5-2",
          "title": "B-Trees and B+ Trees: Construction, Search, Insert & Delete Operations",
          "channel": "Gate Smashers",
          "duration": "31:40",
          "url": "https://www.youtube.com/watch?v=aZjYr87r1b8",
          "summary": "Order of B-tree, node splitting, leaf pointers, and range queries in B+ Trees."
        }
      ]
    }
  ]
},

  // =========================================================================
  // --- 1.3 OPERATING SYSTEMS (OS) ---
  // Scheme: 2023 | Code: CS402 | Category: PCC | Credits: 3
  // CSE, CSM, ECE & EEE Semester 4
  // =========================================================================
  {
  "id": "cse-sem4-cs402-os",
  "branch": "CSE",
  "branchesApplicable": [
    "CSE",
    "CSM",
    "ECE",
    "EEE"
  ],
  "semester": "Sem 4",
  "subjectCode": "CS402",
  "subjectName": "Operating Systems (OS)",
  "credits": 3,
  "scheme": "2023 Scheme",
  "category": "PCC",
  "description": "Operating System Structure, System Calls, Process Management, CPU Scheduling Algorithms, Inter-Process Communication, Classical Synchronization Problems (Dining Philosophers, Readers-Writers), Deadlock Detection & Avoidance (Banker's Algorithm), Paging, Segmentation, and File Systems.",
  "thumbnail": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000",
  "oneShotVideo": {
    "title": "Operating Systems (OS) Complete One-Shot Revision Marathon",
    "channel": "Gate Smashers / Neso Academy",
    "url": "https://www.youtube.com/watch?v=bkSWJJZNgf8",
    "duration": "7h 30m",
    "views": "3.4M"
  },
  "playlistUrl": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O",
  "units": [
    {
      "unitNumber": 1,
      "unitTitle": "UNIT I: OS Overview & Process Concept",
      "description": "Functions of Operating System, Dual Mode Operation, System Calls, Process States, PCB, Process Scheduling Queues, Context Switching, Inter-Process Communication (IPC).",
      "videos": [
        {
          "id": "v-os-u1-1",
          "title": "Introduction to Operating Systems, Dual-Mode & System Calls Explained",
          "channel": "Gate Smashers",
          "duration": "19:20",
          "url": "https://www.youtube.com/watch?v=26QPDBe-NB8",
          "summary": "Kernel mode vs user mode, hardware interrupts, trap, fork(), and exec() system calls."
        },
        {
          "id": "v-os-u1-2",
          "title": "Process State Transition Diagram & Process Control Block (PCB)",
          "channel": "Gate Smashers",
          "duration": "16:40",
          "url": "https://www.youtube.com/watch?v=ovS7Wmg9N_I",
          "summary": "New, Ready, Running, Waiting, Terminated states, context switching overhead and scheduler types."
        }
      ]
    },
    {
      "unitNumber": 2,
      "unitTitle": "UNIT II: CPU Scheduling & Threads",
      "description": "Multithreading Models, Scheduling Criteria, FCFS, SJF (Preemptive/Non-preemptive), Priority Scheduling, Round Robin, Multilevel Queue & Multilevel Feedback Queue Scheduling.",
      "videos": [
        {
          "id": "v-os-u2-1",
          "title": "CPU Scheduling Algorithms: FCFS, SJF, SRTF Solved with Gantt Chart",
          "channel": "Gate Smashers",
          "duration": "28:30",
          "url": "https://www.youtube.com/watch?v=zFnrUVqti3M",
          "summary": "Average turnaround time, waiting time, response time calculations and Convoy Effect in FCFS."
        },
        {
          "id": "v-os-u2-2",
          "title": "Round Robin CPU Scheduling Algorithm with Time Quantum & Solved Numerical",
          "channel": "Gate Smashers",
          "duration": "22:15",
          "url": "https://www.youtube.com/watch?v=TxjIlNYRZ5E",
          "summary": "Impact of time quantum size, context switch frequency, and average waiting time calculations."
        }
      ]
    },
    {
      "unitNumber": 3,
      "unitTitle": "UNIT III: Process Synchronization & Deadlocks",
      "description": "Critical Section Problem, Peterson's Solution, Semaphores (Binary & Counting), Mutex, Producer-Consumer, Readers-Writers, Dining Philosophers Problems. Deadlock Conditions, Resource Allocation Graph, Banker's Algorithm, Deadlock Detection & Recovery.",
      "videos": [
        {
          "id": "v-os-u3-1",
          "title": "Critical Section Problem, Race Conditions & Peterson's Solution Algorithm",
          "channel": "Gate Smashers",
          "duration": "21:40",
          "url": "https://www.youtube.com/watch?v=1r_7iLq9F0w",
          "summary": "Mutual exclusion, progress, and bounded waiting criteria satisfied by software solutions."
        },
        {
          "id": "v-os-u3-2",
          "title": "Semaphores in OS: Binary vs Counting Semaphores & Producer-Consumer Problem",
          "channel": "Gate Smashers",
          "duration": "25:10",
          "url": "https://www.youtube.com/watch?v=XDE0z0b_yE4",
          "summary": "Wait() and Signal() atomic operations, mutex implementation, and buffer synchronization."
        },
        {
          "id": "v-os-u3-3",
          "title": "Deadlock in OS: 4 Necessary Conditions & Banker's Algorithm Solved Problem",
          "channel": "Gate Smashers",
          "duration": "29:45",
          "url": "https://www.youtube.com/watch?v=T0FXvTHcYi4",
          "summary": "Mutual exclusion, hold and wait, no preemption, circular wait, and safety algorithm / resource request algorithm."
        }
      ]
    },
    {
      "unitNumber": 4,
      "unitTitle": "UNIT IV: Memory Management & Virtual Memory",
      "description": "Logical vs Physical Address Space, Contiguous Memory Allocation, Paging, Page Table Structure, TLB (Translation Lookaside Buffer), Segmentation, Demand Paging, Page Faults, Page Replacement Algorithms (FIFO, LRU, Optimal).",
      "videos": [
        {
          "id": "v-os-u4-1",
          "title": "Paging in OS: Logical to Physical Address Translation & Page Table Architecture",
          "channel": "Gate Smashers",
          "duration": "27:15",
          "url": "https://www.youtube.com/watch?v=pJ6myTV3ca8",
          "summary": "Page number, page offset, frame number, MMU translation, and TLB hit ratio calculations."
        },
        {
          "id": "v-os-u4-2",
          "title": "Page Replacement Algorithms: FIFO, Optimal, LRU & Belady's Anomaly Solved Problems",
          "channel": "Gate Smashers",
          "duration": "31:20",
          "url": "https://www.youtube.com/watch?v=8XFEb8pQ2n4",
          "summary": "Page fault frequency comparison, stack algorithms, and Belady anomaly illustration in FIFO."
        }
      ]
    },
    {
      "unitNumber": 5,
      "unitTitle": "UNIT V: File Systems & Disk Management",
      "description": "File Concepts, Access Methods, Directory Structure, File Allocation Methods (Contiguous, Linked, Indexed), Free Space Management, Disk Structure, Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK).",
      "videos": [
        {
          "id": "v-os-u5-1",
          "title": "File Allocation Methods: Contiguous, Linked & Inode Indexed Allocation",
          "channel": "Gate Smashers",
          "duration": "23:30",
          "url": "https://www.youtube.com/watch?v=5aK8a5L0mP4",
          "summary": "External fragmentation in contiguous allocation, pointer overhead in linked, and Unix inode structures."
        },
        {
          "id": "v-os-u5-2",
          "title": "Disk Scheduling Algorithms: FCFS, SSTF, SCAN, C-SCAN Solved with Total Head Movements",
          "channel": "Gate Smashers",
          "duration": "26:50",
          "url": "https://www.youtube.com/watch?v=9_zW7L_v8K4",
          "summary": "Seek time calculation, cylinder tracks traversal, and algorithm efficiency comparison."
        }
      ]
    }
  ]
},
  // =========================================================================
  // --- 1. UNIVERSAL HUMAN VALUES (UHV) ---
  // Scheme: 2023 | Code: HSM 201 | Category: BS&H | Credits: 3
  // Common to ALL Branches (CSE, CSM, ECE, EEE, Civil, Mechanical)
  // =========================================================================
  {
    id: 'common-sem3-hsm201-uhv',
    branch: 'CSE', // Available across all branches
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3', 'Sem 4'],
    subjectCode: 'HSM 201',
    subjectName: 'Universal Human Values (UHV)',
    credits: 3,
    scheme: '2023 Scheme',
    category: 'BS&H',
    description: 'Value Education, Self-Exploration, Continuous Happiness & Prosperity, Harmony in the Human Being (Self & Body), Harmony in Family & Society (Trust & Respect), Harmony in Nature & Existence (4 Orders of Nature), and Professional Ethics.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
    oneShotVideo: {
      title: 'Universal Human Values (UHV) Complete One-Shot Revision Marathon',
      channel: 'Gate Smashers / AICTE UHV',
      url: 'https://www.youtube.com/watch?v=Jm3U49XWv3c',
      duration: '4h 45m',
      views: '850K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiE49ZgYgV3sF2xQ2z4gT3sX',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'UNIT I: Introduction to Value Education & Self-Exploration',
        description: 'Right Understanding, Relationship & Physical Facility (Holistic Development & Role of Education). Value Education, Self-Exploration as the Process. Continuous Happiness and Prosperity as Basic Human Aspirations. Current scenario vs Natural Acceptance.',
        videos: [
          {
            id: 'v-uhv-u1-1',
            title: 'Value Education, Right Understanding, Relationship & Physical Facility',
            channel: 'Gate Smashers',
            duration: '18:30',
            url: 'https://www.youtube.com/watch?v=e_wK3b6Fk2s',
            summary: 'Understanding the triad of Right Understanding, Relationship (with humans) and Physical Facilities (with nature) for holistic happiness.'
          },
          {
            id: 'v-uhv-u1-2',
            title: 'Self-Exploration as the Process for Value Education',
            channel: 'AICTE UHV / NPTEL',
            duration: '22:15',
            url: 'https://www.youtube.com/watch?v=mD_3h_C0p9Y',
            summary: 'Content of self-exploration (Desire/Purpose & Program of action) and Natural Acceptance vs Experiential Validation.'
          },
          {
            id: 'v-uhv-u1-3',
            title: 'Continuous Happiness and Prosperity: The Basic Human Aspirations',
            channel: 'Gate Smashers',
            duration: '16:40',
            url: 'https://www.youtube.com/watch?v=RO5alU6PpSU',
            summary: 'Distinction between Prosperity (feeling of having more than required physical facilities) and Accumulation of Wealth.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'UNIT II: Harmony in the Human Being (Self & Body)',
        description: 'Human being as Co-existence of the Self (\'I\') and the Body. Needs of Self (Qualitative/Continuous) vs Body (Quantitative/Temporary). Body as an Instrument of Self. Harmony in the Self, Sources of Imagination (Desires, Thoughts, Expectations). Sanyam & Swasthya (Self-Regulation and Health).',
        videos: [
          {
            id: 'v-uhv-u2-1',
            title: 'Human Being as Co-existence of Self (\'I\') and Body',
            channel: 'Gate Smashers',
            duration: '24:50',
            url: 'https://www.youtube.com/watch?v=3n-vH_72s9w',
            summary: 'Needs, activities and types of Self (conscious) vs Body (physico-chemical) detailed tabular comparison.'
          },
          {
            id: 'v-uhv-u2-2',
            title: 'Harmony in the Self (\'I\'): Desires, Thoughts & Expectations (Imagination)',
            channel: 'AICTE UHV',
            duration: '20:10',
            url: 'https://www.youtube.com/watch?v=480gE_wE-2k',
            summary: 'Analyzing Pre-conditioning vs Sensation vs Natural Acceptance as sources of human imagination.'
          },
          {
            id: 'v-uhv-u2-3',
            title: 'Sanyam and Swasthya: Self-Regulation and Health Programs',
            channel: 'Gate Smashers',
            duration: '19:25',
            url: 'https://www.youtube.com/watch?v=46T2wYdVElc',
            summary: 'Feeling of responsibility for nurturing, protecting and rightly utilizing the body.'
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'UNIT III: Harmony in the Family and Society',
        description: 'Harmony in the Family - Basic Unit of Human Interaction. Trust (Vishwas) - Foundational Value in Relationship. Respect (Samman) as Right Evaluation (Over/Under/Otherwise Evaluation). Other values: Affection, Care, Guidance, Reverence, Glory, Gratitude, Love. Harmony in Society: Undivided Society (Akhand Samaj) & Universal Order (Sarvabhaum Vyavastha).',
        videos: [
          {
            id: 'v-uhv-u3-1',
            title: 'Trust (Vishwas) as the Foundational Value in Human Relationships',
            channel: 'Gate Smashers',
            duration: '26:40',
            url: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
            summary: 'Difference between Intention (Natural Acceptance) and Competence (ability to perform) in evaluating trust.'
          },
          {
            id: 'v-uhv-u3-2',
            title: 'Respect (Samman) as Right Evaluation vs Differentiation',
            channel: 'AICTE UHV',
            duration: '23:15',
            url: 'https://www.youtube.com/watch?v=83e6yWJ_05s',
            summary: 'Over-evaluation, under-evaluation and otherwise-evaluation vs right evaluation on the basis of Self.'
          },
          {
            id: 'v-uhv-u3-3',
            title: 'Comprehensive Human Goals & Five Dimensions of Human Order in Society',
            channel: 'Gate Smashers',
            duration: '21:30',
            url: 'https://www.youtube.com/watch?v=1XATy2G1qJg',
            summary: 'Right understanding, Prosperity, Fearlessness (Trust) and Co-existence in society across 5 dimensions.'
          }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'UNIT IV: Harmony in the Nature and Existence',
        description: 'Understanding Harmony in Nature: Four Orders of Nature (Material/Padartha, Pranic/Bio, Animal/Jeeva, Human/Jnana Order). Interconnectedness, Self-regulation and Mutual Fulfillment (Parasparata). Existence as Co-existence (Sah-astitva) at All Levels. Submergence in Space.',
        videos: [
          {
            id: 'v-uhv-u4-1',
            title: 'Four Orders of Nature & Mutual Fulfillment (Parasparata)',
            channel: 'Gate Smashers',
            duration: '25:20',
            url: 'https://www.youtube.com/watch?v=404iM1lqfE4',
            summary: 'Material order, plant order, animal order, human order characteristics, activity, innateness, and natural characteristic.'
          },
          {
            id: 'v-uhv-u4-2',
            title: 'Existence as Co-existence (Sah-Astitva) & Units Submerged in Space',
            channel: 'AICTE UHV',
            duration: '27:10',
            url: 'https://www.youtube.com/watch?v=sDv4f4s2SB8',
            summary: 'Unlimited space vs limited energized units, self-organized harmony and cosmic co-existence.'
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'UNIT V: Professional Ethics & Holistic Humanistic Models',
        description: 'Natural Acceptance of Human Values. Definitiveness of Ethical Human Conduct. Humanistic Education, Constitution and Universal Human Order. Competence in Professional Ethics. Holistic Technologies, Production Systems & Management Models. Transition Strategies towards Value-based Profession.',
        videos: [
          {
            id: 'v-uhv-u5-1',
            title: 'Definitiveness of Ethical Human Conduct & Professional Competence',
            channel: 'Gate Smashers',
            duration: '21:40',
            url: 'https://www.youtube.com/watch?v=9TlHvipP5yA',
            summary: 'Values (Mulya), Policy (Niti), and Character (Charitra) in engineering and corporate decision-making.'
          },
          {
            id: 'v-uhv-u5-2',
            title: 'Holistic Technologies, Eco-Friendly Production Systems & Case Studies',
            channel: 'AICTE UHV',
            duration: '19:50',
            url: 'https://www.youtube.com/watch?v=jDM6_TnYIuE',
            summary: 'Criteria for holistic technologies: renewable, recyclable, non-polluting, locally adaptable and human-friendly.'
          },
          {
            id: 'v-uhv-u5-3',
            title: 'Transition Strategies towards Value-Based Life and Profession',
            channel: 'Gate Smashers',
            duration: '18:15',
            url: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
            summary: 'Step-by-step personal transformation and organizational cultural shifts.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- 2. ARTIFICIAL INTELLIGENCE (AI) ---
  // Scheme: 2023 | Code: CM201 | Category: ES | Credits: 3
  // Branches: CSM (CSE AI&ML), CSE
  // =========================================================================
  {
    id: 'csm-sem3-cm201-ai',
    branch: 'CSM',
    branchesApplicable: ['CSM', 'CSE'],
    semester: 'Sem 3',
    subjectCode: 'CM201',
    subjectName: 'Artificial Intelligence (AI)',
    credits: 3,
    scheme: '2023 Scheme',
    category: 'ES',
    description: 'Agents & Environments, Heuristic Search (Hill Climbing, A*, AO*), Game Playing (Minimax, Alpha-Beta), Knowledge Representation, Reasoning Under Uncertainty (Bayes, Dempster-Shafer), First-Order Logic & Expert Systems (MYCIN, DART, XCON).',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000',
    oneShotVideo: {
      title: 'Artificial Intelligence (AI) Complete One Shot Marathon',
      channel: 'Gate Smashers',
      url: 'https://www.youtube.com/watch?v=5NgNicANyqM',
      duration: '5h 15m',
      views: '1.4M'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGhUL4eyP_eM-JbB_k_UuV',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'UNIT I: Introduction & Intelligent Agents',
        description: 'AI problems, foundation of AI and history of AI. Intelligent agents: Agents & Environments, rationality, nature of environments (PEAS), structure of agents (Reflex, Model, Goal, Utility), problem-solving agents, problem formulation.',
        videos: [
          {
            id: 'v-ai-u1-1',
            title: 'What is Artificial Intelligence? Foundation and History of AI',
            channel: 'Gate Smashers',
            duration: '12:45',
            url: 'https://www.youtube.com/watch?v=2ePf9rue1Ao',
            summary: 'Turing test, definitions of AI, origins from Dartmouth conference to modern AI systems.'
          },
          {
            id: 'v-ai-u1-2',
            title: 'Agents and Environments in AI (PEAS Model)',
            channel: 'Gate Smashers',
            duration: '14:20',
            url: 'https://www.youtube.com/watch?v=mD_3h_C0p9Y',
            summary: 'Performance measure, Environment, Actuators, Sensors with real-world examples (Automated Taxi, Medical Diagnosis).'
          },
          {
            id: 'v-ai-u1-3',
            title: 'Structure of Intelligent Agents (Simple Reflex, Model, Goal & Utility Based)',
            channel: 'Gate Smashers',
            duration: '18:10',
            url: 'https://www.youtube.com/watch?v=e_wK3b6Fk2s',
            summary: 'Architectural diagrams and state transitions for all 4 major agent types and learning agents.'
          },
          {
            id: 'v-ai-u1-4',
            title: 'Problem Formulation and Problem-Solving Agents',
            channel: 'Neso Academy',
            duration: '16:30',
            url: 'https://www.youtube.com/watch?v=J8n5rV2W6tM',
            summary: 'Initial state, actions, transition model, goal test, and path cost formulation in 8-puzzle and vacuum world.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'UNIT II: Searching Techniques & Game Playing',
        description: 'Searching for solutions, uninformed search strategies (BFS, DFS), Heuristic search (Hill climbing, A*, AO* Algorithms, Problem reduction). Games: Mini-max algorithm, optimal decisions in multiplayer games, Alpha-Beta pruning, Evaluation functions.',
        videos: [
          {
            id: 'v-ai-u2-1',
            title: 'Uninformed Search Strategies: Breadth First Search (BFS) & Depth First Search (DFS)',
            channel: 'Gate Smashers',
            duration: '19:40',
            url: 'https://www.youtube.com/watch?v=pcK_iYp1s68',
            summary: 'Time/space complexity, completeness, and optimality comparison between BFS and DFS.'
          },
          {
            id: 'v-ai-u2-2',
            title: 'Hill Climbing Algorithm (Simple, Steepest-Ascent & Problems Explained)',
            channel: 'Gate Smashers',
            duration: '22:15',
            url: 'https://www.youtube.com/watch?v=kYv_C2Z72hI',
            summary: 'Local maxima, plateau, ridge problems and simulated annealing / random restart solutions.'
          },
          {
            id: 'v-ai-u2-3',
            title: 'A* Search Algorithm Step-by-Step with Numerical Example',
            channel: 'Gate Smashers',
            duration: '26:10',
            url: 'https://www.youtube.com/watch?v=tvghPn_l_4k',
            summary: 'Heuristic evaluation f(n) = g(n) + h(n), admissibility condition h(n) <= h*(n) and optimality proof.'
          },
          {
            id: 'v-ai-u2-4',
            title: 'AO* Search Algorithm (AND-OR Graphs & Problem Reduction)',
            channel: 'Gate Smashers',
            duration: '24:50',
            url: 'https://www.youtube.com/watch?v=t_u_K4iU6zE',
            summary: 'AND-OR graph decomposition, heuristic calculation, and branch tree updating.'
          },
          {
            id: 'v-ai-u2-5',
            title: 'Mini-Max Algorithm in Game Theory with Game Tree Example',
            channel: 'Gate Smashers',
            duration: '21:30',
            url: 'https://www.youtube.com/watch?v=zD_UPm_zH-M',
            summary: 'MAX and MIN player turns, utility valuation, and zero-sum game trees.'
          },
          {
            id: 'v-ai-u2-6',
            title: 'Alpha-Beta Pruning with Solved Exam Numerical',
            channel: 'Gate Smashers',
            duration: '25:40',
            url: 'https://www.youtube.com/watch?v=l-hh51ncgDI',
            summary: 'Alpha cutoff and Beta cutoff conditions to reduce branching factor from O(b^d) to O(b^(d/2)).'
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'UNIT III: Representation of Knowledge & Reasoning Under Uncertainty',
        description: 'Knowledge representation issues, predicate logic, logic programming, semantic nets, frames and inheritance, representing knowledge using rules, rule-based deduction systems. Reasoning under uncertainty: review of probability, Bayes\' probabilistic inferences and Dempster-Shafer theory.',
        videos: [
          {
            id: 'v-ai-u3-1',
            title: 'Knowledge Representation in AI: Issues & Approaches',
            channel: 'Gate Smashers',
            duration: '17:25',
            url: 'https://www.youtube.com/watch?v=KzL_L6_Q28k',
            summary: 'Declarative vs Procedural knowledge, representation properties: representational adequacy, inferential adequacy.'
          },
          {
            id: 'v-ai-u3-2',
            title: 'Semantic Networks, Frames and Inheritance Representation',
            channel: 'Gate Smashers',
            duration: '20:10',
            url: 'https://www.youtube.com/watch?v=3n-vH_72s9w',
            summary: 'Nodes, links (IS-A, HAS-A), slots, fillers and default inheritance in frame-based systems.'
          },
          {
            id: 'v-ai-u3-3',
            title: 'Bayes\' Probabilistic Inference & Bayesian Belief Networks',
            channel: 'Gate Smashers',
            duration: '27:30',
            url: 'https://www.youtube.com/watch?v=83e6yWJ_05s',
            summary: 'Conditional probability, Bayes rule P(A|B) = [P(B|A)*P(A)] / P(B), joint distributions and DAG networks.'
          },
          {
            id: 'v-ai-u3-4',
            title: 'Dempster-Shafer Theory of Evidence (Belief & Plausibility)',
            channel: 'Gate Smashers',
            duration: '23:15',
            url: 'https://www.youtube.com/watch?v=sDv4f4s2SB8',
            summary: 'Frame of discernment, mass function m(A), Belief Bel(A), and Plausibility Pl(A) calculations.'
          }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'UNIT IV: Logic Concepts & Learning Methods',
        description: 'First order logic (FOL), Inference in first order logic, propositional vs. first order inference, unification & lifts forward chaining, Backward chaining, Resolution. Learning: Learning from observation, Inductive learning, Explanation based learning, Statistical Learning methods, Reinforcement Learning.',
        videos: [
          {
            id: 'v-ai-u4-1',
            title: 'First Order Logic (FOL) / Predicate Calculus & Quantifiers',
            channel: 'Gate Smashers',
            duration: '21:05',
            url: 'https://www.youtube.com/watch?v=RO5alU6PpSU',
            summary: 'Universal (∀) and Existential (∃) quantifiers, converting English sentences into FOL representations.'
          },
          {
            id: 'v-ai-u4-2',
            title: 'Forward Chaining vs Backward Chaining in FOL',
            channel: 'Gate Smashers',
            duration: '18:40',
            url: 'https://www.youtube.com/watch?v=480gE_wE-2k',
            summary: 'Data-driven bottom-up reasoning (Forward) vs Goal-driven top-down reasoning (Backward) in rule engines.'
          },
          {
            id: 'v-ai-u4-3',
            title: 'Unification Algorithm & Resolution Refutation in First Order Logic',
            channel: 'Gate Smashers',
            duration: '28:15',
            url: 'https://www.youtube.com/watch?v=46T2wYdVElc',
            summary: 'Substitutions, Most General Unifier (MGU), converting to CNF, Skolemization, and proof by contradiction.'
          },
          {
            id: 'v-ai-u4-4',
            title: 'Machine Learning Concepts in AI (Inductive, Explanation-Based & Reinforcement Learning)',
            channel: 'Gate Smashers',
            duration: '24:50',
            url: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
            summary: 'Inductive bias, EBL domain theories, Markov Decision Processes, agent reward policy in Reinforcement Learning.'
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'UNIT V: Expert Systems & Architectures',
        description: 'Architecture of expert systems, Roles of expert systems – Knowledge Acquisition. Typical expert systems – MYCIN, DART, XCON; Expert systems shells.',
        videos: [
          {
            id: 'v-ai-u5-1',
            title: 'Architecture of Expert Systems (Inference Engine, Knowledge Base & UI)',
            channel: 'Gate Smashers',
            duration: '16:40',
            url: 'https://www.youtube.com/watch?v=1XATy2G1qJg',
            summary: 'Working memory, inference engine, explanation facility, user interface and knowledge base.'
          },
          {
            id: 'v-ai-u5-2',
            title: 'Knowledge Acquisition & Role of Domain Experts / Knowledge Engineers',
            channel: 'Neso Academy',
            duration: '14:20',
            url: 'https://www.youtube.com/watch?v=404iM1lqfE4',
            summary: 'Knowledge elicitation techniques, rule induction, validation and verification in expert systems.'
          },
          {
            id: 'v-ai-u5-3',
            title: 'Case Studies: MYCIN (Medical), DART, XCON (DEC Hardware) & Expert System Shells',
            channel: 'Gate Smashers',
            duration: '22:30',
            url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U',
            summary: 'Certainty factors in MYCIN, configuration rules in XCON, and EMYCIN / CLIPS shell environments.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- 3. ADVANCED DATA STRUCTURES & ALGORITHMS ANALYSIS (ADSA) ---
  // Scheme: 2023 | Code: CS202 | Category: PC | Credits: 3
  // Branches: Common to CSE, CSM, CSE(DS), CSBS
  // =========================================================================
  {
    id: 'cse-sem3-cs202-adsa',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'CSE(DS)', 'CSBS'],
    semester: 'Sem 3',
    subjectCode: 'CS202',
    subjectName: 'Advanced Data Structures & Algorithms Analysis (ADSA)',
    credits: 3,
    scheme: '2023 Scheme',
    category: 'PC',
    description: 'AVL Trees, B-Trees, Heap Trees, Graph Traversals (BFS, DFS, Biconnected Components), String Searching (Rabin-Karp, Boyer-Moore), Divide & Conquer, Greedy, Dynamic Programming (OBST, 0/1 Knapsack, TSP), Backtracking (8-Queens, Subsets, Coloring) & Branch and Bound (15-Puzzle).',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000',
    oneShotVideo: {
      title: 'ADSA / DAA Complete One-Shot Revision Marathon',
      channel: 'Abdul Bari / Gate Smashers',
      url: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
      duration: '7h 20m',
      views: '2.8M'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'UNIT I: Advanced Trees & Algorithm Analysis',
        description: 'Introduction to Algorithm Analysis, Space & Time Complexity, Asymptotic Notations. AVL Trees (Creation, Insertion, Deletion, Rotations). B-Trees (Creation, Insertion, Deletion & Properties). Heap Trees (Priority Queues - Min/Max Heaps).',
        videos: [
          {
            id: 'v-adsa-u1-1',
            title: 'Asymptotic Notations (Big-O, Omega, Theta) & Complexity Recurrences',
            channel: 'Abdul Bari',
            duration: '26:15',
            url: 'https://www.youtube.com/watch?v=9TlHvipP5yA',
            summary: 'Formal definitions of growth rates, upper bound, lower bound, and tight bound with recurrence tree methods.'
          },
          {
            id: 'v-adsa-u1-2',
            title: 'AVL Tree Rotations (LL, RR, LR, RL) Insert & Delete with Balance Factors',
            channel: 'Abdul Bari',
            duration: '38:10',
            url: 'https://www.youtube.com/watch?v=jDM6_TnYIuE',
            summary: 'Balance factor calculation {-1, 0, +1}, single rotations and double rotations with complete numerical examples.'
          },
          {
            id: 'v-adsa-u1-3',
            title: 'B-Tree Construction, Node Splitting on Insertion & Deletion Operations',
            channel: 'Abdul Bari',
            duration: '42:30',
            url: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
            summary: 'Properties of B-Trees of order m, minimum keys, maximum keys, root splitting and multi-way search trees.'
          },
          {
            id: 'v-adsa-u1-4',
            title: 'Heap Trees (Min-Heap & Max-Heap), Heapify Algorithm & Priority Queues',
            channel: 'Abdul Bari',
            duration: '31:20',
            url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U',
            summary: 'Complete binary tree array representation, O(N) build heap algorithm, insert and delete-max operations.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'UNIT II: Graphs & String Searching Algorithms',
        description: 'Graphs: Terminology, Representations (Adjacency Matrix/List), Basic Search & Traversals (BFS, DFS), Biconnected Components & DFS. String Searching: Brute-Force, Rabin-Karp Hash-based, Boyer-Moore Bad Character & Good Suffix heuristics.',
        videos: [
          {
            id: 'v-adsa-u2-1',
            title: 'Graph Traversals: Breadth First Search (BFS) & Depth First Search (DFS)',
            channel: 'Abdul Bari',
            duration: '34:40',
            url: 'https://www.youtube.com/watch?v=pcKY4hjDrxk',
            summary: 'Queue-based BFS traversal and recursive stack-based DFS traversal with connected components.'
          },
          {
            id: 'v-adsa-u2-2',
            title: 'Biconnected Components and Articulation Points using DFS Discovery Times',
            channel: 'Abdul Bari',
            duration: '28:15',
            url: 'https://www.youtube.com/watch?v=jFZsDDB0-vo',
            summary: 'Discovery time d[u], lowest reachable ancestor low[u], and bridge identification in graphs.'
          },
          {
            id: 'v-adsa-u2-3',
            title: 'Rabin-Karp String Matching Algorithm (Rolling Hash & Modulo Arithmetic)',
            channel: 'Abdul Bari',
            duration: '25:50',
            url: 'https://www.youtube.com/watch?v=qQ8vS2btsxI',
            summary: 'Rolling hash function, spurious hits, and worst-case vs average-case time complexity.'
          },
          {
            id: 'v-adsa-u2-4',
            title: 'Boyer-Moore String Pattern Matching Algorithm (Bad Character Rule)',
            channel: 'Abdul Bari',
            duration: '32:10',
            url: 'https://www.youtube.com/watch?v=4Xyhb72LCX4',
            summary: 'Right-to-left character comparison and bad character shift table generation.'
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'UNIT III: Divide & Conquer and Greedy Methods',
        description: 'Divide and Conquer: Quick Sort, Merge Sort, MaxMin problem, Strassen\'s matrix multiplication. Greedy Method: Job Sequencing with deadlines, Fractional Knapsack, Minimum Cost Spanning Trees (Prim\'s & Kruskal\'s), Single Source Shortest Path (Dijkstra).',
        videos: [
          {
            id: 'v-adsa-u3-1',
            title: 'Merge Sort & Quick Sort Divide-and-Conquer Analysis',
            channel: 'Abdul Bari',
            duration: '36:15',
            url: 'https://www.youtube.com/watch?v=ak-pzJ-P1GA',
            summary: 'Partitioning algorithms, worst-case O(N^2) vs best-case O(N log N) analysis and recurrence trees.'
          },
          {
            id: 'v-adsa-u3-2',
            title: 'Strassen\'s Matrix Multiplication Algorithm Derivation (7 Multiplications)',
            channel: 'Abdul Bari',
            duration: '26:40',
            url: 'https://www.youtube.com/watch?v=0oJyNmEbS4w',
            summary: 'Reducing scalar multiplications from 8 to 7 to achieve O(N^2.81) time complexity.'
          },
          {
            id: 'v-adsa-u3-3',
            title: 'Job Sequencing with Deadlines (Greedy Strategy with Max Profit)',
            channel: 'Abdul Bari',
            duration: '24:20',
            url: 'https://www.youtube.com/watch?v=zPtI8q9gvX8',
            summary: 'Slot assignment, sorting by profit descending, and disjoint set optimization.'
          },
          {
            id: 'v-adsa-u3-4',
            title: 'Prim\'s & Kruskal\'s Minimum Spanning Tree (MST) Algorithms',
            channel: 'Abdul Bari',
            duration: '40:15',
            url: 'https://www.youtube.com/watch?v=4ZlRH0eK-qQ',
            summary: 'Cut property for Prim\'s and Disjoint Set Union (DSU) cycle check for Kruskal\'s.'
          },
          {
            id: 'v-adsa-u3-5',
            title: 'Dijkstra Single-Source Shortest Path Algorithm Step-by-Step',
            channel: 'Abdul Bari',
            duration: '33:45',
            url: 'https://www.youtube.com/watch?v=XB4MIexjvY0',
            summary: 'Greedy relaxation formula d[v] = min(d[v], d[u] + cost(u,v)) with min-priority queue.'
          }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'UNIT IV: Dynamic Programming Method',
        description: 'Dynamic Programming: General Method, Principle of Optimality, Multistage Graphs (Forward/Backward approach), All-Pairs Shortest Paths (Floyd-Warshall), Optimal Binary Search Trees (OBST), 0/1 Knapsack Problem, String Editing (Levenshtein Distance), Travelling Salesperson Problem (TSP).',
        videos: [
          {
            id: 'v-adsa-u4-1',
            title: '0/1 Knapsack Problem using Dynamic Programming Table',
            channel: 'Abdul Bari',
            duration: '35:20',
            url: 'https://www.youtube.com/watch?v=nLmhmB6NzcM',
            summary: 'Tabulation state transition DP[i][w] = max(DP[i-1][w], val[i-1] + DP[i-1][w-wt[i-1]]) and back-tracking included items.'
          },
          {
            id: 'v-adsa-u4-2',
            title: 'Multistage Graph Shortest Path (Forward and Backward Approaches)',
            channel: 'Abdul Bari',
            duration: '27:50',
            url: 'https://www.youtube.com/watch?v=9iE9Mj4m8jk',
            summary: 'Stage-wise recursive cost formulation and path reconstruction.'
          },
          {
            id: 'v-adsa-u4-3',
            title: 'Floyd-Warshall All-Pairs Shortest Path Algorithm',
            channel: 'Abdul Bari',
            duration: '28:15',
            url: 'https://www.youtube.com/watch?v=oNI0rf2P9gE',
            summary: 'Three nested loops DP matrix iteration A^k[i][j] = min(A^(k-1)[i][j], A^(k-1)[i][k] + A^(k-1)[k][j]).'
          },
          {
            id: 'v-adsa-u4-4',
            title: 'Optimal Binary Search Tree (OBST) Dynamic Programming Formulation',
            channel: 'Abdul Bari',
            duration: '38:40',
            url: 'https://www.youtube.com/watch?v=vLS-zRCHo-Y',
            summary: 'Successful probabilities p[i], unsuccessful probabilities q[i], and cost matrix C[i][j] with weight matrix W[i][j].'
          },
          {
            id: 'v-adsa-u4-5',
            title: 'Travelling Salesperson Problem (TSP) using Dynamic Programming',
            channel: 'Abdul Bari',
            duration: '32:10',
            url: 'https://www.youtube.com/watch?v=-JjA4hJrU2U',
            summary: 'Subset state formulation g(i, S) = min_{j in S} { c_ij + g(j, S - {j}) } with O(N^2 * 2^N) complexity.'
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'UNIT V: Backtracking and Branch & Bound',
        description: 'Backtracking: General Method, State Space Tree, 8-Queens Problem, Sum of Subsets Problem, Graph Coloring, Hamiltonian Cycle Problem. Branch and Bound: General Method, FIFO & LC Branch and Bound, 15-Puzzle Problem, Job Sequencing with Deadlines, TSP Branch and Bound.',
        videos: [
          {
            id: 'v-adsa-u5-1',
            title: 'N-Queens / 8-Queens Problem using Backtracking & State Space Tree',
            channel: 'Abdul Bari',
            duration: '34:25',
            url: 'https://www.youtube.com/watch?v=xFv_Hl4B83A',
            summary: 'Bounding conditions: row conflict, column conflict, diagonal checks and placement vector representation.'
          },
          {
            id: 'v-adsa-u5-2',
            title: 'Sum of Subsets Problem using Backtracking State Space Tree',
            channel: 'Abdul Bari',
            duration: '22:15',
            url: 'https://www.youtube.com/watch?v=kyLxTBM3Gt8',
            summary: 'Left child (include item) vs Right child (exclude item) bounding tests with remaining sum.'
          },
          {
            id: 'v-adsa-u5-3',
            title: 'Graph Coloring & Hamiltonian Cycle Problems using Backtracking',
            channel: 'Abdul Bari',
            duration: '31:50',
            url: 'https://www.youtube.com/watch?v=052VkKhIaQ4',
            summary: 'm-Colorability decision algorithm and recursive vertex visited circuit detection.'
          },
          {
            id: 'v-adsa-u5-4',
            title: '15-Puzzle Problem using Least Cost (LC) Branch and Bound & Manhattan Distance',
            channel: 'Abdul Bari',
            duration: '36:10',
            url: 'https://www.youtube.com/watch?v=1FEP_sNb62k',
            summary: 'Heuristic cost estimation c^(x) = f(x) + g^(x), state space tree exploration and goal state reachability.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- 4. OBJECT ORIENTED PROGRAMMING THROUGH JAVA (OOPJ) ---
  // Scheme: 2023 | Code: CS203 | Category: PC | Credits: 3
  // Branches: Common to CSE, CSM, CSE(DS), CSBS
  // =========================================================================
  {
    id: 'cse-sem3-cs203-oopj',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'CSE(DS)', 'CSBS', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3', 'Sem 4', 'Sem 5'],
    subjectCode: 'CS203',
    subjectName: 'Object Oriented Programming through Java (OOPJ)',
    credits: 3,
    scheme: '2023 Scheme',
    category: 'PC',
    description: 'Java Fundamentals, Classes & Objects, Inheritance, Dynamic Method Dispatch, Interfaces & Packages, String Handling, Exception Handling, Multithreading & Synchronization, JDBC Architecture, and Collections Framework taught by Kunal Kushwaha & top educators.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    oneShotVideo: {
      title: 'Complete Java + DSA + Interview Preparation Bootcamp',
      channel: 'Kunal Kushwaha',
      url: 'https://www.youtube.com/watch?v=4EP8YHp8i60',
      duration: '60+ Hours',
      views: '5.8M'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'UNIT I: Java Architecture, Syntax, Methods & Flow of Program',
        description: 'Overview of Java, JVM, JRE, JDK, bytecode compilation, Primitive data types, Operators, Control statements (if/else, switch, while, for loops), Functions, Methods, Scoping, Shadowing, and Variable Arguments (Varargs).',
        videos: [
          {
            id: 'v-oopj-u1-kunal-1',
            title: 'Introduction to Java: Architecture, Installation, JDK/JRE/JVM & First Program',
            channel: 'Kunal Kushwaha',
            duration: '1h 12m',
            url: 'https://www.youtube.com/watch?v=4EP8YHp8i60',
            summary: 'How Java works, bytecode compilation, JIT compiler, memory architecture, installing JDK & IntelliJ IDEA, and writing your first Java application.'
          },
          {
            id: 'v-oopj-u1-kunal-2',
            title: 'Conditionals, Loops & Calculator Program in Java',
            channel: 'Kunal Kushwaha',
            duration: '1h 45m',
            url: 'https://www.youtube.com/watch?v=vvanI8NRlSI',
            summary: 'If-else statements, while loops, do-while loops, for loops, counting occurrences, reverse a number, and building a full interactive calculator.'
          },
          {
            id: 'v-oopj-u1-kunal-3',
            title: 'Functions & Methods in Java: Parameters, Return Values, Scoping & Varargs',
            channel: 'Kunal Kushwaha',
            duration: '1h 30m',
            url: 'https://www.youtube.com/watch?v=vLnPwxZd34I',
            summary: 'Passing parameters by value, method overloading, block scope, method scope, loop scope, and variable length arguments (Varargs).'
          },
          {
            id: 'v-oopj-u1-kunal-4',
            title: 'Arrays & ArrayList in Java: Memory Allocation, 2D Arrays & Dynamic Sizing',
            channel: 'Kunal Kushwaha',
            duration: '2h 10m',
            url: 'https://www.youtube.com/watch?v=n60Dn0UsbEk',
            summary: 'Array declaration, initialization in heap memory, stack pointers, 2D multidimensional arrays, and ArrayList dynamic internals.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'UNIT II: Object Oriented Programming (OOP 1 & 2): Classes, Objects, Constructors & Inheritance',
        description: 'Classes, Objects, Constructors (Default, Parameterized), this keyword, new keyword, Garbage Collection, Finalize, Inheritance (Single, Multilevel, Hierarchical), super keyword, Polymorphism (Static vs Dynamic), Dynamic Method Dispatch, Encapsulation, and Abstraction.',
        videos: [
          {
            id: 'v-oopj-u2-kunal-1',
            title: 'OOP 1: Introduction, Classes, Objects, Constructors, Memory Allocation & this Keyword',
            channel: 'Kunal Kushwaha',
            duration: '1h 55m',
            url: 'https://www.youtube.com/watch?v=BSvc586N45E',
            summary: 'Deep dive into classes as templates, instantiating objects with new, constructor overloading, calling constructor from constructor using this(), and final keyword immutability.'
          },
          {
            id: 'v-oopj-u2-kunal-2',
            title: 'OOP 2: Packages, Static Variables, Static Methods, Static Blocks & Singleton Class',
            channel: 'Kunal Kushwaha',
            duration: '1h 40m',
            url: 'https://www.youtube.com/watch?v=4Q_lB_c3lU',
            summary: 'Package directory hierarchy, classpath, static keyword memory management, inner classes, static initialization blocks, and building a Singleton class in Java.'
          },
          {
            id: 'v-oopj-u2-kunal-3',
            title: 'OOP 3: Inheritance, Polymorphism, Encapsulation & Dynamic Method Dispatch',
            channel: 'Kunal Kushwaha',
            duration: '2h 15m',
            url: 'https://www.youtube.com/watch?v=46T2wYdVElc',
            summary: 'Types of inheritance, super() constructor calls, method overriding vs overloading, runtime polymorphism via dynamic method dispatch, and data hiding via getters/setters.'
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'UNIT III: OOP (3 & 4): Access Control, Abstract Classes, Interfaces & String Handling',
        description: 'Access Modifiers (public, protected, private, default), in-built packages, Object class methods. Abstract classes, Interfaces, Default/Static methods in Interfaces, Multiple inheritance via interfaces. Strings, StringBuilder, Immutability & String Constant Pool (SCP).',
        videos: [
          {
            id: 'v-oopj-u3-kunal-1',
            title: 'OOP 4: Access Control, In-built Packages, Object Class Methods & toString()',
            channel: 'Kunal Kushwaha',
            duration: '1h 20m',
            url: 'https://www.youtube.com/watch?v=W145DXs8fG8',
            summary: 'Detailed access modifier matrix across same package, subclass, and external packages, hashCode(), equals(), and Object class inheritance.'
          },
          {
            id: 'v-oopj-u3-kunal-2',
            title: 'OOP 5: Abstract Classes, Interfaces, Default/Static Methods & Nested Interfaces',
            channel: 'Kunal Kushwaha',
            duration: '1h 50m',
            url: 'https://www.youtube.com/watch?v=rg1P9VpD_B0',
            summary: 'Why multiple inheritance is not supported with classes, creating interface contracts, implementing multiple interfaces, and default/static methods.'
          },
          {
            id: 'v-oopj-u3-kunal-3',
            title: 'Strings & StringBuilder in Java: String Pool, Immutability, Performance & Methods',
            channel: 'Kunal Kushwaha',
            duration: '1h 35m',
            url: 'https://www.youtube.com/watch?v=zjxXwD5qTfQ',
            summary: 'String Constant Pool (SCP), == vs .equals(), charAt, substring, mutable StringBuilder operations, and memory efficiency.'
          }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'UNIT IV: Exception Handling, Generics & Multithreading',
        description: 'Exception handling hierarchy (Throwable, Exception, Error, RuntimeException), try-catch-finally blocks, throw, throws, custom user-defined exceptions. Generics, Custom ArrayList, Wildcards, Lambda expressions. Java Thread model, Runnable interface, Thread life cycle, Synchronization, and JDBC basics.',
        videos: [
          {
            id: 'v-oopj-u4-kunal-1',
            title: 'OOP 6: Generics, Custom ArrayList, Lambda Expressions & Exception Handling in Java',
            channel: 'Kunal Kushwaha',
            duration: '2h 05m',
            url: 'https://www.youtube.com/watch?v=OY2lPr8h93U',
            summary: 'Generics type safety, bounded wildcards <? extends T>, custom ArrayList implementation, lambda expressions, try-catch-finally, and custom exceptions.'
          },
          {
            id: 'v-oopj-u4-kunal-2',
            title: 'Multithreading & Concurrency in Java: Thread class vs Runnable & Synchronization',
            channel: 'Telusko / Kunal Kushwaha',
            duration: '42:15',
            url: 'https://www.youtube.com/watch?v=mD_3h_C0p9Y',
            summary: 'Thread states, thread priorities, synchronized methods, synchronized blocks, wait(), notify(), and inter-thread communication.'
          },
          {
            id: 'v-oopj-u4-kunal-3',
            title: 'JDBC Step-by-Step Architecture: Connection, PreparedStatement & Database CRUD',
            channel: 'Telusko',
            duration: '35:20',
            url: 'https://www.youtube.com/watch?v=3n-vH_72s9w',
            summary: 'Connecting Java to MySQL/PostgreSQL databases using JDBC Driver, DriverManager, Statement, and ResultSet execution.'
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'UNIT V: Java Collections Framework Masterclass',
        description: 'Collection Interfaces: List, Set, SortedSet, Queue, Deque, Map. Classes: ArrayList, LinkedList, Vector, Stack, HashSet, LinkedHashSet, TreeSet, PriorityQueue, ArrayDeque, HashMap, LinkedHashMap, TreeMap. Iterators & For-Each loops.',
        videos: [
          {
            id: 'v-oopj-u5-kunal-1',
            title: 'Java Collections Framework Complete Masterclass (Internal Working & Time Complexity)',
            channel: 'Kunal Kushwaha',
            duration: '4h 30m',
            url: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
            summary: 'Detailed architecture of Collections, internal arrays in ArrayList, Node pointers in LinkedList, hashing in HashMap, Red-Black Trees in TreeSet/TreeMap, PriorityQueues, and Iterator patterns.'
          },
          {
            id: 'v-oopj-u5-kunal-2',
            title: 'HashMap & HashSet Internal Working: Hashing, Buckets & Collision Resolution',
            channel: 'Kunal Kushwaha',
            duration: '1h 15m',
            url: 'https://www.youtube.com/watch?v=480gE_wE-2k',
            summary: 'hashCode(), equals(), bucket index calculation, linked list chaining, and treeification in Java 8+.'
          },
          {
            id: 'v-oopj-u5-kunal-3',
            title: 'Bitwise Operators & Number System Math for DSA and Java Coding Interviews',
            channel: 'Kunal Kushwaha',
            duration: '1h 45m',
            url: 'https://www.youtube.com/watch?v=f65OiUP1qMM',
            summary: 'Bit manipulation tricks, find unique element, odd/even check, power of 2, set bits count, and fast exponentiation.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- FLAGSHIP 1: COMPLETE JAVA + DSA + INTERVIEW BOOTCAMP BY KUNAL KUSHWAHA ---
  // =========================================================================
  {
    id: 'kunal-kushwaha-java-dsa-masterclass',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
    subjectCode: 'KUNAL-DSA-BOOTCAMP',
    subjectName: 'Complete Java + DSA Bootcamp (by Kunal Kushwaha)',
    credits: 4,
    scheme: 'Industry Ready 2026',
    category: 'Placement Masterclass',
    description: 'The world-renowned 60+ hour Java, Data Structures, Algorithms, LeetCode, and FAANG interview preparation bootcamp by Kunal Kushwaha. Covers Java fundamentals, Searching, Sorting, Strings, OOP, Recursion, Trees, Graphs, DP, and System Design.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000',
    oneShotVideo: {
      title: 'Complete Java + DSA + Interview Preparation Bootcamp (Full Playlist)',
      channel: 'Kunal Kushwaha',
      url: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ',
      duration: '60+ Hours',
      views: '6.2M'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'MODULE 1: Java Fundamentals, Memory Model & Flow of Program',
        description: 'How Java works, Bytecode, JRE/JDK/JVM, Variables, Conditionals, Loops, Functions, Methods, Scoping, and Time Complexity basics.',
        videos: [
          {
            id: 'v-kk-m1-1',
            title: 'Java Introduction, Setup, Memory Architecture & First Code',
            channel: 'Kunal Kushwaha',
            duration: '1h 12m',
            url: 'https://www.youtube.com/watch?v=4EP8YHp8i60',
            summary: 'JVM internals, Stack vs Heap memory, primitive data types, Scanner input, and compilation workflow.'
          },
          {
            id: 'v-kk-m1-2',
            title: 'Conditionals, Loops & Switch Statements in Java',
            channel: 'Kunal Kushwaha',
            duration: '1h 45m',
            url: 'https://www.youtube.com/watch?v=vvanI8NRlSI',
            summary: 'Nested loops, break and continue, enhanced switch syntax, and solving core math programming problems.'
          },
          {
            id: 'v-kk-m1-3',
            title: 'Functions & Methods in Java: Pass by Value, Scoping & Varargs',
            channel: 'Kunal Kushwaha',
            duration: '1h 30m',
            url: 'https://www.youtube.com/watch?v=vLnPwxZd34I',
            summary: 'Method signature, return types, pass-by-value demonstration with object references, and variable arguments.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'MODULE 2: Arrays, Linear Search & Binary Search (1D and 2D Matrices)',
        description: 'Memory allocation of arrays, dynamic ArrayLists, Linear Search, Binary Search in sorted arrays, Order-Agnostic Binary Search, LeetCode Binary Search problems, and Binary Search in 2D Matrices.',
        videos: [
          {
            id: 'v-kk-m2-1',
            title: 'Arrays & Dynamic ArrayList in Java: Memory Allocation & 2D Matrices',
            channel: 'Kunal Kushwaha',
            duration: '2h 10m',
            url: 'https://www.youtube.com/watch?v=n60Dn0UsbEk',
            summary: 'Arrays in heap, continuous memory concept, multidimensional arrays, dynamic array resizing, and reversing arrays.'
          },
          {
            id: 'v-kk-m2-2',
            title: 'Linear Search Algorithm & LeetCode Problem Solutions',
            channel: 'Kunal Kushwaha',
            duration: '1h 05m',
            url: 'https://www.youtube.com/watch?_HRA37X8N_Q',
            summary: 'Searching in range, searching in strings, minimum number finding, and searching in 2D arrays.'
          },
          {
            id: 'v-kk-m2-3',
            title: 'Binary Search Algorithm & Order-Agnostic Binary Search Explained',
            channel: 'Kunal Kushwaha',
            duration: '1h 25m',
            url: 'https://www.youtube.com/watch?v=fwpFkTXpYrg',
            summary: 'O(log N) divide-and-conquer searching logic, best case vs worst case, and order-agnostic comparison.'
          },
          {
            id: 'v-kk-m2-4',
            title: 'Top LeetCode Binary Search Interview Questions (Ceiling, Floor, First/Last Position, Peak Index)',
            channel: 'Kunal Kushwaha',
            duration: '2h 45m',
            url: 'https://www.youtube.com/watch?v=W9QJ8HaRvSw',
            summary: 'Solving Ceiling of number, Floor, First and Last Position in sorted array, Infinite array search, and Mountain array peak.'
          },
          {
            id: 'v-kk-m2-5',
            title: 'Binary Search in 2D Matrices (Row-Wise & Column-Wise Sorted)',
            channel: 'Kunal Kushwaha',
            duration: '1h 15m',
            url: 'https://www.youtube.com/watch?v=enI_exwq3Gs',
            summary: 'O(N + M) staircase elimination search and O(log(N*M)) strict sorted matrix binary search.'
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'MODULE 3: Sorting Algorithms (Bubble, Selection, Insertion, Cyclic Sort) & Strings',
        description: 'Bubble Sort, Selection Sort, Insertion Sort, Cyclic Sort (Crucial for Amazon/Google missing/duplicate number questions), Pattern Printing, and Strings/StringBuilder.',
        videos: [
          {
            id: 'v-kk-m3-1',
            title: 'Bubble Sort Algorithm: Step-by-Step with Complexity Analysis',
            channel: 'Kunal Kushwaha',
            duration: '50 mins',
            url: 'https://www.youtube.com/watch?v=F5MZyqRp_IM',
            summary: 'Adjacent element comparisons, swapping, best-case O(N) optimization with boolean swapped flag.'
          },
          {
            id: 'v-kk-m3-2',
            title: 'Selection Sort & Insertion Sort Algorithms Explained',
            channel: 'Kunal Kushwaha',
            duration: '1h 15m',
            url: 'https://www.youtube.com/watch?v=Nd4SCCIHFWk',
            summary: 'Finding max/min index in remaining unsorted subarray, inserting into sorted left partition, and why insertion sort is adaptive.'
          },
          {
            id: 'v-kk-m3-3',
            title: 'Cyclic Sort Algorithm: Amazon & Google Favorite Pattern (Missing Number, Disappeared Numbers)',
            channel: 'Kunal Kushwaha',
            duration: '1h 35m',
            url: 'https://www.youtube.com/watch?v=JflhwH15OR4',
            summary: 'Index mapping technique for numbers 1 to N in O(N) time with O(1) auxiliary space.'
          },
          {
            id: 'v-kk-m3-4',
            title: 'Strings, StringBuilder & Character Array Performance in Java',
            channel: 'Kunal Kushwaha',
            duration: '1h 35m',
            url: 'https://www.youtube.com/watch?v=zjxXwD5qTfQ',
            summary: 'String Constant Pool (SCP), immutability, palindrome check, and StringBuilder dynamic character operations.'
          }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'MODULE 4: Object-Oriented Programming (OOP Full 6-Part Masterclass)',
        description: 'Comprehensive OOP: Classes, Objects, Constructors, Static variables/methods, Singleton design pattern, Inheritance, Polymorphism, Encapsulation, Abstraction, Access Modifiers, Interfaces, Generics, and Collections Framework.',
        videos: [
          {
            id: 'v-kk-m4-1',
            title: 'OOP 1: Classes, Objects, Constructors, new & this keyword',
            channel: 'Kunal Kushwaha',
            duration: '1h 55m',
            url: 'https://www.youtube.com/watch?v=BSvc586N45E',
            summary: 'Class templates, stack reference vs heap instance, constructor overloading, and final keyword behavior.'
          },
          {
            id: 'v-kk-m4-2',
            title: 'OOP 2: Packages, Static Context, Singleton Pattern & Inner Classes',
            channel: 'Kunal Kushwaha',
            duration: '1h 40m',
            url: 'https://www.youtube.com/watch?v=4Q_lB_c3lU',
            summary: 'Package organization, static members loaded during class loading, static blocks, and private constructor singleton.'
          },
          {
            id: 'v-kk-m4-3',
            title: 'OOP 3: Inheritance, Polymorphism, Encapsulation & Runtime Dispatch',
            channel: 'Kunal Kushwaha',
            duration: '2h 15m',
            url: 'https://www.youtube.com/watch?v=46T2wYdVElc',
            summary: 'Super keyword, constructor chaining, method overriding rules, runtime polymorphism, and encapsulation.'
          },
          {
            id: 'v-kk-m4-4',
            title: 'OOP 4: Access Modifiers, Protected Specifiers & Object Class Methods',
            channel: 'Kunal Kushwaha',
            duration: '1h 20m',
            url: 'https://www.youtube.com/watch?v=W145DXs8fG8',
            summary: 'Public, private, default, protected access tables, toString(), equals(), hashCode(), and finalize().'
          },
          {
            id: 'v-kk-m4-5',
            title: 'OOP 5: Abstract Classes, Interfaces, Multiple Inheritance & Default Methods',
            channel: 'Kunal Kushwaha',
            duration: '1h 50m',
            url: 'https://www.youtube.com/watch?v=rg1P9VpD_B0',
            summary: 'Abstract methods, interface specifications, multiple interface implementation, and static methods in interfaces.'
          },
          {
            id: 'v-kk-m4-6',
            title: 'OOP 6: Generics, Custom ArrayList, Lambda Expressions & Exception Handling',
            channel: 'Kunal Kushwaha',
            duration: '2h 05m',
            url: 'https://www.youtube.com/watch?v=OY2lPr8h93U',
            summary: 'Generic classes, type parameters, lambda functions, try-catch blocks, throw, throws, and custom exceptions.'
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'MODULE 5: Recursion, Backtracking, Bitwise Math & Dynamic Programming',
        description: 'Recursion basics, Recursive tree visualization, Subset sums, Permutations, Backtracking (N-Queens, Sudoku Solver, Knights Tour), Bitwise operations, and Dynamic Programming intro.',
        videos: [
          {
            id: 'v-kk-m5-1',
            title: 'Recursion Introduction: Call Stack, Base Conditions & Recurrence Relations',
            channel: 'Kunal Kushwaha',
            duration: '1h 45m',
            url: 'https://www.youtube.com/watch?v=M2uO2nMT0Bk',
            summary: 'How recursion works in memory, call stack frames, base cases, and writing pure recursive functions.'
          },
          {
            id: 'v-kk-m5-2',
            title: 'Recursion with Arrays & Linear/Binary Search via Recursion',
            channel: 'Kunal Kushwaha',
            duration: '1h 20m',
            url: 'https://www.youtube.com/watch?v=sTdiMLom00U',
            summary: 'Checking if array is sorted recursively, linear search returning ArrayList of multiple occurrences, and rotated binary search.'
          },
          {
            id: 'v-kk-m5-3',
            title: 'Recursion Pattern Questions, Bubble Sort & Selection Sort using Recursion',
            channel: 'Kunal Kushwaha',
            duration: '1h 10m',
            url: 'https://www.youtube.com/watch?v=ymgnIIclCF0',
            summary: 'Triangle patterns, recursive bubble sort, and recursive selection sort step-by-step.'
          },
          {
            id: 'v-kk-m5-4',
            title: 'Merge Sort & In-Place Merge Sort using Recursion & Divide-and-Conquer',
            channel: 'Kunal Kushwaha',
            duration: '1h 30m',
            url: 'https://www.youtube.com/watch?v=iKGAgWdgoRk',
            summary: 'Divide and conquer strategy, merging two sorted arrays, in-place merge sort, and time complexity derivation.'
          },
          {
            id: 'v-kk-m5-5',
            title: 'Quick Sort Algorithm using Recursion & Pivot Partitioning',
            channel: 'Kunal Kushwaha',
            duration: '1h 15m',
            url: 'https://www.youtube.com/watch?v=Z8svOqfqDnl',
            summary: 'Pivot selection, swapping around pivot, recursive partitioning, and worst-case prevention.'
          },
          {
            id: 'v-kk-m5-6',
            title: 'Backtracking Masterclass: Mazes, Obstacles, All Paths & Matrix Traversals',
            channel: 'Kunal Kushwaha',
            duration: '2h 15m',
            url: 'https://www.youtube.com/watch?v=zg5v2vZxp9k',
            summary: 'State restoration, marking visited cells, restoring visited array upon backtracking, and printing full path steps.'
          },
          {
            id: 'v-kk-m5-7',
            title: 'N-Queens, N-Knights & Sudoku Solver Complete Backtracking Solutions',
            channel: 'Kunal Kushwaha',
            duration: '2h 30m',
            url: 'https://www.youtube.com/watch?v=nC1rbW2YSz0',
            summary: 'Placing non-attacking queens on N*N chessboard, isValid safe checks, knight placements, and 9*9 Sudoku solver.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- FLAGSHIP 2: GIT, GITHUB & OPEN SOURCE BOOTCAMP BY KUNAL KUSHWAHA ---
  // =========================================================================
  {
    id: 'kunal-kushwaha-git-github-bootcamp',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
    subjectCode: 'KUNAL-GIT-DEVOPS',
    subjectName: 'Git, GitHub & Open Source Masterclass (by Kunal Kushwaha)',
    credits: 2,
    scheme: 'Industry Ready 2026',
    category: 'Placement Masterclass',
    description: 'Complete Git, GitHub, Version Control, Pull Requests, Open Source Contributions, and DevOps pipeline fundamentals taught by Kunal Kushwaha.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000',
    oneShotVideo: {
      title: 'Complete Git and GitHub Tutorial for Beginners to Advanced (Masterclass)',
      channel: 'Kunal Kushwaha',
      url: 'https://www.youtube.com/watch?v=apGV9Kg7ics',
      duration: '2h 45m',
      views: '3.1M'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnoqBXdMwUTjGgi95E2CpXTU',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'MODULE 1: Version Control & Git Fundamentals',
        description: 'What is version control, Git architecture, Working directory, Staging area, Local repo, Commits, and Logs.',
        videos: [
          {
            id: 'v-kk-git-1',
            title: 'Complete Git & GitHub Tutorial for Beginners to Pro',
            channel: 'Kunal Kushwaha',
            duration: '2h 45m',
            url: 'https://www.youtube.com/watch?v=apGV9Kg7ics',
            summary: 'git init, git add, git commit, git status, git log, git diff, branching, merging, and merge conflicts.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'MODULE 2: GitHub, Remote Repositories & Open Source Pull Requests',
        description: 'Pushing to remote GitHub, cloning, forks, pull requests, upstream syncing, and landing open-source internships (GSoC, LFX, MLH).',
        videos: [
          {
            id: 'v-kk-git-2',
            title: 'How to Contribute to Open Source: Step-by-Step Pull Request Guide',
            channel: 'Kunal Kushwaha',
            duration: '1h 15m',
            url: 'https://www.youtube.com/watch?v=msyGUtUCun8',
            summary: 'Forking repositories, creating feature branches, submitting PRs, resolving code reviews, and contributing to top GitHub projects.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- 5. ADSA LAB (ADSA(P)) ---
  // Scheme: 2023 | Code: CS204 | Category: PC | Credits: 1.5
  // =========================================================================
  {
    id: 'cse-sem3-cs204-adsalab',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'CSE(DS)', 'CSBS'],
    semester: 'Sem 3',
    subjectCode: 'CS204',
    subjectName: 'Advanced Data Structures & Algorithms Lab (ADSA(P))',
    credits: 1.5,
    scheme: '2023 Scheme',
    category: 'PC Lab',
    description: 'Hands-on lab implementations: AVL Tree operations, B-Tree operations, Heap Sort, Graph BFT/DFT, String Searching (Brute Force & Boyer-Moore), Quick & Merge Sort analysis, Dijkstra Shortest Path, Fractional Knapsack & Job Sequencing, All-Pairs Shortest Paths (Floyd-Warshall), and N-Queens Problem using Backtracking.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000',
    oneShotVideo: {
      title: 'ADSA Lab Complete Code Walkthroughs (All 10 Programs)',
      channel: 'Campus Coding Lab',
      url: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
      duration: '4h 10m',
      views: '340K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Lab Experiments (1 to 5): Tree & Search Implementations',
        description: 'AVL Tree insertion/deletion from file, B-Tree insertion/searching, Heap Sort program, Graph BFT/DFT with Adjacency Matrix & Lists, String Processing (Brute Force & Boyer Moore).',
        videos: [
          {
            id: 'v-adsa-lab-1',
            title: 'Exp 1: Construct AVL Tree & Implement Insert/Delete Operations in C/C++',
            channel: 'Code Help',
            duration: '22:40',
            url: 'https://www.youtube.com/watch?v=jDM6_TnYIuE',
            summary: 'Writing file reading routines and balance factor rotation code.'
          },
          {
            id: 'v-adsa-lab-2',
            title: 'Exp 2: B-Tree Construction, Search & Insert Operations Code',
            channel: 'Abdul Bari',
            duration: '28:15',
            url: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
            summary: 'Handling m-way node splitting and disk-friendly multi-key blocks.'
          },
          {
            id: 'v-adsa-lab-3',
            title: 'Exp 3: Heap Sort Algorithm C++ Implementation with Heapify',
            channel: 'Jenny\'s Lectures',
            duration: '19:30',
            url: 'https://www.youtube.com/watch?v=HqPJF2L5h9U',
            summary: 'Building max-heap and in-place array element swapping.'
          },
          {
            id: 'v-adsa-lab-4',
            title: 'Exp 4 & 5: Graph BFS/DFS & Boyer-Moore String Matching Code',
            channel: 'Abdul Bari',
            duration: '25:10',
            url: 'https://www.youtube.com/watch?v=4Xyhb72LCX4',
            summary: 'Adjacency list representations and bad character table lookup implementation.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Lab Experiments (6 to 10): Algorithm Design Paradigms',
        description: 'Quick Sort & Merge Sort execution time comparison, Dijkstra Greedy Shortest Path, Fractional Knapsack & Job Sequencing, Floyd-Warshall All Pairs Shortest Path, N-Queens Problem using Backtracking.',
        videos: [
          {
            id: 'v-adsa-lab-6',
            title: 'Exp 6 & 7: Merge/Quick Sort Execution Time Benchmarking & Dijkstra Path Code',
            channel: 'Abdul Bari',
            duration: '26:40',
            url: 'https://www.youtube.com/watch?v=XB4MIexjvY0',
            summary: 'Calculating execution time in milliseconds and Dijkstra adjacency matrix traversal.'
          },
          {
            id: 'v-adsa-lab-8',
            title: 'Exp 8 & 9: Fractional Knapsack & Floyd-Warshall DP All-Pairs Shortest Path',
            channel: 'Abdul Bari',
            duration: '24:20',
            url: 'https://www.youtube.com/watch?v=oNI0rf2P9gE',
            summary: 'Profit/weight density sorting and 3-loop matrix updating.'
          },
          {
            id: 'v-adsa-lab-10',
            title: 'Exp 10: N-Queens Problem Solution using Backtracking Code Walkthrough',
            channel: 'Abdul Bari',
            duration: '21:50',
            url: 'https://www.youtube.com/watch?v=xFv_Hl4B83A',
            summary: 'isSafe() placement check and recursive board state printing.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- 6. OOP JAVA LAB (OOPJ(P)) ---
  // Scheme: 2023 | Code: CS205 | Category: PC | Credits: 1.5
  // =========================================================================
  {
    id: 'cse-sem3-cs205-oopjlab',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'CSE(DS)', 'CSBS'],
    semester: 'Sem 3',
    subjectCode: 'CS205',
    subjectName: 'Object Oriented Programming through Java Lab (OOPJ(P))',
    credits: 1.5,
    scheme: '2023 Scheme',
    category: 'PC Lab',
    description: 'Practical lab programs: Class & object mechanism, method & constructor overloading, Single/Multi/Hierarchical Inheritance, Abstract classes & Interfaces, Dynamic Method Dispatch, User-defined Packages, String handling, Exception handling (Multiple catch, Custom Exceptions), Multithreading (Thread/Runnable, isAlive, join, Synchronization, Producer-Consumer), Collections (ArrayList, LinkedList, HashSet).',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    oneShotVideo: {
      title: 'Java Lab Programs Complete Execution & Viva Guide',
      channel: 'Telusko Lab',
      url: 'https://www.youtube.com/watch?v=BGTx91t8q50',
      duration: '3h 45m',
      views: '290K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Lab Programs (1 to 4): Core OOP & Package Mechanisms',
        description: 'Class & Object creation, method & constructor overloading, Inheritance hierarchies, Abstract shapes & Interfaces, Dynamic Method Dispatch, and User-defined package import.',
        videos: [
          {
            id: 'v-java-lab-1',
            title: 'Prog 1 & 2: Class Mechanism, Overloading & Inheritance Hierarchies in Java',
            channel: 'Apna College',
            duration: '25:10',
            url: 'https://www.youtube.com/watch?v=bSrm9RXwBaI',
            summary: 'Writing clean Java classes with multiple constructors and subclass extends keywords.'
          },
          {
            id: 'v-java-lab-3',
            title: 'Prog 3 & 4: Dynamic Method Dispatch & User-Defined Packages in Java',
            channel: 'Telusko',
            duration: '22:30',
            url: 'https://www.youtube.com/watch?v=46T2wYdVElc',
            summary: 'Implementing Shape base class with Circle/Rectangle subclasses and package directory bundling.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Lab Programs (5 to 8): Strings, Exceptions, Multithreading & Collections',
        description: 'String handling routines, Built-in and Custom Exceptions with multiple catch blocks, Multithreading (Hello/Welcome timers, isAlive, join, Producer-Consumer Problem), and Collections (ArrayList, LinkedList, HashSet).',
        videos: [
          {
            id: 'v-java-lab-5',
            title: 'Prog 5 & 6: String Manipulation & Custom Exception Handling in Java',
            channel: 'Telusko',
            duration: '24:15',
            url: 'https://www.youtube.com/watch?v=e_wK3b6Fk2s',
            summary: 'Custom AgeNotValidException, try-catch-finally block structure and string methods.'
          },
          {
            id: 'v-java-lab-7',
            title: 'Prog 7 & 8: Multithreading Timers, Producer-Consumer & Collections Program',
            channel: 'Telusko',
            duration: '31:45',
            url: 'https://www.youtube.com/watch?v=mD_3h_C0p9Y',
            summary: 'Thread sleep timers, wait/notify synchronized queue, and ArrayList/HashSet student records.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- ECE SEM 4: Analog Electronics ---
  // =========================================================================
  {
    id: 'ece-sem4-analog',
    branch: 'ECE',
    branchesApplicable: ['ECE'],
    semester: 'Sem 4',
    subjectCode: 'EC401',
    subjectName: 'Analog Electronic Circuits',
    credits: 4,
    description: 'BJT & MOSFET Amplifiers, Frequency Response, Feedback Amplifiers, Op-Amps, Oscillators & Waveform Generators.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000',
    oneShotVideo: {
      title: 'Analog Electronics Complete Marathon',
      channel: 'Neso Academy',
      url: 'https://www.youtube.com/watch?v=QwtQj46rUa4',
      duration: '9h 20m',
      views: '740K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiw-GZRqfnlVIBz9dxrqHJS',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit 1: Small Signal BJT & FET Amplifiers',
        description: 'h-parameter model, Common Emitter, Common Collector analysis, Voltage gain, Input/Output impedance.',
        videos: [
          {
            id: 'v-ece-u1-1',
            title: 'Common Emitter (CE) Amplifier Analysis & Voltage Gain',
            channel: 'Neso Academy',
            duration: '31:15',
            url: 'https://www.youtube.com/watch?v=7uV8-W3K-2E',
            summary: 'Small-signal equivalent circuit modeling and frequency characteristics.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- EEE SEM 3: Circuit Theory ---
  // =========================================================================
  {
    id: 'eee-sem3-circuits',
    branch: 'EEE',
    branchesApplicable: ['EEE'],
    semester: 'Sem 3',
    subjectCode: 'EE301',
    subjectName: 'Electric Circuit Analysis & Network Theory',
    credits: 4,
    description: 'KVL, KCL, Mesh & Nodal Analysis, Network Theorems (Thevenin, Norton, Superposition, Maximum Power Transfer), Transient Analysis.',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000',
    oneShotVideo: {
      title: 'Network Analysis Full Course in One Shot',
      channel: 'Gate Academy / Neso Academy',
      url: 'https://www.youtube.com/watch?v=Yf7L2tT-6Z4',
      duration: '8h 40m',
      views: '610K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XR3PKEZ9fxrapGg',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit 1: Network Theorems (DC & AC)',
        description: 'Superposition Theorem, Thevenin\'s Theorem, Norton\'s Theorem, Maximum Power Transfer Theorem.',
        videos: [
          {
            id: 'v-eee-u1-1',
            title: 'Thevenin and Norton Theorem Numerical Solved Step-by-Step',
            channel: 'Gate Smashers',
            duration: '27:40',
            url: 'https://www.youtube.com/watch?v=6r0dK7u1GkY',
            summary: 'Vth and Rth calculation with dependent and independent voltage/current sources.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- CIVIL SEM 3: Strength of Materials ---
  // =========================================================================
  {
    id: 'civil-sem3-som',
    branch: 'Civil',
    branchesApplicable: ['Civil'],
    semester: 'Sem 3',
    subjectCode: 'CE301',
    subjectName: 'Strength of Materials & Solid Mechanics',
    credits: 4,
    description: 'Stress and Strain, Shear Force & Bending Moment Diagrams (SFD & BMD), Flexural Stresses, Torsion in Shafts, Deflection of Beams.',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?q=80&w=1000',
    oneShotVideo: {
      title: 'Strength of Materials Full Course Revision',
      channel: 'Gate Academy / NPTEL',
      url: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
      duration: '7h 15m',
      views: '450K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit 1: Simple Stresses & Strains',
        description: 'Hooke\'s Law, Elastic Moduli (E, G, K), Thermal Stresses, Strain Energy, Principal Stresses & Mohr\'s Circle.',
        videos: [
          {
            id: 'v-ce-u1-1',
            title: 'Mohr Circle of Stress Step by Step Construction',
            channel: 'Learn Engineering',
            duration: '22:15',
            url: 'https://www.youtube.com/watch?v=jDM6_TnYIuE',
            summary: 'Graphical determination of principal stresses and maximum shear planes.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // --- MECHANICAL SEM 3: Thermodynamics ---
  // =========================================================================
  {
    id: 'mech-sem3-thermo',
    branch: 'Mechanical',
    branchesApplicable: ['Mechanical'],
    semester: 'Sem 3',
    subjectCode: 'ME301',
    subjectName: 'Engineering Thermodynamics',
    credits: 4,
    description: 'First and Second Laws of Thermodynamics, Carnot Cycle, Entropy, Availability, Pure Substances, Steam Tables, Rankine & Otto Cycles.',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000',
    oneShotVideo: {
      title: 'Thermodynamics Complete Course Marathon',
      channel: 'NPTEL / Gate Smashers',
      url: 'https://www.youtube.com/watch?v=QwtQj46rUa4',
      duration: '8h 30m',
      views: '520K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XR3PKEZ9fxrapGg',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Unit 1: First Law of Thermodynamics',
        description: 'Closed and Open System Work, Heat Transfer, Steady Flow Energy Equation (SFEE), Internal Energy & Enthalpy.',
        videos: [
          {
            id: 'v-me-u1-1',
            title: 'Steady Flow Energy Equation (SFEE) Derivation & Applications',
            channel: 'Gate Smashers',
            duration: '28:10',
            url: 'https://www.youtube.com/watch?v=7uV8-W3K-2E',
            summary: 'Application of First Law to Nozzles, Diffusers, Turbines and Compressors.'
          }
        ]
      }
    ]
  }
];

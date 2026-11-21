import { SCHEME_2026_SUBJECTS } from './scheme2026CurriculumData';
// Comprehensive Engineering Curriculum & Verified Academic Notes Database
// Tailored for GPREC & Autonomous Engineering Curricula across all Branches and Semesters

export const BRANCH_LIST = [
  { id: 'CSE', name: 'Computer Science & Engineering', icon: '💻', short: 'CSE', color: 'from-cyan-500 to-blue-600', accent: 'cyan' },
  { id: 'CSM', name: 'CSE (AI & Machine Learning)', icon: '🤖', short: 'CSM', color: 'from-purple-500 to-indigo-600', accent: 'purple' },
  { id: 'ECE', name: 'Electronics & Communication', icon: '⚡', short: 'ECE', color: 'from-amber-500 to-orange-600', accent: 'amber' },
  { id: 'EEE', name: 'Electrical & Electronics', icon: '💡', short: 'EEE', color: 'from-yellow-500 to-amber-600', accent: 'yellow' },
  { id: 'Civil', name: 'Civil Engineering', icon: '🏗️', short: 'Civil', color: 'from-emerald-500 to-teal-600', accent: 'emerald' },
  { id: 'Mechanical', name: 'Mechanical Engineering', icon: '⚙️', short: 'Mech', color: 'from-rose-500 to-red-600', accent: 'rose' },
];

export const SEMESTER_LIST = [
  'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'
];

export const SCHEMES_LIST = [
  { id: 'Scheme-2026', name: 'Scheme-2026 (New Autonomous Syllabus)', short: 'Scheme-2026', badge: 'NEW ✨', desc: 'AI-Integrated 1st Year Engineering Curriculum' },
  { id: '2023 Scheme', name: 'Scheme-2023 (Autonomous Curriculum)', short: 'Scheme-2023', badge: 'CURRENT 🏛️', desc: 'Established B.Tech Engineering Curriculum' }
];

export const CURRICULUM_SUBJECTS = [
  ...SCHEME_2026_SUBJECTS,
  // =========================================================================
  // SCHEME-2023 (CURRENT CORE CURRICULUM)
  // =========================================================================
  {
    id: 'cse-sem3-cs202-adsa',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CS202',
    name: 'Advanced Data Structures & Algorithms (ADSA)',
    credits: 4,
    category: 'Professional Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Asymptotic Analysis, Balanced BSTs (AVL, Red-Black Trees, Splay Trees), Multiway Trees (B-Trees, B+ Trees), Priority Queues, Disjoint Set Union, Graph Algorithms (Dijkstra, Bellman-Ford, Kruskal, Prim), Dynamic Programming, and Divide-and-Conquer paradigms.',
    syllabus: [
      'Unit I: Asymptotic Notations, Recurrences, Master Theorem, Amortized Analysis.',
      'Unit II: Balanced Search Trees: AVL Trees, Red-Black Trees, Splay Trees & 2-3-4 Trees.',
      'Unit III: Priority Queues & Heaps: Binary Heap, Binomial Heap, Fibonacci Heap, Disjoint Sets.',
      'Unit IV: Multiway Search Trees: B-Trees, B+ Trees, Indexing Techniques, Trie & Suffix Trees.',
      'Unit V: Graph Algorithms: Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall), Spanning Trees (Kruskal, Prim), Flow Networks.'
    ],
    notes: [
      {
        id: 'adsa-u1-notes',
        title: 'ADSA Unit 1: Asymptotic Complexity & Recurrence Relations',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '28 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://ykuyzkhhnltjccyzduap.supabase.co/storage/v1/object/public/academic_resources/contributions/1783536363296_Unit_5_Questions.pdf',
        isVerified: true
      },
      {
        id: 'adsa-u2-notes',
        title: 'ADSA Unit 2: Balanced Search Trees (AVL & Red-Black Trees)',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '34 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'adsa-u3-notes',
        title: 'ADSA Unit 3: Advanced Heaps, Binomial & Fibonacci Heaps',
        unit: 'Unit 3',
        type: 'PDF Document',
        pages: '22 Pages',
        author: 'Prof. Academic Desk',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'adsa-u4-notes',
        title: 'ADSA Unit 4: B-Trees, B+ Trees & File Indexing Techniques',
        unit: 'Unit 4',
        type: 'PDF Document',
        pages: '30 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'adsa-u5-notes',
        title: 'ADSA Unit 5: Graph Theory, Shortest Paths & Network Flow',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '38 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'adsa-pyq-2024',
        title: 'ADSA Previous Year Mid-1 & Mid-2 Question Papers (Solved)',
        unit: 'Exam Special',
        type: 'PYQ Paper',
        pages: '16 Pages',
        author: 'Exam Cell Archive',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'One Shot DSA & Trees Revision', channel: 'Abdul Bari / Striver', videos: 14, duration: '12h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Advanced Data Structures Masterclass', channel: 'Abdul Bari Algorithms', videos: 84, duration: '48h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Striver A2Z DSA Sheet & LeetCode Hard', channel: 'take U forward', videos: 190, duration: '120h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000', playlistUrl: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' },
        alternatives: []
      }
    }
  },

  {
    id: 'cse-sem3-cs203-oopj',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CS203',
    name: 'Object Oriented Programming through Java (OOPJ)',
    credits: 3,
    category: 'Professional Core',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'Java bytecode, JVM architecture, OOP principles (Encapsulation, Inheritance, Polymorphism, Abstraction), Packages, Interfaces, Exception Handling, Multithreading, Generics, Collections Framework, Streams API, and JavaFX/Swing GUI development.',
    syllabus: [
      'Unit I: Java Basics, JVM architecture, Primitive data types, OOP principles, Constructors.',
      'Unit II: Inheritance, Polymorphism, Method Overriding, Abstract Classes, Packages & Interfaces.',
      'Unit III: Exception Handling (try-catch-finally, throws, custom exceptions), String & StringBuffer.',
      'Unit IV: Multithreaded Programming, Thread lifecycle, Synchronization, Inter-thread communication.',
      'Unit V: Java Collections Framework (List, Set, Map), Generics, Lambda Expressions & File I/O.'
    ],
    notes: [
      {
        id: 'oopj-u1-notes',
        title: 'Java Fundamentals & OOP Paradigm Unit 1 Notes',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '32 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'oopj-u2-notes',
        title: 'Inheritance, Interfaces & Packages Unit 2 Notes',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '26 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'oopj-u3-notes',
        title: 'Exception Handling & String Tokenizer Unit 3 Notes',
        unit: 'Unit 3',
        type: 'PDF Document',
        pages: '24 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'oopj-u4-notes',
        title: 'Multithreading & Concurrency Unit 4 Notes',
        unit: 'Unit 4',
        type: 'PDF Document',
        pages: '30 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'oopj-u5-notes',
        title: 'Java Collections Framework & Streams API Unit 5 Notes',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '40 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'oopj-cheatsheet',
        title: 'Java OOP Complete Quick Revision Cheatsheet & Code Snippets',
        unit: 'Cheatsheet',
        type: 'Revision Cheatsheet',
        pages: '12 Pages',
        author: 'Lumixora Academic Team',
        fileUrl: 'https://drive.google.com/file/d/1XYbDk-CXzIQXY1OVQVzRg_XfKXxApt27/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Java One Shot in One Video (Full Course)', channel: 'freeCodeCamp / Kunal', videos: 1, duration: '10h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=A74TOX803D0' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Java + DSA Bootcamp by Kunal Kushwaha', channel: 'Kunal Kushwaha', videos: 65, duration: '60h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Advanced Spring Boot & Microservices in Java', channel: 'Amigoscode', videos: 40, duration: '35h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=GykTLqODQuU' },
        alternatives: []
      }
    }
  },

  {
    id: 'common-sem3-hsm202-mefa',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3', 'Sem 4'],
    code: 'HSM 202',
    name: 'Managerial Economics and Financial Analysis (MEFA)',
    credits: 2,
    category: 'Humanities & Social Sciences',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'Demand Analysis, Elasticity of Demand, Production & Cost Functions, Break-Even Analysis (BEA), Market Structures (Monopoly, Oligopoly, Perfect Competition), Capital Budgeting (NPV, IRR, Payback), Double-Entry Accounting, Final Accounts & Financial Ratio Analysis.',
    syllabus: [
      'Unit I: Managerial Economics, Nature, Scope, Law of Demand & Elasticity of Demand.',
      'Unit II: Production Function, Isoquants, Cost Concepts, Break-Even Analysis (BEA).',
      'Unit III: Market Structures (Perfect Competition, Monopoly, Monopolistic), Pricing Strategies.',
      'Unit IV: Capital Budgeting, Working Capital, Evaluation Methods (Payback, ARR, NPV, IRR).',
      'Unit V: Financial Accounting, Double Entry System, Journal, Ledger, Trial Balance, Final Accounts & Ratios.'
    ],
    notes: [
      {
        id: 'mefa-u1-notes',
        title: 'MEFA Unit 1: Managerial Economics & Demand Analysis Complete Notes',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '25 Pages',
        author: 'Dept. of Humanities & Management, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'mefa-u2-notes',
        title: 'MEFA Unit 2: Production Function & Break-Even Analysis Formulas',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '22 Pages',
        author: 'Dept. of Humanities & Management, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'mefa-u3-notes',
        title: 'MEFA Unit 3: Market Structures & Pricing Methods Handbook',
        unit: 'Unit 3',
        type: 'PDF Document',
        pages: '20 Pages',
        author: 'Dept. of Humanities & Management, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'mefa-u4-notes',
        title: 'MEFA Unit 4: Capital Budgeting (NPV, IRR, Payback Problems & Solutions)',
        unit: 'Unit 4',
        type: 'PDF Document',
        pages: '35 Pages',
        author: 'Dept. of Humanities & Management, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'mefa-u5-notes',
        title: 'MEFA Unit 5: Accounting Principles, Journal, Ledger & Ratio Analysis',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '42 Pages',
        author: 'Dept. of Humanities & Management, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'mefa-pyq-bundle',
        title: 'MEFA 5-Year Question Papers & Formula Sheets',
        unit: 'Exam Special',
        type: 'PYQ Paper',
        pages: '28 Pages',
        author: 'Autonomous Exam Wing',
        fileUrl: 'https://drive.google.com/file/d/1XYbDk-CXzIQXY1OVQVzRg_XfKXxApt27/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'MEFA Complete Playlist in 5 Hours', channel: "Devika's Commerce Academy", videos: 35, duration: '18h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PLLhSIFfDZcUW8eZFwPrZjj_TBdelHfHho' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Managerial Economics and Financial Analysis Complete Lecture Series', channel: 'NPTEL / Devika', videos: 40, duration: '28h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PLLhSIFfDZcUW8eZFwPrZjj_TBdelHfHho' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Corporate Financial Valuation & Investment Banking Basics', channel: 'Wall Street Prep', videos: 18, duration: '14h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=356_pioFiss' },
        alternatives: []
      }
    }
  },

  {
    id: 'common-sem3-hsm201-uhv',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3', 'Sem 4'],
    code: 'HSM 201',
    name: 'Universal Human Values (UHV)',
    credits: 3,
    category: 'Humanities & Social Sciences',
    difficulty: 'Easy',
    scheme: '2023 Scheme',
    description: 'Harmony in the Human Being, Self-exploration, Natural Acceptance, Harmony in the Family and Society, Trust and Respect as Foundational Values, Harmony in Nature and Existence, Holistic Alternative, Ethics and Sustainable Life.',
    syllabus: [
      'Unit I: Introduction to Value Education, Self-Exploration, Continuous Happiness and Prosperity.',
      'Unit II: Harmony in the Human Being: Understanding the Self and Body, Sanyam and Health.',
      'Unit III: Harmony in the Family and Society: Trust (Vishwas), Respect (Samman), Nine Feelings.',
      'Unit IV: Harmony in Nature & Existence: Interconnectedness, Co-existence (Sah-astitva).',
      'Unit V: Implications of Holistic Understanding on Professional Ethics and Universal Human Order.'
    ],
    notes: [
      {
        id: 'uhv-all-units',
        title: 'Universal Human Values (UHV) Complete 5-Units Consolidated Guide',
        unit: 'All Units',
        type: 'PDF Document',
        pages: '48 Pages',
        author: 'AICTE & GPREC Humanities Cell',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'uhv-exam-qa',
        title: 'UHV Most Expected Semester Exam Questions & Model Answers',
        unit: 'Exam Special',
        type: 'PYQ Paper',
        pages: '18 Pages',
        author: 'Value Education Wing',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'UHV Complete One-Shot Revision for Sem Exams', channel: 'Knowledge Gate / AICTE', videos: 10, duration: '6h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Universal Human Values - Official AICTE Workshop Series', channel: 'AICTE Official', videos: 25, duration: '20h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Ethics in Engineering Leadership & Tech Culture', channel: 'MIT OpenCourseWare', videos: 12, duration: '10h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      }
    }
  },

  {
    id: 'cse-sem3-cs201-dmgt',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CS201',
    name: 'Discrete Mathematical Structures & Graph Theory (DMGT)',
    credits: 3,
    category: 'Basic Sciences & Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Propositional and Predicate Logic, Proof Techniques, Sets, Relations, Posets and Lattices, Functions, Generating Functions, Recurrence Relations, Combinatorics, Graph Theory, Eulerian & Hamiltonian Circuits, Trees, Planar Graphs, Algebraic Structures & Monoids.',
    syllabus: [
      'Unit I: Mathematical Logic: Statements, Connectives, Normal Forms (CNF/DNF), Predicate Calculus.',
      'Unit II: Set Theory, Relations, Equivalence Relations, Partial Ordering, Hasse Diagrams, Lattices.',
      'Unit III: Combinatorics: Permutations, Combinations, Pigeonhole Principle, Inclusion-Exclusion Principle.',
      'Unit IV: Recurrence Relations: Solving Homogeneous and Non-Homogeneous Recurrence Relations.',
      'Unit V: Graph Theory: Basic Terminology, Isomorphism, Eulerian and Hamiltonian Graphs, Planar Graphs, Chromatic Number.'
    ],
    notes: [
      {
        id: 'dmgt-u1-notes',
        title: 'DMGT Unit 1: Propositional Logic & Truth Tables Notes',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '28 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18f1wL37NSF-ukin-F49G9ugpedqkWnak/view?usp=drive_link',
        isVerified: true
      },
      {
        id: 'dmgt-u2-notes',
        title: 'DMGT Unit 2: Relations, Posets, Hasse Diagrams & Lattices',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '31 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'dmgt-u5-notes',
        title: 'DMGT Unit 5: Graph Theory, Coloring & Planar Graphs',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '36 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Discrete Mathematics in 1 Shot', channel: 'Gate Smashers', videos: 18, duration: '14h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9AU560UFdW69pTUx545p' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Discrete Mathematics & Graph Theory Course', channel: 'Gate Smashers', videos: 75, duration: '38h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9AU560UFdW69pTUx545p' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Mathematics for Computer Science', channel: 'MIT 6.042J', videos: 30, duration: '35h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=L3LMbpZIKhQ' },
        alternatives: []
      }
    }
  },

  {
    id: 'cse-sem3-cs204-adsalab',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CS204',
    name: 'Advanced Data Structures & Algorithms Lab (ADSA(P))',
    credits: 1.5,
    category: 'Practical Laboratory',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'Implementation of AVL Trees, Red-Black Trees, B-Trees, Graph Traversal Algorithms, Minimum Spanning Trees (Kruskal and Prim), Dijkstra algorithm, and Dynamic Programming optimization in C++/Java.',
    syllabus: [
      'Lab Cycle 1: Implementation of AVL Tree insertion and rotation routines.',
      'Lab Cycle 2: Implementation of B-Tree of order m and operations.',
      'Lab Cycle 3: Disjoint Sets and Kruskal / Prim MST implementation.',
      'Lab Cycle 4: Dijkstra Single Source Shortest Path with Priority Queue.',
      'Lab Cycle 5: Longest Common Subsequence and Knapsack 0/1 using Dynamic Programming.'
    ],
    notes: [
      {
        id: 'adsa-lab-manual',
        title: 'ADSA Lab Manual & Executable Source Codes (All Cycles)',
        unit: 'Lab Manual',
        type: 'Lab Manual',
        pages: '45 Pages',
        author: 'Dept. of CSE Lab Incharge',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'DSA Lab Experiments Step-by-Step', channel: 'Code Help', videos: 10, duration: '5h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      complete: {
        featured: { title: 'All ADSA Lab Programs in C++ and Java', channel: 'Abdul Bari', videos: 15, duration: '8h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Competitive Programming Clean Code Techniques', channel: 'Errichto', videos: 20, duration: '12h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      }
    }
  },

  {
    id: 'cse-sem3-cs205-oopjlab',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CS205',
    name: 'Object Oriented Programming through Java Lab (OOPJ(P))',
    credits: 1.5,
    category: 'Practical Laboratory',
    difficulty: 'Easy',
    scheme: '2023 Scheme',
    description: 'Practical lab covering Java OOP fundamentals: class creation, inheritance hierarchies, abstract classes, interface contracts, exception handling mechanisms, multithreaded producers-consumers, and Collections frameworks.',
    syllabus: [
      'Lab Cycle 1: Java Classes, Objects, Overloading, and Parameter passing.',
      'Lab Cycle 2: Inheritance, Abstract classes, and Multiple Interface realization.',
      'Lab Cycle 3: User-defined Exceptions and Checked/Unchecked error handling.',
      'Lab Cycle 4: Producer-Consumer multithreaded synchronization.',
      'Lab Cycle 5: Mini-Project using Java Collections and File Serialization.'
    ],
    notes: [
      {
        id: 'oopj-lab-manual',
        title: 'Java Programming Lab Manual & Executable Code Exercises',
        unit: 'Lab Manual',
        type: 'Lab Manual',
        pages: '42 Pages',
        author: 'Dept. of CSE Lab Incharge',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Java Lab Programs Walkthrough', channel: 'Telusko', videos: 12, duration: '4h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=A74TOX803D0' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Java Practical Lab Course', channel: 'Kunal Kushwaha', videos: 25, duration: '14h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Enterprise Java Development Practices', channel: 'Amigoscode', videos: 16, duration: '10h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=A74TOX803D0' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // CSE - SEMESTER 4
  // =========================================================================
  {
    id: 'cse-sem4-cs401-dbms',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE'],
    semester: 'Sem 4',
    semestersApplicable: ['Sem 4'],
    code: 'CS401',
    name: 'Database Management Systems (DBMS)',
    credits: 3,
    category: 'Professional Core',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'Entity-Relationship (ER) Modeling, Relational Algebra, SQL queries (DDL, DML, DCL), Functional Dependencies, Normalization (1NF, 2NF, 3NF, BCNF, 4NF), Transaction Processing (ACID), Concurrency Control (2PL, Timestamping), and Indexing (B+ Trees).',
    syllabus: [
      'Unit I: Introduction to DBMS, Data Models, Database Architecture, ER Diagrams.',
      'Unit II: Relational Model, Relational Algebra, Calculus, SQL DDL/DML/DCL commands & Triggers.',
      'Unit III: Schema Refinement: Functional Dependencies, Normalization (1NF, 2NF, 3NF, BCNF, 4NF).',
      'Unit IV: Transaction Management: ACID properties, Serializability, Schedules, Recovery System.',
      'Unit V: Concurrency Control: Lock-based Protocols (2PL), Deadlock handling, B+ Tree Indexing.'
    ],
    notes: [
      {
        id: 'dbms-u1-notes',
        title: 'DBMS Unit 1: Architecture & ER Modeling Detailed Notes',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '29 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'dbms-u2-notes',
        title: 'DBMS Unit 2: Relational Algebra & Advanced SQL Query Guide',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '35 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'dbms-u3-notes',
        title: 'DBMS Unit 3: Normalization (1NF to BCNF) Solved Problems',
        unit: 'Unit 3',
        type: 'PDF Document',
        pages: '38 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'dbms-u4-notes',
        title: 'DBMS Unit 4: ACID, Transactions & Recovery Systems',
        unit: 'Unit 4',
        type: 'PDF Document',
        pages: '28 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'dbms-u5-notes',
        title: 'DBMS Unit 5: Concurrency Control Protocols & Indexing',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '26 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'DBMS One-Shot Complete Revision for Exams', channel: 'Gate Smashers', videos: 15, duration: '10h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete DBMS & SQL Course for College & Placements', channel: 'Gate Smashers', videos: 78, duration: '36h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
        alternatives: []
      },
      industry: {
        featured: { title: 'High Performance Database Engineering & Distributed SQL', channel: 'Hussein Nasser', videos: 45, duration: '28h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
        alternatives: []
      }
    }
  },

  {
    id: 'cse-sem4-cs402-os',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE'],
    semester: 'Sem 4',
    semestersApplicable: ['Sem 4'],
    code: 'CS402',
    name: 'Operating Systems (OS)',
    credits: 3,
    category: 'Professional Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Process Management, CPU Scheduling Algorithms, Inter-process Communication, Synchronization (Semaphores, Mutex, Monitors), Deadlocks (Detection, Prevention, Banker Algorithm), Memory Management (Paging, Segmentation, Virtual Memory, Page Replacement), and File Systems.',
    syllabus: [
      'Unit I: Operating System Structures, System Calls, Dual-Mode Operation, Process Concept, PCB.',
      'Unit II: CPU Scheduling: FCFS, SJF, Round Robin, Priority, Multi-level Queue, Thread Scheduling.',
      'Unit III: Process Synchronization: Critical Section, Peterson Solution, Semaphores, Classic Sync Problems.',
      'Unit IV: Deadlocks: Characterization, Prevention, Avoidance (Banker Algorithm), Recovery.',
      'Unit V: Memory Management: Contiguous Allocation, Paging, Segmentation, Virtual Memory, Page Replacement Algorithms.'
    ],
    notes: [
      {
        id: 'os-u1-notes',
        title: 'OS Unit 1: System Calls & Process Management Handbook',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '31 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'os-u2-notes',
        title: 'OS Unit 2: CPU Scheduling Algorithms Solved Problems',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '28 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'os-u3-notes',
        title: 'OS Unit 3: Process Synchronization & Semaphores Notes',
        unit: 'Unit 3',
        type: 'PDF Document',
        pages: '33 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'os-u4-notes',
        title: 'OS Unit 4: Deadlocks & Banker Algorithm Solved Numerical Guide',
        unit: 'Unit 4',
        type: 'PDF Document',
        pages: '24 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'os-u5-notes',
        title: 'OS Unit 5: Virtual Memory & Page Replacement (FIFO, LRU, Optimal)',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '36 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Operating Systems One Shot in 6 Hours', channel: 'Gate Smashers', videos: 12, duration: '6h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=vBURTt97EkA' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Operating Systems Course', channel: 'Neso Academy', videos: 62, duration: '32h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=vBURTt97EkA' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Linux Kernel Architecture & Internals', channel: 'MIT 6.S081', videos: 22, duration: '24h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=vBURTt97EkA' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // CSE - SEMESTER 1 & 2
  // =========================================================================
  {
    id: 'common-sem1-m1',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 1',
    semestersApplicable: ['Sem 1'],
    code: 'BS101',
    name: 'Linear Algebra and Calculus (Mathematics-I)',
    credits: 4,
    category: 'Basic Sciences',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Matrices, Rank of a Matrix, System of Linear Equations, Eigenvalues and Eigenvectors, Cayley-Hamilton Theorem, Mean Value Theorems, Partial Differentiation, Maxima and Minima of Functions of Two Variables, and Multiple Integrals.',
    syllabus: [
      'Unit I: Matrices and System of Linear Equations, Rank, Gauss Elimination, Gauss-Jordan.',
      'Unit II: Eigenvalues, Eigenvectors, Diagonalization, Cayley-Hamilton Theorem, Quadratic Forms.',
      'Unit III: Calculus: Rolle Theorem, Lagrange Mean Value Theorem, Taylor and Maclaurin Series.',
      'Unit IV: Multivariable Calculus: Partial Derivatives, Euler Theorem, Jacobians, Maxima & Minima.',
      'Unit V: Multiple Integrals: Double and Triple Integrals, Change of Order of Integration, Volume/Area.'
    ],
    notes: [
      {
        id: 'm1-u1-notes',
        title: 'M1 Unit 1: Matrices & Linear Equations Solved Question Bank',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '35 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'm1-u2-notes',
        title: 'M1 Unit 2: Eigenvalues & Cayley-Hamilton Theorem Notes',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '30 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Engineering Mathematics 1 One Shot', channel: 'Gajendra Purohit', videos: 20, duration: '15h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Linear Algebra & Calculus Series', channel: 'Gajendra Purohit', videos: 60, duration: '40h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Linear Algebra for Machine Learning', channel: '3Blue1Brown', videos: 15, duration: '8h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs' },
        alternatives: []
      }
    }
  },

  {
    id: 'common-sem1-cprog',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 1',
    semestersApplicable: ['Sem 1'],
    code: 'ES101',
    name: 'Programming for Problem Solving through C',
    credits: 3,
    category: 'Engineering Sciences',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'Algorithms, Flowcharts, C fundamentals, Data Types, Control Structures, Arrays, Strings, Functions, Recursion, Pointers, Dynamic Memory Allocation (malloc, calloc), Structures, Unions, and File Management in C.',
    syllabus: [
      'Unit I: Introduction to Programming, Algorithms, Flowcharts, C Tokens, Operators, Type Conversions.',
      'Unit II: Control Structures: if-else, switch, while, do-while, for loops, break and continue.',
      'Unit III: Arrays (1D, 2D), Matrix Operations, Strings and String Handling Functions.',
      'Unit IV: Functions: Parameter passing, Recursion, Storage Classes, Pointers, Dynamic Memory Allocation.',
      'Unit V: Structures, Unions, Typedef, Bit-fields, File Operations (fopen, fclose, fread, fwrite).'
    ],
    notes: [
      {
        id: 'cprog-u1-notes',
        title: 'C Programming Unit 1 & 2: Control Structures & Loops Handout',
        unit: 'Unit 1 & 2',
        type: 'PDF Document',
        pages: '36 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'cprog-pointers-notes',
        title: 'Pointers, DMA & Structures in C: Illustrated Guide with Code',
        unit: 'Unit 4 & 5',
        type: 'PDF Document',
        pages: '44 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'C Programming One-Shot Revision in 5 Hours', channel: 'Apna College / CodeWithHarry', videos: 1, duration: '10h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=irqbmMNs2Bo' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete C Language Bootcamp with Exercises', channel: 'CodeWithHarry', videos: 70, duration: '30h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=irqbmMNs2Bo' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Low-Level C Programming & Systems Fundamentals', channel: 'Jacob Sorber', videos: 30, duration: '15h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=irqbmMNs2Bo' },
        alternatives: []
      }
    }
  },

  {
    id: 'common-sem2-m2',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE', 'EEE', 'Civil', 'Mechanical'],
    semester: 'Sem 2',
    semestersApplicable: ['Sem 2'],
    code: 'BS201',
    name: 'Differential Equations and Vector Calculus (Mathematics-II)',
    credits: 4,
    category: 'Basic Sciences',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'First order differential equations, Higher order linear differential equations with constant coefficients, Method of Variation of Parameters, Partial Differential Equations, Vector Differentiation, Gradient, Divergence, Curl, Line, Surface & Volume Integrals, and Green, Gauss & Stokes Theorems.',
    syllabus: [
      'Unit I: First Order Ordinary Differential Equations: Exact, Linear, Bernoulli, Orthogonal Trajectories.',
      'Unit II: Higher Order Linear ODEs: Non-homogeneous, Method of Variation of Parameters, Cauchy-Euler.',
      'Unit III: Partial Differential Equations: Formation, Solutions of first order PDE, Lagrange Method.',
      'Unit IV: Vector Differentiation: Scalar and Vector Fields, Gradient, Directional Derivative, Divergence, Curl.',
      'Unit V: Vector Integration: Line, Surface, Volume Integrals, Green Theorem, Stokes and Gauss Divergence Theorems.'
    ],
    notes: [
      {
        id: 'm2-u1-notes',
        title: 'M2 Differential Equations Solved Manual & Practice Problems',
        unit: 'All Units',
        type: 'PDF Document',
        pages: '52 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Engineering Mathematics 2 One Shot', channel: 'Gajendra Purohit', videos: 15, duration: '12h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Vector Calculus & Differential Equations', channel: 'Gajendra Purohit', videos: 55, duration: '35h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Applied Vector Fields in Physics & Computing', channel: 'Khan Academy', videos: 20, duration: '12h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // CSE - SEMESTER 5 & 6 (ADVANCED SPECIALIZATIONS)
  // =========================================================================
  {
    id: 'cse-sem5-cn',
    branch: 'CSE',
    branchesApplicable: ['CSE', 'CSM', 'ECE'],
    semester: 'Sem 5',
    semestersApplicable: ['Sem 5'],
    code: 'CS501',
    name: 'Computer Networks (CN)',
    credits: 3,
    category: 'Professional Core',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'OSI Reference Model, TCP/IP Suite, Physical Layer, Data Link Layer (Framing, Flow Control, Sliding Window, Error Detection CRC), MAC Sublayer, Network Layer (IPv4, IPv6, Routing Protocols RIP, OSPF, BGP), Transport Layer (TCP 3-way handshake, UDP, Congestion Control), and Application Layer (DNS, HTTP, SMTP).',
    syllabus: [
      'Unit I: Network Architecture, Topologies, OSI Reference Model, TCP/IP Protocol Stack.',
      'Unit II: Data Link Layer: Framing, Error Control (Hamming, CRC), Flow Control (Stop & Wait, Go-Back-N, Selective Repeat).',
      'Unit III: Medium Access Control (MAC): ALOHA, CSMA/CD, CSMA/CA, Ethernet, IEEE 802.11 Wireless LAN.',
      'Unit IV: Network Layer: IPv4 Addressing, Subnetting, CIDR, NAT, Routing Algorithms (Distance Vector, Link State), ARP/ICMP.',
      'Unit V: Transport & Application: TCP vs UDP, Connection Management, Congestion Control (AIMD), DNS, HTTP/2, SMTP.'
    ],
    notes: [
      {
        id: 'cn-u1-notes',
        title: 'Computer Networks Complete 5-Unit Consolidated Lecture Notes',
        unit: 'All Units',
        type: 'PDF Document',
        pages: '64 Pages',
        author: 'Dept. of CSE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'cn-subnetting-guide',
        title: 'IPv4 Subnetting, CIDR & Routing Numerical Problems Solved',
        unit: 'Unit 4',
        type: 'Revision Cheatsheet',
        pages: '18 Pages',
        author: 'Network Academy',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Computer Networks in One Shot', channel: 'Gate Smashers', videos: 14, duration: '8h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Computer Networks Playlist', channel: 'Neso Academy', videos: 70, duration: '35h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Network Protocols & Packet Inspection with Wireshark', channel: 'David Bombal', videos: 30, duration: '20h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // CSM (CSE - AI & ML) SPECIFIC & CORE COURSES
  // =========================================================================
  {
    id: 'csm-sem3-cs201-dmgt',
    branch: 'CSM',
    branchesApplicable: ['CSM', 'CSE'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CS201',
    name: 'Discrete Mathematical Structures & Graph Theory (DMGT)',
    credits: 3,
    category: 'Basic Sciences & Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Propositional and Predicate Logic, Proof Techniques, Sets, Relations, Posets and Lattices, Functions, Generating Functions, Recurrence Relations, Combinatorics, Graph Theory, Eulerian & Hamiltonian Circuits, Trees, Planar Graphs, Algebraic Structures & Monoids.',
    syllabus: [
      'Unit I: Mathematical Logic: Statements, Connectives, Normal Forms (CNF/DNF), Predicate Calculus.',
      'Unit II: Set Theory, Relations, Equivalence Relations, Partial Ordering, Hasse Diagrams, Lattices.',
      'Unit III: Combinatorics: Permutations, Combinations, Pigeonhole Principle, Inclusion-Exclusion Principle.',
      'Unit IV: Recurrence Relations: Solving Homogeneous and Non-Homogeneous Recurrence Relations.',
      'Unit V: Graph Theory: Basic Terminology, Isomorphism, Eulerian and Hamiltonian Graphs, Planar Graphs, Chromatic Number.'
    ],
    notes: [
      {
        id: 'csm-dmgt-u1-notes',
        title: 'DMGT Unit 1: Propositional Logic & Truth Tables Notes',
        unit: 'Unit 1',
        type: 'PDF Document',
        pages: '28 Pages',
        author: 'Dept. of Mathematics & CSM, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18f1wL37NSF-ukin-F49G9ugpedqkWnak/view?usp=drive_link',
        isVerified: true
      },
      {
        id: 'csm-dmgt-u2-notes',
        title: 'DMGT Unit 2: Relations, Posets, Hasse Diagrams & Lattices',
        unit: 'Unit 2',
        type: 'PDF Document',
        pages: '31 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'csm-dmgt-u5-notes',
        title: 'DMGT Unit 5: Graph Theory, Coloring & Planar Graphs',
        unit: 'Unit 5',
        type: 'PDF Document',
        pages: '36 Pages',
        author: 'Dept. of Mathematics, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Discrete Mathematics in 1 Shot', channel: 'Gate Smashers', videos: 18, duration: '14h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9AU560UFdW69pTUx545p' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Discrete Mathematics & Graph Theory Course', channel: 'Gate Smashers', videos: 75, duration: '38h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9AU560UFdW69pTUx545p' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Mathematics for Computer Science', channel: 'MIT 6.042J', videos: 30, duration: '35h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=L3LMbpZIKhQ' },
        alternatives: []
      }
    }
  },

  {
    id: 'csm-sem3-cm201-ai',
    branch: 'CSM',
    branchesApplicable: ['CSM', 'CSE'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CM201',
    name: 'Artificial Intelligence & Intelligent Systems (AI)',
    credits: 3,
    category: 'Professional Core',
    difficulty: 'Medium',
    scheme: '2023 Scheme',
    description: 'Intelligent Agents, Problem Solving by Searching (BFS, DFS, Uniform Cost, A* Search, Heuristics), Adversarial Search (Minimax, Alpha-Beta Pruning), Constraint Satisfaction Problems (CSP), Knowledge Representation, First-Order Logic, Propositional Inference, and Expert Systems.',
    syllabus: [
      'Unit I: Introduction to AI, Intelligent Agents, State Space Search, Uninformed Search (BFS, DFS, UCS).',
      'Unit II: Informed Search: Greedy Best-First, A* Search, Admissible Heuristics, Hill Climbing.',
      'Unit III: Adversarial Search: Game Playing, Minimax Algorithm, Alpha-Beta Pruning, Stochastic Games.',
      'Unit IV: Knowledge Representation: Propositional Logic, First-Order Predicate Logic, Resolution, Unification.',
      'Unit V: Planning & Uncertainty: Classical Planning, Bayesian Networks, Hidden Markov Models.'
    ],
    notes: [
      {
        id: 'ai-u1-notes',
        title: 'Artificial Intelligence Unit 1 & 2: Search Strategies & A* Search',
        unit: 'Unit 1 & 2',
        type: 'PDF Document',
        pages: '38 Pages',
        author: 'Dept. of CSM, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'ai-u3-notes',
        title: 'Minimax, Alpha-Beta Pruning & Logic Resolution Guide',
        unit: 'Unit 3 & 4',
        type: 'PDF Document',
        pages: '32 Pages',
        author: 'Dept. of CSM, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Artificial Intelligence Complete One-Shot', channel: 'Gate Smashers', videos: 12, duration: '7h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=5NgNicANyqM' },
        alternatives: []
      },
      complete: {
        featured: { title: 'CS50 Introduction to Artificial Intelligence with Python', channel: 'Harvard CS50', videos: 10, duration: '28h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=5NgNicANyqM' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Deep Learning & Neural Networks Specialization', channel: 'Andrew Ng / DeepLearning.AI', videos: 50, duration: '40h', lang: 'Eng', level: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=5NgNicANyqM' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // ECE - CORE SUBJECTS
  // =========================================================================
  {
    id: 'ece-sem3-devc',
    branch: 'ECE',
    branchesApplicable: ['ECE', 'EEE'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'EC301',
    name: 'Electronic Devices and Circuits (EDC / DEVC)',
    credits: 4,
    category: 'Professional Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Semiconductor Physics, PN Junction Diode, Zener Diode, Rectifiers & Filters, BJT Characteristics & Biasing, Transistor as an Amplifier, Small Signal Analysis, JFET & MOSFET Characteristics, and Frequency Response of Amplifiers.',
    syllabus: [
      'Unit I: Semiconductor Diode: PN junction, V-I characteristics, Temperature dependence, Zener breakdown.',
      'Unit II: Diode Applications: Half-wave, Full-wave & Bridge Rectifiers, Capacitive and Inductive Filters.',
      'Unit III: Bipolar Junction Transistor (BJT): CB, CE, CC configurations, Early effect, DC & AC load lines.',
      'Unit IV: Transistor Biasing & Thermal Stabilization: Operating Point, Fixed bias, Voltage Divider bias.',
      'Unit V: Field Effect Transistors: JFET operation, Pinch-off, MOSFET (Depletion & Enhancement), Small Signal Models.'
    ],
    notes: [
      {
        id: 'devc-u1-notes',
        title: 'EDC Unit 1 & 2: Semiconductor Diodes & Rectifiers Notes',
        unit: 'Unit 1 & 2',
        type: 'PDF Document',
        pages: '38 Pages',
        author: 'Dept. of ECE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/18HFPAF8HCa6e7zfrxShP3YD8W6axlN_o/view?usp=drivesdk',
        isVerified: true
      },
      {
        id: 'devc-u3-notes',
        title: 'EDC Unit 3 & 4: BJT Biasing & Small Signal Amplifiers Solved Numericals',
        unit: 'Unit 3 & 4',
        type: 'PDF Document',
        pages: '42 Pages',
        author: 'Dept. of ECE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1oUk8HXpC2A2WvSWtFREw47DUlWCy5fBN/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Electronic Devices & Circuits in One Shot', channel: 'Neso Academy', videos: 18, duration: '12h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=ukM_zzrIeXs' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete EDC & Analog Devices Masterclass', channel: 'Neso Academy', videos: 80, duration: '45h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=ukM_zzrIeXs' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Semiconductor Device Fabrication & VLSI Physics', channel: 'MIT Microelectronics', videos: 25, duration: '20h', lang: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=ukM_zzrIeXs' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // EEE - CORE SUBJECTS
  // =========================================================================
  {
    id: 'eee-sem3-circuits',
    branch: 'EEE',
    branchesApplicable: ['EEE', 'ECE'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'EE301',
    name: 'Electric Circuit Analysis & Network Theory',
    credits: 4,
    category: 'Professional Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Network Theorems (Thevenin, Norton, Superposition, Maximum Power Transfer), Transient Analysis in RL, RC, RLC Circuits, Sinusoidal Steady State Analysis, Resonance, Two-Port Networks (Z, Y, ABCD, h parameters), and Laplace Transforms in Circuit Analysis.',
    syllabus: [
      'Unit I: Network Topology, Mesh & Nodal Analysis, Star-Delta transformations.',
      'Unit II: Network Theorems: Superposition, Thevenin, Norton, Max Power Transfer, Reciprocity.',
      'Unit III: Transient Analysis: DC and AC transients in RL, RC, and RLC series/parallel circuits.',
      'Unit IV: Resonance & Coupled Circuits: Series & Parallel resonance, Q-factor, Bandwidth, Mutual Inductance.',
      'Unit V: Two-Port Networks: Z, Y, ABCD, h-parameters, Interconnection of two-port networks.'
    ],
    notes: [
      {
        id: 'ee-circuits-notes',
        title: 'Network Analysis & Theorems Solved Problem Bank (100+ Problems)',
        unit: 'All Units',
        type: 'PDF Document',
        pages: '56 Pages',
        author: 'Dept. of EEE, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1sZwkpqwrAOo51W7pMzl_GWqy1vRirE7q/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Network Theory in One Shot for Semester Exams', channel: 'Gate Academy', videos: 15, duration: '10h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=ukM_zzrIeXs' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Circuit Theory & Two-Port Networks', channel: 'Neso Academy', videos: 65, duration: '35h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=ukM_zzrIeXs' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Power System Modeling & Transient Simulation', channel: 'IEEE PES', videos: 18, duration: '14h', lang: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=ukM_zzrIeXs' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // CIVIL - CORE SUBJECTS
  // =========================================================================
  {
    id: 'civil-sem3-som',
    branch: 'Civil',
    branchesApplicable: ['Civil', 'Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'CE301',
    name: 'Strength of Materials & Solid Mechanics',
    credits: 4,
    category: 'Professional Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Simple Stresses and Strains, Elastic Constants, Shear Force and Bending Moment Diagrams (SFD & BMD) for Beams, Flexural and Shear Stresses, Deflection of Beams, Torsion of Circular Shafts, Thin Cylinders, and Euler Column Theory.',
    syllabus: [
      'Unit I: Simple Stresses and Strains, Hooke Law, Modulus of Elasticity, Poisson Ratio, Volumetric Strain.',
      'Unit II: Shear Force and Bending Moment Diagrams (SFD & BMD) for Cantilever, Simply Supported & Overhanging Beams.',
      'Unit III: Theory of Simple Bending: Flexural formula, Section Modulus, Shear Stress distribution in beams.',
      'Unit IV: Deflection of Beams: Double Integration Method, Macaulay Method, Moment Area Method.',
      'Unit V: Torsion of Circular Shafts, Power Transmission, Thin Cylindrical and Spherical Shells.'
    ],
    notes: [
      {
        id: 'civil-som-notes',
        title: 'Strength of Materials Hand-Written Unit Notes & SFD/BMD Numerical Solver',
        unit: 'All Units',
        type: 'PDF Document',
        pages: '62 Pages',
        author: 'Dept. of Civil Engineering, GPREC',
        fileUrl: 'https://drive.google.com/file/d/16vLbQD75_BGZTYh-IOWToVYhxRtOij-s/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Strength of Materials SFD & BMD in One Shot', channel: 'Gate Academy / Unacademy', videos: 14, duration: '9h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Solid Mechanics & SOM Masterclass', channel: 'NPTEL Civil', videos: 45, duration: '30h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Structural Design & Finite Element Analysis Basics', channel: 'MIT CEE', videos: 20, duration: '18h', lang: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      }
    }
  },

  // =========================================================================
  // MECHANICAL - CORE SUBJECTS
  // =========================================================================
  {
    id: 'mech-sem3-thermo',
    branch: 'Mechanical',
    branchesApplicable: ['Mechanical'],
    semester: 'Sem 3',
    semestersApplicable: ['Sem 3'],
    code: 'ME301',
    name: 'Engineering Thermodynamics',
    credits: 4,
    category: 'Professional Core',
    difficulty: 'Hard',
    scheme: '2023 Scheme',
    description: 'Basic Concepts, Zeroth Law, First Law of Thermodynamics for Closed and Open Systems, Steady Flow Energy Equation (SFEE), Second Law of Thermodynamics, Carnot Cycle, Clausius Inequality, Entropy, Availability & Irreversibility, and Pure Substance Vapor Cycles (Rankine Cycle).',
    syllabus: [
      'Unit I: Fundamental Concepts, Thermodynamic Systems, Zeroth Law, Work and Heat Transfers.',
      'Unit II: First Law of Thermodynamics: Internal Energy, Enthalpy, Steady Flow Energy Equation (SFEE) Applications.',
      'Unit III: Second Law of Thermodynamics: Kelvin-Planck and Clausius Statements, Heat Engines, Refrigerators, Carnot Theorem.',
      'Unit IV: Entropy: Clausius Inequality, Principle of Increase of Entropy, Availability and Exergy Analysis.',
      'Unit V: Properties of Pure Substances: P-V-T surfaces, Steam Tables, Mollier Chart, Rankine Cycle with Superheat.'
    ],
    notes: [
      {
        id: 'mech-thermo-notes',
        title: 'Thermodynamics Complete Lecture Notes & Steam Table Solved Problems',
        unit: 'All Units',
        type: 'PDF Document',
        pages: '58 Pages',
        author: 'Dept. of Mechanical Engineering, GPREC',
        fileUrl: 'https://drive.google.com/file/d/1kHQfqj7ACngnrsuQoSpU0RUdU1X-TJSP/view?usp=drivesdk',
        isVerified: true
      }
    ],
    playlists: {
      pass: {
        featured: { title: 'Engineering Thermodynamics in One Shot', channel: 'Gate Academy', videos: 12, duration: '8h', lang: 'Eng', level: 'Beg', thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      },
      complete: {
        featured: { title: 'Complete Thermodynamics & Power Cycles Course', channel: 'NPTEL Mechanical', videos: 50, duration: '35h', lang: 'Eng', level: 'Int', thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      },
      industry: {
        featured: { title: 'Thermal Power Plant & Gas Turbine Systems Engineering', channel: 'Learn Engineering', videos: 15, duration: '12h', lang: 'Adv', thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000', playlistUrl: 'https://www.youtube.com/watch?v=RO5alU6PpSU' },
        alternatives: []
      }
    }
  }
];

// Helper to look up curated subjects with intelligent fallback
export function getCuratedSubjectsFor(branch = 'CSE', semester = 'Sem 3') {
  return CURRICULUM_SUBJECTS.filter(s => {
    const branchMatch = s.branch === branch || (s.branchesApplicable && s.branchesApplicable.includes(branch));
    const semMatch = s.semester === semester || (s.semestersApplicable && s.semestersApplicable.includes(semester));
    return branchMatch && semMatch;
  });
}

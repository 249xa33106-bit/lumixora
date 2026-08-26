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
    branchesApplicable: ['CSE', 'CSM', 'CSE(DS)', 'CSBS'],
    semester: 'Sem 3',
    subjectCode: 'CS203',
    subjectName: 'Object Oriented Programming through Java (OOPJ)',
    credits: 3,
    scheme: '2023 Scheme',
    category: 'PC',
    description: 'Java Fundamentals, Classes & Objects, Inheritance, Dynamic Method Dispatch, Interfaces & Packages, String Handling, Exception Handling, Multithreading & Synchronization, JDBC Architecture, and Collections Framework.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    oneShotVideo: {
      title: 'Java Full Course Marathon in One Shot',
      channel: 'Telusko / Apna College',
      url: 'https://www.youtube.com/watch?v=BGTx91t8q50',
      duration: '8h 30m',
      views: '4.2M'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5',
    units: [
      {
        unitNumber: 1,
        unitTitle: 'UNIT I: OOP Concepts, Programming Constructs & Classes',
        description: 'Overview of Java, buzzwords, OOP principles. Data types, Operators, Control statements. Classes, Objects, Methods, Constructors, Console I/O, this keyword, Garbage collection, finalize, and Wrapper classes.',
        videos: [
          {
            id: 'v-oopj-u1-1',
            title: 'Java Buzzwords & JVM, JRE, JDK Architecture Explained',
            channel: 'Telusko',
            duration: '22:15',
            url: 'https://www.youtube.com/watch?v=480gE_wE-2k',
            summary: 'Platform independence, bytecode compilation, JIT compiler and memory regions (Stack, Heap).'
          },
          {
            id: 'v-oopj-u1-2',
            title: 'Classes, Objects, Methods & Constructor Overloading in Java',
            channel: 'Apna College',
            duration: '35:40',
            url: 'https://www.youtube.com/watch?v=bSrm9RXwBaI',
            summary: 'Default, parameterized, copy constructors, this keyword reference and memory allocation.'
          },
          {
            id: 'v-oopj-u1-3',
            title: 'Wrapper Classes, Autoboxing/Unboxing & Garbage Collection in Java',
            channel: 'Telusko',
            duration: '19:30',
            url: 'https://www.youtube.com/watch?v=3u_sK_8j2wA',
            summary: 'Integer, Double wrappers, System.gc(), and object destruction.'
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'UNIT II: Inheritance, Interfaces & Packages',
        description: 'Types of Inheritance (Single, Multilevel, Hierarchical, Multiple via Interfaces), Final and Super keywords, Method Overloading, Dynamic Method Dispatch. Abstract classes, Interfaces, Default/Static methods in Interfaces. Packages, java.lang, java.util, Math, Random, Formatter, and Date/Time.',
        videos: [
          {
            id: 'v-oopj-u2-1',
            title: 'Inheritance in Java (Single, Multilevel, Hierarchical) with super keyword',
            channel: 'Telusko',
            duration: '28:10',
            url: 'https://www.youtube.com/watch?v=46T2wYdVElc',
            summary: 'Parent-child relationships, super() constructor calls, method overriding rules.'
          },
          {
            id: 'v-oopj-u2-2',
            title: 'Dynamic Method Dispatch (Runtime Polymorphism) in Java Explained',
            channel: 'Telusko',
            duration: '18:45',
            url: 'https://www.youtube.com/watch?v=d_p_java_disp',
            summary: 'Superclass reference variable pointing to subclass object and runtime method resolution.'
          },
          {
            id: 'v-oopj-u2-3',
            title: 'Abstract Classes vs Interfaces & Default/Static Methods in Interfaces',
            channel: 'Telusko',
            duration: '25:20',
            url: 'https://www.youtube.com/watch?v=1XATy2G1qJg',
            summary: 'Multiple inheritance solution, contract design, and Java 8 interface feature additions.'
          },
          {
            id: 'v-oopj-u2-4',
            title: 'Creating and Importing User-Defined Packages & java.util Classes',
            channel: 'Telusko',
            duration: '21:30',
            url: 'https://www.youtube.com/watch?v=404iM1lqfE4',
            summary: 'Classpath configuration, package directory hierarchy, access modifiers (public, protected, private, default).'
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'UNIT III: String Handling & Exception Handling',
        description: 'String constructors & methods (charAt, compareTo, substring, replace). StringBuffer & StringBuilder comparison and mutable methods. Exception Handling hierarchy, try-catch-finally, throw, throws, multi-catch, and Custom Exceptions.',
        videos: [
          {
            id: 'v-oopj-u3-1',
            title: 'String vs StringBuffer vs StringBuilder in Java Deep Dive',
            channel: 'Telusko',
            duration: '26:50',
            url: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
            summary: 'String Constant Pool (SCP), immutability reason, thread safety in StringBuffer vs speed in StringBuilder.'
          },
          {
            id: 'v-oopj-u3-2',
            title: 'Exception Handling Masterclass (try, catch, finally, throw, throws)',
            channel: 'Gate Smashers',
            duration: '31:10',
            url: 'https://www.youtube.com/watch?v=e_wK3b6Fk2s',
            summary: 'Checked vs Unchecked exceptions, Throwable hierarchy, and multi-catch block ordering.'
          },
          {
            id: 'v-oopj-u3-3',
            title: 'Creating User-Defined / Custom Exceptions in Java with Examples',
            channel: 'Telusko',
            duration: '16:40',
            url: 'https://www.youtube.com/watch?v=83e6yWJ_05s',
            summary: 'Extending Exception/RuntimeException, passing custom messages to super(message).'
          }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: 'UNIT IV: Multithreading & JDBC Architecture',
        description: 'Java Thread model, Thread class & Runnable interface, Thread life cycle, Priorities, Deadlocks, Synchronization (synchronized keyword, blocks), Inter-thread communication (wait, notify, notifyAll). JDBC: Architecture, Drivers, Steps, DriverManager, Connection, Statement, PreparedStatement & ResultSet.',
        videos: [
          {
            id: 'v-oopj-u4-1',
            title: 'Multithreading in Java: Thread class vs Runnable interface',
            channel: 'Telusko',
            duration: '32:15',
            url: 'https://www.youtube.com/watch?v=mD_3h_C0p9Y',
            summary: 'Thread lifecycle states (New, Runnable, Blocked, Waiting, Terminated) and start() vs run().'
          },
          {
            id: 'v-oopj-u4-2',
            title: 'Thread Synchronization, Deadlock & Producer-Consumer Problem (wait/notify)',
            channel: 'Telusko',
            duration: '38:40',
            url: 'https://www.youtube.com/watch?v=RO5alU6PpSU',
            summary: 'Monitor lock mechanism, preventing race conditions, and synchronized buffer communication.'
          },
          {
            id: 'v-oopj-u4-3',
            title: 'JDBC Step-by-Step Tutorial (Connection, PreparedStatement & CRUD Operations)',
            channel: 'Telusko',
            duration: '35:20',
            url: 'https://www.youtube.com/watch?v=3n-vH_72s9w',
            summary: 'Class.forName(), DriverManager.getConnection(), executing SQL queries and ResultSet traversal.'
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'UNIT V: Java Collections Framework',
        description: 'Collection Interfaces: List, Set, SortedSet, Queue, Deque. Collection Classes: ArrayList, LinkedList, HashSet, LinkedHashSet, TreeSet, PriorityQueue, ArrayDeque. Accessing collections using Iterator and For-Each loops.',
        videos: [
          {
            id: 'v-oopj-u5-1',
            title: 'Java Collections Framework Complete Architecture & Hierarchy',
            channel: 'Telusko',
            duration: '45:30',
            url: 'https://www.youtube.com/watch?v=480gE_wE-2k',
            summary: 'Collection interface tree, difference between List (ordered/duplicates) and Set (unique elements).'
          },
          {
            id: 'v-oopj-u5-2',
            title: 'ArrayList vs LinkedList vs HashSet vs TreeSet Performance & Internal Working',
            channel: 'Apna College',
            duration: '40:15',
            url: 'https://www.youtube.com/watch?v=rzA7UJ-hQn4',
            summary: 'Dynamic resizing, hashing bucket collision handling, and red-black tree sorted traversal.'
          },
          {
            id: 'v-oopj-u5-3',
            title: 'Iterator, ListIterator & For-Each Loop Iteration in Java Collections',
            channel: 'Telusko',
            duration: '18:50',
            url: 'https://www.youtube.com/watch?v=83e6yWJ_05s',
            summary: 'hasNext(), next(), remove() methods and avoiding ConcurrentModificationException.'
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
      channel: 'Civil Engineering Academy',
      url: 'https://www.youtube.com/watch?v=SOM12345678',
      duration: '7h 15m',
      views: '450K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLk7ptZcI9vmh2bC_3y_X_SOM_CIVIL',
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
            url: 'https://www.youtube.com/watch?v=MOHR123456',
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
      channel: 'NPTEL / Gate Academy',
      url: 'https://www.youtube.com/watch?v=THERMO12345',
      duration: '8h 30m',
      views: '520K'
    },
    playlistUrl: 'https://www.youtube.com/playlist?list=PLMECH_THERMO_MECH',
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
            url: 'https://www.youtube.com/watch?v=SFEE123456',
            summary: 'Application of First Law to Nozzles, Diffusers, Turbines and Compressors.'
          }
        ]
      }
    ]
  }
];

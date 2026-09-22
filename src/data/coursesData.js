// Official Lumixora Comprehensive Engineering Courses Catalog & Certification Suite
export const ALL_COURSES = [
  {
    id: 'course-fullstack-core-cs',
    title: 'Full-Stack Software Engineering & Core CS Mastery',
    category: 'Courses',
    level: 'Comprehensive',
    duration: '45 Hours',
    rating: 4.9,
    enrolledCount: 1420,
    instructor: 'Lumixora Autonomous Academic Board & Engineering Faculty',
    badgeIcon: '🎓',
    badgeColor: 'from-blue-500 to-indigo-600',
    shortDescription: 'Master modern full-stack web architecture, distributed DBMS & SQL, operating system internals, and networking.',
    certTitle: 'Full-Stack Software Engineering & Core CS Course Mastery',
    certCategory: 'Courses',
    skills: ['Full-Stack Web Architecture', 'DBMS & SQL', 'Operating Systems', 'Computer Networks'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Advanced Full-Stack Architecture & React System Design',
        duration: '10 Hours',
        lessons: [
          {
            id: 'les-1-1',
            title: 'Modern Web Runtimes, Virtual DOM Reconciliation & State Management',
            type: 'video',
            duration: '45 mins',
            summary: 'Deep dive into JavaScript V8 engine execution, React Fiber reconciler, diffing algorithms, and unidirectional data flow.'
          },
          {
            id: 'les-1-2',
            title: 'RESTful API Engineering, JWT Authentication & Security Headers',
            type: 'reading',
            duration: '35 mins',
            summary: 'Architecting secure microservices, stateless JWT lifecycle, CORS protocols, and CSRF token defenses.'
          },
          {
            id: 'les-1-3',
            title: 'Hands-on: Full-Stack Component Performance Optimization',
            type: 'practice',
            duration: '60 mins',
            summary: 'Implement memoization, virtual list virtualization, lazy code-splitting, and render cycle profiling.'
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Database Management Systems & Distributed SQL',
        duration: '12 Hours',
        lessons: [
          {
            id: 'les-2-1',
            title: 'Relational Algebra, 3NF/BCNF Normalization & ACID Properties',
            type: 'video',
            duration: '50 mins',
            summary: 'Rigorous analysis of database anomalies, functional dependencies, lossless decomposition, and transaction isolation levels.'
          },
          {
            id: 'les-2-2',
            title: 'B+ Tree Indexing Internals, Query Execution Plans & Optimization',
            type: 'reading',
            duration: '40 mins',
            summary: 'How relational query engines parse, analyze, and optimize cost-based index scans versus sequential table scans.'
          },
          {
            id: 'les-2-3',
            title: 'Hands-on: SQL Query Tuning & Complex Aggregations',
            type: 'practice',
            duration: '60 mins',
            summary: 'Writing subqueries, window functions (ROW_NUMBER, DENSE_RANK), and multi-table joins.'
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Operating Systems Internals & Memory Architecture',
        duration: '11 Hours',
        lessons: [
          {
            id: 'les-3-1',
            title: 'Process Management, PCB, CPU Scheduling & Context Switching',
            type: 'video',
            duration: '45 mins',
            summary: 'Preemptive vs non-preemptive scheduling algorithms (Round Robin, Multilevel Feedback Queues), process synchronization, and mutexes.'
          },
          {
            id: 'les-3-2',
            title: 'Virtual Memory, Paging, TLB Cache & Page Replacement Algorithms',
            type: 'reading',
            duration: '35 mins',
            summary: 'Demand paging mechanics, Translation Lookaside Buffer hits/misses, Thrashing, and LRU/FIFO page faults.'
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Computer Networks & Distributed Systems Protocols',
        duration: '12 Hours',
        lessons: [
          {
            id: 'les-4-1',
            title: 'TCP/IP 4-Layer vs OSI 7-Layer, 3-Way Handshake & Flow Control',
            type: 'video',
            duration: '45 mins',
            summary: 'Transmission Control Protocol connection establishment, sequence numbering, congestion control (AIMD), and UDP comparisons.'
          },
          {
            id: 'les-4-2',
            title: 'Application Layer Protocols: HTTP/2, HTTP/3 QUIC, TLS 1.3 & WebSockets',
            type: 'reading',
            duration: '40 mins',
            summary: 'Multiplexing, header compression (HPACK), symmetric encryption handshakes, and persistent bi-directional duplex communication.'
          }
        ]
      }
    ],
    grandTest: {
      id: 'grand-test-fullstack-core',
      title: 'Full-Stack Software Engineering & Core CS Grand Assessment',
      durationMinutes: 25,
      passPercentage: 60,
      questions: [
        {
          id: 'gt_fs_1',
          question: 'In modern relational database engines, what is the primary data structure used for clustered indexing on disk?',
          options: ['Hash Map', 'B+ Tree', 'Binary Max Heap', 'Singly Linked List'],
          correct: 1
        },
        {
          id: 'gt_fs_2',
          question: 'Which of the following conditions is NOT required for a Deadlock state to occur (Coffman Conditions)?',
          options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
          correct: 2
        },
        {
          id: 'gt_fs_3',
          question: 'During a TCP 3-way handshake, what flag combination is sent in the second packet by the server?',
          options: ['SYN only', 'SYN + ACK', 'FIN + ACK', 'RST only'],
          correct: 1
        },
        {
          id: 'gt_fs_4',
          question: 'In React 18 Concurrent Mode, which hook is used to defer non-urgent state updates to keep input responsive?',
          options: ['useEffect', 'useTransition / useDeferredValue', 'useRef', 'useCallback'],
          correct: 1
        },
        {
          id: 'gt_fs_5',
          question: 'What is the SQL standard command to grant a transaction durability guarantee?',
          options: ['ROLLBACK', 'COMMIT', 'SAVEPOINT', 'ISOLATE'],
          correct: 1
        }
      ]
    }
  },
  {
    id: 'course-multilang-specialist',
    title: 'Multi-Paradigm Programming Languages Specialist (Java, Python, C++)',
    category: 'Languages',
    level: 'Intermediate to Advanced',
    duration: '40 Hours',
    rating: 4.95,
    enrolledCount: 1890,
    instructor: 'Lumixora Language Evaluation & Compiler Engineering Team',
    badgeIcon: '💻',
    badgeColor: 'from-cyan-400 to-blue-600',
    shortDescription: 'Master object-oriented Java, high-performance C++ STL memory management, and modern Python data structures.',
    certTitle: 'Multi-Paradigm Programming Languages Specialist (Java, Python, C++)',
    certCategory: 'Languages',
    skills: ['Java OOP & Collections', 'Python Data Science & Scripting', 'C++ STL & Memory Management', 'Modern JavaScript & TypeScript'],
    modules: [
      {
        id: 'mod-lang-1',
        title: 'Module 1: Java 21+ Object-Oriented Architecture & JVM Internals',
        duration: '14 Hours',
        lessons: [
          {
            id: 'les-j-1',
            title: 'Polymorphism, Abstract Classes, Interfaces & Diamond Problem Resolution',
            type: 'video',
            duration: '50 mins',
            summary: 'Deep dive into dynamic method dispatch, vtables, default interface methods, and access control.'
          },
          {
            id: 'les-j-2',
            title: 'Java Collections Framework: ArrayList vs LinkedList, HashMap Hashing Mechanics',
            type: 'reading',
            duration: '45 mins',
            summary: 'Internal array resizing, collision resolution with Red-Black tree conversion in Java 8+, and concurrent collections.'
          },
          {
            id: 'les-j-3',
            title: 'JVM Memory Architecture & Generational Garbage Collection',
            type: 'practice',
            duration: '60 mins',
            summary: 'Heap young/old generation, Eden space, survivor spaces, G1GC tuning, and memory leak prevention.'
          }
        ]
      },
      {
        id: 'mod-lang-2',
        title: 'Module 2: High-Performance C++20 & Standard Template Library (STL)',
        duration: '13 Hours',
        lessons: [
          {
            id: 'les-cpp-1',
            title: 'Pointers, References, RAII & Modern Smart Pointers (unique_ptr, shared_ptr)',
            type: 'video',
            duration: '55 mins',
            summary: 'Stack vs heap allocation, dynamic memory ownership semantics, reference counting, and circular dependency resolution.'
          },
          {
            id: 'les-cpp-2',
            title: 'STL Containers, Iterators, Lambda Expressions & Template Metaprogramming',
            type: 'practice',
            duration: '60 mins',
            summary: 'std::vector, std::unordered_map, std::priority_queue, custom comparator functors, and lambda capture lists.'
          }
        ]
      },
      {
        id: 'mod-lang-3',
        title: 'Module 3: Python 3.12+ Data Engineering & Functional Idioms',
        duration: '13 Hours',
        lessons: [
          {
            id: 'les-py-1',
            title: 'Decorators, Generators, Itertools & Context Managers',
            type: 'video',
            duration: '45 mins',
            summary: 'Higher-order function closures, yield memory streaming, custom context managers with __enter__ and __exit__.'
          },
          {
            id: 'les-py-2',
            title: 'Python Under the Hood: CPython Bytecode, GIL (Global Interpreter Lock) & Asyncio',
            type: 'reading',
            duration: '40 mins',
            summary: 'Understanding the GIL, coroutines, async/await event loops, and CPU-bound vs IO-bound multi-processing.'
          }
        ]
      }
    ],
    grandTest: {
      id: 'grand-test-languages-mastery',
      title: 'Multi-Language Programming Grand Assessment',
      durationMinutes: 20,
      passPercentage: 60,
      questions: [
        {
          id: 'gt_lang_1',
          question: 'In Java, what is the default initial capacity and load factor of a HashMap?',
          options: ['Capacity: 16, Load Factor: 0.75', 'Capacity: 10, Load Factor: 0.5', 'Capacity: 32, Load Factor: 0.8', 'Capacity: 8, Load Factor: 1.0'],
          correct: 0
        },
        {
          id: 'gt_lang_2',
          question: 'In modern C++, which smart pointer allows multiple owners and maintains a reference count?',
          options: ['std::unique_ptr', 'std::shared_ptr', 'std::weak_ptr', 'std::auto_ptr'],
          correct: 1
        },
        {
          id: 'gt_lang_3',
          question: 'What is the output of bool([] == False) in Python?',
          options: ['True', 'False', 'TypeError', 'None'],
          correct: 1
        },
        {
          id: 'gt_lang_4',
          question: 'Which method in Java is executed by the Garbage Collector before an unreachable object is reclaimed?',
          options: ['dispose()', 'finalize()', 'clean()', 'destroy()'],
          correct: 1
        },
        {
          id: 'gt_lang_5',
          question: 'In C++, what does the const keyword at the end of a member function declaration indicate?',
          options: ['The function returns a constant value', 'The function cannot modify any member variables of the calling object', 'The function is static', 'The function cannot be overloaded'],
          correct: 1
        }
      ]
    }
  },
  {
    id: 'course-dsa-competitive-solver',
    title: 'Competitive DSA & Algorithmic Problem Solving (100+ Challenges Track)',
    category: 'Problems Solved',
    level: 'Advanced',
    duration: '50 Hours',
    rating: 4.98,
    enrolledCount: 2310,
    instructor: 'Codeverse & Lumixora Algorithmic Grandmasters',
    badgeIcon: '⚡',
    badgeColor: 'from-emerald-500 to-teal-600',
    shortDescription: 'Master Dynamic Programming, Graph Theory, Trie, Segment Trees, and Advanced Recursion for Tier-1 Product Engineering roles.',
    certTitle: 'Competitive DSA Problem Solver — 100+ Algorithmic Challenges',
    certCategory: 'Problems Solved',
    skills: ['Dynamic Programming', 'Graph Theory & BFS/DFS', 'Trees & Recursion', 'Greedy & Bit Manipulation'],
    modules: [
      {
        id: 'mod-dsa-1',
        title: 'Module 1: Advanced Arrays, Two Pointers & Sliding Window Patterns',
        duration: '12 Hours',
        lessons: [
          {
            id: 'les-dsa-1-1',
            title: 'Dynamic Sliding Window, Prefix Sum Matrices & Monotonic Deques',
            type: 'video',
            duration: '50 mins',
            summary: 'Solving longest subarray with sum constraints, sliding window maximum in O(N), and 2D submatrix queries in O(1).'
          },
          {
            id: 'les-dsa-1-2',
            title: 'Hands-on: Trapping Rain Water & 3-Sum In-Place Algorithms',
            type: 'practice',
            duration: '60 mins',
            summary: 'Optimal O(N) space two-pointer approach vs monotonic stack solution.'
          }
        ]
      },
      {
        id: 'mod-dsa-2',
        title: 'Module 2: Trees, Binary Search Trees & Trie Architecture',
        duration: '12 Hours',
        lessons: [
          {
            id: 'les-dsa-2-1',
            title: 'Binary Tree Traversals, Lowest Common Ancestor & Diameter of Tree',
            type: 'video',
            duration: '45 mins',
            summary: 'Iterative vs recursive traversals, bottom-up post-order DFS DP, and Morris traversal with O(1) space.'
          },
          {
            id: 'les-dsa-2-2',
            title: 'Prefix Tries, Bitwise XOR Tries & Autocomplete Engines',
            type: 'practice',
            duration: '60 mins',
            summary: 'Building high-performance string search and maximum XOR pair lookups in O(32 * N).'
          }
        ]
      },
      {
        id: 'mod-dsa-3',
        title: 'Module 3: Graph Algorithms (BFS, DFS, Dijkstra, Bellman-Ford, Kruskal)',
        duration: '13 Hours',
        lessons: [
          {
            id: 'les-dsa-3-1',
            title: 'Topological Sort (Kahn’s Algorithm) & Cycle Detection in Directed/Undirected Graphs',
            type: 'video',
            duration: '55 mins',
            summary: 'In-degree queue tracking, union-find with path compression & rank, and bipartite graph validation.'
          },
          {
            id: 'les-dsa-3-2',
            title: 'Shortest Paths & Minimum Spanning Trees (Dijkstra vs Disjoint Set Kruskal)',
            type: 'practice',
            duration: '60 mins',
            summary: 'PriorityQueue Dijkstra time complexity O((V + E) log V) and handling negative cycles with Bellman-Ford.'
          }
        ]
      },
      {
        id: 'mod-dsa-4',
        title: 'Module 4: Dynamic Programming Mastery (1D, 2D, Knapsack & Tree DP)',
        duration: '13 Hours',
        lessons: [
          {
            id: 'les-dsa-4-1',
            title: 'Memoization vs Tabulation, 0/1 Knapsack & Unbounded Knapsack Frameworks',
            type: 'video',
            duration: '60 mins',
            summary: 'State definition, recurrence relation derivation, base case initialization, and space reduction from 2D to 1D.'
          },
          {
            id: 'les-dsa-4-2',
            title: 'Longest Common Subsequence (LCS), Edit Distance & Matrix Chain Multiplication',
            type: 'practice',
            duration: '60 mins',
            summary: 'String matching DP matrices, interval DP partition trees, and state compression.'
          }
        ]
      }
    ],
    grandTest: {
      id: 'grand-test-dsa-championship',
      title: 'Competitive DSA Grand Engineering Assessment',
      durationMinutes: 25,
      passPercentage: 60,
      questions: [
        {
          id: 'gt_dsa_1',
          question: 'What is the tightest time complexity of finding the Shortest Path in a weighted graph with non-negative edge weights using a Min-Heap based Dijkstra algorithm?',
          options: ['O(V^2)', 'O((V + E) log V)', 'O(V * E)', 'O(E^2)'],
          correct: 1
        },
        {
          id: 'gt_dsa_2',
          question: 'In Dynamic Programming, what two core properties must a problem satisfy to be solvable via DP?',
          options: ['Greedy Choice and Non-overlapping Subproblems', 'Optimal Substructure and Overlapping Subproblems', 'Continuous State Space and Bounded Memory', 'Divide and Conquer with Independent Subproblems'],
          correct: 1
        },
        {
          id: 'gt_dsa_3',
          question: 'Which tree traversal produces elements of a Binary Search Tree in strictly sorted ascending order?',
          options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
          correct: 1
        },
        {
          id: 'gt_dsa_4',
          question: 'What is the worst-case time complexity of searching for a word of length L in a Trie with N stored words?',
          options: ['O(N * L)', 'O(L)', 'O(log N)', 'O(N^2)'],
          correct: 1
        },
        {
          id: 'gt_dsa_5',
          question: 'Which algorithm is optimal for detecting cycles in an undirected graph with Disjoint Set Union (DSU)?',
          options: ['Floyd-Warshall', 'Kruskal / Union-Find with Path Compression', 'Kadane’s Algorithm', 'KMP String Matching'],
          correct: 1
        }
      ]
    }
  },
  {
    id: 'course-weekly-championship',
    title: 'Weekly Speed Coding & High-Pressure Championship Track',
    category: 'Weekly Award',
    level: 'Championship',
    duration: '25 Hours',
    rating: 4.92,
    enrolledCount: 980,
    instructor: 'Lumixora Arena Tournament Board',
    badgeIcon: '🏆',
    badgeColor: 'from-amber-400 to-orange-500',
    shortDescription: 'Master timed contest strategies, rapid edge-case debugging, and zero-penalty algorithmic submissions.',
    certTitle: 'Weekly Coding Championship — Highest Score Award (Rank #1)',
    certCategory: 'Weekly Award',
    skills: ['Speed Coding Under Pressure', 'Zero-Bug Submissions', 'Optimal Time Complexity', 'Arena Championship'],
    modules: [
      {
        id: 'mod-champ-1',
        title: 'Module 1: Contest Fast I/O, Bit Hacks & Constant Factor Optimization',
        duration: '8 Hours',
        lessons: [
          {
            id: 'les-c-1',
            title: 'Fast I/O Buffering in Java / C++, Bit Manipulation Tricks',
            type: 'video',
            duration: '40 mins',
            summary: 'Using BufferedReader / Custom fast scanner, bitmask DP, parity checks, and bitwise power-of-two optimizations.'
          }
        ]
      },
      {
        id: 'mod-champ-2',
        title: 'Module 2: Mock Arena Championship & High-Pressure Contest Simulations',
        duration: '17 Hours',
        lessons: [
          {
            id: 'les-c-2',
            title: 'Zero-Bug Edge Case Stress Testing & Boundary Validation',
            type: 'practice',
            duration: '60 mins',
            summary: 'Rapid identification of Integer overflow, 1-indexed off-by-one errors, and graph edge cases.'
          }
        ]
      }
    ],
    grandTest: {
      id: 'grand-test-weekly-championship',
      title: 'Weekly Arena Championship Grand Assessment',
      durationMinutes: 20,
      passPercentage: 60,
      questions: [
        {
          id: 'gt_wk_1',
          question: 'Which bitwise operation checks if an integer N is a power of 2 in O(1) time?',
          options: ['(N & (N - 1)) == 0 && N > 0', '(N | (N + 1)) == 0', '(N ^ N) == 0', '(N >> 1) == 0'],
          correct: 0
        },
        {
          id: 'gt_wk_2',
          question: 'What is the integer limit of a 32-bit signed integer before overflow in Java/C++?',
          options: ['2,147,483,647 (~2 * 10^9)', '4,294,967,295', '1,000,000,000', '9,223,372,036,854,775,807'],
          correct: 0
        },
        {
          id: 'gt_wk_3',
          question: 'In competitive programming, what is the standard time limit for an algorithm to execute ~10^8 operations in C++?',
          options: ['1.0 Second', '10.0 Seconds', '0.01 Seconds', '60.0 Seconds'],
          correct: 0
        }
      ]
    }
  }
];

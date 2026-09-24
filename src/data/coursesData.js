// Official Lumixora Comprehensive Digital Engineering Textbook & Autonomous Certification Suite
// Exhaustive In-App Textbook with Architectural Case Studies, ASCII Diagrams, Interview Pearls, and 30-Question Level-Wise Tests

export const ALL_COURSES = [
  {
    "id": "course-fullstack-core-cs",
    "title": "Full-Stack Software Engineering & Core CS Mastery",
    "category": "Courses",
    "level": "Comprehensive",
    "duration": "45 Hours",
    "rating": 4.9,
    "enrolledCount": 1420,
    "instructor": "Lumixora Autonomous Academic Board & Engineering Faculty",
    "badgeIcon": "🎓",
    "badgeColor": "from-blue-500 to-indigo-600",
    "shortDescription": "Master modern full-stack web architecture, distributed DBMS & SQL, operating system internals, and networking.",
    "certTitle": "Full-Stack Software Engineering & Core CS Course Mastery",
    "certCategory": "Courses",
    "skills": [
      "Full-Stack Web Architecture",
      "DBMS & SQL",
      "Operating Systems",
      "Computer Networks"
    ],
    "modules": [
      {
        "id": "mod-1",
        "title": "Module 1: Advanced Full-Stack Architecture & React System Design",
        "duration": "10 Hours",
        "lessons": [
          {
            "id": "les-1-1",
            "title": "Modern Web Runtimes, Virtual DOM Reconciliation & State Management",
            "type": "video",
            "duration": "45 mins",
            "summary": "Deep dive into JavaScript V8 engine execution, React Fiber reconciler, diffing algorithms, and unidirectional data flow.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "The V8 JavaScript Engine parses source code into an AST, compiles to Bytecode via Ignition, and JIT-optimizes hot functions via TurboFan.",
                "React Fiber reconciler breaks component rendering into non-blocking units of work with priority queues (Time Slicing).",
                "The reconciliation diffing algorithm operates in O(N) heuristic time based on element types and stable keys."
              ],
              "sections": [
                {
                  "heading": "1. JavaScript Runtime Internals (V8, Call Stack & Event Loop)",
                  "content": "Modern JavaScript executes inside dedicated runtimes like Google V8. When a script runs, the Ignition interpreter produces bytecode while the TurboFan JIT compiler analyzes profiling feedback to emit optimized machine code for hot execution loops. The runtime architecture is built upon a single-threaded Call Stack, Memory Heap, Microtask Queue (Promises, queueMicrotask), and Macrotask Queue (setTimeout, setImmediate, DOM events). Microtasks always drain completely before the next macrotask is dispatched.",
                  "formula": "Event Loop Turn: Call Stack -> Drain Microtasks -> RequestAnimationFrame -> Render Paint -> Macrotask",
                  "code": "// Event loop execution order demonstration\nconsole.log('1: Synchronous');\nsetTimeout(() => console.log('4: Macrotask (setTimeout)'), 0);\nPromise.resolve().then(() => console.log('2: Microtask 1'));\nqueueMicrotask(() => console.log('3: Microtask 2'));\nconsole.log('Synchronous Complete');",
                  "language": "javascript",
                  "proTip": "Always prioritize microtasks for short atomic state updates, but never block the microtask queue with recursive calls, which starves the browser UI thread.",
                  "asciiDiagram": "\n+-------------------------------------------------------------+\n|                     GOOGLE V8 ENGINE                        |\n|  JavaScript Source -> Parser -> AST -> Ignition (Bytecode)  |\n|                                            |                |\n|                                       Feedback Vector       |\n|                                            v                |\n|                                      TurboFan (JIT)         |\n|                                            v                |\n|                                   Optimized Machine Code    |\n+-------------------------------------------------------------+\n"
                },
                {
                  "heading": "2. React Fiber Reconciliation & The Diffing Algorithm",
                  "content": "Traditional React (v15 and below) utilized a recursive stack reconciler that could block the main thread during deep tree updates. React Fiber reimagines reconciliation as a linked-list work graph where each Fiber node represents a unit of work. Work is divided into two phases: the Render/Reconciliation Phase (asynchronous and interruptible) and the Commit Phase (synchronous DOM mutations). By using stable unique keys, React identifies elements that have moved rather than tearing down and recreating DOM nodes.",
                  "code": "// Idiomatic React Fiber List with stable IDs\nfunction StudentLeaderboard({ scholars }) {\n  return (\n    <ul className=\"space-y-2\">\n      {scholars.map((scholar) => (\n        <li key={scholar.id} className=\"p-3 bg-white/5 rounded-xl flex justify-between\">\n          <span className=\"font-bold\">{scholar.name}</span>\n          <span className=\"text-cyan-400 font-mono\">{scholar.score} pts</span>\n        </li>\n      ))}\n    </ul>\n  );\n}",
                  "language": "javascript",
                  "commonTrap": "Never use array index as a React key for lists that can be reordered, sorted, or filtered; doing so causes state mismatch and redundant DOM destructions."
                }
              ],
              "selfCheck": [
                {
                  "question": "Which task queue is executed first after the current synchronous stack empties?",
                  "options": [
                    "Macrotask Queue (setTimeout)",
                    "Microtask Queue (Promise.then)",
                    "I/O Poll Queue",
                    "Check Queue (setImmediate)"
                  ],
                  "correct": 1
                }
              ],
              "caseStudy": {
                "company": "Meta / Facebook",
                "title": "How React Fiber Solved the 60 FPS Jitter Problem for 3 Billion Users",
                "scenario": "Prior to React 16, rendering complex feeds like Facebook News Feed used a synchronous recursive stack reconciler. Heavy tree updates would lock the JavaScript main thread for 100ms+ (dropping frame rates below 10 FPS and freezing text inputs).",
                "architecture": "Fiber rewrote the reconciler as an interruptible linked-list state machine. It splits rendering into 5ms slices (using MessageChannel / requestIdleCallback). If the browser receives a high-priority user interaction (keystroke or scroll), Fiber pauses the current render tree, handles the user event, and resumes work without discarding previous progress.",
                "takeaway": "Always decouple computation priority from rendering execution: user inputs must always run with immediate urgency, while data list reconciliation can be scheduled cooperatively."
              },
              "interviewPearls": [
                {
                  "question": "What is the difference between the Render Phase and Commit Phase in React Fiber?",
                  "answer": "The Render Phase traverses the Fiber tree, invokes component functions, and computes the side-effect list. It is purely computational, asynchronous, and can be paused or aborted. The Commit Phase takes the computed side-effect list and synchronously applies DOM mutations (e.g. appendChild, removeChild) and fires layout effects, ensuring the UI is never left in a partially updated state."
                },
                {
                  "question": "Why does V8 compile JavaScript in two stages (Ignition interpreter + TurboFan JIT) instead of compiling straight to machine code?",
                  "answer": "Compiling complex JavaScript directly to machine code consumes significant memory and delays initial page startup (Time to Interactive). Ignition quickly emits compact bytecode in milliseconds for immediate startup. TurboFan then selectively compiles only 'hot' functions (frequently executed loops) into hyper-optimized machine code based on runtime type feedback."
                }
              ]
            }
          },
          {
            "id": "les-1-2",
            "title": "RESTful API Engineering, JWT Authentication & Security Headers",
            "type": "reading",
            "duration": "35 mins",
            "summary": "Architecting secure microservices, stateless JWT lifecycle, CORS protocols, and CSRF token defenses.",
            "textbook": {
              "chapterNumber": "Chapter 1.2",
              "readingTime": "15 mins read",
              "keyTakeaways": [
                "JSON Web Tokens (JWT) consist of Header, Payload, and Cryptographic Signature (Base64Url encoded).",
                "Storing JWTs in HttpOnly; Secure; SameSite=Strict cookies completely shields them from client-side XSS exfiltration.",
                "Security headers (CSP, HSTS, X-Content-Type-Options) provide mandatory defense-in-depth against injection attacks."
              ],
              "sections": [
                {
                  "heading": "1. JWT Anatomy & Cryptographic Signing",
                  "content": "A JWT is a compact, URL-safe means of representing claims between two parties. It contains three parts separated by dots: Header (algorithm & token type), Payload (claims like sub, exp, role), and Signature (HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)). Because payloads are only Base64 encoded and NOT encrypted, sensitive secrets like passwords must never be placed inside the payload.",
                  "formula": "JWT = base64(Header) . base64(Payload) . HMAC-SHA256(Header + '.' + Payload, Secret)",
                  "code": "// Verifying and decoding JWT in Node.js\nimport jwt from 'jsonwebtoken';\n\nfunction authenticateToken(req, res, next) {\n  const authHeader = req.headers['authorization'];\n  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>\n  if (!token) return res.status(401).json({ error: 'Access token required' });\n\n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).json({ error: 'Token invalid or expired' });\n    req.user = user;\n    next();\n  });\n}",
                  "language": "javascript"
                },
                {
                  "heading": "2. Production Security Headers & CORS",
                  "content": "Cross-Origin Resource Sharing (CORS) is a browser mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin access to selected resources from a different origin. Setting strict Content-Security-Policy (CSP) and Strict-Transport-Security (HSTS) headers prevents Cross-Site Scripting (XSS) and protocol downgrade attacks.",
                  "code": "// Recommended Express.js Security Headers\napp.use((req, res, next) => {\n  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');\n  res.setHeader('X-Content-Type-Options', 'nosniff');\n  res.setHeader('X-Frame-Options', 'DENY');\n  res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self' https://trusted.cdn.com\");\n  next();\n});",
                  "language": "javascript"
                }
              ],
              "caseStudy": {
                "company": "Auth0 / Okta",
                "title": "Architecting Zero-Trust Stateless JWT Authentication at 500M Daily Logins",
                "scenario": "Centralized database session lookups created massive read bottlenecks at millions of requests per second. Migrating to stateless JWT tokens allowed edge API gateways to verify identity locally without querying a central session database.",
                "architecture": "Edge proxies cache the Identity Provider's public JSON Web Key Set (JWKS) via asymmetric RS256/ES256. When a request arrives with an Authorization Bearer token, the gateway verifies the cryptographic signature in 0.1ms using the cached public key. Revocations are handled via short token lifespans (15 mins) paired with sliding refresh tokens stored in Redis.",
                "takeaway": "Never store sensitive state in JWT payloads without encryption; use RS256 asymmetric signatures so gateways can verify tokens without knowing the private signing key."
              },
              "interviewPearls": [
                {
                  "question": "How do you revoke a stateless JWT before its natural expiration if a user's account is compromised?",
                  "answer": "Since JWTs are self-contained, common revocation strategies include: 1) Short Token Lifespans (5-15 mins) so compromises expire rapidly; 2) Redis Token Blacklist storing revoked `jti` (JWT ID) claims checked at API gateways; 3) User Token Version counter stored in database/cache: when a user logs out all devices, increment `token_version`, and reject tokens whose claim does not match."
                },
                {
                  "question": "What is the difference between CORS and CSRF?",
                  "answer": "CORS (Cross-Origin Resource Sharing) is a browser mechanism that restricts scripts on Origin A from reading responses from Origin B unless Origin B authorizes it via `Access-Control-Allow-Origin`. CSRF (Cross-Site Request Forgery) tricks a victim's browser into executing unauthorized state-changing requests against Origin B using automatically attached cookies, prevented via `SameSite=Strict` cookies and CSRF tokens."
                }
              ]
            }
          },
          {
            "id": "les-1-3",
            "title": "Hands-on: Full-Stack Component Performance Optimization",
            "type": "practice",
            "duration": "60 mins",
            "summary": "Implement memoization, virtual list virtualization, lazy code-splitting, and render cycle profiling.",
            "textbook": {
              "chapterNumber": "Chapter 1.3",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "Use React.memo, useMemo, and useCallback to preserve reference equality and eliminate redundant renders.",
                "Window virtualization renders only DOM nodes within the active viewport, scaling 100,000+ row datasets smoothly.",
                "Dynamic imports via React.lazy and Suspense shrink initial JavaScript bundle sizes."
              ],
              "sections": [
                {
                  "heading": "1. Memoization & Reference Equality",
                  "content": "In JavaScript, functions and objects are compared by reference (`{} !== {}`). When a parent component re-renders, new function instances are passed to child components unless wrapped in `useCallback`. Similarly, expensive calculations should be wrapped in `useMemo` with strict dependency arrays.",
                  "code": "// Optimized Component with useCallback & useMemo\nimport React, { useState, useMemo, useCallback } from 'react';\n\nconst ComplexList = React.memo(({ items, onItemSelect }) => {\n  return (\n    <div>\n      {items.map(item => (\n        <button key={item.id} onClick={() => onItemSelect(item.id)} className=\"p-2\">\n          {item.name}\n        </button>\n      ))}\n    </div>\n  );\n});",
                  "language": "javascript"
                }
              ],
              "caseStudy": {
                "company": "Twitter / X",
                "title": "Window Virtualization for 50,000+ Infinite Scroll Feed Items",
                "scenario": "Rendering 10,000 tweets as real DOM nodes resulted in 500,000+ DOM elements in the browser, consuming 1.5GB RAM and causing 500ms scroll stutters.",
                "architecture": "Implemented Virtual Windowing (similar to react-window). Only the 15-20 tweets currently visible in the user's viewport plus a 5-item buffer above and below are rendered into the DOM. Absolute CSS `translateY` transforms reposition elements dynamically as the user scrolls, maintaining constant memory overhead (under 30MB).",
                "takeaway": "DOM node creation is one of the heaviest browser operations. Scale large datasets with window virtualization rather than rendering unbounded arrays."
              },
              "interviewPearls": [
                {
                  "question": "When should you NOT use React.memo?",
                  "answer": "React.memo incurs a memory and computation cost to shallowly compare old and new props before every render. You should NOT use it when: 1) The component is lightweight (shallow comparisons take longer than simple re-renders); 2) Props change on every render (e.g. inline objects or functions without useCallback), rendering the memoization useless."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-2",
        "title": "Module 2: Database Management Systems & Distributed SQL",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-2-1",
            "title": "Relational Algebra, 3NF/BCNF Normalization & ACID Properties",
            "type": "video",
            "duration": "50 mins",
            "summary": "Rigorous analysis of database anomalies, functional dependencies, lossless decomposition, and transaction isolation levels.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "Functional Dependencies (X -> Y) define relationships between attributes in a relation.",
                "Boyce-Codd Normal Form (BCNF) strictly requires that for every non-trivial dependency X -> Y, X must be a superkey.",
                "Transaction Isolation Levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable."
              ],
              "sections": [
                {
                  "heading": "1. Normalization & De-anomalization",
                  "content": "Database anomalies (Insertion, Deletion, and Update anomalies) occur when redundant data is stored in unnormalized tables. 1NF removes repeating groups. 2NF removes partial dependencies where a non-prime attribute depends on part of a composite key. 3NF eliminates transitive dependencies. BCNF is an advanced version of 3NF that ensures strict superkey compliance for all determinants.",
                  "formula": "BCNF Condition: For all functional dependencies X -> Y, X is a Superkey of relation R."
                },
                {
                  "heading": "2. ACID Transactions & Concurrency Anomalies",
                  "content": "A database transaction is an atomic unit of execution. The engine prevents concurrency anomalies:\n- Dirty Read: Reading uncommitted data modified by another transaction.\n- Non-Repeatable Read: Re-reading a row returns different data because another transaction committed an update.\n- Phantom Read: Re-executing a range query returns newly inserted rows matching the predicate.",
                  "code": "-- PostgreSQL Transaction with Serializable Isolation\nBEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\nUPDATE accounts SET balance = balance - 500 WHERE account_id = 'ACC_101';\nUPDATE accounts SET balance = balance + 500 WHERE account_id = 'ACC_102';\n\nCOMMIT;",
                  "language": "sql"
                }
              ],
              "caseStudy": {
                "company": "Stripe",
                "title": "Financial Ledger Normalization & Exact BCNF Guarantees",
                "scenario": "In high-throughput financial payment ledgers, data redundancy or partial key dependencies cause catastrophic accounting anomalies (e.g., balance updates modifying wrong currency records).",
                "architecture": "Stripe enforces strict Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF) on ledger tables. Non-prime attributes depend only on the primary key, strictly eliminating transitive and partial dependencies. Transactions utilize Immutable Append-Only Ledger patterns with double-entry bookkeeping.",
                "takeaway": "Normalize database schemas to 3NF/BCNF to prevent update and deletion anomalies, and denormalize selectively only for high-speed read-heavy analytical reporting."
              },
              "interviewPearls": [
                {
                  "question": "Explain the difference between 3NF and BCNF with an example.",
                  "answer": "3NF allows a non-trivial functional dependency `X -> Y` if either `X` is a Superkey OR `Y` is a Prime Attribute (part of a candidate key). BCNF is stricter: `X` MUST be a Superkey in ALL non-trivial dependencies `X -> Y`. BCNF eliminates anomalies where overlapping composite candidate keys exist."
                }
              ]
            }
          },
          {
            "id": "les-2-2",
            "title": "B+ Tree Indexing Internals, Query Execution Plans & Optimization",
            "type": "reading",
            "duration": "40 mins",
            "summary": "How relational query engines parse, analyze, and optimize cost-based index scans versus sequential table scans.",
            "textbook": {
              "chapterNumber": "Chapter 2.2",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "B+ Trees store records or record-pointers only in leaf nodes, maximizing branching factor in internal nodes.",
                "Clustered Index determines physical sorting order on disk (one per table).",
                "EXPLAIN ANALYZE reveals actual execution costs, sequential scans vs index scans, and join strategies."
              ],
              "sections": [
                {
                  "heading": "1. Anatomy of B+ Trees in Storage Engines",
                  "content": "In a B+ Tree with page size 8KB or 16KB, internal nodes contain routing keys and child page pointers. Leaf nodes are linked horizontally in a doubly-linked list. This structure yields O(log_B N) search time where B is the high branching factor (typically 100-200), meaning a 3-level tree can index millions of records with only 3 disk page reads.",
                  "code": "-- Using EXPLAIN ANALYZE to inspect query plan\nEXPLAIN ANALYZE\nSELECT u.username, COUNT(o.id) as order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.status = 'COMPLETED'\nGROUP BY u.username\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC;",
                  "language": "sql",
                  "asciiDiagram": "\n+---------------------------------------------------------------+\n|                      B+ TREE ROOT (Level 1)                   |\n|                   [ Key: 100 | Key: 500 ]                     |\n|                   /          |          \\                    |\n|             Level 2        Level 2       Level 2              |\n|          [ 20 | 50 ]     [ 200 | 350 ]  [ 600 | 800 ]         |\n|            /    \\           /     \\        /    \\             |\n|       +---+      +---+  +---+      +---+ +---+   +---+        |\n| Leaf: | 10|<---->| 30|<>| 60|<---->|210|<>|620|<>|850| (Data) |\n|       +---+      +---+  +---+      +---+ +---+   +---+        |\n+---------------------------------------------------------------+\n"
                }
              ],
              "caseStudy": {
                "company": "Amazon DynamoDB / MySQL InnoDB",
                "title": "Why Storage Engines Choose B+ Trees Over Binary Search Trees and Hash Indexes",
                "scenario": "A table with 100,000,000 rows stored in an unindexed heap file requires scanning 100,000 disk pages (~800MB disk I/O) taking 5 seconds per query.",
                "architecture": "InnoDB builds a B+ Tree with 16KB disk page blocks. Because each internal node has a high branching factor (fan-out of ~100 to 200 child pointers), a 3-level tree indexes 100M+ rows. Traversal requires only 3 page reads: Root Page (cached in RAM), Intermediate Page (cached in Buffer Pool), and Leaf Page (disk read in 0.5ms).",
                "takeaway": "B+ Trees minimize disk I/O depth and link all leaf nodes in a doubly-linked list for lightning-fast range scans (`BETWEEN val1 AND val2`)."
              },
              "interviewPearls": [
                {
                  "question": "Why do B+ trees store all data records only in leaf nodes, unlike standard B-trees which store data in internal nodes?",
                  "answer": "By keeping internal nodes free of bulky row data and storing only routing keys and 6-byte child page pointers, the branching factor (fan-out) is maximized. This keeps the tree height extremely shallow (3-4 levels for billions of rows) and maximizes the number of routing keys cached in CPU L1/L2 and RAM buffer pools."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-3",
        "title": "Module 3: Operating Systems Internals & Memory Architecture",
        "duration": "11 Hours",
        "lessons": [
          {
            "id": "les-3-1",
            "title": "Process Management, PCB, CPU Scheduling & Context Switching",
            "type": "video",
            "duration": "45 mins",
            "summary": "Preemptive vs non-preemptive scheduling algorithms (Round Robin, Multilevel Feedback Queues), process synchronization, and mutexes.",
            "textbook": {
              "chapterNumber": "Chapter 3.1",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "Process Control Block (PCB) preserves registers, program counter, memory limits, and open file tables during context switching.",
                "Scheduling criteria: CPU Utilization, Throughput, Turnaround Time, Waiting Time, Response Time.",
                "Mutexes and Semaphores solve the Critical Section problem preventing race conditions."
              ],
              "sections": [
                {
                  "heading": "1. Context Switching & Kernel State Transitions",
                  "content": "When a timer interrupt or system call yields the CPU, the OS kernel saves the executing process state (registers, stack pointer, program counter) into its PCB, transitions it from RUNNING to READY or BLOCKED, and restores the next scheduled process. Context switching incurs CPU cycle overhead from cache pollution and TLB flushing.",
                  "formula": "Turnaround Time = Completion Time - Arrival Time | Waiting Time = Turnaround Time - Burst Time"
                }
              ],
              "caseStudy": {
                "company": "Linux Kernel Core Team",
                "title": "Completely Fair Scheduler (CFS) and Virtual Runtime Tracking",
                "scenario": "Early OS schedulers used multi-level queues with complex heuristic priority boosts that could be exploited by malicious user processes to starve background tasks.",
                "architecture": "Linux introduced CFS (Completely Fair Scheduler), which replaces discrete runqueues with a balanced Red-Black Tree indexed by `vruntime` (virtual runtime). The process that has received the least CPU time (leftmost node in the Red-Black tree) is selected in O(1) time. As it executes, its `vruntime` advances proportional to its nice weight, maintaining fair CPU allocation without starvation.",
                "takeaway": "Fair scheduling models CPU execution as an ideal multi-tasking hardware system, balancing responsiveness for interactive apps and throughput for compute jobs."
              },
              "interviewPearls": [
                {
                  "question": "What is the CPU context switching overhead, and what causes it?",
                  "answer": "Context switching overhead includes Direct Costs (saving/restoring CPU registers, program counter, and stack pointer into PCB via kernel trap) and Indirect Costs (TLB cache invalidation, CPU L1/L2 data and instruction cache misses as the new process populates its working set)."
                }
              ]
            }
          },
          {
            "id": "les-3-2",
            "title": "Virtual Memory, Paging, TLB Cache & Page Replacement Algorithms",
            "type": "reading",
            "duration": "35 mins",
            "summary": "Demand paging mechanics, Translation Lookaside Buffer hits/misses, Thrashing, and LRU/FIFO page faults.",
            "textbook": {
              "chapterNumber": "Chapter 3.2",
              "readingTime": "15 mins read",
              "keyTakeaways": [
                "Virtual address space maps to physical frames via multi-level Page Tables.",
                "TLB (Translation Lookaside Buffer) is an associative hardware cache providing single-cycle virtual-to-physical address translation.",
                "LRU (Least Recently Used) page replacement approximates optimal Belady algorithm without anomaly."
              ],
              "sections": [
                {
                  "heading": "1. Demand Paging & The TLB Hit Flow",
                  "content": "When the CPU generates a virtual memory address, the Memory Management Unit (MMU) checks the TLB. On a TLB Hit, the physical frame number is returned in ~1ns. On a TLB Miss, the MMU performs a Page Table Walk. If the Valid/Invalid bit indicates the page is not in RAM, a Page Fault exception traps into kernel space, triggering disk swap retrieval.",
                  "formula": "Effective Access Time (EAT) = (1 - p) * Memory Access Time + p * Page Fault Service Time"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-4",
        "title": "Module 4: Computer Networks & Distributed Systems Protocols",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-4-1",
            "title": "TCP/IP 4-Layer vs OSI 7-Layer, 3-Way Handshake & Flow Control",
            "type": "video",
            "duration": "45 mins",
            "summary": "Transmission Control Protocol connection establishment, sequence numbering, congestion control (AIMD), and UDP comparisons.",
            "textbook": {
              "chapterNumber": "Chapter 4.1",
              "readingTime": "17 mins read",
              "keyTakeaways": [
                "OSI 7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
                "TCP Sliding Window protocol enables reliable stream delivery and byte-level flow control.",
                "Congestion Control: Slow Start (exponential growth), Congestion Avoidance (Additive Increase, Multiplicative Decrease)."
              ],
              "sections": [
                {
                  "heading": "1. TCP Reliability & Congestion Control",
                  "content": "TCP provides a connection-oriented, reliable byte stream using Sequence Numbers and ACKs. Flow control prevents sender from overwhelming receiver buffers via the advertised Receive Window (rwnd). Congestion control prevents network pipeline collapse via the Congestion Window (cwnd). When packet loss occurs, TCP halves cwnd (AIMD).",
                  "formula": "AIMD Rule: On successful RTT -> cwnd += 1 MSS; On packet drop -> cwnd = cwnd / 2"
                }
              ],
              "caseStudy": {
                "company": "Google",
                "title": "Deploying TCP BBR Across YouTube to Cut Global Video Buffering by 20%",
                "scenario": "Loss-based congestion control algorithms (like TCP Cubic and Reno) assume packet loss equals network congestion. On high-speed long-distance links with minor WiFi packet loss, Cubic throttled throughput by 50%, causing video stalls.",
                "architecture": "Google engineered BBR (Bottleneck Bandwidth and RTT). BBR continuously probes the physical delivery rate (max bandwidth) and minimum round-trip time (min RTT), keeping the network pipe full without overflowing intermediate router buffers (bufferbloat).",
                "takeaway": "Model-based congestion control optimizes throughput and latency simultaneously by measuring the true capacity of the physical link."
              },
              "interviewPearls": [
                {
                  "question": "Explain TCP Flow Control vs TCP Congestion Control.",
                  "answer": "Flow Control is an end-to-end mechanism where the receiver advertises its Receive Window (`rwnd`) to prevent the sender from overwhelming receiver buffer memory. Congestion Control is a network-wide mechanism where the sender modulates its Congestion Window (`cwnd`) based on network capacity to prevent intermediate router queues from overflowing."
                }
              ]
            }
          },
          {
            "id": "les-4-2",
            "title": "Application Layer Protocols: HTTP/2, HTTP/3 QUIC, TLS 1.3 & WebSockets",
            "type": "reading",
            "duration": "40 mins",
            "summary": "Multiplexing, header compression (HPACK), symmetric encryption handshakes, and persistent bi-directional duplex communication.",
            "textbook": {
              "chapterNumber": "Chapter 4.2",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "HTTP/2 introduces binary framing and stream multiplexing over a single TCP connection.",
                "HTTP/3 replaces TCP with QUIC over UDP, eliminating transport-level Head-of-Line blocking and enabling 0-RTT handshakes.",
                "WebSockets provide full-duplex persistent TCP channels over ws:// and wss:// protocols."
              ],
              "sections": [
                {
                  "heading": "1. HTTP Evolution (1.1 -> 2 -> 3 QUIC)",
                  "content": "HTTP/1.1 suffered from Head-of-Line (HoL) blocking where slow responses stalled subsequent requests. HTTP/2 solved application-layer HoL blocking by multiplexing multiple independent request/response streams over one TCP socket. However, a single dropped TCP packet would still pause all streams. HTTP/3 builds upon QUIC over UDP, ensuring stream-level isolation where a lost packet on stream A never halts stream B.",
                  "code": "// Creating an upgraded WebSocket server in Node.js\nimport { WebSocketServer } from 'ws';\n\nconst wss = new WebSocketServer({ port: 8080 });\nwss.on('connection', (ws) => {\n  console.log('Client connected for real-time duplex stream');\n  ws.on('message', (message) => {\n    ws.send(JSON.stringify({ ack: true, received: message.toString(), timestamp: Date.now() }));\n  });\n});",
                  "language": "javascript"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "id": "grand-test-fullstack-core",
      "title": "Full-Stack Software Engineering & Core CS Grand Assessment",
      "durationMinutes": 45,
      "passPercentage": 60,
      "questions": [
        {
          "id": "gt_fs_1",
          "level": "Level 1: Fundamentals",
          "topic": "DBMS & Storage",
          "question": "In modern relational database management systems, what is the primary on-disk data structure used for clustered indexing and range queries?",
          "options": [
            "Hash Table",
            "B+ Tree",
            "Binary Max Heap",
            "Singly Linked List"
          ],
          "correct": 1,
          "explanation": "B+ Trees maintain balanced logarithmic height, keep all data pointers in sorted leaf nodes with doubly-linked sibling pointers, making them optimal for disk block paging and range queries."
        },
        {
          "id": "gt_fs_2",
          "level": "Level 1: Fundamentals",
          "topic": "Operating Systems",
          "question": "Which of the following is NOT one of the four necessary Coffman conditions required for a Deadlock state to occur?",
          "options": [
            "Mutual Exclusion",
            "Hold and Wait",
            "Preemption Allowed",
            "Circular Wait"
          ],
          "correct": 2,
          "explanation": "The Coffman condition is 'No Preemption' (resources cannot be forcibly reclaimed). If preemption is allowed, deadlocks are prevented."
        },
        {
          "id": "gt_fs_3",
          "level": "Level 1: Fundamentals",
          "topic": "Computer Networks",
          "question": "During a standard TCP 3-way connection handshake, what sequence of packet flags is exchanged between client and server?",
          "options": [
            "SYN -> SYN+ACK -> ACK",
            "SYN -> ACK -> SYN+ACK",
            "ACK -> SYN -> ACK+DATA",
            "FIN -> ACK -> FIN+ACK"
          ],
          "correct": 0,
          "explanation": "TCP connection establishment starts with client sending SYN, server responding with SYN+ACK, and client concluding with ACK."
        },
        {
          "id": "gt_fs_4",
          "level": "Level 1: Fundamentals",
          "topic": "Web Architecture",
          "question": "What is the primary function of the JavaScript Virtual DOM in React reconciliation?",
          "options": [
            "Directly executes low-level C++ bytecode in the browser GPU",
            "Maintains an in-memory representation of the UI tree to compute minimal diffs before batching real DOM updates",
            "Replaces the browser CSS rendering engine completely",
            "Stores session cookies securely in local storage"
          ],
          "correct": 1,
          "explanation": "The Virtual DOM keeps a lightweight JavaScript representation of the DOM tree in memory, diffs it via the React Fiber reconciler, and applies only the minimal batch changes to the real browser DOM."
        },
        {
          "id": "gt_fs_5",
          "level": "Level 1: Fundamentals",
          "topic": "Database Management",
          "question": "What does the 'I' in ACID database transactions guarantee?",
          "options": [
            "Integrity: Constraints like Foreign Keys are never violated",
            "Isolation: Concurrent transactions execute without cross-transaction interference or dirty reads",
            "Indexing: All tables must contain at least one primary key",
            "Idempotency: Re-running a query returns identical binary hash values"
          ],
          "correct": 1,
          "explanation": "Isolation ensures that concurrent transactions execute independently without interfering with one another, preventing dirty reads, non-repeatable reads, and phantom reads depending on isolation level."
        },
        {
          "id": "gt_fs_6",
          "level": "Level 1: Fundamentals",
          "topic": "Operating Systems",
          "question": "In OS memory management, what is a 'Page Fault'?",
          "options": [
            "A hardware error when RAM physically fails",
            "An interrupt generated when a running program accesses a memory page mapped in virtual address space but not currently loaded in physical RAM",
            "A segmentation fault caused by writing to a read-only variable",
            "A syntax error thrown by the kernel compiler"
          ],
          "correct": 1,
          "explanation": "A Page Fault occurs when virtual memory references a valid address that is currently not present in physical frames, causing the OS to fetch the page from disk swap space into RAM."
        },
        {
          "id": "gt_fs_7",
          "level": "Level 1: Fundamentals",
          "topic": "Computer Networks",
          "question": "Which HTTP response status code indicates that the server successfully processed the request, but is not returning any content in the response body?",
          "options": [
            "200 OK",
            "201 Created",
            "204 No Content",
            "304 Not Modified"
          ],
          "correct": 2,
          "explanation": "HTTP 204 No Content signifies that the action was successfully executed by the server (e.g. a DELETE or PUT) without requiring a response payload."
        },
        {
          "id": "gt_fs_8",
          "level": "Level 1: Fundamentals",
          "topic": "Web Security",
          "question": "What is the primary purpose of the 'Same-Origin Policy' (SOP) implemented by modern web browsers?",
          "options": [
            "To prevent scripts on one origin from accessing sensitive DOM or cookie data on another origin without explicit CORS permission",
            "To force all web traffic to use port 443 HTTPS",
            "To restrict web pages to only loading images from local disk storage",
            "To compress network assets using Gzip encoding"
          ],
          "correct": 0,
          "explanation": "The Same-Origin Policy is a fundamental browser security mechanism that isolates documents across different protocol, domain, and port tuples."
        },
        {
          "id": "gt_fs_9",
          "level": "Level 1: Fundamentals",
          "topic": "Operating Systems",
          "question": "What distinguishes a Process from a Thread in standard operating system architecture?",
          "options": [
            "Processes have independent address spaces and file descriptors, whereas threads in the same process share the heap and memory space",
            "Threads run in kernel space while processes strictly run in user space",
            "Processes cannot be scheduled by the CPU",
            "Threads have completely isolated virtual memory mappings"
          ],
          "correct": 0,
          "explanation": "A process is an isolated execution container with its own virtual address space, while threads within a process share the code segment, data segment, and heap, having only their own stack and registers."
        },
        {
          "id": "gt_fs_10",
          "level": "Level 1: Fundamentals",
          "topic": "DBMS Normalization",
          "question": "A database table is in Third Normal Form (3NF) if it is in 2NF and has NO:",
          "options": [
            "Primary keys",
            "Transitive functional dependencies between non-prime attributes",
            "Foreign key constraints",
            "Composite indexes"
          ],
          "correct": 1,
          "explanation": "3NF requires that all non-key attributes are directly dependent on the primary key, eliminating transitive dependencies (X -> Y and Y -> Z where Z is not a candidate key)."
        },
        {
          "id": "gt_fs_11",
          "level": "Level 2: Intermediate",
          "topic": "Full-Stack Security",
          "question": "When storing JWTs in a web browser for authentication, why is an 'HttpOnly; Secure; SameSite=Strict' cookie preferred over localStorage?",
          "options": [
            "localStorage has a 5MB storage limit while cookies can store up to 500MB",
            "HttpOnly cookies cannot be accessed or stolen by client-side JavaScript, effectively neutralizing Cross-Site Scripting (XSS) token theft",
            "Cookies automatically encrypt the token payload using RSA 4096-bit keys on the client",
            "localStorage tokens expire automatically after 15 minutes"
          ],
          "correct": 1,
          "explanation": "HttpOnly prevents JavaScript code from reading document.cookie, protecting authentication tokens from malicious XSS injection payloads."
        },
        {
          "id": "gt_fs_12",
          "level": "Level 2: Intermediate",
          "topic": "DBMS Indexing",
          "question": "Consider SQL query `SELECT * FROM orders WHERE customer_id = 42 AND order_date >= '2026-01-01' ORDER BY order_date DESC`. What composite index provides optimal scanning without a separate filesort?",
          "options": [
            "CREATE INDEX idx_orders ON orders (order_date, customer_id);",
            "CREATE INDEX idx_orders ON orders (customer_id, order_date);",
            "CREATE INDEX idx_orders ON orders (total_amount);",
            "Two separate single-column indexes on customer_id and order_date"
          ],
          "correct": 1,
          "explanation": "By the Leftmost Prefix Rule, equality columns (`customer_id`) should come first in composite indexing followed by range/sorting columns (`order_date`), allowing the B+ tree to filter and sort in a single scan."
        },
        {
          "id": "gt_fs_13",
          "level": "Level 2: Intermediate",
          "topic": "Operating Systems",
          "question": "In CPU scheduling algorithms, what is the phenomenon known as 'Convoy Effect'?",
          "options": [
            "When multiple high-priority threads starve all I/O processes",
            "When shorter CPU-bound processes are forced to wait behind a long CPU-intensive process in First-Come, First-Served (FCFS) scheduling",
            "When cache invalidation causes multi-core thrashing",
            "When deadlock occurs due to mutual exclusion"
          ],
          "correct": 1,
          "explanation": "The Convoy Effect happens in FCFS scheduling where smaller processes queue up behind a massive CPU-bound process, degrading average waiting time."
        },
        {
          "id": "gt_fs_14",
          "level": "Level 2: Intermediate",
          "topic": "Computer Networks",
          "question": "What is the primary advantage of HTTP/2 and HTTP/3 over HTTP/1.1 with respect to network latency?",
          "options": [
            "They eliminate the need for TLS/SSL encryption",
            "They support request/response multiplexing over a single connection, eliminating Head-of-Line (HoL) blocking at the application layer",
            "They replace TCP ports with direct MAC address broadcasting",
            "They allow browsers to execute server-side code directly"
          ],
          "correct": 1,
          "explanation": "HTTP/2 introduces binary framing and stream multiplexing over a single TCP connection, allowing concurrent requests and responses without Head-of-Line blocking."
        },
        {
          "id": "gt_fs_15",
          "level": "Level 2: Intermediate",
          "topic": "React Performance",
          "question": "In React 18, what does the `useDeferredValue` hook do?",
          "options": [
            "Schedules an asynchronous setTimeout call on the browser window",
            "Defers updating a non-critical part of the UI until higher-priority user keystrokes/interactions are painted",
            "Caches API response payloads in indexedDB",
            "Prevents any re-rendering of child components permanently"
          ],
          "correct": 1,
          "explanation": "`useDeferredValue` allows React to prioritize urgent inputs (like fast typing in an input field) and defer rendering heavy search list updates until the main thread is idle."
        },
        {
          "id": "gt_fs_16",
          "level": "Level 2: Intermediate",
          "topic": "Database Isolation",
          "question": "Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still allow Phantom Reads under standard ANSI SQL definitions?",
          "options": [
            "Read Uncommitted",
            "Read Committed",
            "Repeatable Read",
            "Serializable"
          ],
          "correct": 2,
          "explanation": "Repeatable Read guarantees that any row read by a transaction remains unchanged for the duration of that transaction, though newly inserted matching rows (phantoms) could appear in subsequent range queries."
        },
        {
          "id": "gt_fs_17",
          "level": "Level 2: Intermediate",
          "topic": "Operating Systems",
          "question": "What is 'Thrashing' in a virtual memory system?",
          "options": [
            "A condition where the CPU spends significantly more time swapping pages in and out of disk than executing user instructions",
            "A hardware clock desynchronization between CPU cores",
            "When two threads access a shared variable without synchronization",
            "When the disk controller overheats from rapid writes"
          ],
          "correct": 0,
          "explanation": "Thrashing occurs when the active working set of running processes exceeds available physical memory frames, resulting in continuous page faulting and disk I/O bottlenecks."
        },
        {
          "id": "gt_fs_18",
          "level": "Level 2: Intermediate",
          "topic": "Computer Networks & Security",
          "question": "How does asymmetric public-key cryptography differ from symmetric cryptography in TLS handshakes?",
          "options": [
            "Asymmetric uses the same single secret key for both encryption and decryption, whereas symmetric uses mathematical key pairs",
            "Asymmetric uses a Public Key to encrypt/verify and a Private Key to decrypt/sign, used during the handshake to negotiate a high-speed shared Symmetric session key",
            "Asymmetric is 1000x faster than symmetric encryption for streaming large video files",
            "Symmetric encryption requires a certificate authority while asymmetric does not"
          ],
          "correct": 1,
          "explanation": "TLS uses asymmetric cryptography (RSA / ECDHE) to securely authenticate the server and negotiate a shared secret, after which high-throughput symmetric encryption (AES-GCM / ChaCha20) encrypts all application payload data."
        },
        {
          "id": "gt_fs_19",
          "level": "Level 2: Intermediate",
          "topic": "Backend & Caching",
          "question": "In high-scale distributed systems, what is the 'Cache-Aside' (Lazy Loading) caching pattern?",
          "options": [
            "The database writes updates to the cache asynchronously before committing to disk",
            "The application first queries the cache; if a cache miss occurs, it queries the database, writes the result to the cache, and returns it to the client",
            "The cache automatically deletes 50% of its keys every hour",
            "The cache executes full SQL queries directly against client browser memory"
          ],
          "correct": 1,
          "explanation": "Under Cache-Aside, the application coordinates between cache and persistent store: checking cache first, fetching from DB on miss, and populating cache for subsequent reads."
        },
        {
          "id": "gt_fs_20",
          "level": "Level 2: Intermediate",
          "topic": "System Architecture",
          "question": "What is the primary role of a Reverse Proxy (e.g. Nginx, Cloudflare) in modern production infrastructure?",
          "options": [
            "To compile frontend React JSX code inside client browsers",
            "To sit in front of backend servers, handling SSL termination, load balancing, edge caching, and DDoS mitigation",
            "To execute database migrations on disk",
            "To replace backend application code with WebAssembly"
          ],
          "correct": 1,
          "explanation": "A reverse proxy intercepts incoming client requests and directs them to appropriate origin backend servers, providing load distribution, SSL offloading, rate limiting, and edge caching."
        },
        {
          "id": "gt_fs_21",
          "level": "Level 3: Advanced",
          "topic": "Distributed Systems",
          "question": "According to the CAP Theorem, during a network partition (P) in a distributed database, what fundamental trade-off must be chosen?",
          "options": [
            "Consistency (CP): reject updates to ensure all nodes return identical data, OR Availability (AP): continue serving reads/writes even if replicas return stale data",
            "Compression (CP) vs Encryption (AP)",
            "Compute speed vs Storage size",
            "CPU clock rate vs Memory bandwidth"
          ],
          "correct": 0,
          "explanation": "When network partitions occur, distributed systems must trade off strong Consistency (CP) for high Availability (AP), as guaranteed linearizability cannot coexist with split-brain node reachability."
        },
        {
          "id": "gt_fs_22",
          "level": "Level 3: Advanced",
          "topic": "Operating Systems & Concurrency",
          "question": "What is the purpose of the Memory Barrier (Fence) instruction in modern multi-core CPU architectures?",
          "options": [
            "It physically powers off inactive RAM banks",
            "It enforces strict memory ordering constraints on CPU instruction reordering and store buffers, preventing race conditions in lock-free algorithms",
            "It allocates virtual memory pages in 1GB hugepage chunks",
            "It terminates crashed user processes immediately"
          ],
          "correct": 1,
          "explanation": "Modern superscalar CPUs reorder memory reads and writes for performance. Memory barriers enforce explicit ordering constraints so shared memory operations become visible across cores in correct order."
        },
        {
          "id": "gt_fs_23",
          "level": "Level 3: Advanced",
          "topic": "DBMS Internals",
          "question": "How does Write-Ahead Logging (WAL) in database engines guarantee both Atomicity and Durability (ARIES)?",
          "options": [
            "By skipping disk writes entirely and storing tables in volatile RAM",
            "By appending all transaction modifications to an append-only log on disk before dirty buffer pool pages are written to data files, enabling REDO and UNDO recovery upon crashes",
            "By generating cryptographic blockchain proofs on every SELECT statement",
            "By running daily backup cron jobs"
          ],
          "correct": 1,
          "explanation": "WAL ensures that log records describing data mutations are flushed to persistent non-volatile disk before modified data pages are flushed. Upon crash, the engine replays the log (REDO) for committed transactions and rolls back (UNDO) uncommitted ones."
        },
        {
          "id": "gt_fs_24",
          "level": "Level 3: Advanced",
          "topic": "Distributed Systems",
          "question": "What is the Two-Phase Commit (2PC) protocol used for in distributed database transactions?",
          "options": [
            "To coordinate all distributed nodes to either commit or abort an atomic transaction across multiple databases through Prepare and Commit phases",
            "To split SQL tables into two horizontal shards based on hash modulo",
            "To double-check user passwords with two-factor authentication",
            "To run garbage collection in two concurrent sweeps"
          ],
          "correct": 0,
          "explanation": "2PC coordinates distributed transaction consensus: Phase 1 (Prepare) polls all participating nodes to verify readiness, and Phase 2 (Commit/Abort) instructs all nodes to finalize the transaction."
        },
        {
          "id": "gt_fs_25",
          "level": "Level 3: Advanced",
          "topic": "Computer Networks",
          "question": "How does TCP BBR (Bottleneck Bandwidth and RTT) congestion control differ from traditional loss-based algorithms like TCP Reno or Cubic?",
          "options": [
            "BBR measures real bottleneck bandwidth and minimum round-trip time rather than waiting for packet loss, preventing bufferbloat and maximizing link throughput",
            "BBR drops 50% of incoming packets to force client throttling",
            "BBR uses UDP headers instead of TCP",
            "BBR only runs on fiber-optic undersea cables"
          ],
          "correct": 0,
          "explanation": "BBR is a model-based congestion control algorithm that continuously measures network pipe capacity (max bandwidth and min RTT) to avoid queue buildup and latency spikes."
        },
        {
          "id": "gt_fs_26",
          "level": "Level 3: Advanced",
          "topic": "Microservices Architecture",
          "question": "In a microservices event-driven architecture, what problem does the 'Outbox Pattern' solve?",
          "options": [
            "Eliminates the need for CSS styling in frontend applications",
            "Guarantees atomic updates to the local database and publishing of corresponding message broker events (Kafka/RabbitMQ) without distributed two-phase transactions",
            "Automatically sends marketing emails to unverified users",
            "Encrypts HTTP headers using symmetric AES keys"
          ],
          "correct": 1,
          "explanation": "The Transactional Outbox Pattern writes domain events to an 'outbox' table within the same local database transaction as the business entity, ensuring at-least-once message delivery without dual-write inconsistency."
        },
        {
          "id": "gt_fs_27",
          "level": "Level 3: Advanced",
          "topic": "Linux Internals",
          "question": "What is the primary advantage of Linux `io_uring` over traditional `epoll` or synchronous POSIX file I/O?",
          "options": [
            "io_uring completely disables the Linux kernel scheduler",
            "io_uring provides true asynchronous, zero-syscall submission and completion rings shared between user space and kernel space for high-throughput disk and network I/O",
            "io_uring increases RAM capacity by 4x using hardware compression",
            "io_uring replaces TCP/IP sockets with Bluetooth protocol"
          ],
          "correct": 1,
          "explanation": "io_uring uses two lockless ring buffers (SQ and CQ) mapped in memory between user space and kernel space, allowing batched asynchronous I/O without costly syscall context switching overhead."
        },
        {
          "id": "gt_fs_28",
          "level": "Level 3: Advanced",
          "topic": "Probabilistic Data Structures",
          "question": "What is the time complexity and false-positive characteristic of a Bloom Filter when checking for set membership of N items with K hash functions and M bit size?",
          "options": [
            "O(1) time complexity; can have False Positives (may report an element is present when it is not) but NEVER False Negatives",
            "O(N) time complexity; can have False Negatives but never False Positives",
            "O(log N) time complexity with 100% exact precision always",
            "O(N^2) space complexity requiring persistent disk storage"
          ],
          "correct": 0,
          "explanation": "Bloom filters provide constant O(K) time set membership checks with space efficiency: false positives are possible, but false negatives are impossible (zero false negatives)."
        },
        {
          "id": "gt_fs_29",
          "level": "Level 3: Advanced",
          "topic": "V8 Engine Internals",
          "question": "In the Google V8 JavaScript engine, what is the 'Hidden Class' (Shape) optimization and why does deleting object properties (`delete obj.x`) degrade execution performance?",
          "options": [
            "It creates CSS rules dynamically on the window object",
            "V8 assigns hidden classes based on property offset offsets to optimize inline caches; deleting properties breaks the transition tree and de-optimizes the object into slow dictionary/hash lookup mode",
            "Deleting properties causes an uncatchable runtime crash in Node.js",
            "Hidden classes are only used for WebAssembly modules"
          ],
          "correct": 1,
          "explanation": "V8 builds internal hidden class transition maps to enable inline cache lookups for lightning-fast property access. Deleting properties forces the object into generic slow dictionary mode."
        },
        {
          "id": "gt_fs_30",
          "level": "Level 3: Advanced",
          "topic": "System Design",
          "question": "When designing a distributed rate limiter for 100M+ requests per minute across a cluster of API gateways, which algorithm and storage primitive is most effective for sub-millisecond atomic enforcement?",
          "options": [
            "File system text logs with periodic grep scans",
            "Token Bucket / Leaky Bucket implemented via Redis Lua scripts or atomic Redis sliding window sorted sets (`ZADD` / `ZREMRANGEBYSCORE`)",
            "Single-threaded Python server with in-memory list storage",
            "Synchronous relational database row locking with `SELECT FOR UPDATE`"
          ],
          "correct": 1,
          "explanation": "Executing Token Bucket or Sliding Window log algorithms via Redis Lua scripts guarantees atomic evaluation in memory without distributed locks or race conditions, scaling to millions of operations per second."
        }
      ]
    }
  },
  {
    "id": "course-multilang-specialist",
    "title": "Multi-Paradigm Programming Languages Specialist (Java, Python, C++)",
    "category": "Languages",
    "level": "Intermediate to Advanced",
    "duration": "40 Hours",
    "rating": 4.95,
    "enrolledCount": 1890,
    "instructor": "Lumixora Language Evaluation & Compiler Engineering Team",
    "badgeIcon": "💻",
    "badgeColor": "from-cyan-400 to-blue-600",
    "shortDescription": "Master object-oriented Java, high-performance C++ STL memory management, and modern Python data structures.",
    "certTitle": "Multi-Paradigm Programming Languages Specialist (Java, Python, C++)",
    "certCategory": "Languages",
    "skills": [
      "Java OOP & Collections",
      "Python Data Science & Scripting",
      "C++ STL & Memory Management",
      "Modern JavaScript & TypeScript"
    ],
    "modules": [
      {
        "id": "mod-lang-1",
        "title": "Module 1: Java 21+ Object-Oriented Architecture & JVM Internals",
        "duration": "14 Hours",
        "lessons": [
          {
            "id": "les-j-1",
            "title": "Polymorphism, Abstract Classes, Interfaces & Diamond Problem Resolution",
            "type": "video",
            "duration": "50 mins",
            "summary": "Deep dive into dynamic method dispatch, vtables, default interface methods, and access control.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "Dynamic Method Dispatch resolves virtual methods at runtime via JVM invokevirtual bytecode and class vtables.",
                "Interfaces support multiple inheritance of type, resolving default method ambiguity using explicit SuperClass.super.method() syntax.",
                "Sealed classes (Java 17+) restrict which classes may extend or implement them, enhancing domain integrity."
              ],
              "sections": [
                {
                  "heading": "1. Dynamic Method Dispatch & Virtual Method Tables",
                  "content": "In Java, all non-static, non-final, and non-private methods are virtual by default. When an overridden method is called through a superclass reference, the JVM uses dynamic method dispatch. Each loaded class has a Virtual Method Table (vtable) storing pointers to its executable methods. The runtime inspects the actual instance type on the heap rather than the reference type.",
                  "code": "// Polymorphic dispatch in modern Java\npublic sealed interface PaymentGateway permits StripeGateway, CryptoGateway {\n    boolean processPayment(double amount);\n}\n\npublic final class StripeGateway implements PaymentGateway {\n    @Override\n    public boolean processPayment(double amount) {\n        System.out.println(\"Processing $\" + amount + \" via Stripe\");\n        return true;\n    }\n}",
                  "language": "java"
                }
              ],
              "caseStudy": {
                "company": "Netflix",
                "title": "Java 21 Virtual Threads & Domain Microservices Architecture",
                "scenario": "Handling 1,000,000 concurrent streaming telemetry requests required 1,000,000 OS platform threads, each consuming 1MB stack memory (total 1TB RAM) and causing severe kernel context switching bottlenecks.",
                "architecture": "Upgraded microservices to Java 21 Virtual Threads (Project Loom). Virtual threads are lightweight user-space threads managed directly by the JVM. Millions of virtual threads run on a carrier pool of just 16 OS threads. When a virtual thread blocks on network I/O, the JVM unmounts its execution stack to the heap and schedules another virtual thread, reducing memory per thread from 1MB to under 1KB.",
                "takeaway": "Virtual threads combine the simplicity of synchronous code with the high-throughput performance of reactive asynchronous programming."
              },
              "interviewPearls": [
                {
                  "question": "How does dynamic method dispatch work under the hood in the Java Virtual Machine?",
                  "answer": "When the JVM executes the `invokevirtual` bytecode instruction, it uses the object reference on top of the operand stack to locate the object's class metadata and its Virtual Method Table (vtable). The vtable contains method pointers indexed at fixed offsets resolved during class loading, calling the overriding method in O(1) time."
                }
              ]
            }
          },
          {
            "id": "les-j-2",
            "title": "Java Collections Framework: ArrayList vs LinkedList, HashMap Hashing Mechanics",
            "type": "reading",
            "duration": "45 mins",
            "summary": "Internal array resizing, collision resolution with Red-Black tree conversion in Java 8+, and concurrent collections.",
            "textbook": {
              "chapterNumber": "Chapter 1.2",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "HashMap uses an array of buckets. When a bucket length exceeds TREEIFY_THRESHOLD (8) and table capacity >= 64, it converts the linked list to a Red-Black Tree (O(log N)).",
                "Default initial capacity is 16 with a load factor of 0.75, doubling table size at threshold = 12.",
                "ConcurrentHashMap uses bucket-level CAS (Compare-And-Swap) and synchronized node locking without global table locks."
              ],
              "sections": [
                {
                  "heading": "1. Internal Hashing & Collision Mechanics",
                  "content": "When inserting key-value pair `(k, v)`, HashMap computes `hash = (h = k.hashCode()) ^ (h >>> 16)` to spread higher-order bits. The bucket index is calculated via bitwise AND: `index = (capacity - 1) & hash`. If collisions occur, keys are stored in a linked node list until length reaches 8, transforming into a TreeNode (Red-Black tree) to prevent denial-of-service hash collision attacks.",
                  "formula": "Bucket Index = (Capacity - 1) & [hashCode ^ (hashCode >>> 16)]"
                }
              ]
            }
          },
          {
            "id": "les-j-3",
            "title": "JVM Memory Architecture & Generational Garbage Collection",
            "type": "practice",
            "duration": "60 mins",
            "summary": "Heap young/old generation, Eden space, survivor spaces, G1GC tuning, and memory leak prevention.",
            "textbook": {
              "chapterNumber": "Chapter 1.3",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "JVM Memory Model: Heap (Eden, Survivor S0/S1, Tenured Old Gen), Metaspace (off-heap class metadata), JVM Stack (thread frames).",
                "Weak Generational Hypothesis: Most allocated objects die shortly after creation in the Eden space.",
                "G1GC (Garbage-First Collector) partitions the heap into equal-sized regions, reclaiming highest-garbage regions within user-specified pause time targets."
              ],
              "sections": [
                {
                  "heading": "1. Generational GC Lifecycle",
                  "content": "New objects are allocated in Eden. Minor GC scans Eden and copies live objects into Survivor space S0. After surviving multiple GC cycles (default threshold 15), objects are promoted to Old Generation. Major/Full GC reclaims Old Gen and Metaspace.",
                  "formula": "Promotion Criteria: Age > MaxTenuringThreshold (default 15) OR Survivor Space Overflow"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-lang-2",
        "title": "Module 2: High-Performance C++20 & Standard Template Library (STL)",
        "duration": "13 Hours",
        "lessons": [
          {
            "id": "les-cpp-1",
            "title": "Pointers, References, RAII & Modern Smart Pointers (unique_ptr, shared_ptr)",
            "type": "video",
            "duration": "55 mins",
            "summary": "Stack vs heap allocation, dynamic memory ownership semantics, reference counting, and circular dependency resolution.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Resource Acquisition Is Initialization (RAII) ties resource lifespan to object scope.",
                "std::unique_ptr ensures exclusive ownership with zero runtime overhead (move-only).",
                "std::shared_ptr maintains a thread-safe atomic reference count in a control block, paired with std::weak_ptr to break cyclic references."
              ],
              "sections": [
                {
                  "heading": "1. Modern Smart Pointer Ownership & Move Semantics",
                  "content": "Raw pointers in C++ invite memory leaks and double-free bugs. C++11/20 smart pointers automate deallocation. `std::make_unique` allocates heap memory and frees it automatically when the pointer goes out of scope. Rvalue references (`T&&`) and `std::move` transfer ownership without deep copying.",
                  "code": "// RAII and Move Semantics in C++20\n#include <iostream>\n#include <memory>\n#include <vector>\n\nclass DataBuffer {\n    size_t size;\n    int* raw_data;\npublic:\n    DataBuffer(size_t s) : size(s), raw_data(new int[s]) {}\n    ~DataBuffer() { delete[] raw_data; } // RAII cleanup\n    // Move constructor\n    DataBuffer(DataBuffer&& other) noexcept : size(other.size), raw_data(other.raw_data) {\n        other.raw_data = nullptr;\n        other.size = 0;\n    }\n};",
                  "language": "cpp"
                }
              ],
              "caseStudy": {
                "company": "Google Chromium / Chrome Browser",
                "title": "Eliminating 70% of Browser Security Vulnerabilities with Modern C++ Smart Pointers",
                "scenario": "Over 70% of high-severity vulnerabilities in browser rendering engines were Use-After-Free (UAF) memory corruption bugs caused by manual pointer management.",
                "architecture": "Chromium strictly enforced RAII (Resource Acquisition Is Initialization) with `std::unique_ptr` for exclusive DOM ownership and `MiraclePtr / std::weak_ptr` for non-owning references. Destructors automatically deallocate resources when out of scope, eradicating memory leaks and dangling pointer exploits.",
                "takeaway": "Never use raw `new` or `delete` in modern production C++; use `std::make_unique` and RAII wrappers to guarantee exception safety and deterministic destruction."
              },
              "interviewPearls": [
                {
                  "question": "What is the memory and performance overhead of `std::unique_ptr` compared to a raw pointer?",
                  "answer": "`std::unique_ptr` with default deleter has ZERO memory overhead (its size is exactly `sizeof(void*)`, identical to a raw pointer) and ZERO runtime overhead because move operations and destructor calls are inlined by the compiler at build time."
                }
              ]
            }
          },
          {
            "id": "les-cpp-2",
            "title": "STL Containers, Iterators, Lambda Expressions & Template Metaprogramming",
            "type": "practice",
            "duration": "60 mins",
            "summary": "std::vector, std::unordered_map, std::priority_queue, custom comparator functors, and lambda capture lists.",
            "textbook": {
              "chapterNumber": "Chapter 2.2",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "std::vector guarantees contiguous memory layout, enabling cache locality and vectorization.",
                "std::unordered_map provides average O(1) hash lookups; std::map maintains balanced Red-Black tree O(log N) sorting.",
                "C++20 Concepts enable compile-time template parameter constraint validation."
              ],
              "sections": [
                {
                  "heading": "1. STL Containers & Custom Priority Queues",
                  "content": "Containers in STL are designed with separation between data structures and algorithms via iterators. A max-heap is default for `std::priority_queue<T>`, while a min-heap is constructed using `std::greater<T>`.",
                  "code": "// C++20 Custom Comparator Min-Heap\n#include <queue>\n#include <vector>\n#include <iostream>\n\nstruct Task {\n    int priority;\n    std::string name;\n};\n\nauto comp = [](const Task& a, const Task& b) { return a.priority > b.priority; };\nstd::priority_queue<Task, std::vector<Task>, decltype(comp)> minTaskQueue(comp);",
                  "language": "cpp"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-lang-3",
        "title": "Module 3: Python 3.12+ Data Engineering & Functional Idioms",
        "duration": "13 Hours",
        "lessons": [
          {
            "id": "les-py-1",
            "title": "Decorators, Generators, Itertools & Context Managers",
            "type": "video",
            "duration": "45 mins",
            "summary": "Higher-order function closures, yield memory streaming, custom context managers with __enter__ and __exit__.",
            "textbook": {
              "chapterNumber": "Chapter 3.1",
              "readingTime": "15 mins read",
              "keyTakeaways": [
                "Decorators wrap functions using closures, taking a function as an argument and extending its behavior.",
                "Generators yield items on demand (lazy evaluation), maintaining O(1) memory consumption for infinite streams.",
                "Context managers guarantee resource cleanup via `__enter__` and `__exit__` protocols or `@contextmanager`."
              ],
              "sections": [
                {
                  "heading": "1. Advanced Python Decorators & Yield Generators",
                  "content": "Functions in Python are first-class objects. A decorator wraps a function, executing pre- and post-logic while preserving function metadata via `functools.wraps`. Generators use the `yield` keyword to pause execution state, resuming on `next()` calls without allocating full lists in RAM.",
                  "code": "// Python Execution Timing Decorator & Memory Generator\nimport time\nfrom functools import wraps\n\ndef performance_timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f\"{func.__name__} executed in {elapsed:.6f}s\")\n        return result\n    return wrapper\n\n@performance_timer\ndef stream_large_dataset(n):\n    for i in range(n):\n        yield i * i",
                  "language": "python"
                }
              ],
              "caseStudy": {
                "company": "Instagram",
                "title": "Scaling Python Django to 2 Billion Users with Custom CPython C-Extensions",
                "scenario": "Python's dynamic `__dict__` hash table for every user instance consumed massive memory overhead across millions of cached models.",
                "architecture": "Enforced `__slots__ = ('id', 'username', 'email')` on core domain models. This removed the dynamic per-instance dictionary, replacing it with fixed C-struct offsets, reducing server RAM consumption by 40% and accelerating attribute access across billions of daily API requests.",
                "takeaway": "Understanding CPython memory layout (`PyObject_HEAD`, descriptor protocols, slots) unlocks massive performance and memory optimizations in Python at scale."
              },
              "interviewPearls": [
                {
                  "question": "What happens when an exception is raised inside a Python generator function?",
                  "answer": "When an exception occurs inside a generator, execution terminates immediately, the generator transitions to a closed state, and subsequent calls to `next()` raise `StopIteration`. If wrapped in a `try...finally` block, the `finally` clause is guaranteed to execute."
                }
              ]
            }
          },
          {
            "id": "les-py-2",
            "title": "Python Under the Hood: CPython Bytecode, GIL & Asyncio",
            "type": "reading",
            "duration": "40 mins",
            "summary": "Understanding the GIL, coroutines, async/await event loops, and CPU-bound vs IO-bound multi-processing.",
            "textbook": {
              "chapterNumber": "Chapter 3.2",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "Global Interpreter Lock (GIL) ensures thread-safe CPython memory management by allowing only one native thread to execute Python bytecode at a time.",
                "For I/O-bound tasks, `asyncio` cooperative multitasking handles thousands of concurrent sockets.",
                "For CPU-bound tasks, `multiprocessing` spawns distinct Python processes bypassing the GIL."
              ],
              "sections": [
                {
                  "heading": "1. CPython GIL & Asyncio Event Loops",
                  "content": "The GIL protects reference counts (`PyObject_HEAD.ob_refcnt`) from race conditions. When performing network or file I/O, threads release the GIL. Python's `asyncio` event loop uses non-blocking OS selectors (epoll/kqueue) to switch between suspended coroutines without thread context switching overhead.",
                  "code": "// Asyncio Concurrent HTTP Fetcher\nimport asyncio\n\nasync def fetch_scholar_stats(scholar_id):\n    await asyncio.sleep(0.05) # Simulated non-blocking I/O\n    return {'id': scholar_id, 'status': 'certified'}\n\nasync def main():\n    tasks = [fetch_scholar_stats(i) for i in range(100)]\n    results = await asyncio.gather(*tasks)\n    print(f\"Fetched {len(results)} records asynchronously\")\n\n# asyncio.run(main())",
                  "language": "python"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "id": "grand-test-languages-mastery",
      "title": "Multi-Language Programming Grand Assessment",
      "durationMinutes": 45,
      "passPercentage": 60,
      "questions": [
        {
          "id": "gt_lang_1",
          "level": "Level 1: Fundamentals",
          "topic": "Java Collections",
          "question": "In Java, what is the default initial capacity and default load factor of a standard java.util.HashMap?",
          "options": [
            "Capacity: 16, Load Factor: 0.75",
            "Capacity: 10, Load Factor: 0.5",
            "Capacity: 32, Load Factor: 0.8",
            "Capacity: 8, Load Factor: 1.0"
          ],
          "correct": 0,
          "explanation": "HashMap defaults to 16 buckets with a 0.75 load factor, triggering table resizing when bucket count reaches 12 (16 * 0.75)."
        },
        {
          "id": "gt_lang_2",
          "level": "Level 1: Fundamentals",
          "topic": "C++ Memory Management",
          "question": "In modern C++, which smart pointer allows multiple shared owners and maintains an atomic reference count?",
          "options": [
            "std::unique_ptr",
            "std::shared_ptr",
            "std::weak_ptr",
            "std::auto_ptr"
          ],
          "correct": 1,
          "explanation": "std::shared_ptr coordinates shared ownership via an atomic control block reference count, freeing heap memory when count reaches 0."
        },
        {
          "id": "gt_lang_3",
          "level": "Level 1: Fundamentals",
          "topic": "Python Truthiness",
          "question": "What is the evaluated output of `bool([] == False)` in Python?",
          "options": [
            "True",
            "False",
            "TypeError",
            "None"
          ],
          "correct": 1,
          "explanation": "While `bool([])` evaluates to False in truthiness checks, an empty list `[]` does NOT equal the boolean value `False` (`[] == False` is False), so `bool(False)` is False."
        },
        {
          "id": "gt_lang_4",
          "level": "Level 1: Fundamentals",
          "topic": "Java OOP",
          "question": "Which access modifier in Java makes a class member visible only within its own package and to subclasses in other packages?",
          "options": [
            "private",
            "default (package-private)",
            "protected",
            "public"
          ],
          "correct": 2,
          "explanation": "The `protected` modifier allows access within the same package and to derived subclasses across any package."
        },
        {
          "id": "gt_lang_5",
          "level": "Level 1: Fundamentals",
          "topic": "C++ Syntax",
          "question": "In C++, what does appending the `const` keyword to a member function declaration indicate (`void display() const;`)?",
          "options": [
            "The function returns a constant value",
            "The function guarantees it will not modify any non-mutable member variables of the calling instance",
            "The function is static and cannot use 'this'",
            "The function cannot be overloaded"
          ],
          "correct": 1,
          "explanation": "Const member functions inspect the object without mutating state, allowing them to be safely invoked on const references/objects."
        },
        {
          "id": "gt_lang_6",
          "level": "Level 1: Fundamentals",
          "topic": "Python Memory",
          "question": "In Python, which built-in data structure is mutable and maintains insertion order?",
          "options": [
            "tuple",
            "frozenset",
            "list",
            "str"
          ],
          "correct": 2,
          "explanation": "Python lists are mutable dynamic arrays that preserve insertion order."
        },
        {
          "id": "gt_lang_7",
          "level": "Level 1: Fundamentals",
          "topic": "Java JVM",
          "question": "What is the primary purpose of the Java bytecode verifier inside the JVM ClassLoader?",
          "options": [
            "To format Java code indentation",
            "To inspect bytecode before execution to ensure it does not violate memory access rules or stack bounds",
            "To compile Java code into C++ headers",
            "To compress .class files into .zip format"
          ],
          "correct": 1,
          "explanation": "The Bytecode Verifier ensures untrusted class files satisfy JVM type safety, stack limits, and illegal pointer access constraints."
        },
        {
          "id": "gt_lang_8",
          "level": "Level 1: Fundamentals",
          "topic": "C++ Pointers",
          "question": "What happens when you use `delete` instead of `delete[]` on an array allocated with `new int[100]` in C++?",
          "options": [
            "Compiler error at build time",
            "Undefined Behavior (destructors for subsequent elements are not called, and heap corruption may occur)",
            "The entire array is safely deleted automatically",
            "Memory is converted into stack variables"
          ],
          "correct": 1,
          "explanation": "Mismatching new[] with single delete causes undefined behavior as the heap allocator cannot properly determine array destructor bounds."
        },
        {
          "id": "gt_lang_9",
          "level": "Level 1: Fundamentals",
          "topic": "Python Iterators",
          "question": "What special method must a Python class implement to be iterable via a `for ... in` loop?",
          "options": [
            "__iter__()",
            "__loop__()",
            "__next__() only",
            "__call__()"
          ],
          "correct": 0,
          "explanation": "An iterable must implement `__iter__()` returning an iterator object that implements `__next__()`."
        },
        {
          "id": "gt_lang_10",
          "level": "Level 1: Fundamentals",
          "topic": "Java Exceptions",
          "question": "Which of the following exceptions in Java is an Unchecked (Runtime) Exception?",
          "options": [
            "IOException",
            "SQLException",
            "NullPointerException",
            "ClassNotFoundException"
          ],
          "correct": 2,
          "explanation": "Subclasses of RuntimeException (such as NullPointerException, IndexOutOfBoundsException) are unchecked and do not require explicit try-catch or throws declarations."
        },
        {
          "id": "gt_lang_11",
          "level": "Level 2: Intermediate",
          "topic": "Java Collections Internals",
          "question": "Starting from Java 8, when a bucket in HashMap exceeds 8 elements and total table capacity is at least 64, what data structure is the bucket converted to?",
          "options": [
            "SkipList",
            "Red-Black Tree (TreeNode)",
            "Min-Heap",
            "AVL Tree"
          ],
          "correct": 1,
          "explanation": "Java 8 converts collision linked lists into Red-Black trees (`TreeNode`), reducing worst-case lookup from O(N) to O(log N)."
        },
        {
          "id": "gt_lang_12",
          "level": "Level 2: Intermediate",
          "topic": "C++ Move Semantics",
          "question": "What does `std::move(x)` actually do in modern C++?",
          "options": [
            "Physically moves bytes in RAM to a new memory address",
            "Unconditionally casts an lvalue expression `x` into an rvalue reference (`T&&`), enabling move constructors to steal internal resources without copying",
            "Deletes variable `x` immediately",
            "Spawns a new concurrent thread"
          ],
          "correct": 1,
          "explanation": "std::move is purely a compile-time cast (`static_cast<typename std::remove_reference<T>::type&&>(t)`) that marks an object as eligible for resource transfer."
        },
        {
          "id": "gt_lang_13",
          "level": "Level 2: Intermediate",
          "topic": "Python GIL & Concurrency",
          "question": "Why does Python's standard `threading` module fail to speed up CPU-bound tasks (e.g. calculating 100M primes) on multi-core CPUs in CPython?",
          "options": [
            "Threads in Python cannot access the CPU",
            "The Global Interpreter Lock (GIL) allows only one native thread to execute Python bytecode at any given instant",
            "Python only runs on 32-bit hardware",
            "Threads cannot allocate heap memory"
          ],
          "correct": 1,
          "explanation": "The GIL serializes bytecode execution, meaning CPU-bound tasks in multiple threads run sequentially rather than in true parallel on multiple cores."
        },
        {
          "id": "gt_lang_14",
          "level": "Level 2: Intermediate",
          "topic": "Java Concurrency",
          "question": "In Java multithreading, what does the `volatile` keyword guarantee when applied to a variable?",
          "options": [
            "Atomic increment operations (`count++`)",
            "Visibility: writes to the variable are immediately flushed to main memory and subsequent reads read from main memory rather than CPU register/cache",
            "Automatic synchronization lock acquisition on the object",
            "Immutability of the variable"
          ],
          "correct": 1,
          "explanation": "Volatile guarantees memory visibility across threads and establishes a happens-before memory barrier, preventing instruction reordering without providing mutual exclusion for compound actions."
        },
        {
          "id": "gt_lang_15",
          "level": "Level 2: Intermediate",
          "topic": "C++ Virtual Destructors",
          "question": "Why must a base class in C++ with virtual functions declare its destructor as `virtual` (`virtual ~Base();`)?",
          "options": [
            "To allow the class to be instantiated with `new`",
            "To ensure that deleting a derived object via a pointer to base class invokes the derived class destructor first, preventing memory leaks",
            "To prevent inheritance",
            "To speed up compilation time"
          ],
          "correct": 1,
          "explanation": "If the base destructor is non-virtual, deleting a `Derived` object through a `Base*` pointer only invokes `~Base()`, leaking resources allocated by `Derived`."
        },
        {
          "id": "gt_lang_16",
          "level": "Level 2: Intermediate",
          "topic": "Python Decorators",
          "question": "In Python, why is `@functools.wraps(func)` standard practice inside a decorator function?",
          "options": [
            "To compile the function into C code",
            "To preserve the original function's name, docstring, and module metadata (`__name__`, `__doc__`)",
            "To automatically cache function return values",
            "To enforce strict type annotations"
          ],
          "correct": 1,
          "explanation": "Without `@wraps`, the decorated function adopts the generic identity of the inner wrapper function, breaking reflection, introspection, and debugging."
        },
        {
          "id": "gt_lang_17",
          "level": "Level 2: Intermediate",
          "topic": "Java Generics",
          "question": "What is 'Type Erasure' in Java Generics?",
          "options": [
            "The JVM deletes all object references when memory is low",
            "The Java compiler replaces generic type parameters with their bounds (or Object) during compilation, so no generic type information exists at runtime bytecode",
            "A runtime exception thrown when casting between lists",
            "Automatic garbage collection of unused types"
          ],
          "correct": 1,
          "explanation": "Type Erasure was implemented for backwards compatibility: `List<String>` and `List<Integer>` compile to the identical raw type `List` in bytecode."
        },
        {
          "id": "gt_lang_18",
          "level": "Level 2: Intermediate",
          "topic": "C++ RAII",
          "question": "How does `std::weak_ptr` prevent memory leaks in C++ shared pointer architectures?",
          "options": [
            "It deletes objects in a background thread",
            "It observes an object managed by `std::shared_ptr` without incrementing the strong reference count, breaking cyclic dependencies",
            "It compresses memory by 50%",
            "It forbids any access to the pointed object"
          ],
          "correct": 1,
          "explanation": "Cyclic references between two `shared_ptr` instances create a reference count loop that never reaches 0. Replacing one with `weak_ptr` breaks the cycle."
        },
        {
          "id": "gt_lang_19",
          "level": "Level 2: Intermediate",
          "topic": "Python Mutable Defaults",
          "question": "Consider `def append_val(x, lst=[]): lst.append(x); return lst`. Calling `append_val(1)` followed by `append_val(2)` returns:",
          "options": [
            "[1] and [2]",
            "[1] and [1, 2]",
            "[1, 2] and [1, 2]",
            "TypeError"
          ],
          "correct": 1,
          "explanation": "Default argument expressions in Python are evaluated once when the function definition is executed, creating a single persistent shared list object across calls."
        },
        {
          "id": "gt_lang_20",
          "level": "Level 2: Intermediate",
          "topic": "Java String Pool",
          "question": "What is the result of `String s1 = \"Lumixora\"; String s2 = new String(\"Lumixora\"); boolean res = (s1 == s2);` in Java?",
          "options": [
            "true",
            "false",
            "NullPointerException",
            "Compilation Error"
          ],
          "correct": 1,
          "explanation": "`==` checks reference identity in Java. `s1` references the literal in the String Intern Pool, while `new String()` allocates a new distinct object on the heap."
        },
        {
          "id": "gt_lang_21",
          "level": "Level 3: Advanced",
          "topic": "JVM JIT Optimization",
          "question": "In the Java HotSpot VM, what is 'Escape Analysis' used for by the C2 JIT compiler?",
          "options": [
            "To prevent hacker SQL injection queries",
            "To determine if an object allocated inside a method escapes the method scope; if not, the JIT can replace heap allocation with Stack Allocation or Scalar Replacement",
            "To terminate threads that loop for more than 10 seconds",
            "To compress heap strings into UTF-8"
          ],
          "correct": 1,
          "explanation": "Escape Analysis detects objects whose references do not escape method execution, allowing the JIT to decompose object fields into registers/stack variables (Scalar Replacement), avoiding GC overhead."
        },
        {
          "id": "gt_lang_22",
          "level": "Level 3: Advanced",
          "topic": "C++ Template Metaprogramming",
          "question": "In C++ metaprogramming, what does SFINAE (Substitution Failure Is Not An Error) allow developers to achieve?",
          "options": [
            "Ignore compiler syntax errors automatically",
            "Conditionally enable or disable function templates and class specializations based on type traits at compile time without triggering build errors",
            "Execute dynamic SQL queries in C++",
            "Bypass const member restrictions"
          ],
          "correct": 1,
          "explanation": "SFINAE dictates that if a substitution error occurs while evaluating an overloaded template, the compiler simply discards that candidate from the overload set rather than stopping compilation."
        },
        {
          "id": "gt_lang_23",
          "level": "Level 3: Advanced",
          "topic": "Python CPython C-API & Slots",
          "question": "In Python, defining `__slots__ = ('id', 'name')` on a class provides what performance and memory benefit?",
          "options": [
            "Encrypts instance variables with AES-256",
            "Eliminates the per-instance `__dict__` dynamic hash table, replacing it with a compact C-level struct array that reduces memory usage by up to 50%",
            "Prevents any methods from being added to the class",
            "Converts Python bytecode into Java bytecode"
          ],
          "correct": 1,
          "explanation": "`__slots__` tells Python not to create a dynamic `__dict__` for every instance, storing attribute values in fixed-size descriptor arrays for massive memory savings."
        },
        {
          "id": "gt_lang_24",
          "level": "Level 3: Advanced",
          "topic": "Java Memory Model & CAS",
          "question": "How do classes in `java.util.concurrent.atomic` (e.g. `AtomicInteger`) achieve thread safety without using `synchronized` blocks?",
          "options": [
            "By suspending all other threads in the OS",
            "By using low-level hardware CPU atomic instructions like Compare-And-Swap (CAS via Unsafe / VarHandle) in lock-free retry loops",
            "By writing data to disk files",
            "By spawning new processes for each modification"
          ],
          "correct": 1,
          "explanation": "Atomic classes utilize hardware CAS instructions (`cmpxchg` on x86) to update values atomically with optimistic lock-free retry loops."
        },
        {
          "id": "gt_lang_25",
          "level": "Level 3: Advanced",
          "topic": "C++ Memory Ordering",
          "question": "What is the difference between `std::memory_order_relaxed` and `std::memory_order_seq_cst` in C++ atomics?",
          "options": [
            "`seq_cst` enforces a single total global order of execution and memory barriers across all threads, whereas `relaxed` guarantees only atomicity without synchronization ordering",
            "`relaxed` is 1000x slower than `seq_cst`",
            "`relaxed` uses disk caching",
            "`seq_cst` requires mutex locks"
          ],
          "correct": 0,
          "explanation": "Sequential Consistency (`seq_cst`) provides strict global ordering with memory fences, while `relaxed` only guarantees the atomicity of the single operation without establishing happens-before order with other memory writes."
        },
        {
          "id": "gt_lang_26",
          "level": "Level 3: Advanced",
          "topic": "Python Asyncio Internals",
          "question": "Under the hood of Python's `asyncio` event loop, how does `await coroutine()` transfer execution control back to the event loop?",
          "options": [
            "By creating a new OS kernel thread",
            "By yielding from a generator-like state object, registering a callback on an OS non-blocking socket selector (epoll/kqueue), and returning control to the loop runner",
            "By raising a SystemExit exception",
            "By sleeping the CPU core"
          ],
          "correct": 1,
          "explanation": "Coroutines in Python are state machines. When awaiting an unready future, the coroutine yields control back to the loop, which polls I/O selectors before resuming the task."
        },
        {
          "id": "gt_lang_27",
          "level": "Level 3: Advanced",
          "topic": "JVM Garbage Collection",
          "question": "In the ZGC (Z Garbage Collector) introduced in modern Java, what architectural mechanism enables sub-millisecond maximum pause times on multi-terabyte heaps?",
          "options": [
            "Pausing all threads for 1 minute every midnight",
            "Colored Pointers (reference metadata bits) and Load Barriers that perform concurrent marking and relocation while application threads run",
            "Disabling dynamic memory allocation",
            "Storing all objects on NVMe SSDs"
          ],
          "correct": 1,
          "explanation": "ZGC embeds GC metadata inside unused pointer bits (Colored Pointers) and intercepts heap reads via JIT Load Barriers to concurrently heal pointers during live execution."
        },
        {
          "id": "gt_lang_28",
          "level": "Level 3: Advanced",
          "topic": "C++ Compile-time Execution",
          "question": "What is the difference between `constexpr` and `consteval` in C++20?",
          "options": [
            "`constexpr` functions can execute at compile-time OR runtime, whereas `consteval` functions (Immediate Functions) MUST strictly execute and evaluate at compile-time",
            "`consteval` is deprecated in C++20",
            "`constexpr` requires dynamic runtime memory allocation",
            "`consteval` variables cannot be stored in RAM"
          ],
          "correct": 0,
          "explanation": "C++20 `consteval` specifies an immediate function that is guaranteed to produce a compile-time constant expression; any invocation that cannot evaluate at compile-time is a compilation error."
        },
        {
          "id": "gt_lang_29",
          "level": "Level 3: Advanced",
          "topic": "Python Memory & Weakref",
          "question": "In Python, what is a `weakref.ref` and when is it necessary?",
          "options": [
            "A pointer that corrupts RAM",
            "A reference that allows referencing an object without incrementing its reference count, preventing cyclical reference memory leaks that defeat standard ref-counting GC",
            "A reference that only lasts 1 second",
            "A reference used for integer caching"
          ],
          "correct": 1,
          "explanation": "CPython reclaims memory immediately when `ob_refcnt == 0`. `weakref` enables caches and circular parent-child links without holding strong references that delay collection until cyclic GC runs."
        },
        {
          "id": "gt_lang_30",
          "level": "Level 3: Advanced",
          "topic": "Java Virtual Threads (Project Loom)",
          "question": "How do Java 21+ Virtual Threads (Project Loom) differ from traditional Platform Threads (`java.lang.Thread`)?",
          "options": [
            "Virtual threads run without JVM bytecode",
            "Virtual threads are lightweight user-mode threads managed entirely by the JVM, multiplexing millions of virtual threads over a small pool of carrier OS kernel threads with non-blocking continuation unmounting",
            "Virtual threads only support single-threaded computation",
            "Virtual threads do not have stack traces"
          ],
          "correct": 1,
          "explanation": "Virtual threads detach Java threads from 1:1 OS kernel thread mappings. When a virtual thread blocks on socket I/O, the JVM unmounts its continuation from the carrier thread, enabling high-throughput concurrency with standard synchronous coding styles."
        }
      ]
    }
  },
  {
    "id": "course-dsa-competitive-solver",
    "title": "Competitive DSA & Algorithmic Problem Solving (100+ Challenges Track)",
    "category": "Problems Solved",
    "level": "Advanced",
    "duration": "50 Hours",
    "rating": 4.98,
    "enrolledCount": 2310,
    "instructor": "Codeverse & Lumixora Algorithmic Grandmasters",
    "badgeIcon": "⚡",
    "badgeColor": "from-emerald-500 to-teal-600",
    "shortDescription": "Master Dynamic Programming, Graph Theory, Trie, Segment Trees, and Advanced Recursion for Tier-1 Product Engineering roles.",
    "certTitle": "Competitive DSA Problem Solver — 100+ Algorithmic Challenges",
    "certCategory": "Problems Solved",
    "skills": [
      "Dynamic Programming",
      "Graph Theory & BFS/DFS",
      "Trees & Recursion",
      "Greedy & Bit Manipulation"
    ],
    "modules": [
      {
        "id": "mod-dsa-1",
        "title": "Module 1: Advanced Arrays, Two Pointers & Sliding Window Patterns",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-dsa-1-1",
            "title": "Dynamic Sliding Window, Prefix Sum Matrices & Monotonic Deques",
            "type": "video",
            "duration": "50 mins",
            "summary": "Solving longest subarray with sum constraints, sliding window maximum in O(N), and 2D submatrix queries in O(1).",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Sliding window maintains a valid state between left and right pointers in linear O(N) amortized time.",
                "Prefix sums precompute cumulative totals to answer range sum queries `sum(L, R) = prefix[R+1] - prefix[L]` in O(1).",
                "Monotonic Deques maintain strictly increasing or decreasing orders to find sliding window extrema in O(N) total time."
              ],
              "sections": [
                {
                  "heading": "1. Monotonic Queue Window Extrema Pattern",
                  "content": "Finding the maximum element in every sliding window of size K in an array of size N can be solved in O(N) using a Monotonic Double-Ended Queue (Deque). As we expand the right pointer, elements smaller than the incoming element are popped from the back of the deque because they can never be the maximum in any subsequent window.",
                  "formula": "Time Complexity: O(N) amortized (each element is pushed and popped at most once). Space: O(K)",
                  "code": "// C++ Sliding Window Maximum via Monotonic Deque\n#include <vector>\n#include <deque>\n\nstd::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {\n    std::deque<int> dq; // stores indices\n    std::vector<int> result;\n    for (int i = 0; i < (int)nums.size(); ++i) {\n        if (!dq.empty() && dq.front() <= i - k) dq.pop_front(); // Remove out of window\n        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back(); // Maintain decreasing order\n        dq.push_back(i);\n        if (i >= k - 1) result.push_back(nums[dq.front()]);\n    }\n    return result;\n}",
                  "language": "cpp"
                }
              ],
              "caseStudy": {
                "company": "Uber / Lyft",
                "title": "Real-Time Driver Surge Pricing with Monotonic Sliding Window Windows",
                "scenario": "Calculating the peak ride demand across 10-minute rolling sliding windows for 100,000 geographic hex grids in real time with naive O(N * K) algorithms overwhelmed stream processing clusters.",
                "architecture": "Deployed Monotonic Deques in streaming Flink/Kafka pipelines. Each location stream maintains a monotonically decreasing deque of timestamps and request volumes. Elements entering update the back in O(1) amortized time, and expired elements are evicted from the front, answering sliding window maximum queries in O(1) constant time.",
                "takeaway": "Monotonic data structures eliminate redundant comparisons by storing only potential future extreme candidates."
              },
              "interviewPearls": [
                {
                  "question": "What is the difference between a Monotonic Stack and a Monotonic Deque?",
                  "answer": "A Monotonic Stack pushes and pops elements only from the top, ideal for finding the Next Greater / Previous Greater Element across a full array in O(N). A Monotonic Deque allows elements to be evicted from the front (when they slide out of a moving range window) while maintaining sorted order from the back, ideal for sliding window maximum/minimum queries."
                }
              ]
            }
          },
          {
            "id": "les-dsa-1-2",
            "title": "Hands-on: Trapping Rain Water & 3-Sum In-Place Algorithms",
            "type": "practice",
            "duration": "60 mins",
            "summary": "Optimal O(N) space two-pointer approach vs monotonic stack solution.",
            "textbook": {
              "chapterNumber": "Chapter 1.2",
              "readingTime": "15 mins read",
              "keyTakeaways": [
                "Trapping Rain Water boils down to finding `min(leftMax, rightMax) - height[i]`.",
                "Two-pointer technique reduces auxiliary space to O(1) by updating the pointer with the smaller bounding height.",
                "3-Sum sorts the array in O(N log N) and uses two pointers with duplicate-skipping to achieve O(N^2) time."
              ],
              "sections": [
                {
                  "heading": "1. O(1) Space Two-Pointer Trapping Rain Water",
                  "content": "Instead of computing prefix and suffix max arrays, we maintain `leftMax` and `rightMax` pointers. If `leftMax < rightMax`, the water trapped at `left` is guaranteed to be bounded by `leftMax`, allowing immediate computation without knowing future taller bars on the right.",
                  "formula": "Water Trapped at index i = max(0, min(leftMax, rightMax) - height[i])"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-dsa-2",
        "title": "Module 2: Trees, Binary Search Trees & Trie Architecture",
        "duration": "12 Hours",
        "lessons": [
          {
            "id": "les-dsa-2-1",
            "title": "Binary Tree Traversals, Lowest Common Ancestor & Diameter of Tree",
            "type": "video",
            "duration": "45 mins",
            "summary": "Iterative vs recursive traversals, bottom-up post-order DFS DP, and Morris traversal with O(1) space.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Tree traversals: Inorder (Left, Root, Right), Preorder (Root, Left, Right), Postorder (Left, Right, Root).",
                "Lowest Common Ancestor (LCA) in binary tree can be found in O(N) via post-order DFS propagation.",
                "Binary Lifting enables O(log N) LCA queries in general trees after O(N log N) DP preprocessing."
              ],
              "sections": [
                {
                  "heading": "1. Post-Order Tree DP & Diameter Computation",
                  "content": "The diameter of a binary tree is the length of the longest path between any two nodes. By computing the maximum branch depth in post-order DFS, the diameter passing through any node is `leftDepth + rightDepth`. We maintain a global maximum while returning `1 + max(leftDepth, rightDepth)` up the recursion tree.",
                  "formula": "Diameter at node = maxDepth(left) + maxDepth(right)"
                }
              ]
            }
          },
          {
            "id": "les-dsa-2-2",
            "title": "Prefix Tries, Bitwise XOR Tries & Autocomplete Engines",
            "type": "practice",
            "duration": "60 mins",
            "summary": "Building high-performance string search and maximum XOR pair lookups in O(32 * N).",
            "textbook": {
              "chapterNumber": "Chapter 2.2",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "Prefix Trie stores strings character by character, enabling O(L) insert, search, and prefix matching.",
                "Bitwise Trie (Binary Trie) treats 32-bit integers as 32-character binary strings.",
                "Maximum XOR of two numbers in an array is solved in O(32 * N) by greedily taking opposite bits in a Bitwise Trie."
              ],
              "sections": [
                {
                  "heading": "1. Bitwise 0-1 Trie for Maximum XOR",
                  "content": "To find two numbers `a ^ b` maximizing XOR, insert all numbers into a Binary Trie. For each number, traverse the trie greedily preferring the opposite bit (`1 - bit`) at each position. If present, set that result bit to 1; otherwise, follow the same bit.",
                  "formula": "Bitwise Trie Search Time: O(32) = O(1) per query"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-dsa-3",
        "title": "Module 3: Graph Algorithms (BFS, DFS, Dijkstra, Bellman-Ford, Kruskal)",
        "duration": "13 Hours",
        "lessons": [
          {
            "id": "les-dsa-3-1",
            "title": "Topological Sort (Kahn’s Algorithm) & Cycle Detection in Directed/Undirected Graphs",
            "type": "video",
            "duration": "55 mins",
            "summary": "In-degree queue tracking, union-find with path compression & rank, and bipartite graph validation.",
            "textbook": {
              "chapterNumber": "Chapter 3.1",
              "readingTime": "20 mins read",
              "keyTakeaways": [
                "Topological Sort linearly orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v.",
                "Kahn's Algorithm tracks in-degrees using a queue; if processed nodes < V, a cycle exists.",
                "Disjoint Set Union (DSU) with Path Compression and Union by Rank achieves nearly constant O(alpha(N)) amortized time."
              ],
              "sections": [
                {
                  "heading": "1. Kahn's Algorithm for Topological Sort & Cycle Detection",
                  "content": "Compute in-degrees for all V nodes. Push all nodes with in-degree 0 into a FIFO queue. While the queue is non-empty, pop node U, append to topological order, and decrement in-degree for all adjacent nodes V. If in-degree(V) reaches 0, push V into queue. If total popped nodes != V, the graph contains a directed cycle.",
                  "formula": "Kahn's Algorithm Time: O(V + E), Space: O(V)"
                }
              ],
              "caseStudy": {
                "company": "Google Maps",
                "title": "Hierarchical Contraction Hierarchies & Accelerated Dijkstra Shortest Path",
                "scenario": "Standard Dijkstra on global road networks with 1,000,000,000 road segments takes several seconds per navigation route query.",
                "architecture": "Precomputes Contraction Hierarchies and Bidirectional Dijkstra with Min-Heaps. Roads are assigned importance levels (highways > arterial > residential). Bidirectional Dijkstra searches forward from source and backward from destination simultaneously, reducing explored state space by over 99% and returning optimal routes in under 5 milliseconds.",
                "takeaway": "Pairing graph theory algorithms with bidirectional search and hierarchical preprocessing scales routing to planetary datasets."
              },
              "interviewPearls": [
                {
                  "question": "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
                  "answer": "Dijkstra is a greedy algorithm: once a node's minimum distance is extracted from the priority queue, Dijkstra marks it as finalized (visited) and never updates it again. A negative edge encountered later could produce a shorter path to a previously finalized node, violating the greedy invariant. Bellman-Ford or SPFA must be used instead."
                }
              ]
            }
          },
          {
            "id": "les-dsa-3-2",
            "title": "Shortest Paths & Minimum Spanning Trees (Dijkstra vs Disjoint Set Kruskal)",
            "type": "practice",
            "duration": "60 mins",
            "summary": "PriorityQueue Dijkstra time complexity O((V + E) log V) and handling negative cycles with Bellman-Ford.",
            "textbook": {
              "chapterNumber": "Chapter 3.2",
              "readingTime": "18 mins read",
              "keyTakeaways": [
                "Dijkstra finds Single Source Shortest Path on non-negative weighted graphs in O((V + E) log V).",
                "Bellman-Ford handles negative edge weights and detects negative weight cycles in O(V * E).",
                "Kruskal sorts all edges and greedily adds edges using DSU to construct a Minimum Spanning Tree in O(E log E)."
              ],
              "sections": [
                {
                  "heading": "1. Dijkstra's Algorithm with Min-Heap",
                  "content": "Maintain a distance array `dist[]` initialized to infinity. Insert `(0, source)` into a priority queue. Greedily extract the vertex `u` with minimum distance. For each neighbor `v` with edge weight `w`, if `dist[u] + w < dist[v]`, update `dist[v]` and push `(dist[v], v)` into the priority queue.",
                  "formula": "Dijkstra Time Complexity: O((V + E) log V)"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-dsa-4",
        "title": "Module 4: Dynamic Programming Mastery (1D, 2D, Knapsack & Tree DP)",
        "duration": "13 Hours",
        "lessons": [
          {
            "id": "les-dsa-4-1",
            "title": "Memoization vs Tabulation, 0/1 Knapsack & Unbounded Knapsack Frameworks",
            "type": "video",
            "duration": "60 mins",
            "summary": "State definition, recurrence relation derivation, base case initialization, and space reduction from 2D to 1D.",
            "textbook": {
              "chapterNumber": "Chapter 4.1",
              "readingTime": "22 mins read",
              "keyTakeaways": [
                "Dynamic Programming applies when problems exhibit Optimal Substructure and Overlapping Subproblems.",
                "0/1 Knapsack: Each item can be picked at most once; 1D space optimization iterates capacity in REVERSE (W down to weight[i]).",
                "Unbounded Knapsack: Infinite copies of items allowed; 1D space optimization iterates capacity FORWARD (weight[i] up to W)."
              ],
              "sections": [
                {
                  "heading": "1. 0/1 Knapsack State & 1D Space Compression",
                  "content": "Let `dp[w]` be the maximum value achievable with weight capacity `w`. When considering item `i` with `weight[i]` and `val[i]`, iterating `w` backwards from `W` to `weight[i]` ensures that values from the previous item state are not overwritten during the current transition.",
                  "formula": "dp[w] = max(dp[w], dp[w - weight[i]] + val[i]) for w from W down to weight[i]",
                  "code": "// 0/1 Knapsack in O(N * W) time and O(W) space\n#include <vector>\n#include <algorithm>\n\nint knapSack01(int W, const std::vector<int>& wt, const std::vector<int>& val, int n) {\n    std::vector<int> dp(W + 1, 0);\n    for (int i = 0; i < n; ++i) {\n        for (int w = W; w >= wt[i]; --w) {\n            dp[w] = std::max(dp[w], dp[w - wt[i]] + val[i]);\n        }\n    }\n    return dp[W];\n}",
                  "language": "cpp"
                }
              ]
            }
          },
          {
            "id": "les-dsa-4-2",
            "title": "Longest Common Subsequence (LCS), Edit Distance & Matrix Chain Multiplication",
            "type": "practice",
            "duration": "60 mins",
            "summary": "String matching DP matrices, interval DP partition trees, and state compression.",
            "textbook": {
              "chapterNumber": "Chapter 4.2",
              "readingTime": "19 mins read",
              "keyTakeaways": [
                "LCS recurrence: if `s1[i] == s2[j]`, `dp[i][j] = 1 + dp[i-1][j-1]`, else `max(dp[i-1][j], dp[i][j-1])`.",
                "Edit Distance (Levenshtein) transforms word1 into word2 using Insert, Delete, and Replace operations.",
                "Interval DP (Matrix Chain Multiplication) splits ranges `[i, j]` at every partition `k` from `i` to `j-1`."
              ],
              "sections": [
                {
                  "heading": "1. Edit Distance (Levenshtein Distance)",
                  "content": "Let `dp[i][j]` be the minimum operations to convert `word1[0..i-1]` to `word2[0..j-1]`. If `word1[i-1] == word2[j-1]`, `dp[i][j] = dp[i-1][j-1]`. Otherwise, `dp[i][j] = 1 + min(dp[i-1][j] (Delete), dp[i][j-1] (Insert), dp[i-1][j-1] (Replace))`.",
                  "formula": "Edit Distance Recurrence: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "id": "grand-test-dsa-championship",
      "title": "Competitive DSA Grand Engineering Assessment",
      "durationMinutes": 45,
      "passPercentage": 60,
      "questions": [
        {
          "id": "gt_dsa_1",
          "level": "Level 1: Fundamentals",
          "topic": "Graph Algorithms",
          "question": "What is the tightest time complexity of finding the Single Source Shortest Path in a weighted graph with non-negative edge weights using a Min-Heap based Dijkstra algorithm?",
          "options": [
            "O(V^2)",
            "O((V + E) log V)",
            "O(V * E)",
            "O(E^2)"
          ],
          "correct": 1,
          "explanation": "Extracting the minimum vertex takes O(log V) V times, and relaxing edges takes O(log V) E times, leading to O((V + E) log V)."
        },
        {
          "id": "gt_dsa_2",
          "level": "Level 1: Fundamentals",
          "topic": "Dynamic Programming",
          "question": "In Dynamic Programming, what two core structural properties must a problem satisfy to be solvable via DP?",
          "options": [
            "Greedy Choice and Non-overlapping Subproblems",
            "Optimal Substructure and Overlapping Subproblems",
            "Continuous State Space and Bounded Memory",
            "Divide and Conquer with Independent Subproblems"
          ],
          "correct": 1,
          "explanation": "DP requires Optimal Substructure (optimal solution to problem contains optimal solutions to subproblems) and Overlapping Subproblems (subproblems are repeatedly solved)."
        },
        {
          "id": "gt_dsa_3",
          "level": "Level 1: Fundamentals",
          "topic": "Tree Traversals",
          "question": "Which binary tree traversal produces the elements of a Binary Search Tree (BST) in strictly sorted ascending order?",
          "options": [
            "Pre-order (Root, Left, Right)",
            "In-order (Left, Root, Right)",
            "Post-order (Left, Right, Root)",
            "Level-order (BFS)"
          ],
          "correct": 1,
          "explanation": "In-order traversal visits the left subtree (all smaller values), then the root, then the right subtree (all larger values), generating sorted order."
        },
        {
          "id": "gt_dsa_4",
          "level": "Level 1: Fundamentals",
          "topic": "Trie Data Structure",
          "question": "What is the worst-case time complexity of searching for a word of length L in a Trie containing N stored words?",
          "options": [
            "O(N * L)",
            "O(L)",
            "O(log N)",
            "O(N^2)"
          ],
          "correct": 1,
          "explanation": "Trie lookups depend strictly on the length of the query key L, traversing exactly one node per character regardless of how many total words N are in the Trie."
        },
        {
          "id": "gt_dsa_5",
          "level": "Level 1: Fundamentals",
          "topic": "Disjoint Set Union",
          "question": "Which algorithm is optimal for detecting cycles in an undirected graph and building a Minimum Spanning Tree with Disjoint Set Union (DSU)?",
          "options": [
            "Floyd-Warshall",
            "Kruskal's Algorithm",
            "Kadane's Algorithm",
            "KMP String Matching"
          ],
          "correct": 1,
          "explanation": "Kruskal's algorithm sorts edges and uses DSU with union-find to detect cycles and construct the Minimum Spanning Tree in O(E log E)."
        },
        {
          "id": "gt_dsa_6",
          "level": "Level 1: Fundamentals",
          "topic": "Sorting Complexities",
          "question": "What is the worst-case time complexity of QuickSort when the pivot chosen is consistently the smallest or largest element?",
          "options": [
            "O(N log N)",
            "O(N)",
            "O(N^2)",
            "O(log N)"
          ],
          "correct": 2,
          "explanation": "Unbalanced partitions (e.g. sorted input with first/last element as pivot) reduce QuickSort recursion depth to N, yielding O(N^2) comparisons."
        },
        {
          "id": "gt_dsa_7",
          "level": "Level 1: Fundamentals",
          "topic": "Heap Data Structure",
          "question": "What is the time complexity of building a Binary Heap of N elements using the bottom-up `heapify` algorithm (Floyd's buildHeap)?",
          "options": [
            "O(N log N)",
            "O(N)",
            "O(N^2)",
            "O(log N)"
          ],
          "correct": 1,
          "explanation": "Summing node heights across the tree levels forms a convergent geometric series bounded by O(N), whereas inserting N elements one-by-one is O(N log N)."
        },
        {
          "id": "gt_dsa_8",
          "level": "Level 1: Fundamentals",
          "topic": "Array Algorithms",
          "question": "Which algorithm finds the maximum subarray sum in a 1D array in linear O(N) time?",
          "options": [
            "Kadane's Algorithm",
            "Dijkstra's Algorithm",
            "Floyd's Cycle Algorithm",
            "Boyer-Moore Voting"
          ],
          "correct": 0,
          "explanation": "Kadane's algorithm maintains `current_max = max(arr[i], current_max + arr[i])` in a single O(N) pass."
        },
        {
          "id": "gt_dsa_9",
          "level": "Level 1: Fundamentals",
          "topic": "Bit Manipulation",
          "question": "What does the expression `(n & (n - 1))` do to the binary representation of an integer `n`?",
          "options": [
            "Inverts all bits of n",
            "Clears (turns off) the lowest set bit (rightmost 1-bit) of n",
            "Multiplies n by 2",
            "Computes the bitwise NOT of n"
          ],
          "correct": 1,
          "explanation": "Subtracting 1 flips all bits from the rightmost set bit onward. Performing bitwise AND with `n` clears that lowest set bit."
        },
        {
          "id": "gt_dsa_10",
          "level": "Level 1: Fundamentals",
          "topic": "Recursion",
          "question": "What is the maximum recursion depth limit typically enforced by Python to prevent C stack overflow?",
          "options": [
            "100",
            "1,000",
            "1,000,000",
            "10"
          ],
          "correct": 1,
          "explanation": "Python defaults `sys.getrecursionlimit()` to 1000 to protect the OS native execution stack from overflow."
        },
        {
          "id": "gt_dsa_11",
          "level": "Level 2: Intermediate",
          "topic": "Monotonic Stack",
          "question": "To find the 'Next Greater Element' for every element in an array of size N in O(N) total time, which data structure is utilized?",
          "options": [
            "Monotonic Decreasing Stack",
            "Min-Heap",
            "Breadth-First Queue",
            "Binary Search Tree"
          ],
          "correct": 0,
          "explanation": "A Monotonic Decreasing Stack keeps elements awaiting their next greater element; when an incoming element exceeds the stack top, it resolves and pops elements in O(N) total amortized operations."
        },
        {
          "id": "gt_dsa_12",
          "level": "Level 2: Intermediate",
          "topic": "String Algorithms",
          "question": "In the KMP (Knuth-Morris-Pratt) string searching algorithm, what does the LPS (Longest Proper Prefix which is also Suffix) array allow us to do on a character mismatch?",
          "options": [
            "Restart the search from index 0 of the text",
            "Skip redundant character comparisons in the text by shifting the pattern to index `lps[j - 1]` without moving the text pointer backwards",
            "Reverse the pattern string",
            "Hash the text using SHA-256"
          ],
          "correct": 1,
          "explanation": "The LPS array encodes self-symmetry in the pattern, enabling linear O(N + M) matching without backtracking the main text index."
        },
        {
          "id": "gt_dsa_13",
          "level": "Level 2: Intermediate",
          "topic": "Dynamic Programming Space Reduction",
          "question": "Why can the space complexity of the 0/1 Knapsack DP table be reduced from O(N * W) to O(W) by iterating the weight capacity backwards (`for w from W down to wt[i]`)?",
          "options": [
            "It speeds up CPU memory bus frequency",
            "Iterating backwards ensures that `dp[w - wt[i]]` represents the state from the previous item `i - 1`, preventing the current item from being counted multiple times",
            "It eliminates the need for any base cases",
            "It converts the problem into greedy selection"
          ],
          "correct": 1,
          "explanation": "Backward iteration preserves the integrity of subproblem results computed in the previous outer loop iteration, correctly enforcing 0/1 exclusivity."
        },
        {
          "id": "gt_dsa_14",
          "level": "Level 2: Intermediate",
          "topic": "Graph Theory",
          "question": "Which algorithm finds All-Pairs Shortest Paths in a dense directed graph in O(V^3) time using dynamic programming?",
          "options": [
            "Floyd-Warshall Algorithm",
            "Kruskal's Algorithm",
            "Prim's Algorithm",
            "Tarjan's Algorithm"
          ],
          "correct": 0,
          "explanation": "Floyd-Warshall computes `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` for all intermediate vertices `k` in O(V^3) time."
        },
        {
          "id": "gt_dsa_15",
          "level": "Level 2: Intermediate",
          "topic": "Binary Lifting",
          "question": "What is the primary advantage of Binary Lifting for finding the Lowest Common Ancestor (LCA) in a tree with Q queries?",
          "options": [
            "Eliminates tree traversal completely",
            "Precomputes 2^k ancestors in O(N log N) time, allowing each LCA query to be answered in O(log N) time",
            "Compresses node values into 16-bit integers",
            "Allows cycles in the tree"
          ],
          "correct": 1,
          "explanation": "Binary Lifting precomputes `up[node][k]` (the 2^k-th ancestor of node) using DP, enabling logarithmic jumping to find LCA in O(log N) per query."
        },
        {
          "id": "gt_dsa_16",
          "level": "Level 2: Intermediate",
          "topic": "Majority Element",
          "question": "Which algorithm finds the majority element (> N/2 occurrences) in an array in O(N) time and O(1) auxiliary space?",
          "options": [
            "Boyer-Moore Voting Algorithm",
            "Kadane's Algorithm",
            "Manacher's Algorithm",
            "Floyd's Tortoise and Hare"
          ],
          "correct": 0,
          "explanation": "Boyer-Moore Voting cancels out distinct element pairs, leaving the majority element with a positive count at the end in O(N) time and O(1) space."
        },
        {
          "id": "gt_dsa_17",
          "level": "Level 2: Intermediate",
          "topic": "Tree Balancing",
          "question": "What is the maximum balance factor allowed for any node in a valid AVL Tree before rotation is triggered?",
          "options": [
            "0",
            "1 (balance factor must be in {-1, 0, 1})",
            "2",
            "log N"
          ],
          "correct": 1,
          "explanation": "AVL trees maintain strict balance where `|height(left) - height(right)| <= 1`. A balance factor of ±2 triggers single (LL/RR) or double (LR/RL) rotations."
        },
        {
          "id": "gt_dsa_18",
          "level": "Level 2: Intermediate",
          "topic": "Topological Ordering",
          "question": "In a course prerequisites problem modeled as a directed graph, what condition indicates that it is IMPOSSIBLE to finish all courses?",
          "options": [
            "The graph has more edges than vertices",
            "The graph contains at least one directed cycle (Kahn's algorithm visits fewer than V vertices)",
            "The graph is disconnected",
            "All nodes have in-degree > 0"
          ],
          "correct": 1,
          "explanation": "A directed cycle represents a circular dependency deadlock where no course in the cycle can be taken first."
        },
        {
          "id": "gt_dsa_19",
          "level": "Level 2: Intermediate",
          "topic": "String Palindromes",
          "question": "What is the time complexity of Manacher's Algorithm for finding the Longest Palindromic Substring in a string of length N?",
          "options": [
            "O(N^2)",
            "O(N log N)",
            "O(N)",
            "O(2^N)"
          ],
          "correct": 2,
          "explanation": "Manacher's algorithm leverages palindromic symmetry around an expanding center to achieve optimal linear O(N) time."
        },
        {
          "id": "gt_dsa_20",
          "level": "Level 2: Intermediate",
          "topic": "Two-Pointer In-Place",
          "question": "When solving the 3-Sum problem (`nums[i] + nums[j] + nums[k] == 0`), what is the optimal time complexity achievable after sorting?",
          "options": [
            "O(N^3)",
            "O(N^2)",
            "O(N log N)",
            "O(N)"
          ],
          "correct": 1,
          "explanation": "Sorting takes O(N log N). Fixing the first element and using two pointers for the remaining pair takes O(N) per element, resulting in overall O(N^2) time."
        },
        {
          "id": "gt_dsa_21",
          "level": "Level 3: Advanced",
          "topic": "Segment Trees & Lazy Propagation",
          "question": "Why is 'Lazy Propagation' necessary when performing Range Updates on a Segment Tree?",
          "options": [
            "To format numbers as floating points",
            "To postpone updating child nodes until they are actually queried, reducing Range Update time from O(N) down to O(log N)",
            "To prevent binary tree stack overflows",
            "To convert dynamic programming into greedy algorithms"
          ],
          "correct": 1,
          "explanation": "Without lazy propagation, updating an interval requires updating all leaf nodes in O(N). Lazy tags store pending updates at internal segment nodes, deferring propagation until children are accessed in O(log N)."
        },
        {
          "id": "gt_dsa_22",
          "level": "Level 3: Advanced",
          "topic": "Graph Bridges & Articulation Points",
          "question": "In Tarjan's bridge-finding algorithm on an undirected graph, what condition proves that an edge `(u, v)` is a Bridge (critical connection)?",
          "options": [
            "`low[v] > disc[u]` (there is no back-edge from the subtree of v to an ancestor of u)",
            "`low[v] == disc[u]`",
            "`disc[v] < disc[u]`",
            "`weight(u, v) == 0`"
          ],
          "correct": 0,
          "explanation": "If `low[v] > disc[u]`, node `v` and its descendants cannot reach `u` or any earlier visited ancestor without crossing edge `(u, v)`, making `(u, v)` a bridge."
        },
        {
          "id": "gt_dsa_23",
          "level": "Level 3: Advanced",
          "topic": "Fenwick Tree (Binary Indexed Tree)",
          "question": "In a Fenwick Tree (BIT), how does `index += (index & -index)` enable point updates in O(log N) time?",
          "options": [
            "It isolates the lowest set bit (two's complement LSB) to jump to the next responsible ancestor range in the tree",
            "It reverses the binary bits of the index",
            "It multiplies the index by 2",
            "It resets the entire tree array"
          ],
          "correct": 0,
          "explanation": "`index & -index` extracts the least significant bit, allowing traversal through covering interval buckets in logarithmic height."
        },
        {
          "id": "gt_dsa_24",
          "level": "Level 3: Advanced",
          "topic": "Network Flow",
          "question": "What is the time complexity of the Dinic's Algorithm for finding Maximum Bipartite Matching on a unit network graph `G = (V, E)`?",
          "options": [
            "O(V^3)",
            "O(E * sqrt(V))",
            "O(V * E^2)",
            "O(2^V)"
          ],
          "correct": 1,
          "explanation": "On unit networks (such as bipartite matching graphs), Dinic's algorithm using BFS level graphs and blocking flow DFS achieves O(E * sqrt(V)) time complexity."
        },
        {
          "id": "gt_dsa_25",
          "level": "Level 3: Advanced",
          "topic": "Digit Dynamic Programming",
          "question": "In Digit DP problems (e.g. count numbers in range `[L, R]` with specific digit properties), what are the standard state parameters memoized?",
          "options": [
            "`(index, tight_flag, leading_zeros_flag, remainder_or_mask)`",
            "`(array_size, pointer_left, pointer_right)`",
            "`(heap_root, tree_depth)`",
            "`(hash_key, salt)`"
          ],
          "correct": 0,
          "explanation": "Digit DP processes numbers digit-by-digit from MSB to LSB, tracking current position, upper bound constraint (`tight`), whether number has started (`leading_zeros`), and accumulated mathematical state."
        },
        {
          "id": "gt_dsa_26",
          "level": "Level 3: Advanced",
          "topic": "Heavy-Light Decomposition",
          "question": "What is the purpose of Heavy-Light Decomposition (HLD) on general trees?",
          "options": [
            "To balance the weight of leaf nodes",
            "To decompose tree vertices into heavy paths, allowing path queries and updates to be mapped into Segment Trees in O(log^2 N) time",
            "To prune 50% of the tree branches",
            "To convert trees into graphs"
          ],
          "correct": 1,
          "explanation": "HLD guarantees that any path from root to node crosses at most O(log N) light edges, mapping tree paths into contiguous segment tree ranges queryable in O(log^2 N)."
        },
        {
          "id": "gt_dsa_27",
          "level": "Level 3: Advanced",
          "topic": "Convex Hull Trick",
          "question": "When optimizing dynamic programming recurrences of the form `dp[i] = min_{j < i} (dp[j] + m_j * x_i + c_j)`, what technique reduces time complexity from O(N^2) to O(N log N) or O(N)?",
          "options": [
            "Convex Hull Trick (CHT) / Li Chao Segment Tree",
            "KMP Algorithm",
            "Floyd's Algorithm",
            "Bitmask Brute Force"
          ],
          "correct": 0,
          "explanation": "The Convex Hull Trick maintains the lower envelope of linear functions `y = m*x + c`, finding the optimal line in O(log N) via binary search or O(1) with monotonic slopes."
        },
        {
          "id": "gt_dsa_28",
          "level": "Level 3: Advanced",
          "topic": "Suffix Automaton",
          "question": "What is the state count and transition edge count of a Suffix Automaton built for a string of length N?",
          "options": [
            "At most `2N - 1` states and `3N - 4` transitions, buildable in linear O(N) time and memory",
            "O(N^2) states and transitions",
            "O(2^N) states",
            "O(N log N) states"
          ],
          "correct": 0,
          "explanation": "A Suffix Automaton is the minimal Deterministic Finite Automaton (DFA) recognizing all suffixes of a string, bounded by linear size and constructed online in O(N)."
        },
        {
          "id": "gt_dsa_29",
          "level": "Level 3: Advanced",
          "topic": "Mo's Algorithm (Offline Range Queries)",
          "question": "In Mo's algorithm for answering Q offline range queries on an array of size N, into what block size should query intervals be grouped to minimize pointer movement?",
          "options": [
            "O(1)",
            "O(sqrt(N)) block size, achieving total time O((N + Q) * sqrt(N))",
            "O(N / 2)",
            "O(log N)"
          ],
          "correct": 1,
          "explanation": "Sorting queries by `L / sqrt(N)` and `R` bounds left-pointer movement to O(Q * sqrt(N)) and right-pointer movement to O(N * sqrt(N)), yielding O((N + Q) sqrt(N))."
        },
        {
          "id": "gt_dsa_30",
          "level": "Level 3: Advanced",
          "topic": "Matrix Exponentiation",
          "question": "To compute the N-th Fibonacci number or count paths of length N in a graph when N = 10^18, what technique computes the answer in O(K^3 log N) time?",
          "options": [
            "Linear recursion",
            "Binary Matrix Exponentiation (`M^N` computed in O(log N) multiplications)",
            "Breadth-First Search",
            "Dynamic Programming Tabulation array of size 10^18"
          ],
          "correct": 1,
          "explanation": "Matrix Exponentiation uses binary exponentiation (`M^N = (M^(N/2))^2`) to compute linear recurrences in logarithmic time, solving N = 10^18 in milliseconds."
        }
      ]
    }
  },
  {
    "id": "course-weekly-championship",
    "title": "Weekly Speed Coding & High-Pressure Championship Track",
    "category": "Weekly Award",
    "level": "Championship",
    "duration": "25 Hours",
    "rating": 4.92,
    "enrolledCount": 980,
    "instructor": "Lumixora Arena Tournament Board",
    "badgeIcon": "🏆",
    "badgeColor": "from-amber-400 to-orange-500",
    "shortDescription": "Master timed contest strategies, rapid edge-case debugging, and zero-penalty algorithmic submissions.",
    "certTitle": "Weekly Coding Championship — Highest Score Award (Rank #1)",
    "certCategory": "Weekly Award",
    "skills": [
      "Speed Coding Under Pressure",
      "Zero-Bug Submissions",
      "Optimal Time Complexity",
      "Arena Championship"
    ],
    "modules": [
      {
        "id": "mod-champ-1",
        "title": "Module 1: Contest Fast I/O, Bit Hacks & Constant Factor Optimization",
        "duration": "8 Hours",
        "lessons": [
          {
            "id": "les-c-1",
            "title": "Fast I/O Buffering in Java / C++, Bit Manipulation Tricks",
            "type": "video",
            "duration": "40 mins",
            "summary": "Using BufferedReader / Custom fast scanner, bitmask DP, parity checks, and bitwise power-of-two optimizations.",
            "textbook": {
              "chapterNumber": "Chapter 1.1",
              "readingTime": "15 mins read",
              "keyTakeaways": [
                "Disable `std::ios_base::sync_with_stdio(false); std::cin.tie(NULL);` in C++ for 10x faster stream reading.",
                "In Java, replace `Scanner` with custom `BufferedReader` and `StringTokenizer` to process 10^6 integers in under 0.2 seconds.",
                "Bit manipulation operates in single CPU clock cycles: `x & -x` extracts LSB, `__builtin_popcount` counts set bits."
              ],
              "sections": [
                {
                  "heading": "1. High-Throughput Contest I/O Templates",
                  "content": "Standard I/O streams synchronize with C stdio by default, incurring heavy function call overhead. Unlinking streams and eliminating buffer flushes (`'\\n'` instead of `std::endl`) prevents Time Limit Exceeded (TLE) verdicts on 10^6 input constraints.",
                  "code": "// Ultra Fast C++ Competitive Template\n#include <iostream>\n\nvoid fast_io() {\n    std::ios_base::sync_with_stdio(false);\n    std::cin.tie(NULL);\n}\n\nint main() {\n    fast_io();\n    int t; std::cin >> t;\n    while (t--) {\n        // Rapid contest loop\n    }\n    return 0;\n}",
                  "language": "cpp"
                }
              ],
              "caseStudy": {
                "company": "Jane Street / High Frequency Trading",
                "title": "Sub-Microsecond Bitmask Matching in Market Data Feeds",
                "scenario": "Parsing millions of exchange market orders per millisecond using standard string operations produced unacceptable latency.",
                "architecture": "Engineered bitmask order flag registers. Stock ticker symbol filters, order type masks (Limit, Stop, IOC), and account verification execute in single CPU bitwise instructions (`AND`, `XOR`, `__builtin_ctz` count trailing zeros), processing 10,000,000 orders per second on single CPU cores.",
                "takeaway": "Bitwise operations map directly to single-cycle CPU hardware registers, delivering deterministic zero-latency computation."
              },
              "interviewPearls": [
                {
                  "question": "How do you compute the population count (number of set bits) in an integer in O(1) hardware time?",
                  "answer": "Modern x86 and ARM processors provide dedicated hardware instructions: `popcnt` in x86 assembly, exposed via compiler intrinsics `__builtin_popcount(x)` in GCC/Clang or `Integer.bitCount(x)` in Java, executing in 1 single CPU cycle."
                }
              ]
            }
          },
          {
            "id": "les-c-2",
            "title": "Bitmask Dynamic Programming & Subset Iteration",
            "type": "reading",
            "duration": "40 mins",
            "summary": "Bitmask representations for Traveling Salesperson, iterating all submasks of a mask in O(3^N).",
            "textbook": {
              "chapterNumber": "Chapter 1.2",
              "readingTime": "17 mins read",
              "keyTakeaways": [
                "Bitmasks represent sets of up to 30 items as integer bit flags.",
                "Iterating all submasks of all masks runs in O(3^N) time using `submask = (submask - 1) & mask`.",
                "TSP (Traveling Salesperson) is solved in O(N^2 * 2^N) using `dp[mask][last_visited]`."
              ],
              "sections": [
                {
                  "heading": "1. Submask Enumeration Pattern",
                  "content": "To iterate through all submasks of a bitmask without checking every number from 0 to mask, the submask subtraction trick `submask = (submask - 1) & mask` visits only valid submasks, reducing complexity across all masks to sum of binomial coefficients = 3^N.",
                  "code": "// Iterating all submasks of a given mask\nfor (int mask = 0; mask < (1 << n); ++mask) {\n    for (int submask = mask; submask > 0; submask = (submask - 1) & mask) {\n        // Process valid submask\n    }\n}",
                  "language": "cpp"
                }
              ]
            }
          }
        ]
      },
      {
        "id": "mod-champ-2",
        "title": "Module 2: Mock Arena Championship & High-Pressure Contest Simulations",
        "duration": "17 Hours",
        "lessons": [
          {
            "id": "les-c-3",
            "title": "Zero-Bug Edge Case Stress Testing & Boundary Validation",
            "type": "practice",
            "duration": "60 mins",
            "summary": "Rapid identification of Integer overflow, 1-indexed off-by-one errors, and graph edge cases.",
            "textbook": {
              "chapterNumber": "Chapter 2.1",
              "readingTime": "16 mins read",
              "keyTakeaways": [
                "Integer Overflow: 32-bit signed max is ~2 * 10^9; intermediate multiplications (e.g. `n * (n - 1) / 2`) require `long long` (64-bit int).",
                "Contest boundary test cases: N=1, empty inputs, duplicate elements, all negative values, disconnected graphs, star graphs.",
                "Stress testing generates random test cases and compares an optimal solution against a slow brute-force reference."
              ],
              "sections": [
                {
                  "heading": "1. Stress Testing Framework Script",
                  "content": "When an optimal solution produces Wrong Answer (WA) on hidden test cases, a stress tester pairs a randomized generator, a brute-force validator, and the candidate solution in a loop until a failing test case is discovered.",
                  "code": "# Python Stress Tester Script\nimport random\n\ndef brute_force(arr):\n    return max([sum(arr[i:j]) for i in range(len(arr)) for j in range(i+1, len(arr)+1)], default=0)\n\ndef candidate(arr):\n    cur = mx = 0\n    for x in arr:\n        cur = max(x, cur + x)\n        mx = max(mx, cur)\n    return mx\n\nfor _ in range(1000):\n    test = [random.randint(-100, 100) for _ in range(10)]\n    if brute_force(test) != candidate(test):\n        print(f\"Failing test found: {test}\")\n        break",
                  "language": "python"
                }
              ]
            }
          }
        ]
      }
    ],
    "grandTest": {
      "id": "grand-test-weekly-championship",
      "title": "Weekly Arena Championship Grand Assessment",
      "durationMinutes": 45,
      "passPercentage": 60,
      "questions": [
        {
          "id": "gt_wk_1",
          "level": "Level 1: Fundamentals",
          "topic": "Bitwise Operations",
          "question": "Which bitwise expression checks if an integer N is a positive power of 2 in O(1) time?",
          "options": [
            "(N & (N - 1)) == 0 && N > 0",
            "(N | (N + 1)) == 0",
            "(N ^ N) == 0",
            "(N >> 1) == 0"
          ],
          "correct": 0,
          "explanation": "Powers of 2 have exactly one set bit in binary. Subtracting 1 flips that bit to 0, making `N & (N - 1) == 0`."
        },
        {
          "id": "gt_wk_2",
          "level": "Level 1: Fundamentals",
          "topic": "Data Types & Limits",
          "question": "What is the maximum positive value of a standard 32-bit signed integer before overflow in Java/C++?",
          "options": [
            "2,147,483,647 (~2 * 10^9)",
            "4,294,967,295",
            "1,000,000,000",
            "9,223,372,036,854,775,807"
          ],
          "correct": 0,
          "explanation": "2^31 - 1 = 2,147,483,647. Products exceeding this threshold cause integer overflow into negative values."
        },
        {
          "id": "gt_wk_3",
          "level": "Level 1: Fundamentals",
          "topic": "Contest Runtime Bounds",
          "question": "In competitive programming platforms (Codeforces, LeetCode), approximately how many simple CPU operations can execute within a 1.0 second time limit in C++?",
          "options": [
            "~10^8 (100 Million)",
            "~10^5 (100 Thousand)",
            "~10^12 (1 Trillion)",
            "~10^3 (1 Thousand)"
          ],
          "correct": 0,
          "explanation": "Modern servers process roughly 10^8 basic operations per second. Algorithms with O(N log N) for N = 10^5 take ~1.7 * 10^6 operations and easily pass."
        },
        {
          "id": "gt_wk_4",
          "level": "Level 1: Fundamentals",
          "topic": "Bitwise Parity",
          "question": "How can you check if an integer `x` is odd using bitwise operations in O(1) time?",
          "options": [
            "(x & 1) != 0",
            "(x | 1) == 0",
            "(x ^ 0) == 0",
            "(x >> 1) == 0"
          ],
          "correct": 0,
          "explanation": "The least significant bit (LSB) of any odd integer is 1. Checking `x & 1` tests this directly in 1 CPU cycle."
        },
        {
          "id": "gt_wk_5",
          "level": "Level 1: Fundamentals",
          "topic": "Binary Search",
          "question": "When implementing Binary Search over an integer range `[low, high]`, why is `mid = low + (high - low) / 2` preferred over `mid = (low + high) / 2`?",
          "options": [
            "It prevents potential 32-bit integer overflow when `low + high > 2,147,483,647`",
            "It executes 2x faster on ARM CPUs",
            "It rounds numbers to floating points",
            "It automatically sorts the array"
          ],
          "correct": 0,
          "explanation": "If `low` and `high` are close to `INT_MAX`, `(low + high)` overflows to a negative number, whereas `low + (high - low) / 2` remains within bounds."
        },
        {
          "id": "gt_wk_6",
          "level": "Level 1: Fundamentals",
          "topic": "Modulo Arithmetic",
          "question": "When computing `(a - b) % MOD` in competitive programming where subtraction might yield a negative number, what is the standard safe formula?",
          "options": [
            "((a - b) % MOD + MOD) % MOD",
            "(a - b) % MOD",
            "abs(a - b) % MOD",
            "(a % MOD) - (b % MOD)"
          ],
          "correct": 0,
          "explanation": "Adding MOD before taking the modulo ensures the dividend is non-negative regardless of language modulo semantics for negative integers."
        },
        {
          "id": "gt_wk_7",
          "level": "Level 1: Fundamentals",
          "topic": "Bitwise Shifts",
          "question": "What is the mathematical equivalent of `1 << k` for non-negative integer `k`?",
          "options": [
            "2^k (2 raised to the power k)",
            "k * 2",
            "k^2",
            "log2(k)"
          ],
          "correct": 0,
          "explanation": "Bitwise left shift by `k` positions is equivalent to multiplying by 2^k."
        },
        {
          "id": "gt_wk_8",
          "level": "Level 1: Fundamentals",
          "topic": "Permutations",
          "question": "In C++ STL, which function transforms a sorted range into the next lexicographical permutation in-place?",
          "options": [
            "std::next_permutation()",
            "std::sort()",
            "std::rotate()",
            "std::reverse()"
          ],
          "correct": 0,
          "explanation": "`std::next_permutation` reorders elements into the next lexicographical permutation in average O(1) amortized time."
        },
        {
          "id": "gt_wk_9",
          "level": "Level 1: Fundamentals",
          "topic": "Set Operations",
          "question": "In C++, which container provides O(log N) sorted unique insertions and lookups implemented as a Red-Black Tree?",
          "options": [
            "std::set",
            "std::vector",
            "std::unordered_set",
            "std::stack"
          ],
          "correct": 0,
          "explanation": "`std::set` is implemented as a self-balancing Red-Black binary search tree maintaining sorted order."
        },
        {
          "id": "gt_wk_10",
          "level": "Level 1: Fundamentals",
          "topic": "GCD Algorithm",
          "question": "What is the time complexity of the Euclidean algorithm for computing the Greatest Common Divisor `gcd(a, b)`?",
          "options": [
            "O(log(min(a, b)))",
            "O(min(a, b))",
            "O(a * b)",
            "O(1)"
          ],
          "correct": 0,
          "explanation": "Lamé's Theorem proves that the Euclidean algorithm takes at most 5 times the number of digits in the smaller number, giving logarithmic O(log(min(a, b))) time."
        },
        {
          "id": "gt_wk_11",
          "level": "Level 2: Intermediate",
          "topic": "Fast Power (Binary Exponentiation)",
          "question": "How many multiplications are required to compute `a^b % mod` where `b = 10^18` using Binary Exponentiation?",
          "options": [
            "At most ~60 multiplications (O(log b))",
            "10^18 multiplications",
            "10^9 multiplications",
            "1 multiplication"
          ],
          "correct": 0,
          "explanation": "Binary exponentiation squares the base at each step (`log2(10^18) ≈ 60`), completing in ~60 iterations."
        },
        {
          "id": "gt_wk_12",
          "level": "Level 2: Intermediate",
          "topic": "Number Theory (Sieve of Eratosthenes)",
          "question": "What is the time complexity of generating all prime numbers up to N using the standard Sieve of Eratosthenes?",
          "options": [
            "O(N log(log N))",
            "O(N * sqrt(N))",
            "O(N^2)",
            "O(N log N)"
          ],
          "correct": 0,
          "explanation": "Summing reciprocal primes `N * (1/2 + 1/3 + 1/5 + ...)` asymptotically converges to O(N log(log N))."
        },
        {
          "id": "gt_wk_13",
          "level": "Level 2: Intermediate",
          "topic": "Two-Pointer Inversion",
          "question": "How many inversions are in an array of size N that is sorted in strictly descending order?",
          "options": [
            "N * (N - 1) / 2",
            "0",
            "N",
            "log N"
          ],
          "correct": 0,
          "explanation": "In a completely reversed array, every pair `(i, j)` with `i < j` is an inversion, totaling `C(N, 2) = N * (N - 1) / 2`."
        },
        {
          "id": "gt_wk_14",
          "level": "Level 2: Intermediate",
          "topic": "Binary Search on Answer",
          "question": "When can 'Binary Search on Answer' (Predicate Monotonicity) be applied to optimization problems (e.g. minimize maximum capacity)?",
          "options": [
            "Whenever the decision predicate `check(X)` is monotonic (e.g. if answer X is possible, all X' >= X are also possible)",
            "Only when the input array is strictly sorted",
            "Only on graph problems",
            "Only when all numbers are powers of 2"
          ],
          "correct": 0,
          "explanation": "Monotonicity allows binary search over the search space `[min_ans, max_ans]`, reducing an optimization problem to logarithmic feasibility checks in O(log(range) * cost(check))."
        },
        {
          "id": "gt_wk_15",
          "level": "Level 2: Intermediate",
          "topic": "Bitmask Subsets",
          "question": "What is the time complexity of iterating through all submasks of all masks for N items using `submask = (submask - 1) & mask`?",
          "options": [
            "O(3^N)",
            "O(4^N)",
            "O(2^N)",
            "O(N * 2^N)"
          ],
          "correct": 0,
          "explanation": "By the binomial theorem, sum_{k=0}^N (N choose k) * 2^k = (1 + 2)^N = 3^N."
        },
        {
          "id": "gt_wk_16",
          "level": "Level 2: Intermediate",
          "topic": "Coordinate Compression",
          "question": "When array element values range up to 10^9 but array size N <= 10^5, what technique maps values to their relative ranks `[0, N - 1]` for indexing Segment Trees?",
          "options": [
            "Coordinate Compression via `std::sort` and `std::unique`",
            "Modulo 1000",
            "Floating point division",
            "Bloom filter"
          ],
          "correct": 0,
          "explanation": "Coordinate compression sorts unique values and replaces each value with its binary search rank (`std::lower_bound`), reducing coordinate domain to `[0, N-1]`."
        },
        {
          "id": "gt_wk_17",
          "level": "Level 2: Intermediate",
          "topic": "Modular Multiplicative Inverse",
          "question": "According to Fermat's Little Theorem, if P is a prime number, what is the modular multiplicative inverse of `a` modulo P (`a^(-1) % P`)?",
          "options": [
            "a^(P - 2) % P",
            "a^(P - 1) % P",
            "P - a",
            "1 / a"
          ],
          "correct": 0,
          "explanation": "Fermat's Little Theorem states `a^(P - 1) ≡ 1 (mod P)`. Multiplying both sides by `a^(-1)` yields `a^(P - 2) ≡ a^(-1) (mod P)`."
        },
        {
          "id": "gt_wk_18",
          "level": "Level 2: Intermediate",
          "topic": "Euler's Totient Function",
          "question": "What is the value of Euler's Totient function `phi(P)` where P is a prime number?",
          "options": [
            "P - 1",
            "P",
            "1",
            "P / 2"
          ],
          "correct": 0,
          "explanation": "For a prime P, all integers from 1 to P - 1 are coprime to P, so `phi(P) = P - 1`."
        },
        {
          "id": "gt_wk_19",
          "level": "Level 2: Intermediate",
          "topic": "Graph Diameter",
          "question": "How can the diameter of an unweighted tree be found in two BFS passes?",
          "options": [
            "Run BFS from arbitrary node u to find farthest node v, then run BFS from v to find farthest node w; distance(v, w) is the tree diameter",
            "Run Dijkstra from all V nodes",
            "Sort all edges by weight",
            "Find the topological sort"
          ],
          "correct": 0,
          "explanation": "The farthest node from any arbitrary starting node in a tree is guaranteed to be an endpoint of the tree's diameter."
        },
        {
          "id": "gt_wk_20",
          "level": "Level 2: Intermediate",
          "topic": "Meet in the Middle",
          "question": "For a subset sum problem with N = 40 items where 2^40 is too slow (~10^12), how does 'Meet in the Middle' make it solvable?",
          "options": [
            "Splits items into two halves of size 20, generates all 2^20 subsets for both halves (~10^6 each), and binary searches one half against the sorted second half in O(2^(N/2) * N)",
            "Runs QuickSort on the entire array",
            "Uses greedy knapsack",
            "Converts numbers to floating point"
          ],
          "correct": 0,
          "explanation": "2^20 is ~10^6, easily computable in 0.05 seconds. Binary searching pairs between both halves completes in O(2^(N/2) * (N/2))."
        },
        {
          "id": "gt_wk_21",
          "level": "Level 3: Advanced",
          "topic": "Interactive Contest Problems",
          "question": "In interactive competitive programming problems where standard output is queried (e.g. `? mid`), why is flushing stdout (`std::cout << std::endl` or `fflush(stdout)`) mandatory after every print?",
          "options": [
            "To prevent output buffer stalls that cause the judge program to hang and trigger Time Limit Exceeded / Idleness Limit Exceeded verdicts",
            "To format numbers as hexadecimals",
            "To encrypt output with RSA",
            "To clear the client RAM"
          ],
          "correct": 0,
          "explanation": "Interactive judges expect immediate input on pipe buffers. Without flushing, output stays buffered in memory, starving the judge process."
        },
        {
          "id": "gt_wk_22",
          "level": "Level 3: Advanced",
          "topic": "Ternary Search",
          "question": "When finding the maximum or minimum of a strictly unimodal (single peak) continuous or discrete function, what is the time complexity of Ternary Search across range R?",
          "options": [
            "O(log_1.5 R)",
            "O(R)",
            "O(R^2)",
            "O(sqrt(R))"
          ],
          "correct": 0,
          "explanation": "Ternary search divides the search space into three parts via two midpoints `m1` and `m2`, eliminating 1/3 of the interval in each iteration in O(log_1.5 R) steps."
        },
        {
          "id": "gt_wk_23",
          "level": "Level 3: Advanced",
          "topic": "Fast Fourier Transform (FFT)",
          "question": "What is the time complexity of multiplying two polynomials of degree N using Fast Fourier Transform (FFT / NTT)?",
          "options": [
            "O(N log N)",
            "O(N^2)",
            "O(N^3)",
            "O(sqrt(N))"
          ],
          "correct": 0,
          "explanation": "FFT evaluates polynomials at complex roots of unity in O(N log N), performs pointwise multiplication in O(N), and inverts via IFFT in O(N log N)."
        },
        {
          "id": "gt_wk_24",
          "level": "Level 3: Advanced",
          "topic": "Centroid Decomposition",
          "question": "What property does the Centroid of a tree with N vertices satisfy, and why is Centroid Decomposition useful?",
          "options": [
            "Removing the centroid splits the tree into subtrees, each containing at most N/2 vertices, bounding recursion depth to O(log N) for tree path queries",
            "It is the vertex with maximum degree",
            "It connects all leaf nodes",
            "It makes the tree a DAG"
          ],
          "correct": 0,
          "explanation": "The centroid guarantees tree division into components of size <= N/2, yielding a divide-and-conquer tree depth of O(log N)."
        },
        {
          "id": "gt_wk_25",
          "level": "Level 3: Advanced",
          "topic": "Bitset Optimization",
          "question": "In C++, how does `std::bitset<N>` accelerate boolean matrix operations and knapsack subset reaches by a factor of 64?",
          "options": [
            "By packing 64 boolean flags into single 64-bit CPU registers (`uint64_t`), allowing bitwise OR/AND operations to process 64 elements per clock cycle with SIMD instructions",
            "By compressing data with gzip",
            "By running on GPU shaders",
            "By disabling garbage collection"
          ],
          "correct": 0,
          "explanation": "Bitsets vectorize bitwise operations across 64-bit words, providing an instant 64x speedup over `bool[]` arrays."
        },
        {
          "id": "gt_wk_26",
          "level": "Level 3: Advanced",
          "topic": "Game Theory (Sprague-Grundy)",
          "question": "In impartial games played under normal play convention (Nim games), what does a Nim-Sum (XOR sum of pile sizes) equal to 0 indicate for the first player?",
          "options": [
            "P-position (Previous player winning position): Any move made by the current player leaves a non-zero state, meaning the first player is in a losing position under optimal play",
            "N-position (Next player winning position)",
            "Draw state",
            "Game must restart"
          ],
          "correct": 0,
          "explanation": "By the Bouton and Sprague-Grundy theorem, a game state with XOR sum = 0 is a P-position (losing for the player whose turn it is)."
        },
        {
          "id": "gt_wk_27",
          "level": "Level 3: Advanced",
          "topic": "Persistent Segment Trees",
          "question": "How does a Persistent Segment Tree answer range queries on past versions of an array while inserting elements in O(log N) time and space per update?",
          "options": [
            "By creating a new root and sharing unchanged child nodes with previous versions (Node Copying / Path Copying)",
            "By writing full copies of the segment tree to disk",
            "By executing database transactions",
            "By deleting previous versions"
          ],
          "correct": 0,
          "explanation": "Path copying allocates only `log N` new nodes per update for the modified path, pointing unchanged subtrees to existing nodes from earlier versions."
        },
        {
          "id": "gt_wk_28",
          "level": "Level 3: Advanced",
          "topic": "Rolling Hash & Hash Collisions",
          "question": "When using polynomial rolling hash for string comparison modulo `10^9 + 7`, why is 'Double Hashing' with two distinct primes (e.g. `10^9 + 7` and `10^9 + 9`) recommended in contests?",
          "options": [
            "To reduce the probability of a hash collision from `~1 / 10^9` down to `~1 / 10^18`, completely neutralizing anti-hash adversarial test cases",
            "To double the string length",
            "To decrypt MD5 hashes",
            "To sort strings alphabetically"
          ],
          "correct": 0,
          "explanation": "Birthday paradox collisions occur around sqrt(MOD) ≈ 30,000 comparisons for single hash. Double hashing squares the state space, making accidental collisions mathematically impossible."
        },
        {
          "id": "gt_wk_29",
          "level": "Level 3: Advanced",
          "topic": "Burnside's Lemma",
          "question": "In combinatorics, what does Burnside's Lemma compute?",
          "options": [
            "The number of distinct orbits (colorings/patterns) under a group of rotational and reflective symmetries",
            "The shortest path in a graph",
            "The roots of a polynomial",
            "The maximum flow in a network"
          ],
          "correct": 0,
          "explanation": "Burnside's lemma states `|X / G| = (1 / |G|) * sum_{g in G} |X^g|`, averaging the number of fixed points across group symmetries."
        },
        {
          "id": "gt_wk_30",
          "level": "Level 3: Advanced",
          "topic": "Arena Contest Submissions",
          "question": "In a 2-hour ACM-ICPC or Codeforces contest, what is the optimal submission strategy when unsure about edge cases on problem B vs reading problem C?",
          "options": [
            "Immediately write a 10-line random stress tester comparing naive vs candidate solution on problem B while reading problem C to maximize concurrent cognitive throughput and avoid wrong submission penalties",
            "Guess random constants and submit 20 times",
            "Close the laptop and wait for contest to end",
            "Rewrite problem B in assembly language"
          ],
          "correct": 0,
          "explanation": "Automated stress testing in background terminal processes identifies failing counter-examples deterministically while freeing the engineer to read and formulate logic for subsequent challenges."
        }
      ]
    }
  }
];

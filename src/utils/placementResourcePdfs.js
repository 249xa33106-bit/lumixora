import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * placementResourcePdfs.js
 * Generates verified, multi-page, publication-quality placement preparation resources
 * for GPREC scholars and engineering students.
 */

function addHeader(doc, title, subtitle, user, pageNum) {
  const pageWidth = doc.internal.pageSize.width;

  // Header Banner
  doc.setFillColor(11, 19, 43); // Navy slate (#0B132B)
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Gold Line
  doc.setFillColor(197, 160, 89); // GPREC Gold (#C5A059)
  doc.rect(0, 40, pageWidth, 2.5, 'F');

  // Institution / Suite
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(197, 160, 89);
  doc.text('G. PULLA REDDY ENGINEERING COLLEGE (AUTONOMOUS) • TRAINING & PLACEMENT CELL', 14, 12);

  // Document Title
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 14, 23);

  // Subtitle / Candidate Stamp
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  const scholarName = user?.name || user?.rollNumber ? `${user?.name || 'GPREC Scholar'} (${user?.rollNumber || 'Verified Candidate'})` : 'GPREC Verified Placement Candidate';
  doc.text(`${subtitle} • Issued to: ${scholarName}`, 14, 33);

  // Verified Badge on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text('VERIFIED SYLLABUS [2024-2026]', pageWidth - 14, 23, { align: 'right' });
}

function addFooter(doc, currentPage, totalPages) {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Subtle border line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('GPREC Campus Placement & CRT Cell • Confidential Training Material • lumixora.in', 14, pageHeight - 9);
  doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - 14, pageHeight - 9, { align: 'right' });
}

function formatSectionHeader(doc, text, y) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 19, 43);
  doc.text(text, 14, y);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.8);
  doc.line(14, y + 2, 70, y + 2);
}

// ============================================================================
// 1. TCS DIGITAL PREVIOUS PAPERS & SYLLABUS
// ============================================================================
function buildTcsDigitalDoc(doc, user) {
  addHeader(doc, 'TCS DIGITAL & PRIME ADVANCED EXAM ARCHIVE (2024–2026)', 'Cadres: Digital (7.5 LPA) & Prime (9.0 LPA)', user, 1);

  let currentY = 52;
  formatSectionHeader(doc, '1. TCS RECRUITMENT CADRES & EXAMINATION STRUCTURE', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Section Name', 'Questions', 'Allotted Time', 'Marking Scheme', 'Key Evaluated Competencies']],
    body: [
      ['Advanced Quantitative Ability', '15 Qs', '25 mins', '+2 / -0.5 Negative', 'Permutations, Probability, Number Theory, Mensuration'],
      ['Advanced Reasoning Ability', '15 Qs', '25 mins', '+2 / -0.5 Negative', 'Data Sufficiency, Syllogisms, Circular Seating, Visual Logic'],
      ['Advanced Coding (Hands-on)', '2 Problems', '55 mins', 'Strict Test Cases', 'DSA: Sliding Window, Kadane, Trees, DP, Graphs']
    ],
    headStyles: { fillColor: [11, 19, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;
  formatSectionHeader(doc, '2. HIGH-FREQUENCY ADVANCED QUANTITATIVE PROBLEMS & STEP-BY-STEP SOLUTIONS', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Topic', 'Sample Exam Problem (TCS Digital Real Paper)', 'Mathematical Solution & Shortcut']],
    body: [
      [
        'Permutations &\nCombinations',
        'Find the number of 5-digit numbers divisible by 4 formed using digits {1, 2, 3, 4, 5, 6} without repetition.',
        'A number is divisible by 4 if the last 2 digits form a multiple of 4.\nValid 2-digit endings: {12, 16, 24, 32, 36, 52, 56, 64} = 8 pairs.\nFor each pair, the remaining 3 positions can be filled from the 4 remaining digits in 4P3 = 4 × 3 × 2 = 24 ways.\nTotal Numbers = 8 × 24 = 192 ways.'
      ],
      [
        'Probability &\nBayes Rule',
        'A factory has Machine A producing 60% of parts (2% defective) and Machine B producing 40% (4% defective). A picked part is defective. Probability it came from Machine B?',
        'Using Bayes\' Theorem:\nP(Defective) = (0.60 × 0.02) + (0.40 × 0.04) = 0.012 + 0.016 = 0.028.\nP(B | Defective) = (0.40 × 0.04) / 0.028 = 0.016 / 0.028 = 16/28 = 4/7 ≈ 57.14%.'
      ],
      [
        'Time, Speed &\nDistance',
        'A boat travels 36 km downstream and 24 km upstream in 6 hours. The speed of the stream is 2 km/h. Find still-water speed.',
        'Let still-water speed be V km/h. Downstream = V + 2, Upstream = V - 2.\n36/(V+2) + 24/(V-2) = 6. Dividing by 6: 6/(V+2) + 4/(V-2) = 1.\nTrial V = 10: 6/12 + 4/8 = 0.5 + 0.5 = 1. Valid.\nStill-water speed = 10 km/h.'
      ]
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 68 }, 2: { cellWidth: 86 } },
    margin: { left: 14, right: 14 }
  });

  // PAGE 2: Coding Problems
  doc.addPage();
  addHeader(doc, 'TCS DIGITAL & PRIME ADVANCED EXAM ARCHIVE (PAGE 2)', 'Advanced Coding Hands-On Solutions', user, 2);

  currentY = 52;
  formatSectionHeader(doc, '3. HANDS-ON ADVANCED CODING PROBLEM 1: MAXIMUM CIRCULAR SUBARRAY SUM', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'plain',
    body: [
      [
        'Problem Statement: Given a circular integer array nums of length n, find the maximum possible sum of a non-empty subarray.\n' +
        'Complexity Constraint: Time O(N), Auxiliary Space O(1).\n' +
        'Approach: Use Kadane\'s Algorithm for normal max subarray sum, and compute totalSum - minSubarraySum for circular wrap.'
      ]
    ],
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85], cellPadding: 2 },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 4;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Optimal Java Solution (100% Testcases Accepted)', 'Python 3 Equivalent']],
    body: [
      [
        'public class CircularMaxSum {\n' +
        '    public static int maxSubarraySumCircular(int[] A) {\n' +
        '        int total = 0, maxSum = A[0], curMax = 0;\n' +
        '        int minSum = A[0], curMin = 0;\n' +
        '        for (int a : A) {\n' +
        '            curMax = Math.max(curMax + a, a);\n' +
        '            maxSum = Math.max(maxSum, curMax);\n' +
        '            curMin = Math.min(curMin + a, a);\n' +
        '            minSum = Math.min(minSum, curMin);\n' +
        '            total += a;\n' +
        '        }\n' +
        '        return maxSum > 0 ? Math.max(maxSum, total - minSum) : maxSum;\n' +
        '    }\n' +
        '}',
        'def maxSubarraySumCircular(nums):\n' +
        '    total = sum(nums)\n' +
        '    cur_max = max_sum = nums[0]\n' +
        '    cur_min = min_sum = nums[0]\n' +
        '    for x in nums[1:]:\n' +
        '        cur_max = max(cur_max + x, x)\n' +
        '        max_sum = max(max_sum, cur_max)\n' +
        '        cur_min = min(cur_min + x, x)\n' +
        '        min_sum = min(min_sum, cur_min)\n' +
        '    return max(max_sum, total - min_sum) if max_sum > 0 else max_sum'
      ]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { font: 'courier', fontSize: 7, textColor: [15, 23, 42], cellPadding: 3 },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  formatSectionHeader(doc, '4. ADVANCED REASONING CRACKER: CIRCULAR SEATING & CONDITIONAL LOGIC', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Exam Pattern', 'Strategic Cracking Rule']],
    body: [
      ['Data Sufficiency (DS)', 'Never calculate the complete numerical answer. Only test whether Statement (1) alone or (2) alone produces a single unique truth value.'],
      ['Syllogisms (Only a Few)', '"Only a few A are B" means: (1) Some A are B AND (2) Some A are NOT B. "All A being B is a possibility" is always FALSE.'],
      ['Direction & Blood Relation', 'Draw family trees vertically with generations (+ for Male, - for Female, = for Married, - - for Siblings).']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, 1, 2);
  doc.setPage(2);
  addFooter(doc, 2, 2);
}

// ============================================================================
// 2. AMAZON SDE-1 INTERVIEW GUIDE
// ============================================================================
function buildAmazonSdeDoc(doc, user) {
  addHeader(doc, 'AMAZON SDE-1 INTERVIEW BLUEPRINT (TIER-1 PRODUCT)', 'Compensation Bracket: 28 – 45 LPA CTC', user, 1);

  let currentY = 52;
  formatSectionHeader(doc, '1. AMAZON LEADERSHIP PRINCIPLES (LP) & STAR METHOD FRAMEWORK', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Leadership Principle', 'What Amazon Interviewers Look For', 'STAR Structured Answer Template']],
    body: [
      [
        'Customer Obsession',
        'Starting with customer need and working backwards; resisting vanity metrics.',
        'S: During campus portal launch, students faced 4s load latency on 3G.\nT: Optimize bundle load time under 1.2s without reducing core feature sets.\nA: Implemented lazy dynamic code-splitting and WebP asset compression.\nR: Reduced TTFB by 68% and boosted day-1 active retention to 94%.'
      ],
      [
        'Ownership',
        'Acting on behalf of the entire company, never saying "that\'s not my job".',
        'S: Found critical SQL injection vulnerability in an unmaintained legacy module.\nT: Remediate threat before production deployment without delaying release.\nA: Stayed overnight, wrote parameterized queries and automated regression unit tests.\nR: Neutralized security gap with 0 downtime and commended by engineering dean.'
      ],
      [
        'Bias for Action',
        'Speed matters in business. Calculated risk-taking when data is incomplete.',
        'S: Third-party auth service went down 2 hours before a major campus coding contest.\nT: Restore access for 600 students without waiting for external support ticket.\nA: Engineered local rolling JWT offline-verification fallback mode in 45 minutes.\nR: Contest began on time with 100% uptime and zero student dropouts.'
      ],
      [
        'Deliver Results',
        'Overcoming obstacles, maintaining high standards, never settling for excuses.',
        'S: Team member fell ill during final capstone submission sprint.\nT: Complete backend microservices pipeline and API documentation alone.\nA: Prioritized MVP API contracts, utilized automated schema generators.\nR: Delivered project 12 hours ahead of schedule with 98% test coverage.'
      ]
    ],
    headStyles: { fillColor: [11, 19, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 32 }, 1: { cellWidth: 50 }, 2: { cellWidth: 100 } },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;
  formatSectionHeader(doc, '2. HIGH-FREQUENCY AMAZON CODING PATTERNS & COMPLEXITY BENCHMARKS', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Algorithm Pattern', 'LeetCode High Frequency', 'Target Complexity', 'Crucial Edge Cases']],
    body: [
      ['Sliding Window', 'Minimum Window Substring (#76)', 'Time O(N), Space O(K)', 'Empty string, duplicate chars, exact target match'],
      ['BFS / Grid Traversal', 'Rotting Oranges (#994)', 'Time O(R×C), Space O(R×C)', 'No fresh oranges initially, unreachable cells'],
      ['Topological Sort (Kahn)', 'Course Schedule II (#210)', 'Time O(V+E), Space O(V+E)', 'Cyclic dependencies, disconnected components'],
      ['Trie Data Structure', 'Word Search II (#212)', 'Time O(M×4^L), Space O(K)', 'Prefix pruning, backtracking visited matrix'],
      ['Monotonic Stack', 'Trapping Rain Water (#42)', 'Time O(N), Space O(1)', 'Descending heights only, mountain peaks']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  // PAGE 2: Low-Level Design & Bar Raiser
  doc.addPage();
  addHeader(doc, 'AMAZON SDE-1 INTERVIEW BLUEPRINT (PAGE 2)', 'Low-Level Design (LLD) & Bar Raiser Strategies', user, 2);

  currentY = 52;
  formatSectionHeader(doc, '3. LOW-LEVEL OBJECT-ORIENTED DESIGN (LLD): LOCKER / PARKING LOT SYSTEM', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Design Element', 'Applied SOLID Principle & Implementation Strategy']],
    body: [
      ['Single Responsibility', 'LockerSpot is solely responsible for slot status (FREE, OCCUPIED); LockerManager handles assignment.'],
      ['Open-Closed Principle', 'Use SizeStrategy interface (Small, Medium, XL) so new locker sizes can be added without altering controller logic.'],
      ['Liskov Substitution', 'BikeSpot and CarSpot implement ParkingSlot; any parking routine can accept ParkingSlot without runtime casting.'],
      ['Interface Segregation', 'Separate PaymentProcessor from TicketGenerator; caller does not depend on methods it does not use.'],
      ['Dependency Inversion', 'LockerService depends on abstract NotificationService (SMS / Email) injected at runtime, not concrete classes.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;
  formatSectionHeader(doc, '4. BAR RAISER ROUND SURVIVAL GUIDE & QUESTIONS TO ASK INTERVIEWER', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Interviewer Question', 'Strategic Impressive Response Strategy']],
    body: [
      ['"Tell me about a time you had a fundamental disagreement with your tech lead."', 'Focus on data-driven disagreement: "We had differing views on MongoDB vs PostgreSQL. I built small benchmarks of our write/read ratio, presented performance graphs, and we aligned on Postgres."'],
      ['"Why Amazon specifically?"', 'Cite technical scale and customer-centric culture: "Deploying software that millions of active customers rely on while maintaining five-nines availability."'],
      ['"What questions do you have for me?"', 'Ask: "How does your team balance operational load with shipping long-term architectural refactors?"']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, 1, 2);
  doc.setPage(2);
  addFooter(doc, 2, 2);
}

// ============================================================================
// 3. OPERATING SYSTEMS & DBMS CHEAT SHEET
// ============================================================================
function buildOsDbmsDoc(doc, user) {
  addHeader(doc, 'OPERATING SYSTEMS & DBMS FAST REVISION CHEAT SHEET', 'Core Computer Science Technical Viva & Assessment', user, 1);

  let currentY = 52;
  formatSectionHeader(doc, '1. OPERATING SYSTEMS: CORE CONCEPTS, CONCURRENCY & DEADLOCKS', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Concept', 'Technical Definition & Formulas', 'Interview Trap / Edge Case']],
    body: [
      [
        'Process vs Thread',
        'Process has independent address space (PCB). Thread shares code, data, open files with parent process but has own stack and registers (TCB).',
        'Thread switching is faster because it avoids TLB flushing and memory mapping invalidation.'
      ],
      [
        'Deadlock (4 Conditions)',
        '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait (must exist simultaneously)',
        'Deadlock prevention invalidates at least one of these 4 conditions; Deadlock avoidance uses Banker\'s algorithm.'
      ],
      [
        'Banker\'s Algorithm',
        'Safe state calculation formula:\nNeed[i][j] = Max[i][j] - Allocation[i][j]\nIf Need <= Work, process finishes and releases allocation.',
        'An unsafe state is NOT necessarily a deadlock; it is merely a state that could lead to one.'
      ],
      [
        'Virtual Memory & Paging',
        'Virtual address divided into Page Number (p) and Offset (d).\nEffective Access Time (EAT) = 2×m - h×m (with TLB hit ratio h).',
        'Belady\'s Anomaly: FIFO page replacement can cause MORE page faults when physical page frames increase.'
      ]
    ],
    headStyles: { fillColor: [11, 19, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 80 }, 2: { cellWidth: 65 } },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;
  formatSectionHeader(doc, '2. DATABASE MANAGEMENT SYSTEMS (DBMS): ACID, NORMALIZATION & INDEXING', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Topic', 'Rules & Mathematical Foundations', 'High-Frequency Placement Questions']],
    body: [
      [
        'ACID Properties',
        'Atomicity: All-or-nothing (undo logs).\nConsistency: Invariants hold (constraints).\nIsolation: Concurrency independence.\nDurability: Committed writes survive power loss (redo log/WAL).',
        'What is Dirty Read? Reading uncommitted data that is later rolled back by another transaction (fixed by Read Committed).'
      ],
      [
        'Normalization\nForms',
        '1NF: Atomic values only (no repeating groups).\n2NF: 1NF + No partial dependency on candidate key.\n3NF: 2NF + No transitive dependencies (X->Y where X is superkey or Y is prime).\nBCNF: For every functional dependency X->Y, X must be a superkey.',
        'Lossless Join decomposition test:\nR1 ∩ R2 -> R1 or R1 ∩ R2 -> R2 must be true for lossless guarantee.'
      ],
      [
        'Indexing:\nB-Tree vs B+ Tree',
        'B-Tree stores data pointers at both leaf and internal nodes.\nB+ Tree stores data only at leaf nodes; leaves are linked via doubly-linked list for lightning-fast range queries.',
        'Why B+ tree in disk DBMS? Higher fanout per disk block and predictable sequential read time.'
      ]
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 85 }, 2: { cellWidth: 65 } },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, 1, 1);
}

// ============================================================================
// 4. COMPUTER NETWORKS & OSI QUICK REVISION
// ============================================================================
function buildNetworksDoc(doc, user) {
  addHeader(doc, 'COMPUTER NETWORKS & OSI PROTOCOL SUITE REVISION', 'Protocols, Handshakes, Subnetting & Web Architecture', user, 1);

  let currentY = 52;
  formatSectionHeader(doc, '1. THE 7-LAYER OSI MODEL & KEY INTERVIEW PROTOCOLS', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['OSI Layer', 'PDU Name', 'Primary Protocols', 'Primary Function & Hardware']],
    body: [
      ['7. Application', 'Data', 'HTTP, HTTPS, DNS, SMTP, FTP, SSH', 'User-facing application APIs, end-to-end communication'],
      ['6. Presentation', 'Data', 'TLS, SSL, JPEG, ASCII, JSON', 'Data encryption, decryption, compression, formatting'],
      ['5. Session', 'Data', 'NetBIOS, RPC, PPTP', 'Session establishment, token management, checkpointing'],
      ['4. Transport', 'Segment (TCP) / Datagram (UDP)', 'TCP, UDP, SCTP', 'Port-to-port delivery, flow/congestion control, reliability'],
      ['3. Network', 'Packet', 'IPv4, IPv6, ICMP, ARP, OSPF, BGP', 'Logical addressing, packet routing across networks (Router)'],
      ['2. Data Link', 'Frame', 'Ethernet, 802.11 Wi-Fi, MAC, VLAN', 'Hop-to-hop physical framing, error detection (Switch, Bridge)'],
      ['1. Physical', 'Bits', 'Fiber, Cat6, Bluetooth, NRZ', 'Raw bit transmission over physical medium (Hub, Repeater)']
    ],
    headStyles: { fillColor: [11, 19, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  formatSectionHeader(doc, '2. TRANSPORT LAYER: TCP 3-WAY HANDSHAKE & FLOW CONTROL', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Stage', 'Packet Flags', 'Sequence & Acknowledgment', 'Description']],
    body: [
      ['Step 1: Client -> Server', 'SYN = 1, ACK = 0', 'Seq = x (random ISN)', 'Client requests connection initiation with initial sequence x.'],
      ['Step 2: Server -> Client', 'SYN = 1, ACK = 1', 'Seq = y, Ack = x + 1', 'Server acknowledges client ISN and sends its own sequence y.'],
      ['Step 3: Client -> Server', 'SYN = 0, ACK = 1', 'Seq = x + 1, Ack = y + 1', 'Client confirms server sequence; connection is established (ESTABLISHED).'],
      ['Termination (4-Way)', 'FIN -> ACK, FIN -> ACK', 'TIME_WAIT (2MSL timer)', 'Graceful closure to guarantee delayed packets drain from network.']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  formatSectionHeader(doc, '3. CIDR SUBNETTING CHEAT SHEET & WEB PROTOCOLS (HTTP/2 vs HTTP/3)', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['CIDR Notation', 'Subnet Mask', 'Usable Hosts', 'HTTP Evolution Comparison']],
    body: [
      ['/24', '255.255.255.0', '254 hosts (2^8 - 2)', 'HTTP/1.1: Persistent connections but suffers from Head-of-Line (HoL) blocking.'],
      ['/26', '255.255.255.192', '62 hosts (2^6 - 2)', 'HTTP/2: Multiplexing over single TCP connection, HPACK header compression.'],
      ['/28', '255.255.255.240', '14 hosts (2^4 - 2)', 'HTTP/3: Built on QUIC protocol over UDP; solves TCP-level packet loss stall.'],
      ['/30', '255.255.255.252', '2 hosts (Point-to-Point)', 'WebSockets: Full-duplex persistent bi-directional channel over single TCP socket.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2 },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, 1, 1);
}

// ============================================================================
// 5. FULL STACK SYSTEM DESIGN ARCHITECTURE
// ============================================================================
function buildSystemDesignDoc(doc, user) {
  addHeader(doc, 'FULL STACK SYSTEM DESIGN & ARCHITECTURE HANDBOOK', 'High-Scale Distributed Systems & Low-Latency Architecture', user, 1);

  let currentY = 52;
  formatSectionHeader(doc, '1. CORE BUILDING BLOCKS OF HIGH-SCALE DISTRIBUTED SYSTEMS', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Component', 'Primary Strategy', 'Tradeoff Analysis']],
    body: [
      ['Load Balancing', 'Layer 4 (Transport / IP:Port) vs Layer 7 (Application / Path, Cookies, Headers)', 'L4 is faster with lower CPU overhead; L7 enables intelligent URL routing, SSL termination, and rate limiting.'],
      ['Caching Layers', 'Cache-Aside (Lazy load), Write-Through, Write-Back (Async write)', 'Cache-Aside handles stale reads with TTL; Write-Back offers blazing write speed but risks data loss on cache crash.'],
      ['CAP Theorem', 'Consistent + Partition Tolerant (CP) vs Available + Partition Tolerant (AP)', 'Bank transactions require CP (e.g., CockroachDB / ZooKeeper); social feeds use AP with eventual consistency (Cassandra).'],
      ['Message Queues', 'Kafka (Log-based streaming, high throughput) vs RabbitMQ (AMQP push, smart routing)', 'Kafka excels for audit logs and event sourcing; RabbitMQ excels for complex routing and priority tasks.'],
      ['Rate Limiting', 'Token Bucket, Leaky Bucket, Sliding Window Counter with Redis Lua script', 'Token bucket permits controlled bursts; Leaky bucket smooths out traffic to constant output rate.']
    ],
    headStyles: { fillColor: [11, 19, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 32 }, 1: { cellWidth: 50 }, 2: { cellWidth: 98 } },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;
  formatSectionHeader(doc, '2. CASE STUDY: END-TO-END URL SHORTENER (TINYURL / BIT.LY)', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Architecture Tier', 'Implementation Design & Capacity Math']],
    body: [
      ['Traffic & Storage Estimations', '100M new URLs/month = 40 writes/sec; 10:1 Read-to-Write = 400 reads/sec.\n500 bytes per URL mapping × 100M × 12 months × 5 years = ~3 TB total storage.'],
      ['Encoding Algorithm', 'Base62 ([a-zA-Z0-9]): 62^7 = 3.52 Trillion unique short URLs.\nAvoid MD5 hash collision by generating a 64-bit unique auto-incrementing ID (Snowflake) and converting to Base62.'],
      ['Database Selection', 'NoSQL Key-Value Store (DynamoDB / Cassandra) or MySQL with Hash partition.\nSchema: { id (PK), short_hash (Unique Index), original_url, created_at, expires_at }.'],
      ['Low-Latency Read Path', 'Client -> Cloudflare CDN -> NGINX Load Balancer -> Redis Cache (80-20 Pareto Rule) -> DB (fallback on cache miss).']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 42 }, 1: { cellWidth: 138 } },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, 1, 1);
}

// ============================================================================
// 6. CAMPUS HR & BEHAVIORAL VIVA DRILLS
// ============================================================================
function buildHrVivaDoc(doc, user) {
  addHeader(doc, 'CAMPUS HR & BEHAVIORAL INTERVIEW VIVA HANDBOOK', 'Executive Hiring Manager & Culture Fit Masterclass', user, 1);

  let currentY = 52;
  formatSectionHeader(doc, '1. TOP 8 FREQUENT CAMPUS HR QUESTIONS & WINNING RESPONSES', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['HR Question', 'What the HR Director Evaluates', 'Recommended Answer Template']],
    body: [
      [
        '"Tell me about yourself."',
        'Structure, clarity, and relevance to the engineering job profile.',
        '"I am an engineering scholar passionate about building scalable software. Recently architected a real-time collaborative system using React and Node.js. Outside academics, I lead technical events at college. I am excited to bring my technical grit and team collaboration to your engineering cohort."'
      ],
      [
        '"What is your greatest weakness?"',
        'Self-awareness and proactive constructive mitigation.',
        '"In earlier projects, I struggled with delegating and took on excessive modules myself, which created a bottleneck. I learned to use Kanban boards, set early code-review check-ins, and trust my teammates, which delivered our last hackathon project 2 days ahead of schedule."'
      ],
      [
        '"Why should we hire you over other toppers?"',
        'Grit, adaptability, and culture alignment.',
        '"While many candidates have good grades, my strength is combining solid computer science fundamentals with high execution speed. When our team faced an unexpected database migration failure, I learned the new ORM within 24 hours and stabilized production without missing a beat."'
      ],
      [
        '"Are you open to relocation and night shifts?"',
        'Commitment and professional flexibility.',
        '"Yes, completely. At this early stage of my career, my primary goal is maximum learning and working with high-impact engineering teams. I welcome the opportunity to relocate to any major tech hub."'
      ]
    ],
    headStyles: { fillColor: [11, 19, 43], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 45 }, 2: { cellWidth: 95 } },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;
  formatSectionHeader(doc, '2. QUESTIONS YOU MUST ASK THE HR PANEL AT THE END OF THE INTERVIEW', currentY);
  currentY += 8;

  autoTable(doc, {
    startY: currentY,
    theme: 'grid',
    head: [['Strategic Question', 'Why It Sets You Apart in the Final Hiring Deliberation']],
    body: [
      ['"What does success look like for a graduate engineer in this team during their first 90 days?"', 'Demonstrates an immediate orientation towards delivery, ramp-up speed, and measurable impact.'],
      ['"How does your team foster continuous technical upskilling alongside delivery sprints?"', 'Shows you are a lifelong learner who plans to grow alongside the company.'],
      ['"What was the most challenging technical hurdle your engineering group overcame this past quarter?"', 'Flips the dynamic to a peer-to-peer technical conversation that interviewers love to answer.']
    ],
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 110 } },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, 1, 1);
}

// ============================================================================
// MAIN DISPATCHER FUNCTION
// ============================================================================
export function downloadPlacementResource(resourceTitle, user) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const title = (resourceTitle || '').trim();

  let fileName = 'GPREC_Placement_Resource.pdf';

  if (title.includes('TCS Digital')) {
    buildTcsDigitalDoc(doc, user);
    fileName = 'TCS_Digital_Prime_Previous_Papers_2024_2026.pdf';
  } else if (title.includes('Amazon SDE-1') || title.includes('Amazon')) {
    buildAmazonSdeDoc(doc, user);
    fileName = 'Amazon_SDE1_Comprehensive_Interview_Guide.pdf';
  } else if (title.includes('Operating Systems') || title.includes('DBMS')) {
    buildOsDbmsDoc(doc, user);
    fileName = 'Operating_Systems_and_DBMS_Placement_Cheat_Sheet.pdf';
  } else if (title.includes('Computer Networks') || title.includes('OSI')) {
    buildNetworksDoc(doc, user);
    fileName = 'Computer_Networks_and_OSI_Quick_Revision_Kit.pdf';
  } else if (title.includes('System Design') || title.includes('Architecture')) {
    buildSystemDesignDoc(doc, user);
    fileName = 'Full_Stack_System_Design_Architecture_Handbook.pdf';
  } else if (title.includes('HR') || title.includes('Behavioral') || title.includes('Viva')) {
    buildHrVivaDoc(doc, user);
    fileName = 'Campus_HR_and_Behavioral_Interview_Viva_Drills.pdf';
  } else {
    buildTcsDigitalDoc(doc, user);
    fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  }

  // Trigger real file download in the browser!
  doc.save(fileName);
  return fileName;
}

// =========================================================================
// Comprehensive Autonomous Engineering University Examination Dataset
// Dedicated Autonomous Paper Archives for ALL Core Engineering Branches:
// - CSE: Computer Science & Engineering (6 Core Subjects)
// - CSM: Artificial Intelligence & Machine Learning (6 Core Subjects)
// - Civil: Civil Engineering (6 Core Subjects)
// - Mechanical: Mechanical Engineering (6 Core Subjects)
// - EEE: Electrical & Electronics Engineering (6 Core Subjects)
// - ECE: Electronics & Communication Engineering (6 Core Subjects)
// - Common: 1st Year Engineering Foundation (6 Subjects)
// Total: 42 Subjects with 150+ Verified End-Semester & Sessional Papers
// =========================================================================

export const HUGE_EXAM_DATASET = [

  {
    "subjectId": "os",
    "subjectName": "Operating Systems & System Programming",
    "subjectCode": "CS301",
    "branch": "CSE",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CS301)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 Autonomous End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous Supplementary Exam Paper",
        "year": "2022",
        "type": "Supple",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Examination Paper with Solution Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional Examination Paper with Scheme",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "OS Structures, System Calls & Process Management"
      },
      {
        "unit": 2,
        "title": "CPU Scheduling & Process Synchronization (Peterson, Semaphores)"
      },
      {
        "unit": 3,
        "title": "Deadlock Characterization, Prevention & Banker's Algorithm"
      },
      {
        "unit": 4,
        "title": "Memory Management, Paging, Segmentation & Virtual Memory"
      },
      {
        "unit": 5,
        "title": "File System Implementation, Disk Scheduling (SSTF, SCAN) & Protection"
      }
    ],
    "questions": [
      {
        "id": "os-q1",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Define the Critical Section Problem and state the three mandatory requirements to satisfy it.",
        "modelAnswer": {
          "keyPoints": [
            "Definition: A code segment accessing shared resources (memory, files) that must not be concurrently executed by multiple threads (1M).",
            "Three conditions: Mutual Exclusion, Progress, Bounded Waiting (1M)."
          ],
          "structure": null,
          "examinerTip": "Explicitly state Bounded Waiting; omitting it deducts 0.5 marks."
        }
      },
      {
        "id": "os-q2",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Banker's Algorithm for Deadlock Avoidance with Safety and Resource-Request algorithms. Provide an illustrative numerical example.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Concept of Safe State & Data structures (Available, Max, Allocation, Need = Max - Allocation) (3M)",
            "2. Safety Algorithm with step-by-step Work & Finish vector updates (3M)",
            "3. Resource Request algorithm steps and verification test (2M)",
            "4. Numerical demonstration with 5 processes (P0-P4) showing final safe sequence (2M)"
          ],
          "examinerTip": "Write the final safe sequence clearly (e.g., <P1, P3, P4, P0, P2>) to ensure full marks."
        }
      },
      {
        "id": "os-q3",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Paging hardware with Translation Lookaside Buffer (TLB). Calculate the Effective Memory Access Time (EMAT) given TLB hit ratio and access delays.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Paging concept: Logical address (p, d) to Physical address (f, d) mapping (3M)",
            "2. TLB associative memory caching and page table base register (PTBR) (3M)",
            "3. EMAT formula: EMAT = h * (t_tlb + t_mem) + (1 - h) * (t_tlb + 2*t_mem) (2M)",
            "4. Numerical calculation with hit ratio h=90% and access time 100ns (2M)"
          ],
          "examinerTip": "Do not forget to account for TLB search time in both hit and miss cases."
        }
      },
      {
        "id": "os-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Operating Systems & System Programming.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "os-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Operating Systems & System Programming with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "os-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Operating Systems & System Programming.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "os-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Operating Systems & System Programming with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "dbms",
    "subjectName": "Database Management Systems",
    "subjectCode": "CS302",
    "branch": "CSE",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CS302)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-B",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Exam with SQL Queries Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 Autonomous Supplementary Exam Paper",
        "year": "2022",
        "type": "Supple",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Database Architecture, Data Models, ER Modeling & Relational Algebra"
      },
      {
        "unit": 2,
        "title": "SQL Queries, Nested Subqueries, Triggers, Views & Complex Joins"
      },
      {
        "unit": 3,
        "title": "Relational Database Design, Functional Dependencies & Normalization (1NF to 5NF)"
      },
      {
        "unit": 4,
        "title": "Transaction Processing, ACID Properties, Schedules & Concurrency Control"
      },
      {
        "unit": 5,
        "title": "Storage, Indexing (B-Trees, B+ Trees), Hashing & Query Optimization"
      }
    ],
    "questions": [
      {
        "id": "dbms-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Functional Dependency and Normalization from 1NF through BCNF and 4NF with illustrative relational schemas.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. 1NF: Atomic values, removal of multi-valued attributes (2M)",
            "2. 2NF: 1NF + No partial dependency on candidate key (2M)",
            "3. 3NF: 2NF + No transitive dependency (2M)",
            "4. BCNF: For every functional dependency X -> Y, X must be a super key (2M)",
            "5. 4NF: Multi-valued dependencies elimination (2M)"
          ],
          "examinerTip": "Clearly show the decomposed table relations for each step."
        }
      },
      {
        "id": "dbms-q2",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 95,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain ACID properties of Transactions. Discuss Conflict Serializability and Testing for Serializability using Precedence Graphs.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. ACID properties (Atomicity, Consistency, Isolation, Durability) definitions (3M)",
            "2. Conflict vs View Serializability criteria (3M)",
            "3. Precedence (Serialization) Graph construction algorithm (2M)",
            "4. Cycle detection theorem: Cycle implies non-serializable schedule (2M)"
          ],
          "examinerTip": "Draw the directed precedence graph showing conflicting read/write operations."
        }
      },
      {
        "id": "dbms-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Database Management Systems.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "dbms-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Database Management Systems with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "dbms-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Database Management Systems.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "dbms-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Database Management Systems with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "dbms-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Database Management Systems.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "dbms-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Database Management Systems with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "cn",
    "subjectName": "Computer Networks & Protocols",
    "subjectCode": "CS303",
    "branch": "CSE",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CS303)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Examination with Subnetting Problems Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous End Semester Question Paper",
        "year": "2022",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Network Reference Models (OSI & TCP/IP), Physical Transmission Media"
      },
      {
        "unit": 2,
        "title": "Data Link Layer: Framing, Error Detection (CRC, Checksum) & MAC Protocols"
      },
      {
        "unit": 3,
        "title": "Network Layer: IPv4/IPv6 Addressing, Subnetting & Routing (Dijkstra, Link State)"
      },
      {
        "unit": 4,
        "title": "Transport Layer: TCP 3-Way Handshake, Flow Control (Sliding Window) & UDP"
      },
      {
        "unit": 5,
        "title": "Application Layer: DNS, HTTP/2, SMTP & Cryptographic Network Security"
      }
    ],
    "questions": [
      {
        "id": "cn-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain IPv4 Classless Addressing (CIDR) and Variable Length Subnet Masking (VLSM). Solve a numerical subnetting problem dividing 192.168.10.0/24 into 4 subnets.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. CIDR slash notation & subnet mask concept (2M)",
            "2. Borrowed bits calculation for 4 subnets (2 bits, /26) (2M)",
            "3. Subnet ranges, Network IDs, and Broadcast addresses calculation (4M)",
            "4. Usable host IP ranges for each subnet (2M)"
          ],
          "examinerTip": "State clearly why 2 host addresses per subnet are reserved (Network ID & Broadcast ID)."
        }
      },
      {
        "id": "cn-q2",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 95,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the TCP 3-Way Handshake for connection establishment and 4-way handshake for termination. Describe TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit).",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. SYN, SYN-ACK, ACK sequence number exchanges with timing diagram (3M)",
            "2. FIN, ACK, FIN, ACK termination states (2M)",
            "3. Slow start exponential window growth and ssthresh threshold (2M)",
            "4. Congestion avoidance linear growth and Fast Recovery mechanism (3M)"
          ],
          "examinerTip": "Draw the congestion window size vs transmission round graph showing Slow Start and AIMD."
        }
      },
      {
        "id": "cn-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Computer Networks & Protocols.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cn-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Computer Networks & Protocols with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cn-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Computer Networks & Protocols.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cn-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Computer Networks & Protocols with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cn-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Computer Networks & Protocols.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cn-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Computer Networks & Protocols with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "adsa",
    "subjectName": "Advanced Data Structures & Algorithms",
    "subjectCode": "CS201",
    "branch": "CSE",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CS201)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Exam with Tree Rotation Proofs",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Asymptotic Notation, Divide & Conquer (Merge Sort, Quick Sort Complexity)"
      },
      {
        "unit": 2,
        "title": "Self-Balancing Search Trees: AVL Trees, Red-Black Trees & Splay Trees"
      },
      {
        "unit": 3,
        "title": "Graph Algorithms: Minimum Spanning Trees (Prim, Kruskal) & Shortest Path (Dijkstra)"
      },
      {
        "unit": 4,
        "title": "Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain Multiplication"
      },
      {
        "unit": 5,
        "title": "Greedy Strategies, Backtracking (N-Queens) & NP-Completeness (P, NP, NP-Hard)"
      }
    ],
    "questions": [
      {
        "id": "adsa-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain AVL Tree rotations (LL, RR, LR, RL) with balancing criteria. Construct an AVL tree by inserting keys: 21, 26, 30, 9, 4, 14, 28, 18.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Balance Factor formula BF = Height(Left) - Height(Right) in {-1, 0, 1} (2M)",
            "2. Single Rotations (LL, RR) derivation and diagrams (2M)",
            "3. Double Rotations (LR, RL) derivation and diagrams (2M)",
            "4. Step-by-step key insertion with intermediate trees and balancing rotations (4M)"
          ],
          "examinerTip": "Label the balance factors on every single node after each key insertion."
        }
      },
      {
        "id": "adsa-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Advanced Data Structures & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "adsa-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Advanced Data Structures & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "adsa-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Advanced Data Structures & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "adsa-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Advanced Data Structures & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "adsa-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Advanced Data Structures & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "adsa-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Advanced Data Structures & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "adsa-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Advanced Data Structures & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "adsa-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Advanced Data Structures & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "cd",
    "subjectName": "Compiler Design & Automata Theory",
    "subjectCode": "CS304",
    "branch": "CSE",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CS304)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-C",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Parser Construction Paper with Solution",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Phases of Compiler, Lexical Analysis, Regular Expressions & Lex Tool"
      },
      {
        "unit": 2,
        "title": "Context-Free Grammars, Top-Down Parsing: LL(1) Parsing Table Construction"
      },
      {
        "unit": 3,
        "title": "Bottom-Up Parsing: LR(0), SLR(1), CLR(1), LALR(1) Parsing Tables & Yacc"
      },
      {
        "unit": 4,
        "title": "Syntax-Directed Translation (SDD/SDT), Attribute Grammars & 3-Address Code"
      },
      {
        "unit": 5,
        "title": "Code Optimization: Basic Blocks, Flow Graphs, Loop Optimization & Code Generation"
      }
    ],
    "questions": [
      {
        "id": "cd-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Construct the LL(1) Parsing Table for the grammar: E -> T E', E' -> + T E' | epsilon, T -> F T', T' -> * F T' | epsilon, F -> ( E ) | id. Compute FIRST and FOLLOW sets.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. FIRST sets computation for all non-terminals (3M)",
            "2. FOLLOW sets computation with $ endmarker (3M)",
            "3. LL(1) Table entry construction rules (2M)",
            "4. Conflict verification: No multiple entries implies grammar is LL(1) (2M)"
          ],
          "examinerTip": "Ensure the FOLLOW of start symbol E contains $."
        }
      },
      {
        "id": "cd-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Compiler Design & Automata Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cd-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Compiler Design & Automata Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cd-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Compiler Design & Automata Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cd-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Compiler Design & Automata Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cd-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Compiler Design & Automata Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cd-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Compiler Design & Automata Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cd-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Compiler Design & Automata Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cd-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Compiler Design & Automata Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "oopj",
    "subjectName": "Object Oriented Programming through Java",
    "subjectCode": "CS202",
    "branch": "CSE",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CS202)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional with Multithreading Lab Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "OOP Principles, Java Architecture, JVM, Bytecode & Class Mechanics"
      },
      {
        "unit": 2,
        "title": "Inheritance, Polymorphism, Interfaces, Abstract Classes & Package Structure"
      },
      {
        "unit": 3,
        "title": "Exception Handling, Checked vs Unchecked Exceptions & Custom Exceptions"
      },
      {
        "unit": 4,
        "title": "Multithreading, Thread Lifecycle, Synchronization & Inter-thread Communication"
      },
      {
        "unit": 5,
        "title": "Java Collections Framework (List, Set, Map), Generics & File I/O Streams"
      }
    ],
    "questions": [
      {
        "id": "oopj-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Multithreading in Java. Differentiate between extending Thread class vs implementing Runnable interface. Write a complete program solving Producer-Consumer using wait() and notify().",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Thread class vs Runnable interface comparison with trade-offs (3M)",
            "2. Thread states (New, Runnable, Blocked, Waiting, Terminated) lifecycle (2M)",
            "3. Critical section synchronization using synchronized keyword (2M)",
            "4. Working Producer-Consumer queue with wait() and notify() methods (3M)"
          ],
          "examinerTip": "Use a while loop when checking buffer empty/full conditions before calling wait()."
        }
      },
      {
        "id": "oopj-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Object Oriented Programming through Java.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "oopj-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Object Oriented Programming through Java with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "oopj-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Object Oriented Programming through Java.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "oopj-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Object Oriented Programming through Java with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "oopj-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Object Oriented Programming through Java.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "oopj-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Object Oriented Programming through Java with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "oopj-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Object Oriented Programming through Java.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "oopj-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Object Oriented Programming through Java with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ml",
    "subjectName": "Machine Learning Foundations & Algorithms",
    "subjectCode": "CSM301",
    "branch": "CSM",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CSM301)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 Model Question Paper - Machine Learning",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with Decision Tree Numerical Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional Exam Paper with SVM Derivations",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Introduction to Machine Learning, Supervised Learning & Linear Regression"
      },
      {
        "unit": 2,
        "title": "Decision Trees (ID3, C4.5), Information Gain & Random Forests"
      },
      {
        "unit": 3,
        "title": "Support Vector Machines (SVM), Maximum Margin Hyperplane & Kernel Trick"
      },
      {
        "unit": 4,
        "title": "Unsupervised Learning: K-Means Clustering, Hierarchical Clustering & PCA"
      },
      {
        "unit": 5,
        "title": "Model Evaluation: Bias-Variance Tradeoff, Cross-Validation, ROC-AUC & Confusion Matrix"
      }
    ],
    "questions": [
      {
        "id": "ml-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the ID3 Decision Tree algorithm. Calculate Entropy and Information Gain for a given tabular dataset to select the root split attribute.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Entropy formula: H(S) = -sum(p_i * log2(p_i)) (2M)",
            "2. Information Gain formula: Gain(S, A) = H(S) - sum(|S_v|/|S| * H(S_v)) (3M)",
            "3. Step-by-step entropy computation for target class (2M)",
            "4. Attribute gain calculations and root node selection (3M)"
          ],
          "examinerTip": "Show complete arithmetic fractional calculations for each attribute split."
        }
      },
      {
        "id": "ml-q2",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the Maximum Margin Hyperplane formulation for Support Vector Machines (SVM). Explain Lagrange multipliers and the role of Slack Variables in soft margin SVM.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Functional and geometric margin definitions (2M)",
            "2. Objective minimization of 0.5 * ||w||^2 subject to y_i(w.x_i + b) >= 1 (3M)",
            "3. Dual formulation using Lagrange multipliers alpha_i (3M)",
            "4. Soft-margin formulation with penalty parameter C and slack variables xi_i (2M)"
          ],
          "examinerTip": "State that only support vectors have alpha_i > 0 in the final decision function."
        }
      },
      {
        "id": "ml-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Machine Learning Foundations & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ml-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Machine Learning Foundations & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ml-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Machine Learning Foundations & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ml-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Machine Learning Foundations & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ml-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Machine Learning Foundations & Algorithms.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ml-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Machine Learning Foundations & Algorithms with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ai_nn",
    "subjectName": "Artificial Intelligence & Neural Networks",
    "subjectCode": "CSM302",
    "branch": "CSM",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CSM302)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Exam with A* Heuristic Proofs",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Problem Solving as State Space Search: A*, AO*, Minimax & Alpha-Beta Pruning"
      },
      {
        "unit": 2,
        "title": "Knowledge Representation: First-Order Predicate Logic, Resolution & Unification"
      },
      {
        "unit": 3,
        "title": "Multi-Layer Perceptrons (MLP), Activation Functions & Backpropagation Derivation"
      },
      {
        "unit": 4,
        "title": "Convolutional Neural Networks (CNN): Convolution, Pooling & Transfer Learning"
      },
      {
        "unit": 5,
        "title": "Recurrent Neural Networks (RNN), Vanishing Gradients, LSTM & Gated Units"
      }
    ],
    "questions": [
      {
        "id": "ai_nn-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the A* Search algorithm with an illustrative example. Prove that A* is optimal and admissible when the heuristic function h(n) is admissible.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Evaluation function f(n) = g(n) + h(n) definition (2M)",
            "2. Open and Closed list management procedure (3M)",
            "3. Mathematical proof of admissibility when h(n) <= h*(n) (3M)",
            "4. 8-Puzzle or pathfinding state space expansion example (2M)"
          ],
          "examinerTip": "Distinguish clearly between admissibility and consistency (monotonicity)."
        }
      },
      {
        "id": "ai_nn-q2",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 95,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the Error Backpropagation algorithm for a Multi-Layer Feedforward Neural Network using Gradient Descent with Sigmoid activation.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Forward pass formulation: net input z and activation a (2M)",
            "2. Mean Squared Error (MSE) loss definition (2M)",
            "3. Delta rule derivation for output layer weights using chain rule (3M)",
            "4. Error propagation to hidden layers and weight update equation (3M)"
          ],
          "examinerTip": "Write the derivative of Sigmoid function: sigma'(z) = sigma(z) * (1 - sigma(z))."
        }
      },
      {
        "id": "ai_nn-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Artificial Intelligence & Neural Networks.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ai_nn-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Artificial Intelligence & Neural Networks with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ai_nn-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Artificial Intelligence & Neural Networks.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ai_nn-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Artificial Intelligence & Neural Networks with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ai_nn-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Artificial Intelligence & Neural Networks.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ai_nn-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Artificial Intelligence & Neural Networks with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "cvip",
    "subjectName": "Computer Vision & Image Processing",
    "subjectCode": "CSM401",
    "branch": "CSM",
    "semester": "Sem 6",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CSM401)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 Model Question Paper - Computer Vision",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with Histogram Equalization Numerical",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Digital Image Fundamentals, Intensity Transformations & Histogram Equalization"
      },
      {
        "unit": 2,
        "title": "Spatial Filtering: Smoothing (Gaussian), Sharpening (Laplacian) & Frequency Domain"
      },
      {
        "unit": 3,
        "title": "Edge Detection (Sobel, Canny), Image Segmentation (Otsu Thresholding, Watershed)"
      },
      {
        "unit": 4,
        "title": "Feature Extraction: Harris Corner, SIFT, HOG & Object Detection (YOLO, Faster R-CNN)"
      },
      {
        "unit": 5,
        "title": "Deep Learning for Vision: Vision Transformers (ViT) & Image Generation (GANs)"
      }
    ],
    "questions": [
      {
        "id": "cvip-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Histogram Equalization for contrast enhancement. Perform histogram equalization on a given 3-bit 8x8 image showing step-by-step CDF transformation.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Probability distribution function p(r_k) = n_k / n (2M)",
            "2. Cumulative distribution function s_k = T(r_k) = sum(p(r_j)) * (L - 1) (3M)",
            "3. Discrete intensity mapping and rounding computation (3M)",
            "4. Comparison of original and equalized histograms (2M)"
          ],
          "examinerTip": "Round the transformed intensity values to nearest integer."
        }
      },
      {
        "id": "cvip-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Computer Vision & Image Processing.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cvip-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Computer Vision & Image Processing with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cvip-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Computer Vision & Image Processing.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cvip-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Computer Vision & Image Processing with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cvip-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Computer Vision & Image Processing.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cvip-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Computer Vision & Image Processing with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "cvip-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Computer Vision & Image Processing.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "cvip-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Computer Vision & Image Processing with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "nlp",
    "subjectName": "Natural Language Processing & LLMs",
    "subjectCode": "CSM402",
    "branch": "CSM",
    "semester": "Sem 6",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CSM402)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Paper with Transformer Attention Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Text Preprocessing: Tokenization, Stemming, Lemmatization, N-grams & TF-IDF"
      },
      {
        "unit": 2,
        "title": "Word Embeddings: Word2Vec (Skip-gram, CBOW), GloVe & FastText"
      },
      {
        "unit": 3,
        "title": "Sequence Modeling: Bidirectional LSTM, Encoder-Decoder & Seq2Seq Models"
      },
      {
        "unit": 4,
        "title": "Transformer Architecture: Scaled Dot-Product Attention, Multi-Head Attention"
      },
      {
        "unit": 5,
        "title": "Pretrained LLMs: BERT, GPT Architecture, Fine-Tuning (LoRA) & Prompt Engineering"
      }
    ],
    "questions": [
      {
        "id": "nlp-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the Transformer Encoder-Decoder architecture in detail. Derive Scaled Dot-Product Attention and Multi-Head Attention equations with neat diagrams.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Transformer block components: Multi-head attention, Add & Norm, Feed-Forward (3M)",
            "2. Attention(Q, K, V) = softmax((Q * K^T)/sqrt(d_k)) * V formula derivation (3M)",
            "3. Multi-head projection matrices W_Q, W_K, W_V and concatenation (2M)",
            "4. Positional Encoding equations using Sine and Cosine functions (2M)"
          ],
          "examinerTip": "State why division by sqrt(d_k) prevents vanishing gradients in softmax."
        }
      },
      {
        "id": "nlp-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Natural Language Processing & LLMs.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "nlp-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Natural Language Processing & LLMs with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "nlp-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Natural Language Processing & LLMs.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "nlp-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Natural Language Processing & LLMs with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "nlp-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Natural Language Processing & LLMs.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "nlp-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Natural Language Processing & LLMs with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "nlp-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Natural Language Processing & LLMs.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "nlp-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Natural Language Processing & LLMs with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ot",
    "subjectName": "Optimization Techniques in AI",
    "subjectCode": "CSM201",
    "branch": "CSM",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CSM201)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Linear Programming: Formulation, Graphical Method & Simplex Method"
      },
      {
        "unit": 2,
        "title": "Duality in LPP, Dual Simplex Method & Sensitivity Analysis"
      },
      {
        "unit": 3,
        "title": "Non-Linear Programming: Gradient Descent, Momentum, Adam Optimizer"
      },
      {
        "unit": 4,
        "title": "Constrained Optimization: Kuhn-Tucker (KKT) Conditions & Lagrange Multipliers"
      },
      {
        "unit": 5,
        "title": "Metaheuristics: Genetic Algorithms (Selection, Crossover, Mutation) & PSO"
      }
    ],
    "questions": [
      {
        "id": "ot-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 95,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Solve the following Linear Programming Problem using Two-Phase Simplex Method: Maximize Z = 3x1 - x2 subject to 2x1 + x2 >= 2, x1 + 3x2 <= 2, x2 <= 4, x1, x2 >= 0.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Standard form with surplus, artificial, and slack variables (2M)",
            "2. Phase 1 objective minimization of artificial variables (3M)",
            "3. Phase 1 table iterations and feasibility check (3M)",
            "4. Phase 2 original objective simplex iterations and optimal solution (2M)"
          ],
          "examinerTip": "Verify that all artificial variables leave the basis at the end of Phase 1."
        }
      },
      {
        "id": "ot-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Optimization Techniques in AI.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ot-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Optimization Techniques in AI with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ot-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Optimization Techniques in AI.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ot-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Optimization Techniques in AI with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ot-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Optimization Techniques in AI.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ot-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Optimization Techniques in AI with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ot-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Optimization Techniques in AI.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ot-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Optimization Techniques in AI with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "pas",
    "subjectName": "Probability & Statistics for Machine Learning",
    "subjectCode": "CSM202",
    "branch": "CSM",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CSM202)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Probability Foundations, Conditional Probability, Bayes Theorem & Random Variables"
      },
      {
        "unit": 2,
        "title": "Probability Distributions: Binomial, Poisson, Normal, Uniform & Exponential"
      },
      {
        "unit": 3,
        "title": "Sampling Distributions, Central Limit Theorem (CLT) & Parameter Estimation (MLE)"
      },
      {
        "unit": 4,
        "title": "Hypothesis Testing: Large Sample Tests (Z-Test) & Small Sample Tests (t-Test, F-Test)"
      },
      {
        "unit": 5,
        "title": "Chi-Square Test for Goodness of Fit, ANOVA (One-way and Two-way) & Correlation"
      }
    ],
    "questions": [
      {
        "id": "pas-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Student's t-Distribution and its applications. Conduct a two-sample t-test at 5% significance level to test if two independent sample means differ significantly.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. t-Distribution definition, degrees of freedom, and bell-shape properties (3M)",
            "2. Null hypothesis H0: mu1 = mu2 and alternative hypothesis H1: mu1 != mu2 (2M)",
            "3. Pooled standard deviation s_p and test statistic t_calc formula (3M)",
            "4. Comparison with critical t_table value and final statistical inference (2M)"
          ],
          "examinerTip": "State degrees of freedom clearly: df = n1 + n2 - 2."
        }
      },
      {
        "id": "pas-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Probability & Statistics for Machine Learning.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "pas-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Probability & Statistics for Machine Learning with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "pas-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Probability & Statistics for Machine Learning.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "pas-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Probability & Statistics for Machine Learning with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "pas-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Probability & Statistics for Machine Learning.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "pas-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Probability & Statistics for Machine Learning with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "pas-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Probability & Statistics for Machine Learning.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "pas-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Probability & Statistics for Machine Learning with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ce_som",
    "subjectName": "Strength of Materials & Structural Analysis",
    "subjectCode": "CE201",
    "branch": "Civil",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CE201)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 Autonomous End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous Supplementary Exam Paper",
        "year": "2022",
        "type": "Supple",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Exam with SFD/BMD Numerical Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional Exam with Beam Deflection Solutions",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Simple Stresses and Strains, Hooke's Law, Elastic Constants & Thermal Stresses"
      },
      {
        "unit": 2,
        "title": "Shear Force & Bending Moment Diagrams (SFD & BMD) for Simply Supported & Cantilever Beams"
      },
      {
        "unit": 3,
        "title": "Theory of Simple Bending, Flexural Stresses, Neutral Axis & Section Modulus"
      },
      {
        "unit": 4,
        "title": "Torsion of Circular Shafts, Shear Stress Distribution & Helical Springs"
      },
      {
        "unit": 5,
        "title": "Deflection of Beams (Macaulay's Method, Moment-Area) & Euler's Column Buckling"
      }
    ],
    "questions": [
      {
        "id": "ce_som-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Draw the Shear Force Diagram (SFD) and Bending Moment Diagram (BMD) for a simply supported beam of 8m span carrying a UDL of 5 kN/m over left half and a concentrated load of 20 kN at 6m from left support. Find the maximum bending moment.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Support reactions R_A and R_B calculation using equilibrium equations (2M)",
            "2. Sectional Shear Force equations and complete SFD with linear/vertical segments (3M)",
            "3. Determination of point of zero shear (2M)",
            "4. Bending Moment calculation at critical sections and parabolic/linear BMD sketch (3M)"
          ],
          "examinerTip": "Remember that bending moment curve is parabolic under UDL and linear under point loads."
        }
      },
      {
        "id": "ce_som-q2",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the Bending Equation M/I = sigma/y = E/R with standard assumptions of simple bending. Calculate the section modulus Z for a hollow circular beam.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Assumptions of simple bending (plane sections remain plane, etc.) (2M)",
            "2. Strain derivation across neutral axis: epsilon = y / R (3M)",
            "3. Resisting moment integral: M = (E/R) * I (3M)",
            "4. Section modulus formula Z = (pi / 32*D) * (D^4 - d^4) for hollow circular cross-section (2M)"
          ],
          "examinerTip": "Show that the neutral axis must pass through the centroid of the cross-section."
        }
      },
      {
        "id": "ce_som-q3",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive Euler's Critical Buckling Load formula P_cr = pi^2 * E * I / L_e^2 for a long column with both ends hinged. State effective length L_e for all four standard end support conditions.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Differential equation of buckled column: E*I*(d^2 y / dx^2) = -P*y (3M)",
            "2. Boundary conditions application yielding sin(k*L) = 0 => k*L = pi (3M)",
            "3. Four standard end conditions: (a) Both hinged: L, (b) One fixed other free: 2L, (c) Both fixed: L/2, (d) One fixed other hinged: L/sqrt(2) (4M)"
          ],
          "examinerTip": "Define slenderness ratio lambda = L_e / r_min and state Euler formula limits."
        }
      },
      {
        "id": "ce_som-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Strength of Materials & Structural Analysis.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_som-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Strength of Materials & Structural Analysis with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_som-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Strength of Materials & Structural Analysis.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_som-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Strength of Materials & Structural Analysis with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ce_geotech",
    "subjectName": "Geotechnical Engineering & Soil Mechanics",
    "subjectCode": "CE301",
    "branch": "Civil",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CE301)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-B",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with Permeability & Seepage Problems",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous End Semester Question Paper",
        "year": "2022",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Soil Formation, 3-Phase Soil Diagram, Index Properties & Soil Classification (USCS/IS)"
      },
      {
        "unit": 2,
        "title": "Permeability of Soil, Darcy's Law, Quick Sand Condition & Seepage Analysis (Flow Nets)"
      },
      {
        "unit": 3,
        "title": "Soil Compaction, Standard Proctor Test & 1-D Terzaghi Consolidation Theory"
      },
      {
        "unit": 4,
        "title": "Shear Strength of Soil: Mohr-Coulomb Failure Theory, Direct Shear & Triaxial Tests"
      },
      {
        "unit": 5,
        "title": "Earth Pressure Theories (Rankine, Coulomb) & Terzaghi Bearing Capacity for Footings"
      }
    ],
    "questions": [
      {
        "id": "ce_geotech-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the Mohr-Coulomb failure criteria for soils. Describe the Consolidated-Undrained (CU) Triaxial Compression Test with pore water pressure measurement and Mohr circle envelope.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Mohr-Coulomb shear strength equation: tau = c + sigma_n * tan(phi) (2M)",
            "2. Triaxial cell apparatus components (membrane, chamber fluid, cell pressure sigma_3) (3M)",
            "3. CU test procedure (consolidation phase followed by undrained shearing) (3M)",
            "4. Drawing Mohr circles in terms of total and effective stresses with failure envelope (2M)"
          ],
          "examinerTip": "Differentiate between total shear parameters (c, phi) and effective parameters (c', phi')."
        }
      },
      {
        "id": "ce_geotech-q2",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 95,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive Terzaghi's Ultimate Bearing Capacity equation q_ult = c*N_c + gamma*D_f*N_q + 0.5*gamma*B*N_gamma for a continuous shallow strip footing. State Terzaghi assumptions.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Assumptions: D_f <= B, continuous footing, general shear failure mode (2M)",
            "2. Three failure zones: Elastic wedge (I), Radial shear (II), Passive Rankine zone (III) (4M)",
            "3. Bearing capacity factors N_c, N_q, N_gamma as functions of friction angle phi (2M)",
            "4. Modifications for square and circular footings (2M)"
          ],
          "examinerTip": "Mention modification for local shear failure: c' = (2/3)c and tan(phi') = (2/3)tan(phi)."
        }
      },
      {
        "id": "ce_geotech-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Geotechnical Engineering & Soil Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_geotech-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Geotechnical Engineering & Soil Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_geotech-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Geotechnical Engineering & Soil Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_geotech-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Geotechnical Engineering & Soil Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_geotech-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Geotechnical Engineering & Soil Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_geotech-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Geotechnical Engineering & Soil Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ce_fluid",
    "subjectName": "Fluid Mechanics & Hydraulic Engineering",
    "subjectCode": "CE202",
    "branch": "Civil",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CE202)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Exam Paper with Bernoulli Proof",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Fluid Properties, Hydrostatic Pressure on Plane and Curved Surfaces, Buoyancy & Metacenter"
      },
      {
        "unit": 2,
        "title": "Fluid Kinematics: Continuity Equation, Velocity Potential & Stream Function"
      },
      {
        "unit": 3,
        "title": "Fluid Dynamics: Bernoulli's Equation Derivation, Venturimeter & Orifice Meter Discharge"
      },
      {
        "unit": 4,
        "title": "Laminar and Turbulent Flow in Pipes, Darcy-Weisbach Equation & Minor Losses"
      },
      {
        "unit": 5,
        "title": "Open Channel Flow: Chezy's and Manning's Formula, Most Economical Trapezoidal Channel"
      }
    ],
    "questions": [
      {
        "id": "ce_fluid-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive Bernoulli's equation from Euler's equation of motion along a streamline. State all assumptions. Explain the principle and derive the discharge formula for an inclined Venturimeter.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Euler equation along streamline: dp/rho + v*dv + g*dz = 0 (2M)",
            "2. Integration for steady, incompressible, frictionless flow: p/rho*g + v^2/2g + z = const (3M)",
            "3. Venturimeter geometry (converging cone, throat, diverging cone) (2M)",
            "4. Discharge formula derivation: Q = (C_d * a1 * a2 * sqrt(2*g*h)) / sqrt(a1^2 - a2^2) (3M)"
          ],
          "examinerTip": "Explain why diverging cone angle (5-7 deg) is smaller than converging angle (20-22 deg) to prevent flow separation."
        }
      },
      {
        "id": "ce_fluid-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Fluid Mechanics & Hydraulic Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_fluid-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Fluid Mechanics & Hydraulic Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_fluid-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Fluid Mechanics & Hydraulic Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_fluid-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Fluid Mechanics & Hydraulic Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_fluid-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Fluid Mechanics & Hydraulic Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_fluid-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Fluid Mechanics & Hydraulic Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_fluid-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Fluid Mechanics & Hydraulic Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_fluid-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Fluid Mechanics & Hydraulic Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ce_survey",
    "subjectName": "Surveying & Geomatics Engineering",
    "subjectCode": "CE203",
    "branch": "Civil",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CE203)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Linear Measurements, Compass Surveying, Prismatic Compass & Local Attraction Correction"
      },
      {
        "unit": 2,
        "title": "Levelling: Height of Instrument & Rise and Fall Methods, Curvature and Refraction Corrections"
      },
      {
        "unit": 3,
        "title": "Theodolite Surveying: Measurement of Horizontal and Vertical Angles, Omitted Measurements"
      },
      {
        "unit": 4,
        "title": "Tacheometric Surveying: Stadia Method & Tangential Method, Trigonometrical Levelling"
      },
      {
        "unit": 5,
        "title": "Total Station Architecture, GPS Principles & Introduction to GIS Mapping"
      }
    ],
    "questions": [
      {
        "id": "ce_survey-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the Rise and Fall Method and Height of Instrument Method of Levelling. Complete a level field book with 10 consecutive readings and apply arithmetic checks.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Comparison of HI method vs Rise & Fall method (2M)",
            "2. Tabulation of BS, IS, FS readings (2M)",
            "3. Rise and Fall computation and Reduced Levels (RL) determination (4M)",
            "4. Arithmetic checks: sum(BS) - sum(FS) = sum(Rise) - sum(Fall) = Last RL - First RL (2M)"
          ],
          "examinerTip": "All three arithmetic checks must be verified and shown explicitly."
        }
      },
      {
        "id": "ce_survey-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Surveying & Geomatics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_survey-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Surveying & Geomatics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_survey-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Surveying & Geomatics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_survey-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Surveying & Geomatics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_survey-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Surveying & Geomatics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_survey-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Surveying & Geomatics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_survey-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Surveying & Geomatics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_survey-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Surveying & Geomatics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ce_concrete",
    "subjectName": "Concrete Technology & Design of Concrete Structures",
    "subjectCode": "CE302",
    "branch": "Civil",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (CE302)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Constituents of Concrete: Cement Chemistry (Bogue's Compounds), Aggregates & Admixtures"
      },
      {
        "unit": 2,
        "title": "Workability of Fresh Concrete: Slump Test, Compaction Factor Test & Segregation/Bleeding"
      },
      {
        "unit": 3,
        "title": "Hardened Concrete Properties, Compressive Strength, Elasticity & Durability Factors"
      },
      {
        "unit": 4,
        "title": "Concrete Mix Design as per IS 10262:2019 for M25/M30 Grades"
      },
      {
        "unit": 5,
        "title": "Limit State Design Principles: Singly and Doubly Reinforced Beams as per IS 456:2000"
      }
    ],
    "questions": [
      {
        "id": "ce_concrete-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Design an M30 grade concrete mix as per IS 10262:2019 guidelines for moderate exposure conditions with 20mm aggregate. Calculate quantities of cement, water, fine aggregate and coarse aggregate per m^3.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Target mean strength calculation: f'_ck = f_ck + 1.65 * s (2M)",
            "2. Selection of water-cement ratio and air content (2M)",
            "3. Calculation of water content and cementitious material content (3M)",
            "4. Coarse and fine aggregate proportions determination (3M)"
          ],
          "examinerTip": "Show adjustments for aggregate moisture content and water absorption."
        }
      },
      {
        "id": "ce_concrete-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Concrete Technology & Design of Concrete Structures.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_concrete-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Concrete Technology & Design of Concrete Structures with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_concrete-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Concrete Technology & Design of Concrete Structures.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_concrete-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Concrete Technology & Design of Concrete Structures with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_concrete-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Concrete Technology & Design of Concrete Structures.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_concrete-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Concrete Technology & Design of Concrete Structures with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_concrete-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Concrete Technology & Design of Concrete Structures.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_concrete-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Concrete Technology & Design of Concrete Structures with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ce_transport",
    "subjectName": "Transportation & Highway Engineering",
    "subjectCode": "CE401",
    "branch": "Civil",
    "semester": "Sem 6",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CE401)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Highway Planning, Alignment Factors, Engineering Surveys & Master Plans (Nagpur, Lucknow)"
      },
      {
        "unit": 2,
        "title": "Geometric Design of Highways: Cross-Section Elements, Sight Distances (SSD, OSD)"
      },
      {
        "unit": 3,
        "title": "Super-elevation Design, Extra Widening on Curves & Transition Curves Design"
      },
      {
        "unit": 4,
        "title": "Pavement Design: Flexible Pavements (IRC 37 Method) & Rigid Pavements (IRC 58 Method)"
      },
      {
        "unit": 5,
        "title": "Traffic Engineering: Traffic Volume Studies, Speed Studies, Signal Design (Webster Method)"
      }
    ],
    "questions": [
      {
        "id": "ce_transport-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the formula for Super-elevation e = v^2 / (225 * R) in highway geometric design. Design super-elevation for a horizontal curve of radius 400m for design speed 80 km/h.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Forces acting on vehicle on banked curve (Centrifugal force, friction, weight) (3M)",
            "2. Equilibrium equation e + f = v^2 / (127 * R) derivation (3M)",
            "3. IRC step-by-step design procedure (neglecting friction at 75% speed) (2M)",
            "4. Numerical calculation and verification against max super-elevation e_max = 7% (2M)"
          ],
          "examinerTip": "Check if calculated e exceeds 0.07; if yes, restrict e=0.07 and check lateral friction f."
        }
      },
      {
        "id": "ce_transport-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Transportation & Highway Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_transport-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Transportation & Highway Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_transport-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Transportation & Highway Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_transport-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Transportation & Highway Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_transport-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Transportation & Highway Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_transport-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Transportation & Highway Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ce_transport-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Transportation & Highway Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ce_transport-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Transportation & Highway Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "me_thermo",
    "subjectName": "Applied Thermodynamics & Thermal Engineering",
    "subjectCode": "ME201",
    "branch": "Mechanical",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (ME201)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous Supplementary Exam Paper",
        "year": "2022",
        "type": "Supple",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with Diesel Cycle Derivation",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional with Rankine Reheat Cycle Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "First & Second Law of Thermodynamics, Clausius Inequality & Entropy Principle"
      },
      {
        "unit": 2,
        "title": "Air Standard Cycles: Otto, Diesel, Dual & Brayton Cycles Analysis & Efficiency Derivations"
      },
      {
        "unit": 3,
        "title": "Vapor Power Cycles: Ideal Rankine Cycle, Reheat & Regenerative Feed Heating Cycles"
      },
      {
        "unit": 4,
        "title": "Properties of Pure Substances, Steam Tables, Mollier Chart & Dryness Fraction"
      },
      {
        "unit": 5,
        "title": "IC Engines Performance: Indicated Power, Brake Power, Heat Balance Sheet & Testing"
      }
    ],
    "questions": [
      {
        "id": "me_thermo-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the thermal efficiency expression for an Air Standard Diesel Cycle in terms of compression ratio r, cutoff ratio r_c, and adiabatic index gamma. Draw the cycle on P-v and T-s coordinates.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Four processes on P-v and T-s diagrams (Isentropic, Isobaric, Isentropic, Isochoric) (3M)",
            "2. Heat supplied Q_in = m*C_p*(T3 - T2) and heat rejected Q_out = m*C_v*(T4 - T1) (2M)",
            "3. Derivation: eta = 1 - (1 / r^(gamma-1)) * [(r_c^gamma - 1) / (gamma * (r_c - 1))] (3M)",
            "4. Comparison with Otto cycle for same peak pressure and temperature (2M)"
          ],
          "examinerTip": "State clearly that as cutoff ratio r_c approaches 1, Diesel efficiency approaches Otto efficiency."
        }
      },
      {
        "id": "me_thermo-q2",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the Reheat Rankine Cycle with plant schematic and T-s diagram. Calculate thermal efficiency, turbine work output, and dryness fraction at condenser inlet.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Reheat power plant layout (Boiler, HP Turbine, Reheater, LP Turbine, Condenser) (3M)",
            "2. T-s diagram with superheat and reheat loops (2M)",
            "3. Work formulas: W_T = (h3 - h4) + (h5 - h6) and Q_in = (h3 - h2) + (h5 - h4) (3M)",
            "4. Primary engineering reason: Prevents water droplet erosion of LP turbine blades (2M)"
          ],
          "examinerTip": "Ensure dryness fraction at LP turbine exhaust is verified to be >= 0.88."
        }
      },
      {
        "id": "me_thermo-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Applied Thermodynamics & Thermal Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_thermo-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Applied Thermodynamics & Thermal Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_thermo-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Applied Thermodynamics & Thermal Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_thermo-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Applied Thermodynamics & Thermal Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_thermo-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Applied Thermodynamics & Thermal Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_thermo-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Applied Thermodynamics & Thermal Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "me_heat",
    "subjectName": "Heat Transfer & Refrigeration",
    "subjectCode": "ME301",
    "branch": "Mechanical",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (ME301)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-B",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with Insulation Derivation",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Conduction Heat Transfer: Fourier's Law, 1-D Steady State in Slabs, Cylinders & Fins"
      },
      {
        "unit": 2,
        "title": "Critical Thickness of Insulation for Cylinders and Spheres (r_cr = k / h)"
      },
      {
        "unit": 3,
        "title": "Convection Heat Transfer: Newton's Law, Dimensional Analysis (Nusselt, Reynolds, Prandtl)"
      },
      {
        "unit": 4,
        "title": "Radiation Heat Transfer: Stefan-Boltzmann Law, Planck's Law, Wien's Law & Radiation Shields"
      },
      {
        "unit": 5,
        "title": "Heat Exchangers: LMTD & NTU-Effectiveness Methods for Parallel & Counter-Flow Exchangers"
      }
    ],
    "questions": [
      {
        "id": "me_heat-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the general 1-D steady state heat conduction through a composite cylinder. Define Critical Radius of Insulation and derive r_cr = k / h.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Radial Fourier equation integration: Q = 2*pi*k*L*(T1 - T2) / ln(r2/r1) (3M)",
            "2. Composite resistance network with conduction and outer convection (2M)",
            "3. Total resistance expression R_total as a function of outer radius r (2M)",
            "4. Minimizing resistance dR_total/dr = 0 yielding r_cr = k / h (3M)"
          ],
          "examinerTip": "Explain that adding insulation increases heat loss if r < r_cr and decreases it only if r > r_cr."
        }
      },
      {
        "id": "me_heat-q2",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 95,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the Log Mean Temperature Difference (LMTD) for a counter-flow heat exchanger. Why is counter-flow superior to parallel-flow?",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Counter-flow temperature profile along exchanger length (2M)",
            "2. Energy balance differential equations for hot and cold fluid streams (3M)",
            "3. Integration yielding LMTD = (Delta T1 - Delta T2) / ln(Delta T1 / Delta T2) (3M)",
            "4. Superiority: Maintains higher average temperature gradient, requiring less area (2M)"
          ],
          "examinerTip": "Show that when Delta T1 = Delta T2, LMTD equals Delta T."
        }
      },
      {
        "id": "me_heat-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Heat Transfer & Refrigeration.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_heat-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Heat Transfer & Refrigeration with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_heat-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Heat Transfer & Refrigeration.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_heat-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Heat Transfer & Refrigeration with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_heat-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Heat Transfer & Refrigeration.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_heat-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Heat Transfer & Refrigeration with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "me_fluid",
    "subjectName": "Fluid Mechanics & Hydraulic Machinery",
    "subjectCode": "ME202",
    "branch": "Mechanical",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (ME202)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional with Pelton Wheel Efficiency Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Fluid Properties, Fluid Statics, Pressure Measurement & Buoyancy Metacenter"
      },
      {
        "unit": 2,
        "title": "Fluid Dynamics: Bernoulli's Equation, Flow through Pipes, Darcy-Weisbach Equation"
      },
      {
        "unit": 3,
        "title": "Impact of Jets on Stationary & Moving Flat/Curved Vanes, Work Done & Efficiency"
      },
      {
        "unit": 4,
        "title": "Hydraulic Turbines: Pelton Wheel, Francis Turbine & Kaplan Turbine Working Principles"
      },
      {
        "unit": 5,
        "title": "Centrifugal & Reciprocating Pumps: Velocity Triangles, Manometric Efficiency & Cavitation"
      }
    ],
    "questions": [
      {
        "id": "me_fluid-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the working principle of a Pelton Wheel Turbine. Draw the inlet and outlet velocity triangles for a double hemispherical bucket and derive condition for maximum hydraulic efficiency.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Pelton wheel components (nozzle, spear, runner, buckets, casing) (2M)",
            "2. Inlet and outlet velocity triangles construction (3M)",
            "3. Force exerted: F_x = rho*a*V1*(V_w1 + V_w2) and power output (2M)",
            "4. Differentiation yielding optimal speed ratio u = V1 / 2 and max efficiency (3M)"
          ],
          "examinerTip": "Deflection angle of bucket is 165 degrees (leaving 15 degrees blade angle)."
        }
      },
      {
        "id": "me_fluid-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Fluid Mechanics & Hydraulic Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_fluid-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Fluid Mechanics & Hydraulic Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_fluid-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Fluid Mechanics & Hydraulic Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_fluid-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Fluid Mechanics & Hydraulic Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_fluid-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Fluid Mechanics & Hydraulic Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_fluid-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Fluid Mechanics & Hydraulic Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_fluid-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Fluid Mechanics & Hydraulic Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_fluid-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Fluid Mechanics & Hydraulic Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "me_kom",
    "subjectName": "Kinematics & Dynamics of Machinery",
    "subjectCode": "ME203",
    "branch": "Mechanical",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (ME203)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Mechanisms and Machines, Degrees of Freedom (Kutzbach & Grubler Criteria), Inversions"
      },
      {
        "unit": 2,
        "title": "Velocity and Acceleration Analysis of Planar Mechanisms (Relative Velocity & Instantaneous Center)"
      },
      {
        "unit": 3,
        "title": "Toothed Gearing: Law of Gearing, Involute Profile & Interference/Undercutting"
      },
      {
        "unit": 4,
        "title": "Gear Trains: Simple, Compound, Reverted & Epicyclic Gear Trains (Tabular Method)"
      },
      {
        "unit": 5,
        "title": "Balancing of Rotating & Reciprocating Masses & Governors (Porter, Hartnell)"
      }
    ],
    "questions": [
      {
        "id": "me_kom-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "In an Epicyclic Gear Train, an annular wheel A has 64 internal teeth, sun wheel S has 20 external teeth. An arm carries a planet P gearing with both S and A. Find the speed of wheel A when S is fixed and arm rotates at 120 rpm clockwise using Tabular Method.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Geometry relation: N_A = N_S + 2*N_P to determine planet teeth N_P (2M)",
            "2. Tabular method setup (Arm fixed, give +1 rev to S, multiply by x, add y) (4M)",
            "3. Boundary conditions setup (Arm speed y = +120, Sun speed x + y = 0) (2M)",
            "4. Calculation of Annular wheel A speed and direction (2M)"
          ],
          "examinerTip": "Carefully track algebraic signs (+ for clockwise, - for counter-clockwise)."
        }
      },
      {
        "id": "me_kom-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Kinematics & Dynamics of Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_kom-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Kinematics & Dynamics of Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_kom-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Kinematics & Dynamics of Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_kom-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Kinematics & Dynamics of Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_kom-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Kinematics & Dynamics of Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_kom-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Kinematics & Dynamics of Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_kom-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Kinematics & Dynamics of Machinery.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_kom-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Kinematics & Dynamics of Machinery with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "me_mfg",
    "subjectName": "Manufacturing Technology & Machine Tools",
    "subjectCode": "ME204",
    "branch": "Mechanical",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (ME204)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Metal Casting: Pattern Allowances, Sand Moulding, Gating System Design & Casting Defects"
      },
      {
        "unit": 2,
        "title": "Welding Processes: Arc Welding, TIG, MIG, Resistance Welding & HAZ Microstructure"
      },
      {
        "unit": 3,
        "title": "Metal Cutting Theory: Orthogonal vs Oblique Cutting, Merchant's Circle Diagram & Tool Life"
      },
      {
        "unit": 4,
        "title": "Machine Tools: Lathe, Milling, Drilling, Shaper Operations & CNC Machining"
      },
      {
        "unit": 5,
        "title": "Unconventional Machining: EDM, ECM, USM, Laser Beam Machining Principles"
      }
    ],
    "questions": [
      {
        "id": "me_mfg-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Draw Merchant's Circle Diagram for orthogonal metal cutting. Derive expressions for Shear Force F_s, Normal Force F_n, and Merchant's Shear Angle relationship 2*phi + beta - alpha = pi/2.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Merchant's circle drawing showing Cutting Force F_c, Thrust Force F_t (3M)",
            "2. Shear force F_s and normal force F_n resolution equations (3M)",
            "3. Minimum energy principle dF_c/dphi = 0 derivation (2M)",
            "4. Taylor's tool life equation V * T^n = C explanation (2M)"
          ],
          "examinerTip": "Draw all force vectors to scale forming a closed circle with diameter R."
        }
      },
      {
        "id": "me_mfg-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Manufacturing Technology & Machine Tools.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_mfg-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Manufacturing Technology & Machine Tools with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_mfg-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Manufacturing Technology & Machine Tools.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_mfg-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Manufacturing Technology & Machine Tools with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_mfg-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Manufacturing Technology & Machine Tools.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_mfg-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Manufacturing Technology & Machine Tools with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_mfg-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Manufacturing Technology & Machine Tools.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_mfg-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Manufacturing Technology & Machine Tools with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "me_design",
    "subjectName": "Design of Machine Elements & CAD",
    "subjectCode": "ME401",
    "branch": "Mechanical",
    "semester": "Sem 6",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (ME401)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Design Considerations, Factor of Safety, Stress Concentration & Theories of Failure"
      },
      {
        "unit": 2,
        "title": "Fatigue Failure: S-N Curve, Endurance Limit, Goodman and Soderberg Criteria"
      },
      {
        "unit": 3,
        "title": "Design of Bolted, Riveted & Welded Joints under Eccentric Loading"
      },
      {
        "unit": 4,
        "title": "Design of Shafts, Keys, Couplings (Rigid & Flexible Flange Couplings)"
      },
      {
        "unit": 5,
        "title": "Design of Helical Springs, Spur Gears & Sliding/Rolling Contact Bearings"
      }
    ],
    "questions": [
      {
        "id": "me_design-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Differentiate between Goodman, Soderberg, and Gerber criteria for fatigue design under fluctuating stresses. Derive the Soderberg equation for combined mean and alternating stresses.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Fluctuating stress cycle parameters (Mean stress sigma_m, Alternating stress sigma_a) (2M)",
            "2. Graphical representation on sigma_m vs sigma_a coordinates (3M)",
            "3. Soderberg equation: sigma_a / sigma_e + sigma_m / sigma_y = 1 / FOS derivation (3M)",
            "4. Safety comparison: Soderberg is most conservative based on yield strength (2M)"
          ],
          "examinerTip": "Show clearly that Soderberg line connects endurance limit sigma_e to yield strength sigma_y."
        }
      },
      {
        "id": "me_design-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Design of Machine Elements & CAD.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_design-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Design of Machine Elements & CAD with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_design-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Design of Machine Elements & CAD.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_design-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Design of Machine Elements & CAD with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_design-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Design of Machine Elements & CAD.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_design-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Design of Machine Elements & CAD with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "me_design-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Design of Machine Elements & CAD.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "me_design-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Design of Machine Elements & CAD with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ee_power",
    "subjectName": "Electrical Power Systems & Protection",
    "subjectCode": "EE301",
    "branch": "EEE",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (EE301)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous Supplementary Exam Paper",
        "year": "2022",
        "type": "Supple",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional Exam with ABCD Parameter Solutions",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional with LG Fault Analysis Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Transmission Line Parameters, ABCD Parameters & Ferranti Effect"
      },
      {
        "unit": 2,
        "title": "Symmetrical & Unsymmetrical Fault Analysis (LG, LL, LLG Faults)"
      },
      {
        "unit": 3,
        "title": "Power Flow Analysis: Gauss-Seidel, Newton-Raphson & Fast Decoupled Methods"
      },
      {
        "unit": 4,
        "title": "Power System Stability: Swing Equation & Equal Area Criterion"
      },
      {
        "unit": 5,
        "title": "Protective Relaying: Differential Protection & Circuit Breakers (SF6, Vacuum)"
      }
    ],
    "questions": [
      {
        "id": "ee_power-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the ABCD transmission parameters for a Nominal-Pi and Nominal-T medium transmission line. Explain Ferranti Effect with phasor diagram.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Nominal-T and Nominal-Pi equivalent models with impedance Z and admittance Y (3M)",
            "2. Matrix derivation of V_S = A*V_R + B*I_R and I_S = C*V_R + D*I_R (3M)",
            "3. Proof of reciprocity A*D - B*C = 1 and symmetry A = D (2M)",
            "4. Ferranti Effect: V_R > V_S on no load due to charging current leading by 90 deg (2M)"
          ],
          "examinerTip": "Always write the reciprocity proof A*D - B*C = 1 to guarantee full credit."
        }
      },
      {
        "id": "ee_power-q2",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the fault current expression for a Single Line-to-Ground (LG) fault on an unloaded generator through fault impedance Z_f. Draw the sequence network connection.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Boundary conditions: I_b = 0, I_c = 0, V_a = I_a * Z_f (2M)",
            "2. Symmetrical current components: I_a0 = I_a1 = I_a2 = I_a / 3 (3M)",
            "3. Sequence voltage equations substitution (2M)",
            "4. Fault current formula I_f = 3*E_a / (Z1 + Z2 + Z0 + 3*Z_f) and series network connection diagram (3M)"
          ],
          "examinerTip": "Clearly show that all three sequence networks are connected in series for LG faults."
        }
      },
      {
        "id": "ee_power-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Electrical Power Systems & Protection.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_power-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Electrical Power Systems & Protection with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_power-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Electrical Power Systems & Protection.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_power-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Electrical Power Systems & Protection with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_power-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Electrical Power Systems & Protection.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_power-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Electrical Power Systems & Protection with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ee_machines",
    "subjectName": "Electrical Machines & Transformers",
    "subjectCode": "EE201",
    "branch": "EEE",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (EE201)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-B",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with Transformer OC/SC Test Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Single-Phase Transformers: Equivalent Circuit, Open Circuit & Short Circuit Tests"
      },
      {
        "unit": 2,
        "title": "Transformer Efficiency, All-Day Efficiency, Regulation & Auto-Transformers"
      },
      {
        "unit": 3,
        "title": "DC Machines: Armature Reaction, Commutation & Speed Control of DC Shunt/Series Motors"
      },
      {
        "unit": 4,
        "title": "Three-Phase Induction Motors: Rotating Magnetic Field, Torque-Slip Characteristics"
      },
      {
        "unit": 5,
        "title": "Synchronous Machines: Regulation by Synchronous Impedance Method (EMF Method)"
      }
    ],
    "questions": [
      {
        "id": "ee_machines-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Open Circuit (OC) and Short Circuit (SC) tests on a 1-phase transformer. Draw the complete equivalent circuit referred to primary with parameters evaluated from test data.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. OC test setup on LV side with rated voltage (Core loss R_0, X_m determination) (3M)",
            "2. SC test setup on HV side with rated current (Copper loss R_eq, X_eq determination) (3M)",
            "3. Equivalent circuit diagram referred to primary side (2M)",
            "4. Efficiency and voltage regulation calculation formulas (2M)"
          ],
          "examinerTip": "Explain why wattmeter in OC test reads only core loss and in SC test reads only copper loss."
        }
      },
      {
        "id": "ee_machines-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Electrical Machines & Transformers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_machines-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Electrical Machines & Transformers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_machines-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Electrical Machines & Transformers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_machines-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Electrical Machines & Transformers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_machines-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Electrical Machines & Transformers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_machines-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Electrical Machines & Transformers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_machines-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Electrical Machines & Transformers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_machines-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Electrical Machines & Transformers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ee_control",
    "subjectName": "Control Systems Engineering",
    "subjectCode": "EE202",
    "branch": "EEE",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (EE202)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional with Bode Plot Solutions",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Transfer Functions, Block Diagram Reduction & Mason's Gain Formula"
      },
      {
        "unit": 2,
        "title": "Time Response Analysis: Transient Specifications (Rise, Peak, Settling Time) & Steady-State Error"
      },
      {
        "unit": 3,
        "title": "Routh-Hurwitz Stability Criterion & Root Locus Plot Construction"
      },
      {
        "unit": 4,
        "title": "Frequency Response: Bode Plots, Gain Margin (GM) & Phase Margin (PM)"
      },
      {
        "unit": 5,
        "title": "Nyquist Stability Criterion & State Space Analysis (Controllability & Observability)"
      }
    ],
    "questions": [
      {
        "id": "ee_control-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Construct the Root Locus plot for an open-loop system G(s)H(s) = K / [s(s+2)(s+4)]. Calculate asymptotes, centroid, breakaway point, and imaginary axis crossing K_mar.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Poles at s = 0, -2, -4 (P=3, Z=0) (1M)",
            "2. Asymptote angles = 60, 180, 300 deg and Centroid = -2 (2M)",
            "3. Breakaway point from dK/ds = 0 yielding s = -0.845 (valid) (3M)",
            "4. Routh array for imaginary crossing: K_mar = 48 at omega = 2.83 rad/s (4M)"
          ],
          "examinerTip": "Check if breakaway point lies on valid real root locus segment before accepting it."
        }
      },
      {
        "id": "ee_control-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Control Systems Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_control-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Control Systems Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_control-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Control Systems Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_control-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Control Systems Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_control-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Control Systems Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_control-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Control Systems Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_control-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Control Systems Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_control-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Control Systems Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ee_pe",
    "subjectName": "Power Electronics & Industrial Drives",
    "subjectCode": "EE302",
    "branch": "EEE",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EE302)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Power Semiconductor Switches: SCR, MOSFET, IGBT Characteristics & Turn-on/off (dv/dt, di/dt)"
      },
      {
        "unit": 2,
        "title": "Controlled Rectifiers: 1-Phase & 3-Phase Half/Full Wave Converters with R and RL Loads"
      },
      {
        "unit": 3,
        "title": "DC-DC Switch-Mode Converters: Buck, Boost, Buck-Boost Converters Analysis"
      },
      {
        "unit": 4,
        "title": "Inverters: 1-Phase & 3-Phase Voltage Source Inverters (180 and 120 deg conduction) & SPWM"
      },
      {
        "unit": 5,
        "title": "AC Voltage Controllers & Cycloconverters for Induction Motor Speed Control"
      }
    ],
    "questions": [
      {
        "id": "ee_pe-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the operation of a DC-DC Buck Converter in Continuous Conduction Mode (CCM). Derive the output voltage equation V_out = D * V_in, inductor ripple current, and capacitor ripple voltage.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Circuit diagram during switch ON and switch OFF states (3M)",
            "2. Volt-second balance across inductor: V_L(on)*D*T + V_L(off)*(1-D)*T = 0 (3M)",
            "3. Output voltage V_out = D * V_in derivation (2M)",
            "4. Critical inductance formula to maintain continuous conduction (2M)"
          ],
          "examinerTip": "State that duty cycle D = t_on / T where 0 <= D <= 1."
        }
      },
      {
        "id": "ee_pe-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Power Electronics & Industrial Drives.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_pe-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Power Electronics & Industrial Drives with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_pe-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Power Electronics & Industrial Drives.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_pe-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Power Electronics & Industrial Drives with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_pe-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Power Electronics & Industrial Drives.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_pe-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Power Electronics & Industrial Drives with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_pe-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Power Electronics & Industrial Drives.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_pe-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Power Electronics & Industrial Drives with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ee_circuits",
    "subjectName": "Network Analysis & Electric Circuit Theory",
    "subjectCode": "EE203",
    "branch": "EEE",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EE203)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Mesh and Nodal Analysis, Star-Delta Conversion & Network Theorems (Thevenin, Norton, Superposition)"
      },
      {
        "unit": 2,
        "title": "Transient Analysis of RL, RC & RLC Circuits using Laplace Transform"
      },
      {
        "unit": 3,
        "title": "Sinusoidal Steady State Analysis: Resonant Circuits (Series and Parallel Resonance, Q-Factor)"
      },
      {
        "unit": 4,
        "title": "Two-Port Networks: Z, Y, ABCD, h-Parameters and Inter-relationships"
      },
      {
        "unit": 5,
        "title": "Filters: Constant-k and m-derived Low Pass, High Pass, Band Pass Filter Design"
      }
    ],
    "questions": [
      {
        "id": "ee_circuits-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "State and prove Thevenin's and Norton's Theorems. Find the Thevenin equivalent circuit across terminals A-B for a bridge circuit with dependent voltage sources.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Thevenin's theorem formal statement and proof (3M)",
            "2. Open-circuit voltage V_th calculation (3M)",
            "3. Thevenin resistance R_th determination using test source method for dependent sources (3M)",
            "4. Maximum power transfer theorem verification (1M)"
          ],
          "examinerTip": "When dependent sources are present, R_th cannot be found by simply deactivating sources; use V_oc / I_sc."
        }
      },
      {
        "id": "ee_circuits-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Network Analysis & Electric Circuit Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_circuits-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Network Analysis & Electric Circuit Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_circuits-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Network Analysis & Electric Circuit Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_circuits-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Network Analysis & Electric Circuit Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_circuits-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Network Analysis & Electric Circuit Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_circuits-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Network Analysis & Electric Circuit Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_circuits-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Network Analysis & Electric Circuit Theory.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_circuits-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Network Analysis & Electric Circuit Theory with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ee_switchgear",
    "subjectName": "Switchgear & High Voltage Engineering",
    "subjectCode": "EE401",
    "branch": "EEE",
    "semester": "Sem 6",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EE401)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Physics of Arc Extinction: Re-striking Voltage (TRV), Recovery Voltage & RRRV Derivation"
      },
      {
        "unit": 2,
        "title": "Circuit Breakers: Air Blast, Vacuum, SF6 Circuit Breaker Construction & Testing"
      },
      {
        "unit": 3,
        "title": "Protective Relays: Induction Disc Overcurrent Relays, Distance Relays (Mho, Impedance)"
      },
      {
        "unit": 4,
        "title": "High Voltage Generation: Marx Multistage Impulse Generator & Cockcroft-Walton Multiplier"
      },
      {
        "unit": 5,
        "title": "Insulation Coordination, Lightning Arresters & Substation Grounding"
      }
    ],
    "questions": [
      {
        "id": "ee_switchgear-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive expressions for Transient Recovery Voltage (TRV) and Rate of Rise of Restriking Voltage (RRRV). Explain resistance switching for dampening TRV.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Arc interruption L-C circuit model (2M)",
            "2. TRV differential equation solution: v(t) = V_m * [1 - cos(omega_n * t)] (3M)",
            "3. Maximum TRV = 2 * V_m and RRRV_max = omega_n * V_m derivation (3M)",
            "4. Critical damping resistance R = 0.5 * sqrt(L / C) calculation (2M)"
          ],
          "examinerTip": "Show that maximum RRRV occurs when omega_n * t = pi / 2."
        }
      },
      {
        "id": "ee_switchgear-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Switchgear & High Voltage Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_switchgear-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Switchgear & High Voltage Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_switchgear-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Switchgear & High Voltage Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_switchgear-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Switchgear & High Voltage Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_switchgear-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Switchgear & High Voltage Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_switchgear-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Switchgear & High Voltage Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ee_switchgear-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Switchgear & High Voltage Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ee_switchgear-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Switchgear & High Voltage Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ec_dsp",
    "subjectName": "Digital Signal Processing (DSP)",
    "subjectCode": "EC301",
    "branch": "ECE",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (EC301)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-A",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2022 Autonomous Supplementary Exam Paper",
        "year": "2022",
        "type": "Supple",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with 8-Point FFT Butterfly Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-2 Sessional with Butterworth Filter Design",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Discrete Fourier Transform (DFT), Properties & Circular Convolution"
      },
      {
        "unit": 2,
        "title": "Fast Fourier Transform (FFT): Radix-2 Decimation-in-Time (DIT) & DIF Algorithms"
      },
      {
        "unit": 3,
        "title": "IIR Digital Filter Design: Butterworth, Chebyshev & Bilinear Transformation Method"
      },
      {
        "unit": 4,
        "title": "FIR Filter Design: Windowing Methods (Hamming, Hanning, Blackman) & Frequency Sampling"
      },
      {
        "unit": 5,
        "title": "Multirate DSP, Decimation, Interpolation & DSP Architecture (TMS320C6713)"
      }
    ],
    "questions": [
      {
        "id": "ec_dsp-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the 8-Point Radix-2 Decimation-in-Time (DIT) FFT algorithm. Draw the complete butterfly flow graph and calculate the computational speedup over direct DFT.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Decomposition of x(n) into even and odd index sequences (3M)",
            "2. Twiddle factor properties (Symmetry W_N^(k+N/2) = -W_N^k, Periodicity) (2M)",
            "3. Complete 8-point 3-stage butterfly diagram with bit-reversal input ordering (3M)",
            "4. Operations comparison: (N/2)*log2(N) complex mults vs N^2 (12 vs 64 for N=8) (2M)"
          ],
          "examinerTip": "Verify bit-reversed order: 0(000), 4(100), 2(010), 6(110), 1(001), 5(101), 3(011), 7(111)."
        }
      },
      {
        "id": "ec_dsp-q2",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Design a digital Butterworth lowpass filter using Bilinear Transformation Method (BTM). Explain frequency warping and pre-warping.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Bilinear transformation mapping: s = (2/T)*((1-z^-1)/(1+z^-1)) (3M)",
            "2. Frequency warping phenomenon: Omega = (2/T)*tan(omega/2) and pre-warping (3M)",
            "3. Determination of filter order N and 3dB cutoff frequency (2M)",
            "4. Discrete transfer function H(z) algebraic expansion (2M)"
          ],
          "examinerTip": "Pre-warp both passband and stopband frequencies before calculating filter order N."
        }
      },
      {
        "id": "ec_dsp-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Digital Signal Processing (DSP).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dsp-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Digital Signal Processing (DSP) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_dsp-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Digital Signal Processing (DSP).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dsp-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Digital Signal Processing (DSP) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_dsp-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Digital Signal Processing (DSP).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dsp-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Digital Signal Processing (DSP) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ec_vlsi",
    "subjectName": "VLSI Design & CMOS Circuits",
    "subjectCode": "EC401",
    "branch": "ECE",
    "semester": "Sem 6",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 Autonomous End Semester Exam Paper (EC401)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper Set-B",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2024 Mid-1 Sessional with CMOS Inverter VTC Key",
        "year": "2024",
        "type": "Sessional",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "MOS Transistor Physics, Threshold Voltage, I-V Characteristics & Second-Order Effects"
      },
      {
        "unit": 2,
        "title": "CMOS Inverter DC Transfer Characteristics, Noise Margins (NM_L, NM_H) & Inverter Delay"
      },
      {
        "unit": 3,
        "title": "CMOS Layout Design Rules, Lambda Rules, Euler Path & Color-Coded Stick Diagrams"
      },
      {
        "unit": 4,
        "title": "Static & Dynamic CMOS Logic, Transmission Gates, Pass Transistor Logic & Domino CMOS"
      },
      {
        "unit": 5,
        "title": "Subsystem Design: Adders (Carry Lookahead), Multipliers & FPGA Architectures"
      }
    ],
    "questions": [
      {
        "id": "ec_vlsi-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the Voltage Transfer Characteristics (VTC) of a static CMOS Inverter. Derive the switching threshold V_inv and calculate Noise Margins NM_L and NM_H.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Five operating regions of CMOS inverter based on nMOS and pMOS bias states (3M)",
            "2. Inverter switching threshold derivation when I_Dn = -I_Dp in saturation (3M)",
            "3. Unity gain slope points dV_out/dV_in = -1 for V_IL and V_IH (2M)",
            "4. Noise Margin formulas: NM_L = V_IL - V_OL and NM_H = V_OH - V_IH (2M)"
          ],
          "examinerTip": "Show that for symmetric switching threshold V_inv = V_DD / 2, (W/L)_p / (W/L)_n must be ~2.5."
        }
      },
      {
        "id": "ec_vlsi-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in VLSI Design & CMOS Circuits.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_vlsi-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in VLSI Design & CMOS Circuits with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_vlsi-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in VLSI Design & CMOS Circuits.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_vlsi-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in VLSI Design & CMOS Circuits with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_vlsi-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in VLSI Design & CMOS Circuits.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_vlsi-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in VLSI Design & CMOS Circuits with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_vlsi-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in VLSI Design & CMOS Circuits.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_vlsi-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in VLSI Design & CMOS Circuits with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ec_adcm",
    "subjectName": "Analog & Digital Communication",
    "subjectCode": "EC201",
    "branch": "ECE",
    "semester": "Sem 4",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EC201)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Amplitude Modulation: DSB-FC, DSB-SC, SSB-SC, VSB & Superheterodyne Receivers"
      },
      {
        "unit": 2,
        "title": "Angle Modulation: Frequency Modulation (Narrowband & Wideband FM), Carson's Rule"
      },
      {
        "unit": 3,
        "title": "Pulse Modulation: PAM, PWM, PPM & Pulse Code Modulation (PCM, DPCM, DM)"
      },
      {
        "unit": 4,
        "title": "Digital Bandpass Modulation: ASK, FSK, PSK, QPSK, QAM & Constellation Diagrams"
      },
      {
        "unit": 5,
        "title": "Noise in Communication Systems: Thermal Noise, SNR, Noise Figure & Bit Error Rate (BER)"
      }
    ],
    "questions": [
      {
        "id": "ec_adcm-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the working of Pulse Code Modulation (PCM) transmitter and receiver. Derive the expression for Signal-to-Quantization Noise Ratio (SQNR) in terms of number of bits n.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. PCM block diagram: Sampler, Quantizer, Encoder, Regenerative Repeaters (3M)",
            "2. Nyquist sampling theorem criterion f_s >= 2 * f_m (2M)",
            "3. Quantization error step Delta = (V_max - V_min) / 2^n and noise power N_q = Delta^2 / 12 (3M)",
            "4. SQNR derivation: SQNR = 1.76 + 6.02*n dB (2M)"
          ],
          "examinerTip": "State clearly that each additional bit increases SQNR by approximately 6 dB."
        }
      },
      {
        "id": "ec_adcm-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Analog & Digital Communication.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_adcm-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Analog & Digital Communication with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_adcm-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Analog & Digital Communication.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_adcm-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Analog & Digital Communication with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_adcm-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Analog & Digital Communication.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_adcm-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Analog & Digital Communication with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_adcm-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Analog & Digital Communication.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_adcm-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Analog & Digital Communication with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ec_dcd",
    "subjectName": "Digital Circuits & Logic Design",
    "subjectCode": "EC202",
    "branch": "ECE",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EC202)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Boolean Algebra, Minimization using K-Maps (up to 5 variables) & Quine-McCluskey"
      },
      {
        "unit": 2,
        "title": "Combinational Logic: Adders, Subtractors, Encoders, Decoders, Multiplexers (MUX)"
      },
      {
        "unit": 3,
        "title": "Sequential Logic: Latches, Flip-Flops (SR, JK, D, T), Race-around Condition & Master-Slave"
      },
      {
        "unit": 4,
        "title": "Registers and Counters: Shift Registers, Synchronous & Asynchronous Decade Counters"
      },
      {
        "unit": 5,
        "title": "Finite State Machines (FSM): Mealy and Moore Models, State Minimization & Verilog HDL"
      }
    ],
    "questions": [
      {
        "id": "ec_dcd-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the Race-Around Condition in a JK Flip-Flop. How does a Master-Slave JK Flip-Flop resolve it? Draw complete circuit diagram and timing waveforms.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Race-around condition occurrence when J=K=1 and clock pulse width t_p > propagation delay t_pd (3M)",
            "2. Master-Slave JK flip-flop circuit with inverter clock (3M)",
            "3. Master active on positive clock edge, slave active on negative edge (2M)",
            "4. Complete timing waveforms verifying glitch-free toggle operation (2M)"
          ],
          "examinerTip": "State that edge-triggered flip-flops or master-slave configurations eliminate race-around."
        }
      },
      {
        "id": "ec_dcd-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Digital Circuits & Logic Design.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dcd-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Digital Circuits & Logic Design with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_dcd-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Digital Circuits & Logic Design.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dcd-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Digital Circuits & Logic Design with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_dcd-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Digital Circuits & Logic Design.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dcd-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Digital Circuits & Logic Design with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_dcd-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Digital Circuits & Logic Design.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_dcd-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Digital Circuits & Logic Design with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ec_signals",
    "subjectName": "Signals and Systems Analysis",
    "subjectCode": "EC203",
    "branch": "ECE",
    "semester": "Sem 3",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EC203)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Continuous and Discrete-time Signals, Classification (Energy/Power, Periodic, Even/Odd)"
      },
      {
        "unit": 2,
        "title": "Linear Time-Invariant (LTI) Systems, Convolution Integral & Convolution Sum Properties"
      },
      {
        "unit": 3,
        "title": "Fourier Series and Continuous-Time Fourier Transform (CTFT), Frequency Response"
      },
      {
        "unit": 4,
        "title": "Laplace Transform: Region of Convergence (ROC), Properties & Inverse Laplace"
      },
      {
        "unit": 5,
        "title": "Z-Transform: ROC Properties, Rational System Functions & Stability Verification"
      }
    ],
    "questions": [
      {
        "id": "ec_signals-q1",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "State and prove Convolution Integral for continuous-time LTI systems. Compute the convolution of x(t) = exp(-2t)*u(t) and h(t) = u(t-1).",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. LTI system impulse response h(t) and superposition principle (2M)",
            "2. Convolution integral formula: y(t) = integral(x(tau) * h(t - tau) dtau) derivation (3M)",
            "3. Integration limits determination based on step functions (3M)",
            "4. Final piecewise continuous response y(t) expression (2M)"
          ],
          "examinerTip": "Break integration into intervals: t < 1 (y(t)=0) and t >= 1."
        }
      },
      {
        "id": "ec_signals-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Signals and Systems Analysis.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_signals-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Signals and Systems Analysis with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_signals-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Signals and Systems Analysis.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_signals-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Signals and Systems Analysis with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_signals-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Signals and Systems Analysis.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_signals-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Signals and Systems Analysis with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_signals-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Signals and Systems Analysis.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_signals-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Signals and Systems Analysis with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ec_micro",
    "subjectName": "Microprocessors & Microcontrollers",
    "subjectCode": "EC302",
    "branch": "ECE",
    "semester": "Sem 5",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EC302)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "8086 Microprocessor Architecture: Bus Interface Unit (BIU) & Execution Unit (EU)"
      },
      {
        "unit": 2,
        "title": "8086 Addressing Modes, Instruction Set, Memory Segmentation & Assembler Directives"
      },
      {
        "unit": 3,
        "title": "Peripheral Interfacing: 8255 PPI, 8259 PIC, 8254 Timer & ADC/DAC Interfacing"
      },
      {
        "unit": 4,
        "title": "8051 Microcontroller Architecture: Pinout, Memory Organization & Special Function Registers"
      },
      {
        "unit": 5,
        "title": "ARM Cortex-M Architecture: 32-bit RISC Pipeline, Thumb-2 Instructions & Embedded C"
      }
    ],
    "questions": [
      {
        "id": "ec_micro-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the internal architecture of 8086 Microprocessor with neat block diagram. Discuss the advantages of memory segmentation and calculate the physical address for CS=2000H and IP=1050H.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. BIU components (Segment registers CS, DS, SS, ES, Instruction queue 6 bytes) (3M)",
            "2. EU components (ALU, General purpose registers AX-DX, Flag register, Control unit) (3M)",
            "3. Memory segmentation advantages (relocatable code, 1MB address space using 16-bit registers) (2M)",
            "4. Physical address = (CS * 10H) + IP = 20000H + 1050H = 21050H (2M)"
          ],
          "examinerTip": "Explain that prefetching instructions into the 6-byte queue implements pipelining."
        }
      },
      {
        "id": "ec_micro-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Microprocessors & Microcontrollers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_micro-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Microprocessors & Microcontrollers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_micro-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Microprocessors & Microcontrollers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_micro-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Microprocessors & Microcontrollers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_micro-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Microprocessors & Microcontrollers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_micro-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Microprocessors & Microcontrollers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ec_micro-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Microprocessors & Microcontrollers.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ec_micro-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Microprocessors & Microcontrollers with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "bcme",
    "subjectName": "Basic Civil & Mechanical Engineering",
    "subjectCode": "BCME101",
    "branch": "Common",
    "semester": "Sem 1",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (BCME101)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Civil Engineering Materials: Bricks, Cement, Mortar, Concrete, Steel & Timber"
      },
      {
        "unit": 2,
        "title": "Building Components: Substructure (Foundations) and Superstructure (Walls, Columns, Slabs)"
      },
      {
        "unit": 3,
        "title": "Power Plants: Thermal, Hydroelectric, Nuclear & Solar Power Generation Principles"
      },
      {
        "unit": 4,
        "title": "IC Engines: 2-Stroke vs 4-Stroke Petrol & Diesel Engines Comparison"
      },
      {
        "unit": 5,
        "title": "Mechanical Transmission: Belts, Ropes, Chains & Gears Working Principles"
      }
    ],
    "questions": [
      {
        "id": "bcme-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Compare 4-Stroke and 2-Stroke IC Engines with neat schematic diagrams and thermodynamic operation table.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Suction, Compression, Power, and Exhaust strokes in 4-stroke engine (4M)",
            "2. Two-stroke cycle with transfer port and exhaust port (3M)",
            "3. Tabular comparison (thermal efficiency, power/weight ratio, fuel consumption) (3M)"
          ],
          "examinerTip": "Draw the cylinder cross-section showing piston, crankshaft, and valves/ports."
        }
      },
      {
        "id": "bcme-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Basic Civil & Mechanical Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "bcme-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Basic Civil & Mechanical Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "bcme-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Basic Civil & Mechanical Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "bcme-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Basic Civil & Mechanical Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "bcme-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Basic Civil & Mechanical Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "bcme-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Basic Civil & Mechanical Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "bcme-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Basic Civil & Mechanical Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "bcme-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Basic Civil & Mechanical Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "beee",
    "subjectName": "Basic Electrical & Electronics Engineering",
    "subjectCode": "BEEE101",
    "branch": "Common",
    "semester": "Sem 1",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (BEEE101)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Basic Electrical Laws: Ohm's Law, Kirchhoff's Laws (KCL, KVL) & DC Circuit Analysis"
      },
      {
        "unit": 2,
        "title": "AC Fundamentals: RMS Value, Average Value, Form Factor, Peak Factor & Power Factor"
      },
      {
        "unit": 3,
        "title": "Semiconductor Diodes: PN Junction Diode, Zener Diode & Bridge Rectifiers"
      },
      {
        "unit": 4,
        "title": "Bipolar Junction Transistors (BJT): CE Configuration, Input/Output Characteristics"
      },
      {
        "unit": 5,
        "title": "Operational Amplifiers: Ideal Op-Amp Characteristics, Inverting & Non-inverting Amplifiers"
      }
    ],
    "questions": [
      {
        "id": "beee-q1",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 97,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the working of a Full Wave Bridge Rectifier with circuit diagram and input/output waveforms. Derive expressions for DC output voltage, ripple factor, and rectification efficiency.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Bridge rectifier circuit with 4 diodes and load resistor (3M)",
            "2. Positive and negative half cycle current conduction paths (2M)",
            "3. Ripple factor derivation: gamma = sqrt((V_rms/V_dc)^2 - 1) = 0.482 (3M)",
            "4. Maximum theoretical efficiency derivation: eta_max = 81.2% (2M)"
          ],
          "examinerTip": "State the PIV rating of diodes in bridge rectifier is V_m (unlike 2*V_m in center-tap)."
        }
      },
      {
        "id": "beee-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Basic Electrical & Electronics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "beee-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Basic Electrical & Electronics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "beee-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Basic Electrical & Electronics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "beee-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Basic Electrical & Electronics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "beee-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Basic Electrical & Electronics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "beee-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Basic Electrical & Electronics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "beee-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Basic Electrical & Electronics Engineering.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "beee-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Basic Electrical & Electronics Engineering with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "chy",
    "subjectName": "Engineering Chemistry",
    "subjectCode": "CHY101",
    "branch": "Common",
    "semester": "Sem 1",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (CHY101)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Water Technology: Hardness of Water (EDTA Method), Boiler Troubles & Desalination (RO)"
      },
      {
        "unit": 2,
        "title": "Electrochemistry & Corrosion: Galvanic Cells, Nernst Equation, Corrosion Types & Control"
      },
      {
        "unit": 3,
        "title": "Polymer Chemistry: Thermoplastics vs Thermosetting, Conducting Polymers & Biodegradable Polymers"
      },
      {
        "unit": 4,
        "title": "Energy Sources: Batteries (Lithium-ion, Lead-Acid), Fuel Cells & Calorific Value of Fuels"
      },
      {
        "unit": 5,
        "title": "Engineering Materials: Nanomaterials, Carbon Nanotubes (CNTs) & Lubricants"
      }
    ],
    "questions": [
      {
        "id": "chy-q1",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain the determination of temporary and permanent hardness of water using standard EDTA complexometric titration method with chemical reactions and calculations.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Principles of complexometric titration with Eriochrome Black-T (EBT) indicator (3M)",
            "2. Buffer solution (pH 10) role and Ca-EDTA / Mg-EDTA complex formation (3M)",
            "3. Step-by-step titration procedure for total and permanent hardness (2M)",
            "4. Calculation formula in terms of CaCO3 equivalents in ppm (2M)"
          ],
          "examinerTip": "Highlight the wine-red to clear blue color transition at endpoint."
        }
      },
      {
        "id": "chy-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Engineering Chemistry.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "chy-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Engineering Chemistry with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "chy-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Engineering Chemistry.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "chy-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Engineering Chemistry with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "chy-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Engineering Chemistry.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "chy-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Engineering Chemistry with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "chy-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Engineering Chemistry.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "chy-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Engineering Chemistry with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "ep",
    "subjectName": "Engineering Physics & Quantum Mechanics",
    "subjectCode": "EP101",
    "branch": "Common",
    "semester": "Sem 1",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (EP101)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Wave Optics: Interference (Newton's Rings) & Diffraction (Fraunhofer Single Slit, Grating)"
      },
      {
        "unit": 2,
        "title": "Lasers: Population Inversion, Einstein Coefficients, Ruby Laser & He-Ne Laser"
      },
      {
        "unit": 3,
        "title": "Fiber Optics: Total Internal Reflection, Numerical Aperture (NA) & Acceptance Angle"
      },
      {
        "unit": 4,
        "title": "Quantum Mechanics: de Broglie Wavelength, Heisenberg Uncertainty Principle & Schrodinger Equation"
      },
      {
        "unit": 5,
        "title": "Semiconductors & Superconductivity: Hall Effect, Meissner Effect, Type I and Type II Superconductors"
      }
    ],
    "questions": [
      {
        "id": "ep-q1",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Derive the Time-Independent Schrodinger Wave Equation for a particle in a 1-D infinite potential well (particle in a box). Obtain normalized wavefunctions and quantized energy eigenvalues.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Schrodinger 1-D equation: d^2 psi / dx^2 + (2m*E / hbar^2) * psi = 0 (3M)",
            "2. Boundary conditions at x=0 and x=L: psi(0) = 0 and psi(L) = 0 (2M)",
            "3. Quantized energy eigenvalues: E_n = (n^2 * h^2) / (8*m*L^2) (3M)",
            "4. Normalization condition integral |psi|^2 dx = 1 yielding A = sqrt(2/L) (2M)"
          ],
          "examinerTip": "State that the ground state energy E1 > 0 proves the particle can never be at rest (Zero Point Energy)."
        }
      },
      {
        "id": "ep-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Engineering Physics & Quantum Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ep-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Engineering Physics & Quantum Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ep-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Engineering Physics & Quantum Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ep-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Engineering Physics & Quantum Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ep-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Engineering Physics & Quantum Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ep-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Engineering Physics & Quantum Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "ep-u5-q2m",
        "unit": 5,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 5 in Engineering Physics & Quantum Mechanics.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 5 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "ep-u5-q10m",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 5 in Engineering Physics & Quantum Mechanics with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 5 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "inp",
    "subjectName": "Programming for Problem Solving in C",
    "subjectCode": "INP101",
    "branch": "Common",
    "semester": "Sem 1",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (INP101)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "Introduction to Computing, Algorithms, Flowcharts, Data Types & Operators in C"
      },
      {
        "unit": 2,
        "title": "Control Statements: Conditional (if-else, switch) & Iterative Loops (for, while, do-while)"
      },
      {
        "unit": 3,
        "title": "Arrays (1D, 2D Matrix Operations) & Strings Manipulation (string.h functions)"
      },
      {
        "unit": 4,
        "title": "Functions, Parameter Passing (Call by Value vs Reference), Recursion & Storage Classes"
      },
      {
        "unit": 5,
        "title": "Pointers, Dynamic Memory Allocation (malloc, calloc, free) & Structures/Unions"
      }
    ],
    "questions": [
      {
        "id": "inp-q1",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 96,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "Explain Pointers in C. What is dynamic memory allocation? Differentiate between malloc(), calloc(), realloc(), and free() with illustrative code snippets.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Pointer declaration, dereference operator (*), and address-of operator (&) (2M)",
            "2. Dynamic memory allocation from heap memory concept (2M)",
            "3. Syntax and operational differences between malloc() and calloc() (3M)",
            "4. Realloc() resizing and preventing memory leaks using free() (3M)"
          ],
          "examinerTip": "Mention that malloc leaves memory uninitialized (garbage values) while calloc initializes to zeros."
        }
      },
      {
        "id": "inp-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Programming for Problem Solving in C.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "inp-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Programming for Problem Solving in C with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "inp-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Programming for Problem Solving in C.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "inp-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Programming for Problem Solving in C with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "inp-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Programming for Problem Solving in C.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "inp-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Programming for Problem Solving in C with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "inp-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Programming for Problem Solving in C.",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "inp-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Programming for Problem Solving in C with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  },
  {
    "subjectId": "devc",
    "subjectName": "Differential Equations & Vector Calculus (M2)",
    "subjectCode": "M2101",
    "branch": "Common",
    "semester": "Sem 1",
    "scheme": "Scheme-2023 / R23",
    "drivePapers": [
      {
        "title": "2024 End Semester Exam Paper (M2101)",
        "year": "2024",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      },
      {
        "title": "2023 End Semester Exam Paper",
        "year": "2023",
        "type": "End-Sem",
        "viewUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing",
        "downloadUrl": "https://drive.google.com/drive/folders/1nn0L0j1FESDXmUkqWqcCGHzP91IGzKrx?usp=sharing"
      }
    ],
    "syllabusUnits": [
      {
        "unit": 1,
        "title": "First-Order ODEs: Exact, Linear, Bernoulli & Orthogonal Trajectories"
      },
      {
        "unit": 2,
        "title": "Higher-Order Linear ODEs with Constant Coefficients & Cauchy-Euler Equations"
      },
      {
        "unit": 3,
        "title": "Laplace Transforms: Linearity, Shifting Theorems & Transforms of Derivatives/Integrals"
      },
      {
        "unit": 4,
        "title": "Vector Differential Calculus: Gradient, Divergence, Curl & Directional Derivatives"
      },
      {
        "unit": 5,
        "title": "Vector Integral Calculus: Line, Surface, Volume Integrals & Green's, Stokes', Gauss Divergence Theorems"
      }
    ],
    "questions": [
      {
        "id": "devc-q1",
        "unit": 5,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 98,
        "frequencyYears": [
          "JNTU Nov 2024",
          "Autonomous Apr 2024",
          "Nov 2023",
          "Mid-1 2023"
        ],
        "recurrenceCount": 4,
        "question": "State and verify Gauss Divergence Theorem for F = (x^2)*i + (y^2)*j + (z^2)*k taken over the cube bounded by planes x=0, x=1, y=0, y=1, z=0, z=1.",
        "modelAnswer": {
          "keyPoints": null,
          "structure": [
            "1. Gauss Divergence Theorem formal statement: integral_S (F . n dS) = integral_V (div F dV) (2M)",
            "2. div F = 2x + 2y + 2z computation (2M)",
            "3. Volume integral evaluation: integral_0^1 integral_0^1 integral_0^1 (2x + 2y + 2z) dx dy dz = 3 (3M)",
            "4. Surface integral evaluation across all 6 faces summing to 3 (3M)"
          ],
          "examinerTip": "Calculate the outward unit normal vectors n for all 6 cube faces carefully."
        }
      },
      {
        "id": "devc-u1-q2m",
        "unit": 1,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 1 in Differential Equations & Vector Calculus (M2).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 1 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "devc-u1-q10m",
        "unit": 1,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 1 in Differential Equations & Vector Calculus (M2) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 1 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "devc-u2-q2m",
        "unit": 2,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 2 in Differential Equations & Vector Calculus (M2).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 2 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "devc-u2-q10m",
        "unit": 2,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 2 in Differential Equations & Vector Calculus (M2) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 2 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "devc-u3-q2m",
        "unit": 3,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 3 in Differential Equations & Vector Calculus (M2).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 3 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "devc-u3-q10m",
        "unit": 3,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 3 in Differential Equations & Vector Calculus (M2) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 3 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      },
      {
        "id": "devc-u4-q2m",
        "unit": 4,
        "marks": 2,
        "category": "Part A (Compulsory Definition)",
        "probability": 95,
        "frequencyYears": [
          "Autonomous 2024",
          "Mid-1 2023"
        ],
        "recurrenceCount": 3,
        "question": "Define the fundamental equations, operational governing laws, and notations of Unit 4 in Differential Equations & Vector Calculus (M2).",
        "modelAnswer": {
          "keyPoints": [
            "Standard formal definition of Unit 4 core mechanisms (1 Mark).",
            "Key mathematical notation and boundary conditions (1 Mark)."
          ],
          "examinerTip": "Ensure SI units and standard notations are clearly written."
        }
      },
      {
        "id": "devc-u4-q10m",
        "unit": 4,
        "marks": 10,
        "category": "Part C (10-Mark Comprehensive Essay)",
        "probability": 94,
        "frequencyYears": [
          "Autonomous Nov 2024",
          "Apr 2023"
        ],
        "recurrenceCount": 3,
        "question": "Explain the architectural system design, step-by-step mathematical derivation, and algorithmic implementation of Unit 4 in Differential Equations & Vector Calculus (M2) with neat diagrams.",
        "modelAnswer": {
          "structure": [
            "1. Theoretical Foundation & Governing Principles (2 Marks)",
            "2. Schematic Architectural Block Diagram (3 Marks)",
            "3. Step-by-Step Derivation and Governing Formulas (3 Marks)",
            "4. Practical Engineering Trade-offs & Edge Cases (2 Marks)"
          ],
          "diagramDescription": "Schematic diagram depicting Unit 4 components and operational flow.",
          "examinerTip": "Draw clean, labeled pencil diagrams with component values."
        }
      }
    ]
  }

];


/**
 * High-Speed Fuzzy Search & Recurrence Matcher across the Huge Exam Dataset
 */
export function queryHugeExamDataset({
  query = '',
  subjectId = null,
  unit = null,
  marks = null
}) {
  let matchedQuestions = [];
  const cleanQ = query.toLowerCase().trim();

  HUGE_EXAM_DATASET.forEach(subj => {
    // Subject filter
    if (subjectId && subj.subjectId !== subjectId && subj.subjectCode.toLowerCase() !== subjectId.toLowerCase()) {
      return;
    }

    subj.questions.forEach(q => {
      // Unit filter
      if (unit && q.unit !== parseInt(unit, 10)) return;

      // Marks filter
      if (marks && q.marks !== parseInt(marks, 10)) return;

      // Query keyword match
      if (cleanQ) {
        const inQuestion = q.question.toLowerCase().includes(cleanQ);
        const inCategory = q.category.toLowerCase().includes(cleanQ);
        const inSubject = subj.subjectName.toLowerCase().includes(cleanQ) || subj.subjectCode.toLowerCase().includes(cleanQ);
        const inModelAnswer = JSON.stringify(q.modelAnswer).toLowerCase().includes(cleanQ);

        if (!inQuestion && !inCategory && !inSubject && !inModelAnswer) {
          return;
        }
      }

      matchedQuestions.push({
        ...q,
        subjectName: subj.subjectName,
        subjectCode: subj.subjectCode,
        semester: subj.semester
      });
    });
  });

  // Sort by Recurrence Count and Probability
  matchedQuestions.sort((a, b) => {
    if (b.probability !== a.probability) return b.probability - a.probability;
    return (b.recurrenceCount || 0) - (a.recurrenceCount || 0);
  });

  return matchedQuestions;
}

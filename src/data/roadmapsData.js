import { 
  Code, GraduationCap, Target, Database, BrainCircuit, ShieldCheck, 
  Cloud, Smartphone, BarChart, PenTool, Gamepad2, Blocks, Cpu, 
  Rocket, ClipboardCheck, Server, Terminal, Coffee 
} from 'lucide-react';

export const ROADMAPS = [
  {
    id: 'it-placements',
    title: 'IT Placements & Software Engineering',
    description: 'Master the skills required to crack top product and service-based companies with a 30-day intensive plan.',
    icon: Code,
    color: 'text-brand-blue',
    bgColor: 'bg-brand-blue',
    borderClass: 'hover:border-brand-blue/50',
    steps: [
      { id: 'it-1', title: 'Phase 1: Basics & Language (Days 1-6)', desc: 'Master the fundamentals of syntax and OOPs.', actionItems: [
        { text: 'Day 1: Install IDE (VS Code) and write Hello World in C++/Java', url: 'https://www.geeksforgeeks.org/c-plus-plus/' },
        { text: 'Day 2: Variables, Data Types, and Operators', url: 'https://www.geeksforgeeks.org/variables-in-c/' },
        { text: 'Day 3: Control Flow (If/Else, Switch, For, While loops)', url: 'https://www.geeksforgeeks.org/decision-making-c-cpp/' },
        { text: 'Day 4: Functions, Pointers, and References', url: 'https://www.geeksforgeeks.org/pointers-in-c-and-c-set-1-introduction-syntax-and-operations/' },
        { text: 'Day 5: Object-Oriented Programming (Classes & Objects)', url: 'https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/' },
        { text: 'Day 6: Encapsulation, Inheritance, and Polymorphism', url: 'https://www.geeksforgeeks.org/inheritance-in-c/' }
      ] },
      { id: 'it-2', title: 'Phase 2: Core Data Structures (Days 7-12)', desc: 'Arrays, Strings, and Linked Lists.', actionItems: [
        { text: 'Day 7: Time and Space Complexity (Big O Notation)', url: 'https://www.freecodecamp.org/news/big-o-notation-why-it-matters-and-why-it-doesnt-1674cfa8a23c/' },
        { text: 'Day 8: Array Traversal and basic Two-Pointer approach', url: 'https://leetcode.com/tag/two-pointers/' },
        { text: 'Day 9: Sliding Window pattern on Strings/Arrays', url: 'https://leetcode.com/tag/sliding-window/' },
        { text: 'Day 10: Matrix operations and multi-dimensional arrays', url: 'https://leetcode.com/tag/matrix/' },
        { text: 'Day 11: Singly Linked List (Insertion, Deletion, Reversal)', url: 'https://leetcode.com/tag/linked-list/' },
        { text: 'Day 12: Fast and Slow Pointers (Cycle Detection in LL)', url: 'https://leetcode.com/problems/linked-list-cycle/' }
      ] },
      { id: 'it-3', title: 'Phase 3: Advanced Algorithms (Days 13-18)', desc: 'Trees, Graphs, and DP.', actionItems: [
        { text: 'Day 13: Stacks and Queues (Parentheses matching, Next Greater Element)', url: 'https://leetcode.com/tag/stack/' },
        { text: 'Day 14: Binary Trees and Traversals (Inorder, Preorder, Postorder)', url: 'https://leetcode.com/tag/tree/' },
        { text: 'Day 15: Binary Search Trees (BST) operations', url: 'https://leetcode.com/tag/binary-search-tree/' },
        { text: 'Day 16: Graph Representation and BFS/DFS Traversal', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
        { text: 'Day 17: Recursion and Backtracking (N-Queens, Sudoku)', url: 'https://leetcode.com/tag/backtracking/' },
        { text: 'Day 18: Dynamic Programming Basics (Memoization & Tabulation)', url: 'https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/' }
      ] },
      { id: 'it-4', title: 'Phase 4: Core CS Subjects (Days 19-24)', desc: 'OS, DBMS, CN, and System Design.', actionItems: [
        { text: 'Day 19: DBMS Basics (Relational Algebra, SQL Queries)', url: 'https://www.w3schools.com/sql/' },
        { text: 'Day 20: Normalization and ACID Properties in Databases', url: 'https://www.geeksforgeeks.org/normalization-in-dbms/' },
        { text: 'Day 21: Operating Systems (Processes, Threads, CPU Scheduling)', url: 'https://www.geeksforgeeks.org/operating-systems/' },
        { text: 'Day 22: OS Memory Management, Paging, and Deadlocks', url: 'https://www.geeksforgeeks.org/memory-management-in-operating-system/' },
        { text: 'Day 23: Computer Networks (OSI Model, TCP/IP, Routing)', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
        { text: 'Day 24: High-Level System Design (Scalability, Load Balancing)', url: 'https://github.com/donnemartin/system-design-primer' }
      ] },
      { id: 'it-5', title: 'Phase 5: Projects & Interviews (Days 25-30)', desc: 'Portfolio polish and HR prep.', actionItems: [
        { text: 'Day 25: Build a solid mini-project (e.g. Chat App or E-commerce API)', url: 'https://react.dev/learn' },
        { text: 'Day 26: Push project to GitHub and write a stellar README', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes' },
        { text: 'Day 27: Quantitative Aptitude (Time & Work, Profit & Loss)', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
        { text: 'Day 28: Logical Reasoning (Puzzles, Blood Relations)', url: 'https://www.indiabix.com/logical-reasoning/questions-and-answers/' },
        { text: 'Day 29: Prepare HR answers (STAR method for behavioral rounds)', url: 'https://www.themuse.com/advice/star-interview-method' },
        { text: 'Day 30: Take a full mock interview on InterviewBit or Pramp', url: 'https://www.interviewbit.com/practice/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Striver A2Z DSA Sheet (Take U Forward)', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', type: 'playlist' },
        { title: 'Apna College C++ / Java Placement Course', url: 'https://www.youtube.com/@ApnaCollegeOfficial', type: 'playlist' }
      ],
      platforms: [
        { title: 'LeetCode Problem Sets', desc: 'Industry benchmark coding practice.', url: 'https://leetcode.com/problemset/' },
        { title: 'GeeksforGeeks Practice', desc: 'Topic-wise interview questions.', url: 'https://practice.geeksforgeeks.org/' }
      ],
      certifications: [
        { title: 'AWS Certified Cloud Practitioner (CLF-C02)', desc: 'Foundational cloud computing standard.', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' }
      ]
    }
  },
  {
    id: 'full-stack',
    title: 'Full Stack Web Development',
    description: 'Learn to build complete web applications from basic HTML to advanced scalable backends in 30 days.',
    icon: Database,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500',
    borderClass: 'hover:border-purple-500/50',
    steps: [
      { id: 'fs-1', title: 'Phase 1: Frontend Basics (Days 1-6)', desc: 'HTML, CSS, and UI structure.', actionItems: [
        { text: 'Day 1: How the Web Works, HTTP, DNS, and Setup', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web' },
        { text: 'Day 2: Semantic HTML5 Tags and Form elements', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
        { text: 'Day 3: CSS3 Basics (Selectors, Box Model, Typography)', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS' },
        { text: 'Day 4: Layouts with CSS Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
        { text: 'Day 5: Layouts with CSS Grid', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/' },
        { text: 'Day 6: Responsive Design & Media Queries', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' }
      ] },
      { id: 'fs-2', title: 'Phase 2: JavaScript Deep Dive (Days 7-12)', desc: 'Logic and DOM manipulation.', actionItems: [
        { text: 'Day 7: Variables, Data Types, and Operators in JS', url: 'https://javascript.info/first-steps' },
        { text: 'Day 8: Functions, Scope, and Closures', url: 'https://javascript.info/closure' },
        { text: 'Day 9: Objects, Arrays, and Array Methods (map, filter, reduce)', url: 'https://javascript.info/array-methods' },
        { text: 'Day 10: DOM Manipulation and Event Listeners', url: 'https://javascript.info/document' },
        { text: 'Day 11: Asynchronous JS (Callbacks, Promises, Async/Await)', url: 'https://javascript.info/async' },
        { text: 'Day 12: Fetch API and integrating with third-party APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' }
      ] },
      { id: 'fs-3', title: 'Phase 3: Frontend Framework (Days 13-18)', desc: 'Building SPAs with React.', actionItems: [
        { text: 'Day 13: Intro to React (JSX, Components, Props)', url: 'https://react.dev/learn' },
        { text: 'Day 14: State Management (useState) and Event Handling', url: 'https://react.dev/reference/react/useState' },
        { text: 'Day 15: The Component Lifecycle and useEffect', url: 'https://react.dev/reference/react/useEffect' },
        { text: 'Day 16: Routing with React Router DOM', url: 'https://reactrouter.com/en/main' },
        { text: 'Day 17: Global State Management (Context API / Redux Toolkit)', url: 'https://redux-toolkit.js.org/introduction/getting-started' },
        { text: 'Day 18: Styling in React (Tailwind CSS)', url: 'https://tailwindcss.com/docs/installation' }
      ] },
      { id: 'fs-4', title: 'Phase 4: Backend Engineering (Days 19-24)', desc: 'Servers and RESTful APIs.', actionItems: [
        { text: 'Day 19: Node.js Basics (Modules, File System, HTTP Module)', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
        { text: 'Day 20: Express.js Server Setup and Routing', url: 'https://expressjs.com/en/starter/hello-world.html' },
        { text: 'Day 21: Express Middleware and Error Handling', url: 'https://expressjs.com/en/guide/using-middleware.html' },
        { text: 'Day 22: Relational Databases (PostgreSQL) & SQL Basics', url: 'https://www.postgresql.org/docs/' },
        { text: 'Day 23: NoSQL Databases (MongoDB) and Mongoose ODM', url: 'https://mongoosejs.com/docs/guide.html' },
        { text: 'Day 24: Authentication (JWT, Bcrypt) and REST API Design', url: 'https://jwt.io/introduction' }
      ] },
      { id: 'fs-5', title: 'Phase 5: Full Stack Capstone (Days 25-30)', desc: 'Putting it all together.', actionItems: [
        { text: 'Day 25: Initialize Full Stack Capstone (e.g. Social App or E-com)', url: 'https://www.freecodecamp.org/news/how-to-build-a-fullstack-app/' },
        { text: 'Day 26: Build Backend Models and API Routes', url: 'https://expressjs.com/en/guide/routing.html' },
        { text: 'Day 27: Build Frontend UI and connect to Backend via Fetch/Axios', url: 'https://axios-http.com/docs/intro' },
        { text: 'Day 28: Implement Authentication flow (Login/Register sessions)', url: 'https://developer.mozilla.org/en-US/docs/Web/Security' },
        { text: 'Day 29: Test application and fix bugs (Edge Cases)', url: 'https://testing-library.com/docs/react-testing-library/intro/' },
        { text: 'Day 30: Deploy Backend to Render/Railway and Frontend to Vercel', url: 'https://vercel.com/docs' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Fireship Web Dev Fast Guides', url: 'https://www.youtube.com/@Fireship', type: 'channel' },
        { title: 'Traversy Media Full Stack Courses', url: 'https://www.youtube.com/@TraversyMedia', type: 'channel' }
      ],
      platforms: [
        { title: 'The Odin Project', desc: '100% Free full stack curriculum.', url: 'https://www.theodinproject.com/' },
        { title: 'freeCodeCamp Web Curriculum', desc: 'Interactive coding & projects.', url: 'https://www.freecodecamp.org/learn' }
      ],
      certifications: [
        { title: 'Meta Front-End & React Certificate', desc: 'Industry-standard frontend cert.', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' }
      ]
    }
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'A 30-day deep dive from Python basics to deploying Large Language Models (LLMs).',
    icon: BrainCircuit,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500',
    borderClass: 'hover:border-orange-500/50',
    steps: [
      { id: 'ai-1', title: 'Phase 1: Math & Python (Days 1-6)', desc: 'The critical prerequisites.', actionItems: [
        { text: 'Day 1: Set up Jupyter/Colab and learn Python basics', url: 'https://www.kaggle.com/learn/python' },
        { text: 'Day 2: Python Data Structures (Lists, Dicts, Tuples)', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { text: 'Day 3: Linear Algebra (Vectors, Matrices, Dot Products)', url: 'https://www.khanacademy.org/math/linear-algebra' },
        { text: 'Day 4: Calculus for ML (Derivatives, Gradients)', url: 'https://www.khanacademy.org/math/multivariable-calculus' },
        { text: 'Day 5: Probability & Statistics (Distributions, Bayes Theorem)', url: 'https://www.khanacademy.org/math/statistics-probability' },
        { text: 'Day 6: Intro to NumPy (Broadcasting, Matrix operations)', url: 'https://numpy.org/doc/stable/user/quickstart.html' }
      ] },
      { id: 'ai-2', title: 'Phase 2: Data Manipulation & EDA (Days 7-12)', desc: 'Handle and visualize datasets.', actionItems: [
        { text: 'Day 7: Intro to Pandas (Series and DataFrames)', url: 'https://pandas.pydata.org/docs/user_guide/10min.html' },
        { text: 'Day 8: Data Cleaning (Handling NaNs, duplicates, outliers)', url: 'https://www.kaggle.com/learn/data-cleaning' },
        { text: 'Day 9: Grouping, Merging, and Aggregating data in Pandas', url: 'https://pandas.pydata.org/pandas-docs/stable/user_guide/groupby.html' },
        { text: 'Day 10: Data Visualization with Matplotlib', url: 'https://matplotlib.org/stable/tutorials/introductory/pyplot.html' },
        { text: 'Day 11: Statistical plotting with Seaborn', url: 'https://seaborn.pydata.org/tutorial.html' },
        { text: 'Day 12: Exploratory Data Analysis (EDA) on a Kaggle dataset', url: 'https://www.kaggle.com/datasets' }
      ] },
      { id: 'ai-3', title: 'Phase 3: Machine Learning Algorithms (Days 13-18)', desc: 'Supervised & Unsupervised Learning.', actionItems: [
        { text: 'Day 13: Intro to Scikit-Learn and Linear Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html' },
        { text: 'Day 14: Logistic Regression and Classification Metrics', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
        { text: 'Day 15: Decision Trees and Random Forests', url: 'https://scikit-learn.org/stable/modules/ensemble.html' },
        { text: 'Day 16: Support Vector Machines (SVM) and KNN', url: 'https://scikit-learn.org/stable/modules/svm.html' },
        { text: 'Day 17: Unsupervised Learning (K-Means Clustering, PCA)', url: 'https://scikit-learn.org/stable/modules/clustering.html' },
        { text: 'Day 18: Hyperparameter Tuning (GridSearch) and Cross Validation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html' }
      ] },
      { id: 'ai-4', title: 'Phase 4: Deep Learning (Days 19-24)', desc: 'Neural networks and state-of-the-art models.', actionItems: [
        { text: 'Day 19: Artificial Neural Networks (ANN) & Backpropagation', url: 'https://www.3blue1brown.com/topics/neural-networks' },
        { text: 'Day 20: Intro to PyTorch or TensorFlow frameworks', url: 'https://pytorch.org/tutorials/beginner/basics/intro.html' },
        { text: 'Day 21: Computer Vision: Convolutional Neural Networks (CNN)', url: 'https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html' },
        { text: 'Day 22: Image Classification project using ResNet/VGG', url: 'https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html' },
        { text: 'Day 23: NLP Basics: Recurrent Neural Networks (RNN/LSTM)', url: 'https://pytorch.org/tutorials/intermediate/char_rnn_classification_tutorial.html' },
        { text: 'Day 24: Attention Mechanisms and Transformers', url: 'https://jalammar.github.io/illustrated-transformer/' }
      ] },
      { id: 'ai-5', title: 'Phase 5: LLMs & MLOps (Days 25-30)', desc: 'Deploying intelligence.', actionItems: [
        { text: 'Day 25: Using Pre-trained Models via Hugging Face', url: 'https://huggingface.co/docs/transformers/index' },
        { text: 'Day 26: Prompt Engineering for ChatGPT/Gemini APIs', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' },
        { text: 'Day 27: Fine-tuning LLMs with PEFT/LoRA', url: 'https://huggingface.co/docs/peft/index' },
        { text: 'Day 28: Model Deployment via FastAPI', url: 'https://fastapi.tiangolo.com/' },
        { text: 'Day 29: Containerizing ML Models with Docker', url: 'https://docs.docker.com/get-started/' },
        { text: 'Day 30: Host your ML App on Hugging Face Spaces or Streamlit', url: 'https://huggingface.co/spaces' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'StatQuest with Josh Starmer', url: 'https://www.youtube.com/@statquest', type: 'channel' },
        { title: 'Andrej Karpathy Neural Networks Zero to Hero', url: 'https://www.youtube.com/@AndrejKarpathy', type: 'channel' }
      ],
      platforms: [
        { title: 'Kaggle Micro-Courses', desc: 'Free GPU notebooks and competitions.', url: 'https://www.kaggle.com/learn' },
        { title: 'Hugging Face Hub', desc: 'Pre-trained AI models and datasets.', url: 'https://huggingface.co/' }
      ],
      certifications: [
        { title: 'DeepLearning.AI TensorFlow Professional', desc: 'Andrew Ng deep learning cert.', url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice' }
      ]
    }
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Ethical Hacking',
    description: 'Learn to protect networks and hack ethically in 30 days.',
    icon: ShieldCheck,
    color: 'text-red-400',
    bgColor: 'bg-red-500',
    borderClass: 'hover:border-red-500/50',
    steps: [
      { id: 'sec-1', title: 'Phase 1: IT & Networking (Days 1-6)', desc: 'TCP/IP, Linux, and Windows internals.', actionItems: [
        { text: 'Day 1: Setup Kali Linux VM via VirtualBox', url: 'https://www.kali.org/docs/' },
        { text: 'Day 2: Master Linux CLI (ls, cd, chmod, grep, pipelines)', url: 'https://linuxjourney.com/' },
        { text: 'Day 3: OSI Model and TCP/IP stack understanding', url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-osi-model/' },
        { text: 'Day 4: DNS, DHCP, HTTP/HTTPS protocols in depth', url: 'https://howdns.works/' },
        { text: 'Day 5: Subnetting and IP Addressing (IPv4 vs IPv6)', url: 'https://www.cloudflare.com/learning/network-layer/what-is-subnetting/' },
        { text: 'Day 6: Windows Active Directory & Domain basics', url: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-domain-services' }
      ] },
      { id: 'sec-2', title: 'Phase 2: Security Fundamentals (Days 7-12)', desc: 'Cryptography and Risk.', actionItems: [
        { text: 'Day 7: The CIA Triad and Threat Modeling', url: 'https://csrc.nist.gov/glossary/term/cia_triad' },
        { text: 'Day 8: Symmetric vs Asymmetric Encryption', url: 'https://www.khanacademy.org/computing/computer-science/cryptography' },
        { text: 'Day 9: Hashing (MD5, SHA) and Digital Signatures', url: 'https://www.cloudflare.com/learning/ssl/what-is-a-digital-signature/' },
        { text: 'Day 10: IAM (Identity Access Management) and RBAC', url: 'https://www.cloudflare.com/learning/access-management/what-is-iam/' },
        { text: 'Day 11: Firewalls, IDS, and IPS systems', url: 'https://www.cisco.com/c/en/us/products/security/firewalls/what-is-a-firewall.html' },
        { text: 'Day 12: Malware types (Trojans, Ransomware, Worms)', url: 'https://www.cisa.gov/topics/cyber-threats-and-advisories/malware' }
      ] },
      { id: 'sec-3', title: 'Phase 3: Pentesting Basics (Days 13-18)', desc: 'Information Gathering and Scanning.', actionItems: [
        { text: 'Day 13: OSINT (Open Source Intelligence) techniques', url: 'https://osintframework.com/' },
        { text: 'Day 14: Network Scanning with Nmap (Syntax & Scripts)', url: 'https://nmap.org/book/man.html' },
        { text: 'Day 15: Packet Analysis with Wireshark', url: 'https://www.wireshark.org/docs/' },
        { text: 'Day 16: Vulnerability Scanning (Nessus/OpenVAS)', url: 'https://www.tenable.com/products/nessus' },
        { text: 'Day 17: Metasploit Framework Basics (Exploits & Payloads)', url: 'https://docs.metasploit.com/' },
        { text: 'Day 18: Privilege Escalation (Linux/Windows)', url: 'https://github.com/carlospolop/PEASS-ng' }
      ] },
      { id: 'sec-4', title: 'Phase 4: Web App Security (Days 19-24)', desc: 'OWASP Top 10.', actionItems: [
        { text: 'Day 19: Web Architecture and setting up Burp Suite', url: 'https://portswigger.net/burp/communitydownload' },
        { text: 'Day 20: SQL Injection (SQLi) techniques', url: 'https://portswigger.net/web-security/sql-injection' },
        { text: 'Day 21: Cross-Site Scripting (XSS) - Reflected/Stored', url: 'https://portswigger.net/web-security/cross-site-scripting' },
        { text: 'Day 22: Cross-Site Request Forgery (CSRF) and SSRF', url: 'https://portswigger.net/web-security/csrf' },
        { text: 'Day 23: Authentication bypass and Broken Access Control', url: 'https://portswigger.net/web-security/access-control' },
        { text: 'Day 24: Command Injection and File Inclusion (LFI/RFI)', url: 'https://portswigger.net/web-security/os-command-injection' }
      ] },
      { id: 'sec-5', title: 'Phase 5: Bug Bounty & CTFs (Days 25-30)', desc: 'Real-world practice.', actionItems: [
        { text: 'Day 25: Solve beginner rooms on TryHackMe (e.g. Basic Pentesting)', url: 'https://tryhackme.com/' },
        { text: 'Day 26: Practice Web exploits on PortSwigger Academy', url: 'https://portswigger.net/web-security' },
        { text: 'Day 27: Tackle a retired machine on HackTheBox', url: 'https://www.hackthebox.com/' },
        { text: 'Day 28: Learn Bug Bounty scope and reporting rules', url: 'https://docs.hackerone.com/' },
        { text: 'Day 29: Setup a reconnaissance pipeline for bounties', url: 'https://www.hackerone.com/' },
        { text: 'Day 30: Submit your first bug bounty report', url: 'https://www.bugcrowd.com/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'NetworkChuck Networking & Hacking', url: 'https://www.youtube.com/@NetworkChuck', type: 'channel' },
        { title: 'David Bombal Ethical Hacking Labs', url: 'https://www.youtube.com/@DavidBombal', type: 'channel' }
      ],
      platforms: [
        { title: 'TryHackMe Cyber Labs', desc: 'Hands-on browser-based rooms.', url: 'https://tryhackme.com/' },
        { title: 'PortSwigger Web Security Academy', desc: '100% Free OWASP training.', url: 'https://portswigger.net/web-security' }
      ],
      certifications: [
        { title: 'CompTIA Security+ (SY0-701)', desc: 'Global foundational security standard.', url: 'https://www.comptia.org/certifications/security' }
      ]
    }
  },
  {
    id: 'gate-prep',
    title: 'GATE Preparation (CSE/IT/Core)',
    description: 'A 30-day intensive crash course plan to ace GATE.',
    icon: GraduationCap,
    color: 'text-brand-pink',
    bgColor: 'bg-brand-pink',
    borderClass: 'hover:border-brand-pink/50',
    steps: [
      { id: 'gate-1', title: 'Phase 1: Math & Aptitude (Days 1-6)', desc: 'High scoring areas.', actionItems: [
        { text: 'Day 1: Analyze past 10 years marks weightage', url: 'https://www.geeksforgeeks.org/gate-cs-notes/' },
        { text: 'Day 2: General Aptitude & Verbal Reasoning Practice', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' },
        { text: 'Day 3: Engineering Math: Probability & Statistics', url: 'https://www.geeksforgeeks.org/engineering-mathematics-tutorials/' },
        { text: 'Day 4: Engineering Math: Linear Algebra & Calculus', url: 'https://www.geeksforgeeks.org/matrix-introduction/' },
        { text: 'Day 5: Discrete Math: Logic & Set Theory', url: 'https://www.geeksforgeeks.org/discrete-mathematics-tutorial/' },
        { text: 'Day 6: Discrete Math: Graph Theory & Combinatorics', url: 'https://www.geeksforgeeks.org/mathematics-graph-theory-basics-set-1/' }
      ] },
      { id: 'gate-2', title: 'Phase 2: Heavy Core 1 (Days 7-12)', desc: 'TOC & DSA.', actionItems: [
        { text: 'Day 7: Theory of Computation: Regular Languages & Automata', url: 'https://www.geeksforgeeks.org/introduction-of-theory-of-computation/' },
        { text: 'Day 8: TOC: Context-Free Languages & Turing Machines', url: 'https://www.geeksforgeeks.org/turing-machine-in-toc/' },
        { text: 'Day 9: Compiler Design: Parsing & Syntax Analysis', url: 'https://www.geeksforgeeks.org/compiler-design-tutorials/' },
        { text: 'Day 10: Programming in C (Pointers, Scope, Recursion)', url: 'https://www.geeksforgeeks.org/c-programming-language/' },
        { text: 'Day 11: Data Structures: Trees, Graphs, Hashing', url: 'https://www.geeksforgeeks.org/data-structures/' },
        { text: 'Day 12: Algorithms: Asymptotic Analysis & Graph Algos', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' }
      ] },
      { id: 'gate-3', title: 'Phase 3: Heavy Core 2 (Days 13-18)', desc: 'OS & DBMS.', actionItems: [
        { text: 'Day 13: OS: Process Scheduling & Threads', url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/' },
        { text: 'Day 14: OS: Synchronization & Deadlocks (Semaphores)', url: 'https://www.geeksforgeeks.org/introduction-of-process-synchronization/' },
        { text: 'Day 15: OS: Memory Management & Paging', url: 'https://www.geeksforgeeks.org/memory-management-in-operating-system/' },
        { text: 'Day 16: DBMS: ER Models & Relational Algebra', url: 'https://www.geeksforgeeks.org/dbms/' },
        { text: 'Day 17: DBMS: SQL Queries & Normalization (1NF to BCNF)', url: 'https://www.geeksforgeeks.org/normalization-in-dbms/' },
        { text: 'Day 18: DBMS: Transactions & Concurrency Control', url: 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/' }
      ] },
      { id: 'gate-4', title: 'Phase 4: Systems (Days 19-24)', desc: 'Networks & Architecture.', actionItems: [
        { text: 'Day 19: Computer Networks: OSI, TCP/UDP, IP Addressing', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
        { text: 'Day 20: CN: Routing Algorithms & Application Layer', url: 'https://www.geeksforgeeks.org/routing-algorithms-in-computer-networks/' },
        { text: 'Day 21: Digital Logic: Boolean Algebra & Combinational Circuits', url: 'https://www.geeksforgeeks.org/digital-logic/' },
        { text: 'Day 22: Digital Logic: Sequential Circuits & K-Maps', url: 'https://www.geeksforgeeks.org/karnaugh-map-k-map/' },
        { text: 'Day 23: COA: Instruction Pipelining & Hazards', url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/' },
        { text: 'Day 24: COA: Cache Memory Mapping & Organization', url: 'https://www.geeksforgeeks.org/cache-memory-in-computer-organization/' }
      ] },
      { id: 'gate-5', title: 'Phase 5: Revision & Mocks (Days 25-30)', desc: 'Final push.', actionItems: [
        { text: 'Day 25: Compile Short Notes (Formula Sheets) for all subjects', url: 'https://www.geeksforgeeks.org/gate-cs-notes/' },
        { text: 'Day 26: Solve Official Previous Year Question Papers (PYQs)', url: 'https://gate.iitr.ac.in/' },
        { text: 'Day 27: Analyze Mock Test 1 & Revise weak areas', url: 'https://gateoverflow.in/' },
        { text: 'Day 28: Practice GATE Overflow Question Bank', url: 'https://gateoverflow.in/' },
        { text: 'Day 29: Analyze Mock Test 2 & Practice remaining PYQs', url: 'https://www.geeksforgeeks.org/gate-cs-corner-gq/' },
        { text: 'Day 30: Final relax, light formula review, and exam prep', url: 'https://gate.iitr.ac.in/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Gate Smashers (Varun Singla)', url: 'https://www.youtube.com/@GateSmashers', type: 'channel' },
        { title: 'Knowledge Gate (Sanchit Jain)', url: 'https://www.youtube.com/@KnowledgeGate_SanchitJain', type: 'channel' }
      ],
      platforms: [
        { title: 'GATE Overflow Discussion Forum', desc: 'Best peer-reviewed GATE CS PYQs.', url: 'https://gateoverflow.in/' },
        { title: 'GeeksforGeeks GATE Corner', desc: 'Subject-wise short notes and quizzes.', url: 'https://www.geeksforgeeks.org/gate-cs-corner-gq/' }
      ],
      certifications: [
        { title: 'Official GATE Score Card (IITs)', desc: 'Valid for 3 years for M.Tech & PSU jobs.', url: 'https://gate.iitr.ac.in/' }
      ]
    }
  },
  {
    id: 'govt-jobs',
    title: 'Government Jobs (PSUs, SSC & State)',
    description: '30-day fast track for tech/non-tech govt exams.',
    icon: Target,
    color: 'text-brand-teal',
    bgColor: 'bg-brand-teal',
    borderClass: 'hover:border-brand-teal/50',
    steps: [
      { id: 'govt-1', title: 'Phase 1: General Awareness (Days 1-6)', desc: 'History, polity, geography.', actionItems: [
        { text: 'Day 1: Read Daily Current Affairs of past 6 months', url: 'https://www.gktoday.in/current-affairs/' },
        { text: 'Day 2: Indian Polity basics (Constitution, Parliament, Articles)', url: 'https://www.gktoday.in/quiz-questions/indian-polity-gk-questions/' },
        { text: 'Day 3: Modern Indian History & Freedom Struggle', url: 'https://www.gktoday.in/quiz-questions/modern-indian-history-gk-questions/' },
        { text: 'Day 4: Geography (Rivers, Mountains, National Parks)', url: 'https://www.gktoday.in/quiz-questions/geography-gk-questions/' },
        { text: 'Day 5: General Science (Physics, Chemistry, Biology)', url: 'https://www.gktoday.in/quiz-questions/general-science-gk-questions/' },
        { text: 'Day 6: Indian Economy basics and Fiscal Policy', url: 'https://www.gktoday.in/quiz-questions/indian-economy-gk-questions/' }
      ] },
      { id: 'govt-2', title: 'Phase 2: Quantitative Aptitude (Days 7-12)', desc: 'Speed and calculation.', actionItems: [
        { text: 'Day 7: Number Systems & Simplification tricks', url: 'https://www.indiabix.com/aptitude/numbers/' },
        { text: 'Day 8: Percentages, Profit & Loss, Discount', url: 'https://www.indiabix.com/aptitude/profit-and-loss/' },
        { text: 'Day 9: Ratio & Proportion, Mixtures, Averages', url: 'https://www.indiabix.com/aptitude/ratio-and-proportion/' },
        { text: 'Day 10: Time & Work, Pipes & Cisterns', url: 'https://www.indiabix.com/aptitude/time-and-work/' },
        { text: 'Day 11: Speed, Time, Distance, Trains & Boats', url: 'https://www.indiabix.com/aptitude/time-and-distance/' },
        { text: 'Day 12: Simple & Compound Interest formulas', url: 'https://www.indiabix.com/aptitude/simple-interest/' }
      ] },
      { id: 'govt-3', title: 'Phase 3: Logical Reasoning (Days 13-18)', desc: 'Mental ability.', actionItems: [
        { text: 'Day 13: Blood Relations & Direction Sense', url: 'https://www.indiabix.com/logical-reasoning/blood-relation-test/' },
        { text: 'Day 14: Syllogisms & Venn Diagrams', url: 'https://www.indiabix.com/logical-reasoning/syllogism/' },
        { text: 'Day 15: Number & Alphabet Series', url: 'https://www.indiabix.com/logical-reasoning/number-series/' },
        { text: 'Day 16: Coding-Decoding & Analogy', url: 'https://www.indiabix.com/logical-reasoning/analogies/' },
        { text: 'Day 17: Seating Arrangements (Linear & Circular)', url: 'https://www.indiabix.com/logical-reasoning/seating-arrangement/' },
        { text: 'Day 18: Non-Verbal Reasoning (Paper folding, Mirror images)', url: 'https://www.indiabix.com/non-verbal-reasoning/questions-and-answers/' }
      ] },
      { id: 'govt-4', title: 'Phase 4: Technical Foundation (Days 19-24)', desc: 'B.Tech/Diploma core.', actionItems: [
        { text: 'Day 19: Memorize standard technical formulas & constants', url: 'https://www.geeksforgeeks.org/' },
        { text: 'Day 20: Core Technical Subject 1 (Circuits / C++ / Thermodynamics)', url: 'https://www.geeksforgeeks.org/' },
        { text: 'Day 21: Core Technical Subject 2 (DBMS / Fluid Mechanics)', url: 'https://www.geeksforgeeks.org/dbms/' },
        { text: 'Day 22: Core Technical Subject 3 (Networks / Power Systems)', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
        { text: 'Day 23: Note down frequently repeated conceptual questions', url: 'https://www.indiabix.com/engineering/' },
        { text: 'Day 24: Solve 200+ direct MCQ questions from standard papers', url: 'https://www.indiabix.com/' }
      ] },
      { id: 'govt-5', title: 'Phase 5: Mocks & HR (Days 25-30)', desc: 'Final execution.', actionItems: [
        { text: 'Day 25: Solve SSC JE / RRB JE PYQ Paper 1', url: 'https://ssc.gov.in/' },
        { text: 'Day 26: Solve PSU specific paper (BARC/ISRO/DRDO)', url: 'https://www.isro.gov.in/Careers.html' },
        { text: 'Day 27: Attempt sectional quizzes with tight timers (1 min/q)', url: 'https://www.indiabix.com/' },
        { text: 'Day 28: Prepare explanations for your Final Year Project', url: 'https://www.themuse.com/advice/star-interview-method' },
        { text: 'Day 29: Practice HR interview questions and PSU motives', url: 'https://www.themuse.com/' },
        { text: 'Day 30: Check official notification & eligibility rules', url: 'https://ssc.gov.in/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'SSC Adda247 Live Classes', url: 'https://www.youtube.com/@SSCADDA247', type: 'channel' },
        { title: 'WiFiStudy Government Exams', url: 'https://www.youtube.com/@wifistudy', type: 'channel' }
      ],
      platforms: [
        { title: 'IndiaBIX Quantitative & Reasoning', desc: 'Top aptitude practice portal.', url: 'https://www.indiabix.com/' },
        { title: 'GKToday Daily Current Affairs', desc: 'Premier GK compilation for civil and govt exams.', url: 'https://www.gktoday.in/' }
      ],
      certifications: [
        { title: 'NIELIT O/A Level Government Certification', desc: 'Recognized for government IT recruitments.', url: 'https://nielit.gov.in/' }
      ]
    }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Computing & DevOps',
    description: 'Master CI/CD, cloud infrastructure, and automation in 30 days.',
    icon: Cloud,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500',
    borderClass: 'hover:border-sky-500/50',
    steps: [
      { id: 'cloud-1', title: 'Phase 1: Linux & Networks (Days 1-6)', desc: 'The foundation.', actionItems: [
        { text: 'Day 1: Linux CLI basics (Navigation, Files, Permissions)', url: 'https://linuxjourney.com/' },
        { text: 'Day 2: Package Managers and Process Management (top, kill)', url: 'https://linuxjourney.com/lesson/processes' },
        { text: 'Day 3: Bash Scripting (Variables, Loops, Conditions)', url: 'https://www.shellscript.sh/' },
        { text: 'Day 4: Networking basics (IP, Subnetting, Ports)', url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/' },
        { text: 'Day 5: HTTP/HTTPS, DNS, and SSH key generation', url: 'https://howdns.works/' },
        { text: 'Day 6: Reverse Proxies (NGINX basics)', url: 'https://nginx.org/en/docs/' }
      ] },
      { id: 'cloud-2', title: 'Phase 2: Cloud Provider (AWS) (Days 7-12)', desc: 'Provision resources.', actionItems: [
        { text: 'Day 7: Create AWS account & setup IAM Users/Roles', url: 'https://aws.amazon.com/free/' },
        { text: 'Day 8: Launch and SSH into EC2 Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' },
        { text: 'Day 9: Object Storage with AWS S3 & Glacier', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' },
        { text: 'Day 10: Relational Database Service (RDS) setup', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html' },
        { text: 'Day 11: VPCs, Subnets, and Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' },
        { text: 'Day 12: Load Balancers (ALB) and Auto Scaling', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html' }
      ] },
      { id: 'cloud-3', title: 'Phase 3: Docker Containerization (Days 13-18)', desc: 'Package applications.', actionItems: [
        { text: 'Day 13: Install Docker and run first container', url: 'https://docs.docker.com/get-started/' },
        { text: 'Day 14: Write Dockerfiles for Node/Python apps', url: 'https://docs.docker.com/build/building/packaging/' },
        { text: 'Day 15: Docker Images, Tags, and DockerHub pushes', url: 'https://hub.docker.com/' },
        { text: 'Day 16: Docker Volumes and persistent storage', url: 'https://docs.docker.com/storage/volumes/' },
        { text: 'Day 17: Docker Networking (Bridge, Host)', url: 'https://docs.docker.com/network/' },
        { text: 'Day 18: Multi-container apps with Docker Compose', url: 'https://docs.docker.com/compose/' }
      ] },
      { id: 'cloud-4', title: 'Phase 4: CI/CD & Terraform (Days 19-24)', desc: 'Automation.', actionItems: [
        { text: 'Day 19: Git workflows (Branching, Merging, PRs)', url: 'https://git-scm.com/doc' },
        { text: 'Day 20: Intro to CI/CD concepts and GitHub Actions', url: 'https://docs.github.com/en/actions' },
        { text: 'Day 21: Write a pipeline to test and build Docker image', url: 'https://docs.github.com/en/actions/publishing-packages/publishing-docker-images' },
        { text: 'Day 22: Infrastructure as Code (IaC) theory', url: 'https://developer.hashicorp.com/terraform/intro' },
        { text: 'Day 23: Terraform basics (Providers, Resources, State)', url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started' },
        { text: 'Day 24: Provision AWS EC2 via Terraform', url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-build' }
      ] },
      { id: 'cloud-5', title: 'Phase 5: Kubernetes & Monitoring (Days 25-30)', desc: 'Orchestration.', actionItems: [
        { text: 'Day 25: Kubernetes (K8s) Architecture & Minikube setup', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' },
        { text: 'Day 26: K8s Pods and Deployments YAMLs', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
        { text: 'Day 27: K8s Services (ClusterIP, NodePort, LoadBalancer)', url: 'https://kubernetes.io/docs/concepts/services-networking/service/' },
        { text: 'Day 28: ConfigMaps and Secrets management', url: 'https://kubernetes.io/docs/concepts/configuration/configmap/' },
        { text: 'Day 29: Intro to Prometheus & Grafana Monitoring', url: 'https://prometheus.io/docs/introduction/overview/' },
        { text: 'Day 30: Deploy full app to AWS EKS as Capstone', url: 'https://aws.amazon.com/eks/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'TechWorld with Nana DevOps Bootcamp', url: 'https://www.youtube.com/@TechWorldwithNana', type: 'channel' }
      ],
      platforms: [
        { title: 'KodeKloud Hands-On Labs', desc: 'Docker & Kubernetes real environments.', url: 'https://kodekloud.com/' }
      ],
      certifications: [
        { title: 'AWS Solutions Architect Associate (SAA-C03)', desc: 'Premier cloud architecture cert.', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' }
      ]
    }
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    description: 'Build cross-platform applications for Android and iOS in 30 days.',
    icon: Smartphone,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500',
    borderClass: 'hover:border-emerald-500/50',
    steps: [
      { id: 'mob-1', title: 'Phase 1: Dart Fundamentals (Days 1-6)', desc: 'Learn Dart for Flutter.', actionItems: [
        { text: 'Day 1: Setup Flutter SDK, Android Studio & Emulators', url: 'https://docs.flutter.dev/get-started/install' },
        { text: 'Day 2: Dart Variables, Data Types, and Functions', url: 'https://dart.dev/guides/language/language-tour' },
        { text: 'Day 3: Object-Oriented Dart (Classes, Constructors)', url: 'https://dart.dev/language/classes' },
        { text: 'Day 4: Collections (Lists, Sets, Maps)', url: 'https://dart.dev/language/collections' },
        { text: 'Day 5: Error Handling and Null Safety', url: 'https://dart.dev/null-safety' },
        { text: 'Day 6: Asynchronous Dart (Futures, Async/Await)', url: 'https://dart.dev/codelabs/async-await' }
      ] },
      { id: 'mob-2', title: 'Phase 2: Flutter UI & Widgets (Days 7-12)', desc: 'Build interfaces.', actionItems: [
        { text: 'Day 7: Flutter Architecture & Everything is a Widget', url: 'https://docs.flutter.dev/ui/widgets' },
        { text: 'Day 8: Scaffold, AppBar, and Container widgets', url: 'https://docs.flutter.dev/ui/layout' },
        { text: 'Day 9: Rows, Columns, and Flex layouts', url: 'https://docs.flutter.dev/ui/layout/tutorial' },
        { text: 'Day 10: ListView, GridView, and Scrolling', url: 'https://docs.flutter.dev/cookbook/lists' },
        { text: 'Day 11: TextFields, Forms, and Validation', url: 'https://docs.flutter.dev/cookbook/forms' },
        { text: 'Day 12: Customizing Themes and Colors', url: 'https://docs.flutter.dev/cookbook/design/themes' }
      ] },
      { id: 'mob-3', title: 'Phase 3: State & Navigation (Days 13-18)', desc: 'App logic.', actionItems: [
        { text: 'Day 13: StatefulWidget vs StatelessWidget', url: 'https://docs.flutter.dev/ui/interactivity' },
        { text: 'Day 14: setState and basic state management', url: 'https://docs.flutter.dev/data-and-backend/state-mgmt/ephemeral-vs-app' },
        { text: 'Day 15: Navigation (Navigator.push/pop)', url: 'https://docs.flutter.dev/cookbook/navigation/navigation-basics' },
        { text: 'Day 16: Named Routes and passing data', url: 'https://docs.flutter.dev/cookbook/navigation/named-routes' },
        { text: 'Day 17: Bottom Navigation Bars and Tabs', url: 'https://docs.flutter.dev/cookbook/design/tabs' },
        { text: 'Day 18: Intro to Provider or Riverpod for Global State', url: 'https://docs.flutter.dev/data-and-backend/state-mgmt/simple' }
      ] },
      { id: 'mob-4', title: 'Phase 4: APIs & Storage (Days 19-24)', desc: 'Data handling.', actionItems: [
        { text: 'Day 19: Add dependencies via pubspec.yaml', url: 'https://docs.flutter.dev/packages-and-plugins/using-packages' },
        { text: 'Day 20: Fetch REST API data using HTTP package', url: 'https://docs.flutter.dev/cookbook/networking/fetch-data' },
        { text: 'Day 21: Parse JSON into Dart Data Models', url: 'https://docs.flutter.dev/data-and-backend/json' },
        { text: 'Day 22: Display API data using FutureBuilder', url: 'https://api.flutter.dev/flutter/widgets/FutureBuilder-class.html' },
        { text: 'Day 23: Local Storage with Shared Preferences', url: 'https://docs.flutter.dev/cookbook/persistence/key-value' },
        { text: 'Day 24: Local Database with SQLite (sqflite)', url: 'https://docs.flutter.dev/cookbook/persistence/sqlite' }
      ] },
      { id: 'mob-5', title: 'Phase 5: Firebase & Publishing (Days 25-30)', desc: 'Polish and Release.', actionItems: [
        { text: 'Day 25: Connect app to Firebase console', url: 'https://firebase.google.com/docs/flutter/setup' },
        { text: 'Day 26: Implement Firebase Authentication', url: 'https://firebase.google.com/docs/auth/flutter/start' },
        { text: 'Day 27: Store data in Cloud Firestore', url: 'https://firebase.google.com/docs/firestore/quickstart' },
        { text: 'Day 28: Use Camera/Image Picker hardware plugins', url: 'https://docs.flutter.dev/cookbook/plugins/picture-using-camera' },
        { text: 'Day 29: Generate App Icons and Splash Screens', url: 'https://pub.dev/packages/flutter_launcher_icons' },
        { text: 'Day 30: Build signed APK/AAB and review Play Store guidelines', url: 'https://docs.flutter.dev/deployment/android' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Flutter Official YouTube & Widget of the Week', url: 'https://www.youtube.com/@flutterdev', type: 'channel' }
      ],
      platforms: [
        { title: 'Flutter.dev Cookbook', desc: 'Practical recipes for Flutter apps.', url: 'https://docs.flutter.dev/cookbook' }
      ],
      certifications: [
        { title: 'Google Associate Android Developer', desc: 'Official Android certification.', url: 'https://developers.google.com/learn/certification' }
      ]
    }
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Extract insights from data using statistical analysis and Python in 30 days.',
    icon: BarChart,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500',
    borderClass: 'hover:border-indigo-500/50',
    steps: [
      { id: 'ds-1', title: 'Phase 1: Statistics & SQL (Days 1-6)', desc: 'The backbone of analysis.', actionItems: [
        { text: 'Day 1: Mean, Median, Mode, Variance, and Std Deviation', url: 'https://www.khanacademy.org/math/statistics-probability' },
        { text: 'Day 2: Probability Distributions (Normal, Binomial)', url: 'https://seeing-theory.brown.edu/' },
        { text: 'Day 3: Hypothesis Testing and P-Values', url: 'https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample' },
        { text: 'Day 4: SQL SELECT, WHERE, and Aggregate Functions', url: 'https://www.w3schools.com/sql/' },
        { text: 'Day 5: SQL Joins (INNER, LEFT, RIGHT) and Group By', url: 'https://www.w3schools.com/sql/sql_join.asp' },
        { text: 'Day 6: Advanced SQL (Window Functions & CTEs)', url: 'https://mode.com/sql-tutorial/sql-window-functions/' }
      ] },
      { id: 'ds-2', title: 'Phase 2: Python Data Wrangling (Days 7-12)', desc: 'Clean messy data.', actionItems: [
        { text: 'Day 7: Python syntax, Lists, Dicts for Data Science', url: 'https://www.kaggle.com/learn/python' },
        { text: 'Day 8: NumPy Arrays and Vectorized operations', url: 'https://numpy.org/doc/stable/user/quickstart.html' },
        { text: 'Day 9: Pandas DataFrames (Indexing, Filtering, Selection)', url: 'https://pandas.pydata.org/docs/getting_started/index.html' },
        { text: 'Day 10: Pandas GroupBy and Merging Datasets', url: 'https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html' },
        { text: 'Day 11: Handling Missing Values (NaN) and Duplicates', url: 'https://www.kaggle.com/learn/data-cleaning' },
        { text: 'Day 12: Detecting and removing outliers (Z-Score/IQR)', url: 'https://www.geeksforgeeks.org/detect-and-remove-the-outliers-using-python/' }
      ] },
      { id: 'ds-3', title: 'Phase 3: Data Visualization (Days 13-18)', desc: 'Tell a story.', actionItems: [
        { text: 'Day 13: Matplotlib basics (Line, Bar, Scatter plots)', url: 'https://matplotlib.org/stable/tutorials/introductory/pyplot.html' },
        { text: 'Day 14: Advanced styling and Subplots in Matplotlib', url: 'https://matplotlib.org/stable/gallery/index.html' },
        { text: 'Day 15: Statistical plotting with Seaborn (Heatmaps, Pairplots)', url: 'https://seaborn.pydata.org/tutorial.html' },
        { text: 'Day 16: Interactive plots with Plotly', url: 'https://plotly.com/python/' },
        { text: 'Day 17: Dashboarding Basics in Tableau (Connecting Data)', url: 'https://www.tableau.com/learn/training' },
        { text: 'Day 18: Build a PowerBI / Tableau Interactive Dashboard', url: 'https://learn.microsoft.com/en-us/power-bi/' }
      ] },
      { id: 'ds-4', title: 'Phase 4: Predictive Modeling (Days 19-24)', desc: 'Machine Learning.', actionItems: [
        { text: 'Day 19: Intro to Scikit-Learn and Train/Test Split', url: 'https://scikit-learn.org/stable/getting_started.html' },
        { text: 'Day 20: Simple & Multiple Linear Regression', url: 'https://scikit-learn.org/stable/modules/linear_model.html' },
        { text: 'Day 21: Logistic Regression for Classification', url: 'https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression' },
        { text: 'Day 22: Evaluation Metrics (Confusion Matrix, Precision, Recall)', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
        { text: 'Day 23: Decision Trees and Random Forests overview', url: 'https://scikit-learn.org/stable/modules/ensemble.html' },
        { text: 'Day 24: K-Means Clustering (Unsupervised)', url: 'https://scikit-learn.org/stable/modules/clustering.html' }
      ] },
      { id: 'ds-5', title: 'Phase 5: Capstone Project (Days 25-30)', desc: 'End-to-End Analysis.', actionItems: [
        { text: 'Day 25: Find a unique dataset on Kaggle or UCI Repository', url: 'https://www.kaggle.com/datasets' },
        { text: 'Day 26: Perform complete Exploratory Data Analysis (EDA)', url: 'https://www.kaggle.com/learn/data-visualization' },
        { text: 'Day 27: Feature Engineering (One-Hot Encoding, Scaling)', url: 'https://scikit-learn.org/stable/modules/preprocessing.html' },
        { text: 'Day 28: Train models and tune hyperparameters (GridSearch)', url: 'https://scikit-learn.org/stable/modules/grid_search.html' },
        { text: 'Day 29: Extract business insights from model weights', url: 'https://christophm.github.io/interpretable-ml-book/' },
        { text: 'Day 30: Publish notebook on GitHub/Kaggle and write a portfolio post', url: 'https://www.kaggle.com/code' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Ken Jee Data Science Career Guides', url: 'https://www.youtube.com/@KenJee_ds', type: 'channel' },
        { title: 'Alex The Analyst SQL & PowerBI', url: 'https://www.youtube.com/@AlexTheAnalyst', type: 'channel' }
      ],
      platforms: [
        { title: 'Kaggle Datasets & Notebooks', desc: 'The largest data science community.', url: 'https://www.kaggle.com/' }
      ],
      certifications: [
        { title: 'Google Data Analytics Professional Certificate', desc: 'Global entry-level data analyst standard.', url: 'https://www.coursera.org/professional-certificates/google-data-analytics' }
      ]
    }
  },
  {
    id: 'ui-ux',
    title: 'UI/UX & Product Design',
    description: 'Design beautiful, user-centric digital experiences in 30 days.',
    icon: PenTool,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500',
    borderClass: 'hover:border-pink-500/50',
    steps: [
      { id: 'ui-1', title: 'Phase 1: Design Fundamentals (Days 1-6)', desc: 'Visual rules.', actionItems: [
        { text: 'Day 1: Learn UI vs UX and Design Thinking', url: 'https://www.nngroup.com/articles/design-thinking/' },
        { text: 'Day 2: Visual Hierarchy and Laws of UX (Fitts, Hick)', url: 'https://lawsofux.com/' },
        { text: 'Day 3: Color Theory, Contrast, and Accessibility (Material 3)', url: 'https://m3.material.io/styles/color/overview' },
        { text: 'Day 4: Typography (Pairings, Line Height, Scales)', url: 'https://type-scale.com/' },
        { text: 'Day 5: Spacing (8pt Grid System) and Layouts', url: 'https://spec.fm/specifics/8-pt-grid' },
        { text: 'Day 6: Recreate 3 popular app screens exactly (Copywork)', url: 'https://mobbin.com/' }
      ] },
      { id: 'ui-2', title: 'Phase 2: UX Research (Days 7-12)', desc: 'Understanding users.', actionItems: [
        { text: 'Day 7: Write a research plan and define objectives', url: 'https://www.nngroup.com/articles/ux-research-cheat-sheet/' },
        { text: 'Day 8: How to conduct unbiased User Interviews', url: 'https://www.nngroup.com/articles/user-interviews/' },
        { text: 'Day 9: Create User Personas based on data', url: 'https://www.nngroup.com/articles/persona-types/' },
        { text: 'Day 10: Map out a User Journey / Empathy Map', url: 'https://www.nngroup.com/articles/journey-mapping-101/' },
        { text: 'Day 11: Information Architecture and User Flows', url: 'https://www.nngroup.com/articles/ia-study-guide/' },
        { text: 'Day 12: Card Sorting and Tree Testing', url: 'https://www.nngroup.com/articles/card-sorting-definition/' }
      ] },
      { id: 'ui-3', title: 'Phase 3: Figma & Wireframes (Days 13-18)', desc: 'Prototyping.', actionItems: [
        { text: 'Day 13: Master Figma interface and shortcuts', url: 'https://help.figma.com/hc/en-us' },
        { text: 'Day 14: Sketch Low-Fidelity (Lo-Fi) Wireframes on paper', url: 'https://balsamiq.com/learn/articles/wireframing/' },
        { text: 'Day 15: Digitize wireframes in Figma', url: 'https://help.figma.com/hc/en-us' },
        { text: 'Day 16: Learn Auto-Layout in Figma', url: 'https://help.figma.com/hc/en-us/articles/360040451373-Using-auto-layout' },
        { text: 'Day 17: Create reusable Figma Components & Variants', url: 'https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma' },
        { text: 'Day 18: Build basic click-through prototypes', url: 'https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma' }
      ] },
      { id: 'ui-4', title: 'Phase 4: High-Fidelity & Systems (Days 19-24)', desc: 'Polishing designs.', actionItems: [
        { text: 'Day 19: Apply Colors, Typography, and Images to wireframes', url: 'https://dribbble.com/' },
        { text: 'Day 20: Study Design Systems (Material Design 3, Apple HIG)', url: 'https://m3.material.io/' },
        { text: 'Day 21: Build a mini Design System / UI Kit in Figma', url: 'https://www.figma.com/community' },
        { text: 'Day 22: Design empty states and error messages', url: 'https://emptystat.es/' },
        { text: 'Day 23: Advanced Prototyping (Smart Animate)', url: 'https://help.figma.com/hc/en-us/articles/360039818874-Smart-animate-layers-and-objects' },
        { text: 'Day 24: Micro-interactions and transitions', url: 'https://www.awwwards.com/' }
      ] },
      { id: 'ui-5', title: 'Phase 5: Testing & Portfolio (Days 25-30)', desc: 'Showcase work.', actionItems: [
        { text: 'Day 25: Usability Testing principles and methods', url: 'https://www.nngroup.com/articles/usability-testing-101/' },
        { text: 'Day 26: Run A/B tests or unmoderated tests on your prototype', url: 'https://www.nngroup.com/articles/ab-testing-ux-research/' },
        { text: 'Day 27: Handoff designs to developers (Inspect mode)', url: 'https://help.figma.com/hc/en-us/articles/360039832014-Guide-to-developer-handoff' },
        { text: 'Day 28: Structure a Case Study (Problem, Process, Solution)', url: 'https://www.bestfolios.com/casestudy' },
        { text: 'Day 29: Design your Behance/Notion portfolio layout', url: 'https://www.behance.net/' },
        { text: 'Day 30: Publish Case Study and request community feedback', url: 'https://dribbble.com/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Flux Academy UI/UX Mastery', url: 'https://www.youtube.com/@FluxAcademy', type: 'channel' },
        { title: 'Mizko Product Design', url: 'https://www.youtube.com/@mizko', type: 'channel' }
      ],
      platforms: [
        { title: 'Figma Community Resources & Plugins', desc: 'Free UI kits and design files.', url: 'https://www.figma.com/community' },
        { title: 'Mobbin Mobile & Web Flows', desc: 'Real-world UI design patterns.', url: 'https://mobbin.com/' }
      ],
      certifications: [
        { title: 'Google UX Design Professional Certificate', desc: 'Complete end-to-end design cert.', url: 'https://www.coursera.org/professional-certificates/google-ux-design' }
      ]
    }
  },
  {
    id: 'game-dev',
    title: 'Game Development',
    description: 'Create interactive worlds using Unity & C# in 30 days.',
    icon: Gamepad2,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500',
    borderClass: 'hover:border-violet-500/50',
    steps: [
      { id: 'game-1', title: 'Phase 1: Unity & C# Basics (Days 1-6)', desc: 'Engine foundations.', actionItems: [
        { text: 'Day 1: Install Unity Hub and Editor. Explore the interface', url: 'https://unity.com/download' },
        { text: 'Day 2: GameObjects, Transforms, and Prefabs', url: 'https://docs.unity3d.com/Manual/UsingTheEditor.html' },
        { text: 'Day 3: C# Basics (Variables, Functions, Classes)', url: 'https://learn.unity.com/' },
        { text: 'Day 4: Unity Monobehaviour (Start, Update, Awake)', url: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.html' },
        { text: 'Day 5: Reading Input (Keyboard/Mouse) for movement', url: 'https://docs.unity3d.com/Packages/com.unity.inputsystem@latest/index.html' },
        { text: 'Day 6: Instantiate and Destroy objects dynamically', url: 'https://docs.unity3d.com/ScriptReference/Object.Instantiate.html' }
      ] },
      { id: 'game-2', title: 'Phase 2: Physics & Collisions (Days 7-12)', desc: 'Movement mechanics.', actionItems: [
        { text: 'Day 7: Vector Math for Games (Add, Normalize)', url: 'https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces' },
        { text: 'Day 8: Rigidbodies and Gravity', url: 'https://docs.unity3d.com/Manual/class-Rigidbody.html' },
        { text: 'Day 9: Colliders (Box, Sphere, Capsule)', url: 'https://docs.unity3d.com/Manual/CollidersOverview.html' },
        { text: 'Day 10: Physics Materials (Bounciness, Friction)', url: 'https://docs.unity3d.com/Manual/class-PhysicMaterial.html' },
        { text: 'Day 11: Collision Detection (OnCollisionEnter)', url: 'https://docs.unity3d.com/ScriptReference/Collider.OnCollisionEnter.html' },
        { text: 'Day 12: Triggers (OnTriggerEnter) for collectables', url: 'https://docs.unity3d.com/ScriptReference/Collider.OnTriggerEnter.html' }
      ] },
      { id: 'game-3', title: 'Phase 3: Graphics, Audio, UI (Days 13-18)', desc: 'Making it look good.', actionItems: [
        { text: 'Day 13: Import 3D Models and Textures', url: 'https://learn.unity.com/' },
        { text: 'Day 14: Shaders and Materials basics', url: 'https://docs.unity3d.com/Manual/Shaders.html' },
        { text: 'Day 15: Lighting (Directional, Point, Baking)', url: 'https://docs.unity3d.com/Manual/LightingOverview.html' },
        { text: 'Day 16: Setup AudioSources and AudioListeners', url: 'https://docs.unity3d.com/Manual/AudioOverview.html' },
        { text: 'Day 17: Build a UI Canvas (Buttons, Text, Health Bars)', url: 'https://docs.unity3d.com/Packages/com.unity.ugui@latest/index.html' },
        { text: 'Day 18: Connect UI to C# scripts (Game Over screens)', url: 'https://docs.unity3d.com/Packages/com.unity.ugui@latest/index.html' }
      ] },
      { id: 'game-4', title: 'Phase 4: AI & Logic (Days 19-24)', desc: 'Enemies and state.', actionItems: [
        { text: 'Day 19: Raycasting for shooting or detection', url: 'https://docs.unity3d.com/ScriptReference/Physics.Raycast.html' },
        { text: 'Day 20: Bake a NavMesh for AI Pathfinding', url: 'https://docs.unity3d.com/Manual/nav-NavigationSystem.html' },
        { text: 'Day 21: Implement NavMeshAgent on enemy objects', url: 'https://docs.unity3d.com/ScriptReference/AI.NavMeshAgent.html' },
        { text: 'Day 22: Build a Finite State Machine (Idle, Chase, Attack)', url: 'https://gameprogrammingpatterns.com/state.html' },
        { text: 'Day 23: Scene Management (Loading Levels)', url: 'https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.html' },
        { text: 'Day 24: Save game state using PlayerPrefs', url: 'https://docs.unity3d.com/ScriptReference/PlayerPrefs.html' }
      ] },
      { id: 'game-5', title: 'Phase 5: Polish & Publish (Days 25-30)', desc: 'Release your game.', actionItems: [
        { text: 'Day 25: Add Particle Systems for explosions/magic', url: 'https://docs.unity3d.com/Manual/ParticleSystems.html' },
        { text: 'Day 26: Implement Post-Processing (Bloom, Color Grading)', url: 'https://docs.unity3d.com/Manual/PostProcessingOverview.html' },
        { text: 'Day 27: Profile game performance (Fix frame drops)', url: 'https://docs.unity3d.com/Manual/Profiler.html' },
        { text: 'Day 28: Object Pooling pattern to save memory', url: 'https://learn.unity.com/' },
        { text: 'Day 29: Build settings for PC or WebGL', url: 'https://docs.unity3d.com/Manual/BuildSettings.html' },
        { text: 'Day 30: Upload game to Itch.io and share with friends', url: 'https://itch.io/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Brackeys Unity Archive & Tutorials', url: 'https://www.youtube.com/@Brackeys', type: 'channel' },
        { title: 'Code Monkey C# & Unity Guides', url: 'https://www.youtube.com/@CodeMonkeyUnity', type: 'channel' }
      ],
      platforms: [
        { title: 'Unity Learn Portal', desc: 'Official Unity courses and guided paths.', url: 'https://learn.unity.com/' },
        { title: 'Itch.io Indie Game Community', desc: 'Publish and play indie games.', url: 'https://itch.io/' }
      ],
      certifications: [
        { title: 'Unity Certified User: Programmer', desc: 'Industry recognized game dev cert.', url: 'https://unity.com/products/certifications' }
      ]
    }
  },
  {
    id: 'web3',
    title: 'Blockchain & Web3 Development',
    description: 'Build decentralized applications (dApps) and smart contracts in 30 days.',
    icon: Blocks,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500',
    borderClass: 'hover:border-amber-500/50',
    steps: [
      { id: 'web3-1', title: 'Phase 1: Blockchain Basics (Days 1-6)', desc: 'Cryptography and nodes.', actionItems: [
        { text: 'Day 1: What is Blockchain? (Hashes, Blocks, Chains)', url: 'https://andersbrownworth.com/blockchain/' },
        { text: 'Day 2: Public/Private Keys and Cryptography', url: 'https://www.khanacademy.org/computing/computer-science/cryptography' },
        { text: 'Day 3: Ethereum Virtual Machine (EVM) Basics', url: 'https://ethereum.org/en/developers/docs/evm/' },
        { text: 'Day 4: Gas fees and Transactions explained', url: 'https://ethereum.org/en/developers/docs/gas/' },
        { text: 'Day 5: Consensus Mechanisms (PoW vs PoS)', url: 'https://ethereum.org/en/developers/docs/consensus-mechanisms/' },
        { text: 'Day 6: Setup MetaMask and get testnet ETH', url: 'https://metamask.io/' }
      ] },
      { id: 'web3-2', title: 'Phase 2: Solidity Contracts (Days 7-12)', desc: 'Write Ethereum logic.', actionItems: [
        { text: 'Day 7: Solidity Syntax (Pragmas, Variables, Types)', url: 'https://docs.soliditylang.org/' },
        { text: 'Day 8: Functions, Modifiers, and Visibility', url: 'https://docs.soliditylang.org/en/latest/contracts.html' },
        { text: 'Day 9: Arrays, Mappings, and Structs', url: 'https://docs.soliditylang.org/en/latest/types.html' },
        { text: 'Day 10: Events and Error Handling (require, revert)', url: 'https://docs.soliditylang.org/en/latest/contracts.html#events' },
        { text: 'Day 11: Play CryptoZombies (Interactive Solidity)', url: 'https://cryptozombies.io/' },
        { text: 'Day 12: ERC-20 Token Standard implementation', url: 'https://eips.ethereum.org/EIPS/eip-20' }
      ] },
      { id: 'web3-3', title: 'Phase 3: Hardhat & Testing (Days 13-18)', desc: 'Development environments.', actionItems: [
        { text: 'Day 13: Setup Hardhat project and compile contracts', url: 'https://hardhat.org/docs' },
        { text: 'Day 14: Write deploy scripts in Ethers.js', url: 'https://hardhat.org/tutorial/deploying-to-a-live-network' },
        { text: 'Day 15: Unit Testing contracts with Mocha and Chai', url: 'https://hardhat.org/tutorial/testing-contracts' },
        { text: 'Day 16: Test edge cases and access controls', url: 'https://hardhat.org/tutorial/testing-contracts' },
        { text: 'Day 17: Setup Alchemy/Infura RPC nodes', url: 'https://docs.alchemy.com/' },
        { text: 'Day 18: Deploy contract to Sepolia Testnet', url: 'https://hardhat.org/tutorial/deploying-to-a-live-network' }
      ] },
      { id: 'web3-4', title: 'Phase 4: Web3 Frontend (Days 19-24)', desc: 'Connecting UI to contracts.', actionItems: [
        { text: 'Day 19: Setup React/Next.js frontend', url: 'https://react.dev/' },
        { text: 'Day 20: Integrate Wagmi or Ethers.js', url: 'https://wagmi.sh/' },
        { text: 'Day 21: Implement Connect Wallet button', url: 'https://docs.metamask.io/' },
        { text: 'Day 22: Read state variables from your deployed contract', url: 'https://docs.ethers.org/v6/' },
        { text: 'Day 23: Send transactions to mutate contract state', url: 'https://docs.ethers.org/v6/' },
        { text: 'Day 24: Listen to and display Contract Events', url: 'https://docs.ethers.org/v6/' }
      ] },
      { id: 'web3-5', title: 'Phase 5: NFTs & Security (Days 25-30)', desc: 'Advanced topics.', actionItems: [
        { text: 'Day 25: Understand ERC-721 (NFT) standard', url: 'https://eips.ethereum.org/EIPS/eip-721' },
        { text: 'Day 26: Deploy an NFT collection using OpenZeppelin', url: 'https://docs.openzeppelin.com/contracts/' },
        { text: 'Day 27: Host metadata on IPFS', url: 'https://docs.ipfs.tech/' },
        { text: 'Day 28: Security: Reentrancy Attacks & Prevention', url: 'https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/' },
        { text: 'Day 29: Security: Access Control & Flash Loan Attacks', url: 'https://consensys.github.io/smart-contract-best-practices/' },
        { text: 'Day 30: Use Slither to automatically audit your code', url: 'https://github.com/crytic/slither' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Patrick Collins 32-Hour Web3 Course', url: 'https://www.youtube.com/@PatrickAlphaC', type: 'channel' },
        { title: 'Dapp University Smart Contract Guides', url: 'https://www.youtube.com/@DappUniversity', type: 'channel' }
      ],
      platforms: [
        { title: 'Ethereum.org Developer Portal', desc: 'Comprehensive guides, docs, and tutorials.', url: 'https://ethereum.org/en/developers/' },
        { title: 'CryptoZombies Interactive School', desc: 'Learn Solidity by building games.', url: 'https://cryptozombies.io/' }
      ],
      certifications: [
        { title: 'ConsenSys Blockchain Developer Certificate', desc: 'Ethereum enterprise standard.', url: 'https://consensys.net/academy/' }
      ]
    }
  },
  {
    id: 'core-hardware',
    title: 'Core Hardware & VLSI',
    description: 'Design embedded systems and ICs in a 30-day crash course.',
    icon: Cpu,
    color: 'text-lime-400',
    bgColor: 'bg-lime-500',
    borderClass: 'hover:border-lime-500/50',
    steps: [
      { id: 'hw-1', title: 'Phase 1: Digital Logic (Days 1-6)', desc: 'Gates and circuits.', actionItems: [
        { text: 'Day 1: Boolean Algebra and Number Systems', url: 'https://www.geeksforgeeks.org/boolean-algebra/' },
        { text: 'Day 2: Logic Gates (AND, OR, NOT, NAND, NOR)', url: 'https://www.electronics-tutorials.ws/boolean/bool_1.html' },
        { text: 'Day 3: K-Maps and Circuit Minimization', url: 'https://www.geeksforgeeks.org/karnaugh-map-k-map/' },
        { text: 'Day 4: Combinational Logic (Adders, MUX, Decoders)', url: 'https://www.electronics-tutorials.ws/combination/comb_1.html' },
        { text: 'Day 5: Flip-Flops and Latches (SR, D, JK, T)', url: 'https://www.geeksforgeeks.org/flip-flop-types/' },
        { text: 'Day 6: Sequential Logic (Counters, Registers)', url: 'https://www.electronics-tutorials.ws/sequential/seq_1.html' }
      ] },
      { id: 'hw-2', title: 'Phase 2: Verilog HDL (Days 7-12)', desc: 'Hardware coding.', actionItems: [
        { text: 'Day 7: Intro to Verilog syntax and Modules', url: 'https://hdlbits.01xz.net/wiki/Main_Page' },
        { text: 'Day 8: Continuous assignments (assign) & Wire/Reg', url: 'https://hdlbits.01xz.net/wiki/Wire' },
        { text: 'Day 9: Procedural blocks (always @)', url: 'https://hdlbits.01xz.net/wiki/Always_blocks' },
        { text: 'Day 10: Blocking vs Non-Blocking assignments (= vs <=)', url: 'https://hdlbits.01xz.net/wiki/Always_nblock' },
        { text: 'Day 11: Write a Finite State Machine (FSM) in Verilog', url: 'https://hdlbits.01xz.net/wiki/Fsm1' },
        { text: 'Day 12: Write Testbenches and simulate in ModelSim', url: 'https://www.chipverify.com/verilog/verilog-testbench' }
      ] },
      { id: 'hw-3', title: 'Phase 3: Microcontrollers (Days 13-18)', desc: 'Embedded C.', actionItems: [
        { text: 'Day 13: C Pointers, Bitwise operations, and Volatile keyword', url: 'https://www.geeksforgeeks.org/bitwise-operators-in-c-cpp/' },
        { text: 'Day 14: Microcontroller Architecture (Memory, Registers)', url: 'https://www.geeksforgeeks.org/embedded-systems/' },
        { text: 'Day 15: GPIO Configuration (Reading/Writing Pins)', url: 'https://learn.sparkfun.com/tutorials/digital-logic' },
        { text: 'Day 16: Hardware Timers and PWM generation', url: 'https://www.geeksforgeeks.org/pulse-width-modulation-pwm/' },
        { text: 'Day 17: Interrupts and ISR (Interrupt Service Routines)', url: 'https://www.geeksforgeeks.org/interrupts-in-8086-microprocessor/' },
        { text: 'Day 18: Communication protocols (UART, I2C, SPI)', url: 'https://learn.sparkfun.com/tutorials/i2c' }
      ] },
      { id: 'hw-4', title: 'Phase 4: Comp Architecture (Days 19-24)', desc: 'Under the hood.', actionItems: [
        { text: 'Day 19: Instruction Set Architecture (ISA) basics', url: 'https://www.geeksforgeeks.org/instruction-set-architecture-isa/' },
        { text: 'Day 20: RISC vs CISC and ARM/RISC-V overview', url: 'https://riscv.org/' },
        { text: 'Day 21: CPU Datapath and Control Unit design', url: 'https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/' },
        { text: 'Day 22: Instruction Pipelining and Hazards', url: 'https://www.geeksforgeeks.org/pipelining-in-computer-architecture/' },
        { text: 'Day 23: Cache Memory, Mapping, and Miss penalties', url: 'https://www.geeksforgeeks.org/cache-memory-in-computer-organization/' },
        { text: 'Day 24: Virtual Memory and TLB', url: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/' }
      ] },
      { id: 'hw-5', title: 'Phase 5: PCB & VLSI Flow (Days 25-30)', desc: 'Bringing it to life.', actionItems: [
        { text: 'Day 25: Learn EDA tools (Altium, KiCad 8)', url: 'https://www.kicad.org/help/getting-started/' },
        { text: 'Day 26: Draw schematics and assign footprints in KiCad', url: 'https://docs.kicad.org/' },
        { text: 'Day 27: PCB Routing, Vias, and Design Rule Check (DRC)', url: 'https://www.kicad.org/' },
        { text: 'Day 28: Intro to VLSI Design flow (Frontend vs Backend)', url: 'https://www.geeksforgeeks.org/vlsi-design-process/' },
        { text: 'Day 29: CMOS inverter layout and fabrication basics', url: 'https://www.geeksforgeeks.org/cmos-inverter/' },
        { text: 'Day 30: Generate Gerber files for PCB manufacturing', url: 'https://www.kicad.org/help/getting-started/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Ben Eater 8-Bit Computer from Scratch', url: 'https://www.youtube.com/@BenEater', type: 'channel' }
      ],
      platforms: [
        { title: 'HDLBits Verilog Problem Sets', desc: 'Interactive browser-based Verilog practice.', url: 'https://hdlbits.01xz.net/' },
        { title: 'ChipVerify Verilog & SystemVerilog Guides', desc: 'Hardware verification reference.', url: 'https://www.chipverify.com/' }
      ],
      certifications: [
        { title: 'ARM Accredited Engineer (AAE)', desc: 'Premier embedded ARM processor validation.', url: 'https://www.arm.com/' }
      ]
    }
  },
  {
    id: 'data-eng',
    title: 'Data Engineering',
    description: 'Design pipelines that transform big data into usable formats in 30 days.',
    icon: Server,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500',
    borderClass: 'hover:border-cyan-500/50',
    steps: [
      { id: 'de-1', title: 'Phase 1: Advanced SQL & Modeling (Days 1-6)', desc: 'Data foundations.', actionItems: [
        { text: 'Day 1: Setup Postgres and review CRUD', url: 'https://mode.com/sql-tutorial/' },
        { text: 'Day 2: SQL Joins, Unions, and Group By', url: 'https://mode.com/sql-tutorial/sql-joins/' },
        { text: 'Day 3: Window Functions (ROW_NUMBER, RANK, LEAD)', url: 'https://mode.com/sql-tutorial/sql-window-functions/' },
        { text: 'Day 4: Common Table Expressions (CTEs) & Subqueries', url: 'https://learnsql.com/blog/what-is-common-table-expression/' },
        { text: 'Day 5: Dimensional Data Modeling (Star & Snowflake Schema)', url: 'https://www.geeksforgeeks.org/star-and-snowflake-schema-in-data-warehouse/' },
        { text: 'Day 6: Normalization vs Denormalization', url: 'https://www.geeksforgeeks.org/normalization-in-dbms/' }
      ] },
      { id: 'de-2', title: 'Phase 2: Python for Data Eng (Days 7-12)', desc: 'Scripting pipelines.', actionItems: [
        { text: 'Day 7: Python Lists, Dictionaries, and Sets', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { text: 'Day 8: Reading/Writing CSV, JSON, and Parquet files', url: 'https://pandas.pydata.org/docs/user_guide/io.html' },
        { text: 'Day 9: Interacting with REST APIs via Requests library', url: 'https://realpython.com/api-integration-in-python/' },
        { text: 'Day 10: Multithreading and Multiprocessing in Python', url: 'https://realpython.com/intro-to-python-threading/' },
        { text: 'Day 11: Python Generators and Memory Management', url: 'https://realpython.com/introduction-to-python-generators/' },
        { text: 'Day 12: Intro to Scala basics (Functional programming)', url: 'https://docs.scala-lang.org/tour/tour-of-scala.html' }
      ] },
      { id: 'de-3', title: 'Phase 3: Big Data & Spark (Days 13-18)', desc: 'Distributed computing.', actionItems: [
        { text: 'Day 13: Hadoop Ecosystem overview (HDFS, YARN)', url: 'https://hadoop.apache.org/' },
        { text: 'Day 14: Apache Spark Architecture (Driver, Executors)', url: 'https://spark.apache.org/docs/latest/' },
        { text: 'Day 15: PySpark RDDs (Resilient Distributed Datasets)', url: 'https://spark.apache.org/docs/latest/rdd-programming-guide.html' },
        { text: 'Day 16: PySpark DataFrames & SQL operations', url: 'https://spark.apache.org/docs/latest/sql-programming-guide.html' },
        { text: 'Day 17: Spark Optimization (Partitioning, Caching, Broadcast)', url: 'https://spark.apache.org/docs/latest/tuning.html' },
        { text: 'Day 18: Intro to Apache Kafka for real-time streaming', url: 'https://kafka.apache.org/documentation/' }
      ] },
      { id: 'de-4', title: 'Phase 4: Cloud Data Warehouses (Days 19-24)', desc: 'Storage at scale.', actionItems: [
        { text: 'Day 19: ETL vs ELT Paradigms', url: 'https://www.geeksforgeeks.org/difference-between-etl-and-elt/' },
        { text: 'Day 20: Snowflake Architecture (Compute vs Storage)', url: 'https://docs.snowflake.com/en/user-guide/intro-key-concepts' },
        { text: 'Day 21: Snowflake Data Loading (COPY INTO, Snowpipe)', url: 'https://docs.snowflake.com/en/user-guide/data-load-overview' },
        { text: 'Day 22: Google BigQuery basics and partitioning', url: 'https://cloud.google.com/bigquery/docs' },
        { text: 'Day 23: Setup dbt (Data Build Tool) project', url: 'https://docs.getdbt.com/docs/build/projects' },
        { text: 'Day 24: Write dbt models, tests, and documentation', url: 'https://docs.getdbt.com/docs/build/models' }
      ] },
      { id: 'de-5', title: 'Phase 5: Orchestration (Days 25-30)', desc: 'Scheduling pipelines.', actionItems: [
        { text: 'Day 25: Apache Airflow Architecture and concepts', url: 'https://airflow.apache.org/docs/' },
        { text: 'Day 26: Write your first DAG (Directed Acyclic Graph)', url: 'https://airflow.apache.org/docs/apache-airflow/stable/tutorial/' },
        { text: 'Day 27: Airflow Operators (Python, Bash, Postgres)', url: 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/operators.html' },
        { text: 'Day 28: Setup Docker for containerized pipelines', url: 'https://docs.docker.com/' },
        { text: 'Day 29: CI/CD for Data pipelines (GitHub Actions)', url: 'https://docs.github.com/en/actions' },
        { text: 'Day 30: End-to-End Capstone: API -> S3 -> Snowflake -> dbt -> Airflow', url: 'https://github.com/datastacktv/data-engineer-roadmap' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Seattle Data Guy Data Engineering', url: 'https://www.youtube.com/@SeattleDataGuy', type: 'channel' }
      ],
      platforms: [
        { title: 'DataCamp Data Engineering Track', desc: 'SQL, Airflow, and PySpark courses.', url: 'https://www.datacamp.com/' }
      ],
      certifications: [
        { title: 'Google Cloud Certified Professional Data Engineer', desc: 'Gold standard data engineering cert.', url: 'https://cloud.google.com/certification/data-engineer' }
      ]
    }
  },
  {
    id: 'product-mgmt',
    title: 'Product Management',
    description: 'Lead teams to build products customers love in a 30-day crash course.',
    icon: Rocket,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500',
    borderClass: 'hover:border-rose-500/50',
    steps: [
      { id: 'pm-1', title: 'Phase 1: Product Strategy (Days 1-6)', desc: 'Vision and market.', actionItems: [
        { text: 'Day 1: What is a PM? Read "Inspired" concepts by Marty Cagan', url: 'https://www.svpg.com/books/inspired-how-to-create-tech-products-customers-love-2nd-edition/' },
        { text: 'Day 2: Create a Product Vision Board', url: 'https://www.romanpichler.com/blog/the-product-vision-board/' },
        { text: 'Day 3: The Business Model Canvas', url: 'https://www.strategyzer.com/library/the-business-model-canvas' },
        { text: 'Day 4: Competitor Analysis & Market Sizing (TAM/SAM/SOM)', url: 'https://www.productplan.com/glossary/total-addressable-market/' },
        { text: 'Day 5: Defining Product-Market Fit', url: 'https://review.firstround.com/the-never-ending-road-to-product-market-fit' },
        { text: 'Day 6: Value Proposition Design', url: 'https://www.strategyzer.com/library/the-value-proposition-canvas' }
      ] },
      { id: 'pm-2', title: 'Phase 2: User Research (Days 7-12)', desc: 'Understanding users.', actionItems: [
        { text: 'Day 7: Jobs-To-Be-Done (JTBD) Framework', url: 'https://jtbd.info/' },
        { text: 'Day 8: Writing User Personas', url: 'https://www.nngroup.com/articles/persona-types/' },
        { text: 'Day 9: How to conduct User Interviews without bias', url: 'https://www.nngroup.com/articles/user-interviews/' },
        { text: 'Day 10: Analyzing qualitative feedback and surveys', url: 'https://www.nngroup.com/articles/qualitative-surveys/' },
        { text: 'Day 11: Mapping the User Journey', url: 'https://www.nngroup.com/articles/journey-mapping-101/' },
        { text: 'Day 12: Wireframing basics for PMs (Balsamiq)', url: 'https://balsamiq.com/learn/articles/wireframing/' }
      ] },
      { id: 'pm-3', title: 'Phase 3: Execution & Agile (Days 13-18)', desc: 'Building the product.', actionItems: [
        { text: 'Day 13: Writing a PRD (Product Requirements Doc)', url: 'https://www.atlassian.com/agile/product-management/requirements' },
        { text: 'Day 14: Agile methodologies and Scrum framework', url: 'https://www.scrum.org/resources/what-is-scrum' },
        { text: 'Day 15: Writing User Stories and Acceptance Criteria', url: 'https://www.atlassian.com/agile/project-management/user-stories' },
        { text: 'Day 16: Backlog Grooming and Prioritization frameworks (RICE/MoSCoW)', url: 'https://www.productplan.com/glossary/rice-scoring-model/' },
        { text: 'Day 17: Sprint Planning and Estimation (Story Points)', url: 'https://www.atlassian.com/agile/project-management/estimation' },
        { text: 'Day 18: Scoping the MVP (Minimum Viable Product)', url: 'https://www.productplan.com/glossary/minimum-viable-product/' }
      ] },
      { id: 'pm-4', title: 'Phase 4: Metrics & Analytics (Days 19-24)', desc: 'Data-driven decisions.', actionItems: [
        { text: 'Day 19: AARRR Pirate Metrics (Acquisition to Revenue)', url: 'https://www.ycombinator.com/library/4D-essential-startup-metrics' },
        { text: 'Day 20: Defining North Star Metric & KPIs', url: 'https://amplitude.com/north-star-playbook' },
        { text: 'Day 21: Cohort Analysis and Retention curves', url: 'https://mixpanel.com/blog/cohort-analysis/' },
        { text: 'Day 22: Setup funnels in Mixpanel / Google Analytics', url: 'https://mixpanel.com/' },
        { text: 'Day 23: Understanding A/B Testing and Statistical Significance', url: 'https://www.optimizely.com/optimization-glossary/ab-testing/' },
        { text: 'Day 24: SQL basics for PMs (SELECT, JOIN, GROUP BY)', url: 'https://mode.com/sql-tutorial/' }
      ] },
      { id: 'pm-5', title: 'Phase 5: GTM & Interviews (Days 25-30)', desc: 'Launch and landing a job.', actionItems: [
        { text: 'Day 25: Go-To-Market (GTM) Strategy', url: 'https://www.productplan.com/glossary/go-to-market-strategy/' },
        { text: 'Day 26: Pricing strategies (Freemium, SaaS tiers)', url: 'https://www.profitwell.com/recur/all/saas-pricing-strategy' },
        { text: 'Day 27: PM Interview Prep: Product Sense / Design questions', url: 'https://www.tryexponent.com/courses/pm' },
        { text: 'Day 28: PM Interview Prep: Execution / Metrics questions', url: 'https://www.tryexponent.com/courses/pm' },
        { text: 'Day 29: PM Interview Prep: Behavioral (STAR method)', url: 'https://www.themuse.com/advice/star-interview-method' },
        { text: 'Day 30: Do a mock PM interview with a peer', url: 'https://www.pramp.com/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Product School Product Talks', url: 'https://www.youtube.com/@ProductSchoolSanFrancisco', type: 'channel' }
      ],
      platforms: [
        { title: 'Reforge PM Essays & Library', desc: 'Silicon Valley product leadership playbooks.', url: 'https://www.reforge.com/' },
        { title: 'Exponent PM Interview Portal', desc: 'Mock interviews and practice questions.', url: 'https://www.tryexponent.com/' }
      ],
      certifications: [
        { title: 'Certified Scrum Product Owner (CSPO)', desc: 'Global Agile Scrum alliance cert.', url: 'https://www.scrumalliance.org/' }
      ]
    }
  },
  {
    id: 'qa-sdet',
    title: 'QA Automation & SDET',
    description: 'Ensure software quality by writing test code automatically in 30 days.',
    icon: ClipboardCheck,
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-500',
    borderClass: 'hover:border-fuchsia-500/50',
    steps: [
      { id: 'qa-1', title: 'Phase 1: Manual Testing Basics (Days 1-6)', desc: 'QA foundations.', actionItems: [
        { text: 'Day 1: Software Testing Life Cycle (STLC)', url: 'https://www.guru99.com/software-testing-life-cycle.html' },
        { text: 'Day 2: Bug Life Cycle and Defect Management', url: 'https://www.geeksforgeeks.org/software-engineering-bug-life-cycle/' },
        { text: 'Day 3: Writing Test Cases and Test Scenarios', url: 'https://www.guru99.com/test-case.html' },
        { text: 'Day 4: Boundary Value Analysis & Equivalence Partitioning', url: 'https://www.guru99.com/equivalence-partitioning-boundary-value-analysis.html' },
        { text: 'Day 5: Agile Testing and Jira workflows', url: 'https://www.atlassian.com/agile/software-development/testing' },
        { text: 'Day 6: Traceability Matrices and Test Planning', url: 'https://www.guru99.com/traceability-matrix.html' }
      ] },
      { id: 'qa-2', title: 'Phase 2: Programming for QA (Days 7-12)', desc: 'Java/JS prep.', actionItems: [
        { text: 'Day 7: Java syntax, Variables, and Methods', url: 'https://www.w3schools.com/java/' },
        { text: 'Day 8: OOP Concepts (Inheritance, Polymorphism)', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/' },
        { text: 'Day 9: Java Collections Framework (List, Map)', url: 'https://www.geeksforgeeks.org/collections-in-java-2/' },
        { text: 'Day 10: JavaScript basics for modern frameworks', url: 'https://javascript.info/' },
        { text: 'Day 11: Locating Web Elements (XPath, CSS Selectors)', url: 'https://www.guru99.com/xpath-selenium.html' },
        { text: 'Day 12: Design Patterns: Page Object Model (POM)', url: 'https://www.guru99.com/page-object-model-pom-page-factory-in-selenium-ultimate-guide.html' }
      ] },
      { id: 'qa-3', title: 'Phase 3: Web Automation (Days 13-18)', desc: 'UI Testing.', actionItems: [
        { text: 'Day 13: Setup Selenium WebDriver and launch browsers', url: 'https://www.selenium.dev/documentation/' },
        { text: 'Day 14: Implicit, Explicit, and Fluent Waits in Selenium', url: 'https://www.guru99.com/implicit-explicit-waits-selenium.html' },
        { text: 'Day 15: Handling Dropdowns, Alerts, and iFrames', url: 'https://www.guru99.com/handling-iframes-selenium.html' },
        { text: 'Day 16: Setup modern frameworks: Playwright / Cypress', url: 'https://playwright.dev/' },
        { text: 'Day 17: Write E2E tests in Playwright (Assertions, Actions)', url: 'https://playwright.dev/docs/writing-tests' },
        { text: 'Day 18: Cross-browser testing and device emulation', url: 'https://playwright.dev/docs/emulation' }
      ] },
      { id: 'qa-4', title: 'Phase 4: API Testing (Days 19-24)', desc: 'Backend validation.', actionItems: [
        { text: 'Day 19: HTTP Methods, Status Codes, and JSON', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
        { text: 'Day 20: Manual API testing using Postman', url: 'https://learning.postman.com/docs/getting-started/introduction/' },
        { text: 'Day 21: Postman Collections, Variables, and Environments', url: 'https://learning.postman.com/docs/sending-requests/variables/' },
        { text: 'Day 22: Automate APIs with RestAssured (Java)', url: 'https://rest-assured.io/' },
        { text: 'Day 23: Asserting JSON responses and headers', url: 'https://rest-assured.io/' },
        { text: 'Day 24: JSON Schema Validation', url: 'https://json-schema.org/learn/getting-started-step-by-step.html' }
      ] },
      { id: 'qa-5', title: 'Phase 5: CI/CD & BDD (Days 25-30)', desc: 'Automation pipelines.', actionItems: [
        { text: 'Day 25: Behavior Driven Dev (BDD) with Cucumber & Gherkin', url: 'https://cucumber.io/docs/guides/10-minute-tutorial/' },
        { text: 'Day 26: Map Gherkin steps to Java/JS step definitions', url: 'https://cucumber.io/docs/cucumber/step-definitions/' },
        { text: 'Day 27: Version control (Git) for test automation repos', url: 'https://git-scm.com/doc' },
        { text: 'Day 28: Integrate automation suites into Jenkins / GitHub Actions', url: 'https://www.jenkins.io/doc/tutorials/' },
        { text: 'Day 29: Generate detailed reports (Allure Reports)', url: 'https://allurereport.org/docs/' },
        { text: 'Day 30: Capstone: End-to-End BDD framework connected to CI/CD', url: 'https://testautomationu.applitools.com/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Naveen AutomationLabs Full SDET Guides', url: 'https://www.youtube.com/@NaveenAutomationLabs', type: 'channel' }
      ],
      platforms: [
        { title: 'Test Automation University (TAU)', desc: '100% Free courses by Applitools.', url: 'https://testautomationu.applitools.com/' }
      ],
      certifications: [
        { title: 'ISTQB Certified Tester Foundation Level (CTFL)', desc: 'International standard QA cert.', url: 'https://www.istqb.org/' }
      ]
    }
  },
  {
    id: 'python-dev',
    title: 'Python Development & Backend',
    description: 'Master Python scripting, web scraping, and backend frameworks (Django/FastAPI) in 30 days.',
    icon: Terminal,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500',
    borderClass: 'hover:border-yellow-500/50',
    steps: [
      { id: 'py-1', title: 'Phase 1: Core Python (Days 1-6)', desc: 'Syntax and Collections.', actionItems: [
        { text: 'Day 1: Setup Python, Pip, and Virtual Environments (venv)', url: 'https://realpython.com/python-virtual-environments-a-primer/' },
        { text: 'Day 2: Variables, Data Types, and String Manipulation', url: 'https://docs.python.org/3/tutorial/introduction.html' },
        { text: 'Day 3: Control Flow (if/elif/else, for loops, while loops)', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
        { text: 'Day 4: Lists, Tuples, and List Comprehensions', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
        { text: 'Day 5: Dictionaries, Sets, and Hashing', url: 'https://realpython.com/python-dicts/' },
        { text: 'Day 6: Functions, *args, **kwargs, and Lambda functions', url: 'https://realpython.com/python-kwargs-and-args/' }
      ] },
      { id: 'py-2', title: 'Phase 2: Advanced Python (Days 7-12)', desc: 'OOP and features.', actionItems: [
        { text: 'Day 7: Object-Oriented Programming (Classes, self, __init__)', url: 'https://realpython.com/python3-object-oriented-programming/' },
        { text: 'Day 8: Inheritance, Polymorphism, and Dunder (Magic) Methods', url: 'https://realpython.com/inheritance-composition-python/' },
        { text: 'Day 9: File I/O (Reading/Writing txt, csv, and json files)', url: 'https://docs.python.org/3/tutorial/inputoutput.html' },
        { text: 'Day 10: Exception Handling (try, except, finally)', url: 'https://docs.python.org/3/tutorial/errors.html' },
        { text: 'Day 11: Iterators, Generators (yield), and Memory efficiency', url: 'https://realpython.com/introduction-to-python-generators/' },
        { text: 'Day 12: Decorators and Higher-Order Functions', url: 'https://realpython.com/primer-on-python-decorators/' }
      ] },
      { id: 'py-3', title: 'Phase 3: Scraping & APIs (Days 13-18)', desc: 'Getting data.', actionItems: [
        { text: 'Day 13: Regular Expressions (Regex) with the `re` module', url: 'https://docs.python.org/3/library/re.html' },
        { text: 'Day 14: Working with APIs using the `requests` library', url: 'https://realpython.com/python-requests/' },
        { text: 'Day 15: Web Scraping basics with BeautifulSoup4', url: 'https://realpython.com/beautiful-soup-web-scraper-python/' },
        { text: 'Day 16: Advanced Scraping (Pagination, handling login)', url: 'https://realpython.com/python-web-scraping-practical-introduction/' },
        { text: 'Day 17: Browser Automation using Selenium WebDriver', url: 'https://selenium-python.readthedocs.io/' },
        { text: 'Day 18: Build a bot that scrapes a site and emails the results', url: 'https://realpython.com/python-send-email/' }
      ] },
      { id: 'py-4', title: 'Phase 4: Backend with FastAPI (Days 19-24)', desc: 'Modern REST APIs.', actionItems: [
        { text: 'Day 19: Intro to FastAPI and Uvicorn server', url: 'https://fastapi.tiangolo.com/tutorial/first-steps/' },
        { text: 'Day 20: Path Parameters, Query Parameters, and Pydantic Models', url: 'https://fastapi.tiangolo.com/tutorial/path-params/' },
        { text: 'Day 21: Setup a PostgreSQL database and connect via SQLAlchemy', url: 'https://fastapi.tiangolo.com/tutorial/sql-databases/' },
        { text: 'Day 22: CRUD Operations in FastAPI', url: 'https://fastapi.tiangolo.com/tutorial/sql-databases/' },
        { text: 'Day 23: Authentication using JWT tokens (OAuth2)', url: 'https://fastapi.tiangolo.com/tutorial/security/' },
        { text: 'Day 24: Testing endpoints with PyTest', url: 'https://fastapi.tiangolo.com/tutorial/testing/' }
      ] },
      { id: 'py-5', title: 'Phase 5: Django & Deployment (Days 25-30)', desc: 'Full-featured frameworks.', actionItems: [
        { text: 'Day 25: Django basics (MVT Architecture, apps, settings)', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/' },
        { text: 'Day 26: Django Models, Migrations, and the Admin Panel', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial02/' },
        { text: 'Day 27: Django Views, Templates, and URL routing', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial03/' },
        { text: 'Day 28: Build a REST API using Django Rest Framework (DRF)', url: 'https://www.django-rest-framework.org/' },
        { text: 'Day 29: Asynchronous tasks with Celery and Redis', url: 'https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html' },
        { text: 'Day 30: Dockerize your Python app and deploy to Render/Railway', url: 'https://docs.docker.com/language/python/build-images/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Corey Schafer Python & Django Tutorials', url: 'https://www.youtube.com/@coreyms', type: 'channel' },
        { title: 'Tech With Tim Python Projects', url: 'https://www.youtube.com/@TechWithTim', type: 'channel' }
      ],
      platforms: [
        { title: 'Real Python Tutorials & Guides', desc: 'The best written Python tutorials on the web.', url: 'https://realpython.com/' },
        { title: 'Official Python 3 Documentation', desc: 'Authoritative Python reference.', url: 'https://docs.python.org/3/' }
      ],
      certifications: [
        { title: 'OpenEDG Python Institute Certified Associate (PCAP)', desc: 'Global Python programming cert.', url: 'https://pythoninstitute.org/pcap' }
      ]
    }
  },
  {
    id: 'java-dsa',
    title: 'Java & DSA Mastery',
    description: 'Master Core Java, Object-Oriented Programming, and Data Structures & Algorithms in 30 days to crack top tech interviews.',
    icon: Coffee,
    color: 'text-orange-500',
    bgColor: 'bg-orange-600',
    borderClass: 'hover:border-orange-500/50',
    steps: [
      { id: 'jd-1', title: 'Phase 1: Core Java Basics (Days 1-6)', desc: 'Syntax and fundamentals.', actionItems: [
        { text: 'Day 1: Setup JDK, IntelliJ IDEA, and run your first "Hello World"', url: 'https://www.jetbrains.com/idea/guide/tutorials/hello-world/' },
        { text: 'Day 2: Variables, Data Types, Operators, and Type Casting', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html' },
        { text: 'Day 3: Control Flow (if-else, switch, loops: for, while, do-while)', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html' },
        { text: 'Day 4: Methods (Functions), Parameters, and Return Types', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html' },
        { text: 'Day 5: 1D and 2D Arrays, Memory allocation, and for-each loop', url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html' },
        { text: 'Day 6: String class, Immutability, StringBuilder, and StringBuffer', url: 'https://docs.oracle.com/javase/tutorial/java/data/strings.html' }
      ] },
      { id: 'jd-2', title: 'Phase 2: Object-Oriented Programming (Days 7-12)', desc: 'OOP concepts.', actionItems: [
        { text: 'Day 7: Classes, Objects, Constructors, and the `this` keyword', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html' },
        { text: 'Day 8: Encapsulation, Access Modifiers, and Getters/Setters', url: 'https://www.geeksforgeeks.org/encapsulation-in-java/' },
        { text: 'Day 9: Inheritance, `super` keyword, and Method Overriding', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html' },
        { text: 'Day 10: Polymorphism (Overloading vs Overriding) and Dynamic Binding', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html' },
        { text: 'Day 11: Abstraction (Abstract Classes) and Interfaces', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html' },
        { text: 'Day 12: Exception Handling (try, catch, finally, throw, throws)', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' }
      ] },
      { id: 'jd-3', title: 'Phase 3: Basic DSA & Collections (Days 13-18)', desc: 'Foundations of algorithms.', actionItems: [
        { text: 'Day 13: Time & Space Complexity Analysis (Big-O Notation)', url: 'https://www.geeksforgeeks.org/understanding-time-complexity-simple-examples/' },
        { text: 'Day 14: Java Collections Framework: ArrayList and Wrapper Classes', url: 'https://docs.oracle.com/javase/tutorial/collections/interfaces/list.html' },
        { text: 'Day 15: Recursion Basics (Base cases, Call Stack)', url: 'https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/' },
        { text: 'Day 16: Basic Sorting (Bubble, Selection, Insertion Sort)', url: 'https://www.geeksforgeeks.org/sorting-algorithms/' },
        { text: 'Day 17: Searching Algorithms (Linear Search, Binary Search)', url: 'https://leetcode.com/problems/binary-search/' },
        { text: 'Day 18: Advanced Recursion & Backtracking (N-Queens, Sudoku)', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/' }
      ] },
      { id: 'jd-4', title: 'Phase 4: Linear Data Structures (Days 19-24)', desc: 'Crucial structures.', actionItems: [
        { text: 'Day 19: Linked Lists (Singly and Doubly Linked Lists)', url: 'https://leetcode.com/tag/linked-list/' },
        { text: 'Day 20: Stacks (LIFO) and Monotonic Stacks', url: 'https://leetcode.com/tag/stack/' },
        { text: 'Day 21: Queues (FIFO), Deque, and Priority Queue (Min/Max Heap)', url: 'https://leetcode.com/tag/queue/' },
        { text: 'Day 22: Hashing (HashMap, HashSet) and collision resolution', url: 'https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html' },
        { text: 'Day 23: Two Pointers and Sliding Window Techniques', url: 'https://leetcode.com/tag/sliding-window/' },
        { text: 'Day 24: Divide and Conquer (Merge Sort, Quick Sort)', url: 'https://www.geeksforgeeks.org/merge-sort/' }
      ] },
      { id: 'jd-5', title: 'Phase 5: Non-Linear DSA & Graphs (Days 25-30)', desc: 'Advanced topics.', actionItems: [
        { text: 'Day 25: Trees (Binary Trees, Traversals: Inorder, Preorder, Postorder)', url: 'https://leetcode.com/tag/tree/' },
        { text: 'Day 26: Binary Search Trees (BST) (Insertion, Deletion, Searching)', url: 'https://leetcode.com/tag/binary-search-tree/' },
        { text: 'Day 27: Graph Representation (Adjacency Matrix & List), BFS, DFS', url: 'https://leetcode.com/tag/graph/' },
        { text: 'Day 28: Shortest Path Algorithms (Dijkstra\'s Algorithm)', url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/' },
        { text: 'Day 29: Dynamic Programming (Memoization vs Tabulation, Knapsack)', url: 'https://leetcode.com/tag/dynamic-programming/' },
        { text: 'Day 30: Tries (Prefix Trees) and System Design Basics', url: 'https://leetcode.com/tag/trie/' }
      ] }
    ],
    resources: {
      videos: [
        { title: 'Kunal Kushwaha Java & DSA Bootcamp', url: 'https://www.youtube.com/@KunalKushwaha', type: 'channel' },
        { title: 'Striver (Take U Forward)', url: 'https://www.youtube.com/@takeUforward', type: 'channel' }
      ],
      platforms: [
        { title: 'LeetCode Problem Sets', desc: 'Top coding interview practice.', url: 'https://leetcode.com/' },
        { title: 'GeeksforGeeks Java Portal', desc: 'Extensive Java & DSA articles.', url: 'https://www.geeksforgeeks.org/java/' }
      ],
      certifications: [
        { title: 'Oracle Certified Professional: Java SE Developer', desc: 'Official Oracle Java Certification.', url: 'https://education.oracle.com/oracle-certified-professional-java-se-17-developer/trackp_OCPJAV17' }
      ]
    }
  }
];

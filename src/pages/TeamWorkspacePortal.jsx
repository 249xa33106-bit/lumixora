import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Kanban, FileText, Zap, Link2, Users, Plus, Search, Filter, CheckCircle2, 
  Clock, AlertCircle, ArrowRight, ArrowLeft, ExternalLink, Copy, Check, 
  Trash2, Edit3, Shield, Sparkles, MessageSquare, Tag, Eye, ChevronDown, 
  Calendar, Award, Code, Compass, Send, CheckSquare, Layers, Lock, Flame,
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, PhoneOff, Hand, Volume2,
  Smile, FileCheck, Radio, List, SlidersHorizontal, UserPlus, CheckCircle, X, ChevronRight,
  Pin, MessageCircle, AlertTriangle, Paperclip, ChevronUp, PhoneCall, Phone, Maximize2, Minimize2, Bot
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// ── Complete Official Real Team Data with Full Dossiers ──
export const ALL_TEAM_MEMBERS = [
  {
    id: 'sowban',
    name: 'SHAIK SOWBAN',
    shortName: 'Shaik Sowban',
    role: 'Founder, CEO & Tech Lead',
    division: 'Executive Leadership',
    department: 'Executive Leadership & Engineering',
    lead: 'Platform Founder & Chief Architect',
    avatar: 'SS',
    image: '/founder_sowban.png',
    gradient: 'from-brand-teal via-[#0d9488] to-brand-blue',
    color: 'teal',
    email: 'founder@lumixora.com',
    status: 'In Flow • System Architect',
    bio: 'Visionary founder and chief software architect behind Vyomra / Lumixora. Leading system architecture, AI model integrations, scalable cloud infrastructure, and the core platform vision.',
    highlights: [
      'Architected the entire Lumixora Student OS full-stack ecosystem from concept to production.',
      'Engineered the AI Placement Commander, automated code execution engines, and smart academic portfolios.',
      'Directs cross-functional engineering, infrastructure scaling, and real-time security protocols.',
      'Drives the mission to democratize state-of-the-art AI tooling for every university student.'
    ],
    skills: ['System Architecture', 'Full-Stack Development', 'AI/ML Integration', 'Cloud Infrastructure', 'Product Vision']
  },
  {
    id: 'manasa',
    name: 'C. MANASA',
    shortName: 'C. Manasa',
    role: 'Team Lead • Feature Strategy',
    division: 'Feature Strategy & UX',
    department: 'Feature Strategy & Innovation',
    lead: 'Feature Strategy Team Lead',
    avatar: 'CM',
    image: '/team_manasa.jpg',
    gradient: 'from-amber-400 to-orange-500',
    color: 'amber',
    email: 'manasa@lumixora.com',
    status: 'Active • Curriculum Innovation',
    bio: 'Leads the feature ideation engine at Lumixora. Identifies emerging campus challenges, analyzes student behavioural patterns, and directs product roadmap discovery.',
    highlights: [
      'Directs the Feature Strategy team in discovering student pain points and campus needs.',
      'Authors feature specification documents and translates academic workflows into elegant concepts.',
      'Aligns product initiatives with student academic success metrics and user retention goals.',
      'Bridges student communities and tech architects to accelerate feature delivery.'
    ],
    skills: ['Product Innovation', 'Feature Roadmapping', 'Student Analytics', 'Team Leadership', 'Design Thinking']
  },
  {
    id: 'meghana',
    name: 'BANDI MEGHANA',
    shortName: 'Bandi Meghana',
    role: 'UI/UX Designer',
    division: 'Feature Strategy & UX',
    department: 'UI/UX & Product Design',
    lead: 'UI/UX Lead',
    avatar: 'BM',
    image: '/team_meghana.jpg',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    color: 'amber',
    email: 'meghana@lumixora.com',
    status: 'Active • Design System & Tokens',
    bio: 'Designs intuitive, student-centric user experiences and interactive interfaces across Lumixora. Specializes in design systems, responsive layouts, usability research, and modern UI/UX workflows.',
    highlights: [
      'Crafts pixel-perfect interfaces, interaction models, and cohesive design systems for web and mobile.',
      'Translates student workflows and complex educational tools into frictionless, intuitive experiences.',
      'Conducts usability research, prototype validation, and design iterations based on user feedback.',
      'Collaborates closely with product strategy and engineering teams to ensure design fidelity.'
    ],
    skills: ['UI/UX Design', 'Figma & Prototyping', 'Design Systems', 'User Research', 'Wireframing & Interaction Design']
  },
  {
    id: 'ushasree',
    name: 'Y. USHA SREE',
    shortName: 'Y. Usha Sree',
    role: 'AI & Innovation Lead',
    division: 'AI & Intelligent Systems',
    department: 'AI & Research Division',
    lead: 'Head of Intelligent Systems',
    avatar: 'YU',
    image: '/team_ushasree.jpg',
    gradient: 'from-violet-400 via-purple-500 to-indigo-500',
    color: 'violet',
    email: 'ushasree@lumixora.com',
    status: 'Active • LLM & Prompt Engine',
    bio: 'Pioneering intelligent AI architectures, adaptive learning engines, and next-generation educational innovation across Lumixora.',
    highlights: [
      'Leads prompt engineering, LLM fine-tuning, and personalized tutoring pipelines.',
      'Researches predictive learning analytics to identify early student intervention signals.',
      'Collaborates with engineering to deploy low-latency, scalable AI microservices.',
      'Ensures ethical AI deployment, data privacy compliance, and model accuracy.'
    ],
    skills: ['AI Systems', 'Prompt Engineering', 'Adaptive Tutoring', 'NLP & LLMs', 'Educational AI']
  },
  {
    id: 'tousif',
    name: 'SHAIK TOUSIF BASHA',
    shortName: 'Shaik Tousif Basha',
    role: 'Lead — AI Solutions',
    division: 'AI & Intelligent Systems',
    department: 'AI Solutions Division',
    lead: 'Lead — AI Solutions',
    avatar: 'ST',
    image: '/team_tousif.jpg',
    gradient: 'from-blue-400 via-indigo-500 to-cyan-400',
    color: 'blue',
    email: 'tousif@lumixora.com',
    status: 'Active • Rapid AI Proofs',
    bio: 'Harnesses cutting-edge AI tools to rapidly build demos, prototypes, and proof-of-concepts for new platform tools and automated features.',
    highlights: [
      'Builds rapid AI-driven proofs-of-concept for experimental platform modules.',
      'Bridges cutting-edge generative AI models into actionable student features.',
      'Optimizes developer workflow and prototyping velocity across engineering sprints.',
      'Tests bleeding-edge APIs to continuously expand Lumixora intelligence capabilities.'
    ],
    skills: ['AI Prototyping', 'Rapid Proof-of-Concepts', 'Tool Integration', 'Automation', 'Full-Stack Prototyping']
  },
  {
    id: 'riyaz',
    name: 'SYED RIYAZ',
    shortName: 'Syed Riyaz',
    role: 'AI Solutions Developer',
    division: 'AI & Intelligent Systems',
    department: 'AI Solutions Division',
    lead: 'Under AI Solutions (Shaik Tousif Basha)',
    avatar: 'SR',
    image: '/team_riyaz.jpg',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    color: 'cyan',
    email: 'riyaz@lumixora.com',
    status: 'Active • Model Evaluation',
    bio: 'Core AI solutions developer and rapid prototyping member. Specializes in building proof-of-concept AI modules, intelligent automation pipelines, and model evaluation.',
    highlights: [
      'Develops rapid AI prototypes and experimental feature proof-of-concepts under the AI Solutions division.',
      'Collaborates on LLM integration, prompt design, and automated workflow pipelines.',
      'Tests and optimizes AI-powered student tools for performance, accuracy, and latency.',
      'Works alongside team leads to translate cutting-edge AI research into working platform prototypes.'
    ],
    skills: ['AI Prototyping', 'Prompt Engineering', 'Python', 'Proof of Concepts', 'Model Evaluation']
  },
  {
    id: 'akhil',
    name: 'M. AKHIL',
    shortName: 'M. Akhil',
    role: 'Marketing Head',
    division: 'Growth & Brand Strategy',
    department: 'Growth & Marketing Division',
    lead: 'Head of Growth & Outreach',
    avatar: 'MA',
    image: '/team_akhil.jpg',
    gradient: 'from-brand-purple to-brand-pink',
    color: 'purple',
    email: 'akhil@lumixora.com',
    status: 'Active • Campus Outreach',
    bio: 'Leading brand strategy, university expansion, digital outreach campaigns, and student community partnerships across colleges.',
    highlights: [
      'Directs multi-channel growth campaigns driving thousands of student registrations.',
      'Authors brand storytelling and visual narrative across student media platforms.',
      'Builds strategic partnerships with student clubs, technical societies, and colleges.',
      'Analyzes acquisition funnels and referral loops to maximize platform adoption.'
    ],
    skills: ['Growth Marketing', 'Brand Strategy', 'Community Outreach', 'Digital Campaigns', 'Student Engagement']
  },
  {
    id: 'pooja',
    name: 'A. POOJA REDDY',
    shortName: 'A. Pooja Reddy',
    role: 'Mentorship Head',
    division: 'Mentorship & Support',
    department: 'Mentorship Division',
    lead: 'Head of Doubt Solver Network',
    avatar: 'AP',
    image: '/team_pooja.jpg',
    gradient: 'from-cyan-400 to-blue-600',
    color: 'cyan',
    email: 'pooja@lumixora.com',
    status: 'Active • Mentor Network',
    bio: 'Directs the 24/7 human mentor network, optimizes doubt resolution turnaround times, and provides empathetic academic support.',
    highlights: [
      'Leads a network of top-performing student mentors for real-time concept support.',
      'Monitors doubt resolution SLAs to maintain sub-15-minute response targets.',
      'Develops mentor training modules and quality assurance benchmarks.',
      'Fosters a culture of peer-to-peer collaborative academic acceleration.'
    ],
    skills: ['Mentorship Management', 'Doubt Resolution', 'Student Guidance', 'Quality Benchmarking', 'Community Support']
  },
  {
    id: 'ushaeswari',
    name: 'USHA ESWARI',
    shortName: 'Usha Eswari',
    role: 'Product Testing & QA Lead',
    division: 'Operations & QA Management',
    department: 'Product Testing & QA Division',
    lead: 'Lead — Product Testing & QA',
    avatar: 'UE',
    image: '/team_ushaeswari.jpg',
    gradient: 'from-rose-500 via-pink-500 to-indigo-500',
    color: 'rose',
    email: 'ushaeswari@lumixora.com',
    status: 'Active • Regression Testing',
    bio: 'Directs comprehensive product testing workflows, quality benchmarks, and automated QA validation across the Lumixora ecosystem.',
    highlights: [
      'Leads end-to-end product testing pipelines and quality assurance standards across all student features.',
      'Designs and executes robust functional, regression, and user acceptance test suites.',
      'Collaborates with product and engineering teams to identify defects, edge cases, and performance bottlenecks.',
      'Ensures seamless, bug-free releases and optimal stability for thousands of active university users.'
    ],
    skills: ['Product Testing', 'Quality Assurance', 'Test Automation', 'Bug Tracking & QA', 'User Acceptance Testing']
  }
];

// ── Reusable, Robust Clean Member Avatar Component ──
export function MemberAvatar({ member, size = 'w-14 h-14', rounded = 'rounded-2xl' }) {
  const [imgError, setImgError] = useState(false);

  const imgSrc = member?.image || null;

  return (
    <div className={`relative ${size} shrink-0`}>
      <div className={`absolute inset-0 bg-gradient-to-tr ${member?.gradient || 'from-teal-400 to-blue-500'} ${rounded} blur-sm opacity-40 group-hover:opacity-100 transition-opacity`}></div>
      {imgSrc && !imgError ? (
        <img 
          src={imgSrc} 
          alt={member?.name || 'Team Member'} 
          onError={() => setImgError(true)}
          className={`${size} ${rounded} object-cover relative z-10 border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300`} 
        />
      ) : (
        <div className={`${size} ${rounded} bg-gradient-to-tr ${member?.gradient || 'from-teal-400 to-blue-500'} flex items-center justify-center text-white/80 border-2 border-white/20 relative z-10 shadow-lg select-none`}>
          <Users className="w-1/2 h-1/2 opacity-75" />
        </div>
      )}
    </div>
  );
}

// ── Initial Seed Tasks for All 9 Team Members ──
const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Deploy Scheme-2026 AI Placement Commander & Analytics',
    description: 'Hook up autonomous student placement tracking with AI mock interview scoring and batch analytics export.',
    status: 'in-progress',
    priority: 'P0',
    domain: 'AI Core',
    assignee: 'SHAIK SOWBAN',
    dueDate: '2026-11-24',
    subtasks: [
      { id: 'st-1', text: 'Integrate ATS Resume scorer with Gemini API', done: true },
      { id: 'st-2', text: 'Verify Cloudflare Pages build latency and edge caching', done: true },
      { id: 'st-3', text: 'Complete student batch analytics export in CSV/PDF', done: false }
    ],
    comments: [
      { id: 'c-1', author: 'SHAIK SOWBAN', time: '10:30 AM', text: 'Edge routing tests succeeded. Ready for staging verification.' }
    ]
  },
  {
    id: 'task-2',
    title: 'KaTeX Formula Ribbons & 2D Calculus Visualizer',
    description: 'Ensure all 5 units for core engineering subjects have KaTeX derivations and Brilliant-style visualizers.',
    status: 'done',
    priority: 'P1',
    domain: 'Curriculum',
    assignee: 'C. MANASA',
    dueDate: '2026-11-20',
    subtasks: [
      { id: 'st-4', text: 'Sanitize Mermaid diagram labels', done: true },
      { id: 'st-5', text: 'High contrast Sepia and Dark reading themes', done: true },
      { id: 'st-6', text: '2D Matrix transformation sandbox', done: true }
    ],
    comments: [
      { id: 'c-2', author: 'C. MANASA', time: '11:45 AM', text: 'All 5 units of BS101, CS101, CS102 deployed to production!' }
    ]
  },
  {
    id: 'task-3',
    title: 'Design Mobile Bottom Nav & Responsive Drawers',
    description: 'Optimize responsive drawer transitions and mobile tab ergonomics for student smartphones.',
    status: 'review',
    priority: 'P1',
    domain: 'UI/UX Design',
    assignee: 'BANDI MEGHANA',
    dueDate: '2026-11-22',
    subtasks: [
      { id: 'st-7', text: 'Touch targets minimum 48px', done: true },
      { id: 'st-8', text: 'Smooth backdrop blur animations', done: true }
    ],
    comments: []
  },
  {
    id: 'task-4',
    title: 'Adaptive Tutoring Prompt Engineering & Speech Engine',
    description: 'Refine speech synthesis and automated doubt resolution prompts for natural Telugu/English cadence.',
    status: 'in-progress',
    priority: 'P1',
    domain: 'AI Core',
    assignee: 'Y. USHA SREE',
    dueDate: '2026-11-25',
    subtasks: [
      { id: 'st-9', text: 'Fine-tune technical term phonetics in audio engine', done: true },
      { id: 'st-10', text: 'Benchmark doubt solver response accuracy', done: false }
    ],
    comments: []
  },
  {
    id: 'task-5',
    title: 'Rapid AI Interview Simulation Proof-of-Concept',
    description: 'Build fast client-side audio mock interview proof-of-concept with live voice response evaluation.',
    status: 'in-progress',
    priority: 'P2',
    domain: 'AI Solutions',
    assignee: 'SHAIK TOUSIF BASHA',
    dueDate: '2026-11-26',
    subtasks: [
      { id: 'st-11', text: 'Prototype live speech waveform visualizer', done: true }
    ],
    comments: []
  },
  {
    id: 'task-6',
    title: 'Benchmarking AI Accuracy & Token Latency',
    description: 'Analyze LLM token streaming speed across college WiFi networks and mobile 4G/5G connections.',
    status: 'backlog',
    priority: 'P2',
    domain: 'AI Solutions',
    assignee: 'SYED RIYAZ',
    dueDate: '2026-11-28',
    subtasks: [],
    comments: []
  },
  {
    id: 'task-7',
    title: 'Campus Ambassador Drive & Hackathon Launch Campaign',
    description: 'Coordinate digital flyers and student club outreach across regional autonomous colleges.',
    status: 'in-progress',
    priority: 'P1',
    domain: 'Growth & Marketing',
    assignee: 'M. AKHIL',
    dueDate: '2026-11-27',
    subtasks: [
      { id: 'st-12', text: 'Design Instagram & WhatsApp story campaign', done: true },
      { id: 'st-13', text: 'Partner with technical society leads', done: false }
    ],
    comments: []
  },
  {
    id: 'task-8',
    title: '24/7 Peer Mentorship SLA & Response Optimization',
    description: 'Monitor student doubt resolution times and onboard senior peer concept mentors.',
    status: 'review',
    priority: 'P1',
    domain: 'Mentorship',
    assignee: 'A. POOJA REDDY',
    dueDate: '2026-11-23',
    subtasks: [
      { id: 'st-14', text: 'Maintain sub-15 minute average resolution time', done: true }
    ],
    comments: []
  },
  {
    id: 'task-9',
    title: 'End-to-End Regression Testing on Production Build',
    description: 'Run automated and manual functional checks on Notes Platform, Exam Portal, and Placement Suite.',
    status: 'in-progress',
    priority: 'P0',
    domain: 'Operations & QA',
    assignee: 'USHA ESWARI',
    dueDate: '2026-11-21',
    subtasks: [
      { id: 'st-15', text: 'Verify cross-browser contrast (Dark, Light, Sepia)', done: true },
      { id: 'st-16', text: 'Execute student login edge-case flows', done: false }
    ],
    comments: []
  }
];

// ── Initial Seed Specs ──
const INITIAL_SPECS = [
  {
    id: 'spec-1',
    title: 'PRD: Autonomous Campus Placement Intelligence (AI Placement Commander)',
    domain: 'Product Strategy',
    status: 'Approved',
    author: 'SHAIK SOWBAN',
    lastEdited: 'Nov 19, 2026',
    content: `### 1. Problem Statement
College campus placement drives are traditionally uncoordinated, paper-heavy, and lack student diagnostic readiness. Students arrive at technical rounds without understanding where they rank or what specific topics to revise.

### 2. Proposed Architecture
- **Diagnostic Engine:** Evaluates student DSA mastery, verbal agility, and technical coding speed.
- **Dynamic Company Mapping:** Matches student readiness percentiles to live hiring cutoffs (Tier 1 Product, Tier 2 IT Services, Core Engineering).
- **Zero-Friction Interview Simulator:** Browser-native speech recognition simulating real-world technical manager interviews.

### 3. Technical Constraints
- Real-time latency < 350ms on edge nodes.
- Strict isolation between main domain and autonomous college subdomains.`
  },
  {
    id: 'spec-2',
    title: 'RFC: KaTeX & SVG Interactive Sandbox Engine for Notes Platform',
    domain: 'Engineering',
    status: 'Shipped',
    author: 'C. MANASA & SOWBAN',
    lastEdited: 'Nov 20, 2026',
    content: `### 1. Motivation
Traditional PDF notes are passive and boring. Engineering students learn 3x faster when mathematical theorems can be manipulated interactively.

### 2. Implementation Specifications
- **KaTeX Integration:** Server-side and client-side safe rendering for LaTeX mathematical equations.
- **2D Vector Sandbox:** Real-time matrix transformation $Y = A \\cdot X$ with live determinant and trace updates.
- **Calculus LMVT Visualizer:** Dynamic secant chord and parallel tangent point calculations on cubic curves.`
  }
];

// ── Initial Seed Standups ──
const INITIAL_STANDUPS = [
  {
    id: 'std-1',
    member: 'SHAIK SOWBAN',
    role: 'Founder, CEO & Tech Lead',
    date: 'Today, 10:15 AM',
    shipped: 'Shipped the interactive 2D Calculus & Matrix visualizer sandbox with high-contrast Sepia and Dark reading themes.',
    workingOn: 'Building the upgraded Lumixora Team OS workspace and refining Cloudflare deployment routines.',
    blockers: 'None. Ready for team review on the new sprint flow.',
    founderStatus: 'Approved'
  },
  {
    id: 'std-2',
    member: 'C. MANASA',
    role: 'Team Lead • Feature Strategy',
    date: 'Today, 11:30 AM',
    shipped: 'Curated 10 high-yield formulas and 4 Leitner flashcards across all 5 engineering calculus units.',
    workingOn: 'Drafting the Python programming unit curriculum roadmap and micro-quizzes.',
    blockers: 'Need Sowban’s sign-off on the Scheme-2026 AI tool curriculum spec.',
    founderStatus: 'Reviewing'
  },
  {
    id: 'std-3',
    member: 'BANDI MEGHANA',
    role: 'UI/UX Designer',
    date: 'Today, 1:20 PM',
    shipped: 'Designed high-contrast OLED Midnight and Book Sepia color tokens in Figma.',
    workingOn: 'Designing responsive sprint card drag animations for mobile and desktop.',
    blockers: 'None.',
    founderStatus: 'Approved'
  },
  {
    id: 'std-4',
    member: 'USHA ESWARI',
    role: 'Product Testing & QA Lead',
    date: 'Today, 3:00 PM',
    shipped: 'Executed 45 end-to-end regression test cases across student notes and question banks.',
    workingOn: 'Testing formula derivation contrast and student score persistence.',
    blockers: 'None.',
    founderStatus: 'Approved'
  }
];

// ── Initial Seed War Room Messages ──
const INITIAL_WAR_ROOM_MESSAGES = [
  {
    id: 'msg-1',
    author: 'SHAIK SOWBAN',
    role: 'Founder & CEO',
    time: '10:00 AM',
    text: '🚀 Team, Sprint 14 target is to finalize the Scheme-2026 AI Placement Suite and High-Yield Notes. Let’s make sure all P0 items ship by Friday.',
    badge: 'Announcement 📢'
  },
  {
    id: 'msg-2',
    author: 'C. MANASA',
    role: 'Feature Strategy Lead',
    time: '10:45 AM',
    text: 'Formulas and Leitner flashcards for Linear Algebra & Calculus (BS101) are fully validated. Ready for student review!',
    badge: 'Curriculum'
  },
  {
    id: 'msg-3',
    author: 'BANDI MEGHANA',
    role: 'UI/UX Lead',
    time: '12:15 PM',
    text: 'Updated the mobile drawer safe area margins in Figma. Sowban, please check the inspect link in the Asset Vault.',
    badge: 'UI/UX'
  },
  {
    id: 'msg-4',
    author: 'USHA ESWARI',
    role: 'QA Lead',
    time: '2:30 PM',
    text: 'Sepia and Dark theme contrast tests passed 100% on iOS Safari and Android Chrome. No color clash detected.',
    badge: 'QA Passed ✅'
  }
];

// ── Initial Seed Vault Links ──
const INITIAL_VAULT = [
  {
    id: 'vault-1',
    category: 'Design & Figma',
    title: 'Lumixora Master Figma Design System 2026',
    description: 'Component library, 3D emblem mockups, dark/sepia palettes, and mobile screens.',
    url: 'https://figma.com/@lumixora-system',
    badge: 'Figma'
  },
  {
    id: 'vault-2',
    category: 'Code & Infra',
    title: 'Cloudflare Pages Production Dashboard',
    description: 'Live deployment console, custom subdomains (gprec.lumixora.in, tpo.lumixora.in).',
    url: 'https://dash.cloudflare.com',
    badge: 'Cloudflare'
  },
  {
    id: 'vault-3',
    category: 'Code & Infra',
    title: 'Firebase Firestore & Auth Console',
    description: 'User database, security rules, student collections, and real-time listeners.',
    url: 'https://console.firebase.google.com/project/lumixora-93cca',
    badge: 'Firebase'
  },
  {
    id: 'vault-4',
    category: 'Guidelines & Standards',
    title: 'Zero-Interference & Locked Domain Policy (AGENTS.md)',
    description: 'Strict subdomain isolation rules, commit requirements, and deployment protocols.',
    url: '#/learning-hub',
    badge: 'Engineering'
  },
  {
    id: 'vault-5',
    category: 'Brand Assets',
    title: 'Official Lumixora SVG Logos & Vector Emblems',
    description: 'High-res transparent PNGs, SVG vector logos, and brand typeface specifications.',
    url: '/lumixora_logo.png',
    badge: 'Brand Assets'
  }
];

export default function TeamWorkspacePortal({ user, setActiveTab }) {
  const isFounder = user?.role === 'founder' || 
                    user?.email?.toLowerCase() === 'founder@lumixora.com' ;

  // Workspaces: 'kanban' | 'specs' | 'standups' | 'warroom' | 'vault' | 'roster' | 'executive'
  const [activeWorkspace, setActiveWorkspace] = useState('kanban');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'date' | 'title'
  const [copiedLink, setCopiedLink] = useState(null);
  const [expandedMemberBio, setExpandedMemberBio] = useState({});

  // ── Team Members State with Live Firestore Directory Sync ──
  const [teamMembers, setTeamMembers] = useState(ALL_TEAM_MEMBERS);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'lumixora_team_directory'), (snap) => {
        if (!snap.empty) {
          const dbList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const merged = ALL_TEAM_MEMBERS.map(local => {
            const remote = dbList.find(r => r.id === local.id || r.name === local.name);
            return remote ? { ...local, ...remote } : local;
          });
          setTeamMembers(merged);
        }
      }, () => {});
      return () => unsub();
    } catch (_) {}
  }, []);

  // ── Sprint Goal State ──
  const [sprintGoal, setSprintGoal] = useState(() => {
    return localStorage.getItem('lumixora_sprint_goal') || 'Launch Scheme-2026 AI Placement Suite & High-Yield Interactive Notes';
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalText, setTempGoalText] = useState(sprintGoal);

  // ── Tasks / Kanban State ──
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_team_tasks_v4');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch (_) {
      return INITIAL_TASKS;
    }
  });
  const [taskFilterAssignee, setTaskFilterAssignee] = useState('all');
  const [taskFilterPriority, setTaskFilterPriority] = useState('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [inlineTaskInput, setInlineTaskInput] = useState({ column: null, text: '' });
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'P1',
    domain: 'AI Core',
    assignee: 'SHAIK SOWBAN',
    dueDate: ''
  });

  // Selected Task for Sliding Flyout Drawer
  const [selectedTask, setSelectedTask] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // ── Specs State ──
  const [specs, setSpecs] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_team_specs_v4');
      return saved ? JSON.parse(saved) : INITIAL_SPECS;
    } catch (_) {
      return INITIAL_SPECS;
    }
  });
  const [selectedSpecId, setSelectedSpecId] = useState(specs[0]?.id || 'spec-1');
  const [isEditingSpec, setIsEditingSpec] = useState(false);
  const [specDraftContent, setSpecDraftContent] = useState('');
  const [isNewSpecModalOpen, setIsNewSpecModalOpen] = useState(false);
  const [newSpecData, setNewSpecData] = useState({
    title: '',
    domain: 'Product Strategy',
    status: 'Draft',
    content: ''
  });

  // ── Standups State ──
  const [standups, setStandups] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_team_standups_v4');
      return saved ? JSON.parse(saved) : INITIAL_STANDUPS;
    } catch (_) {
      return INITIAL_STANDUPS;
    }
  });
  const [myStandup, setMyStandup] = useState({ shipped: '', workingOn: '', blockers: '' });
  const [isSubmittingStandup, setIsSubmittingStandup] = useState(false);

  // ── War Room Chat State ──
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_team_warroom_chat');
      return saved ? JSON.parse(saved) : INITIAL_WAR_ROOM_MESSAGES;
    } catch (_) {
      return INITIAL_WAR_ROOM_MESSAGES;
    }
  });
  const [myChatMessage, setMyChatMessage] = useState('');

  // ── Vault State ──
  const [vaultLinks, setVaultLinks] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_team_vault_v4');
      return saved ? JSON.parse(saved) : INITIAL_VAULT;
    } catch (_) {
      return INITIAL_VAULT;
    }
  });
  const [vaultCategoryFilter, setVaultCategoryFilter] = useState('All');
  const [isNewVaultModalOpen, setIsNewVaultModalOpen] = useState(false);
  const [newVaultData, setNewVaultData] = useState({
    title: '',
    category: 'Design & Figma',
    description: '',
    url: '',
    badge: 'Resource'
  });

  // ── Founder Executive Notes State ──
  const [executiveNotes, setExecutiveNotes] = useState(() => {
    return localStorage.getItem('lumixora_executive_notes') || `### Confidential Executive Notes\n- Q4 Target: Reach 5,000 active university students across JNTU & Autonomous engineering colleges.\n- Campus Partners: GPREC, RGM, SVCE discussions in progress.\n- AI Cost Optimization: Transition heavy LLM token usage to cached batch evaluations.`;
  });
  const [isEditingExecutiveNotes, setIsEditingExecutiveNotes] = useState(false);
  const [tempExecutiveNotes, setTempExecutiveNotes] = useState(executiveNotes);

  // ── Persistence to LocalStorage ──
  useEffect(() => {
    try { localStorage.setItem('lumixora_team_tasks_v4', JSON.stringify(tasks)); } catch (_) {}
  }, [tasks]);

  useEffect(() => {
    try { localStorage.setItem('lumixora_team_specs_v4', JSON.stringify(specs)); } catch (_) {}
  }, [specs]);

  useEffect(() => {
    try { localStorage.setItem('lumixora_team_standups_v4', JSON.stringify(standups)); } catch (_) {}
  }, [standups]);

  useEffect(() => {
    try { localStorage.setItem('lumixora_team_warroom_chat', JSON.stringify(chatMessages)); } catch (_) {}
  }, [chatMessages]);

  useEffect(() => {
    try { localStorage.setItem('lumixora_team_vault_v4', JSON.stringify(vaultLinks)); } catch (_) {}
  }, [vaultLinks]);

  // ── Video Call & Huddle State ──
  const [isInHuddle, setIsInHuddle] = useState(false);
  const [directCallMember, setDirectCallMember] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [huddleLayout, setHuddleLayout] = useState('grid'); // 'grid' | 'spotlight'
  const [activeSpeakerId, setActiveSpeakerId] = useState('sowban');
  const [huddleDuration, setHuddleDuration] = useState(180);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showHuddleNotes, setShowHuddleNotes] = useState(false);
  const [huddleReactions, setHuddleReactions] = useState([]);
  const [huddleNotesText, setHuddleNotesText] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_huddle_notes_v2');
      if (saved) return saved;
    } catch (_) {}
    return `## 🚀 Sprint 14 Standup Decisions\n- **AI Placement Engine (Sowban):** Edge latency verified < 350ms.\n- **Curriculum & KaTeX (Manasa):** All 5 units for core engineering published.\n- **Design Systems (Meghana):** Linear-style tokens & responsive drawers approved.\n- **AI Tutoring & Audio (Usha Sree):** Low-latency voice prompt engine benchmarked.\n- **Rapid AI PoCs (Tousif & Riyaz):** Real-time speech response demo in test.\n- **Campus Outreach (Akhil):** College student ambassador drive underway.\n- **Mentorship SLAs (Pooja):** 15-min doubt resolution response target active.\n- **QA Signoff (Usha Eswari):** Cloudflare production build regression tests passed.`;
  });

  // ── AI Team Co-pilot Bot State (Figma AI Aesthetic) ──
  const [showAiBotDrawer, setShowAiBotDrawer] = useState(false);
  const [aiBotPrompt, setAiBotPrompt] = useState('');
  const [aiBotGenerating, setAiBotGenerating] = useState(false);
  const [aiBotMessages, setAiBotMessages] = useState([
    {
      id: 'ai-init',
      sender: 'bot',
      text: '⚡ **Lumixora AI Team Co-Pilot v3.0** online.\nI am connected to your live Sprint 14 telemetry, P0 blocker radar, and team workload graph. How can I accelerate execution today?'
    }
  ]);

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const screenVideoRef = useRef(null);
  const directPeerVideoRef = useRef(null);

  // Stream Attachment Callbacks (prevents blank video screens)
  const attachLocalStream = (el) => {
    localVideoRef.current = el;
    if (el && localStreamRef.current && el.srcObject !== localStreamRef.current) {
      el.srcObject = localStreamRef.current;
    }
  };

  const attachScreenStream = (el) => {
    screenVideoRef.current = el;
    if (el && screenStreamRef.current) {
      if (el.srcObject !== screenStreamRef.current) {
        el.srcObject = screenStreamRef.current;
      }
      el.play?.().catch(() => {});
    }
  };

  // Re-attach screen stream whenever sharing or layout toggles
  useEffect(() => {
    if (isScreenSharing && screenStreamRef.current && screenVideoRef.current) {
      if (screenVideoRef.current.srcObject !== screenStreamRef.current) {
        screenVideoRef.current.srcObject = screenStreamRef.current;
      }
      screenVideoRef.current.play?.().catch(() => {});
    }
  }, [isScreenSharing, huddleLayout]);

  // Video Call Duration Timer
  useEffect(() => {
    let timer;
    if (activeWorkspace === 'huddle' || isInHuddle || directCallMember) {
      timer = setInterval(() => {
        setHuddleDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeWorkspace, isInHuddle, directCallMember]);

  // Speaking rotation simulation in Huddle
  useEffect(() => {
    if (activeWorkspace !== 'huddle' && !isInHuddle && !directCallMember) return;
    const interval = setInterval(() => {
      const candidates = ['sowban', 'manasa', 'meghana', 'ushasree', 'tousif', 'riyaz', 'akhil', 'pooja', 'ushaeswari'];
      const randomSpeaker = candidates[Math.floor(Math.random() * candidates.length)];
      setActiveSpeakerId(randomSpeaker);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeWorkspace, isInHuddle, directCallMember]);

  // Cleanup media streams on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleToggleCamera = async () => {
    if (isCameraOn) {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(t => t.stop());
      }
      setIsCameraOn(false);
    } else {
      try {
        if (navigator?.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, 
            audio: false 
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
        setIsCameraOn(true);
      } catch (err) {
        console.warn('Camera preview fallback active:', err);
        setIsCameraOn(true);
      }
    }
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(prev => !prev);
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator?.mediaDevices?.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
          screenStreamRef.current = stream;
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            if (screenStreamRef.current) {
              screenStreamRef.current = null;
            }
          };
          setIsScreenSharing(true);
          setHuddleLayout('spotlight');
        } else {
          setIsScreenSharing(true);
          setHuddleLayout('spotlight');
        }
      } catch (err) {
        console.warn('Screen share cancelled or failed:', err);
      }
    }
  };

  const handleStartDirectCall = async (member) => {
    setDirectCallMember(member);
    setIsInHuddle(true);
    if (!isCameraOn) {
      await handleToggleCamera();
    }
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    setIsCameraOn(false);
    setIsScreenSharing(false);
    setIsInHuddle(false);
    setDirectCallMember(null);
  };

  const handleSendReaction = (emoji) => {
    const reactionId = Date.now() + Math.random();
    setHuddleReactions(prev => [...prev, { id: reactionId, emoji, left: Math.floor(Math.random() * 80) + 10 }]);
    setTimeout(() => {
      setHuddleReactions(prev => prev.filter(r => r.id !== reactionId));
    }, 2200);
  };

  const formatHuddleDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAskAiBot = (query) => {
    const q = query || aiBotPrompt;
    if (!q.trim()) return;
    setAiBotPrompt('');
    setAiBotMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: q }]);
    setAiBotGenerating(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();
      if (lower.includes('blocker') || lower.includes('p0')) {
        reply = `🚨 **AI Triage Report on P0 Blockers:**\n- **AI Core Placement Intelligence (Assigned: Shaik Sowban):** Gemini ATS Scorer & Cloudflare edge routes verified. Ready for staging test.\n- **QA Regression Testing (Assigned: Usha Eswari):** Test suite active. No memory leaks detected.\n💡 *Recommendation:* Merge Sowban's edge routing pull request to unblock student analytics.`;
      } else if (lower.includes('standup') || lower.includes('summarize')) {
        reply = `📊 **Daily Standup Executive Summary:**\n- **Shipped:** KaTeX formula ribbons & 2D calculus visualizers (C. Manasa).\n- **In Flight:** Responsive mobile nav (Bandi Meghana), Speech engine prompt tuning (Y. Usha Sree), AI Mock interview PoC (Shaik Tousif Basha), College outreach (M. Akhil).\n- **Team Velocity:** 11% Shipped, on track for Sprint 14 closure in 8 days.`;
      } else if (lower.includes('workload') || lower.includes('balance')) {
        reply = `⚖️ **Workload Distribution Audit across 9 Members:**\n- All 9 members are staffed with active tasks.\n- AI Solutions team (Tousif & Riyaz) have capacity to take on mobile audio latency optimizations.\n- Mentorship SLA (Pooja Reddy) reports 98.4% resolution compliance under 15 minutes.`;
      } else {
        reply = `✨ **AI Co-pilot Analysis:**\nAction item logged for "${q}". I have indexed this across the sprint board and updated telemetry in the team database.`;
      }
      setAiBotMessages(prev => [...prev, { id: `ai-${Date.now()}`, sender: 'bot', text: reply }]);
      setAiBotGenerating(false);
    }, 600);
  };

  // Keep selectedTask in sync when tasks update
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]);

  // ── Task Actions ──
  const handleMoveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      setDoc(doc(db, 'team_workspace_tasks', taskId), { status: newStatus }, { merge: true }).catch(() => {});
    } catch (_) {}
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
    try {
      deleteDoc(doc(db, 'team_workspace_tasks', taskId)).catch(() => {});
    } catch (_) {}
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubtasks = (t.subtasks || []).map(st => st.id === subtaskId ? { ...st, done: !st.done } : st);
      return { ...t, subtasks: updatedSubtasks };
    }));
  };

  const handleAddSubtask = (taskId) => {
    if (!newSubtaskText.trim()) return;
    const newSt = { id: `st-${Date.now()}`, text: newSubtaskText.trim(), done: false };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), newSt] } : t));
    setNewSubtaskText('');
  };

  const handleAddComment = (taskId) => {
    if (!newCommentText.trim()) return;
    const newComm = {
      id: `c-${Date.now()}`,
      author: user?.displayName || 'SHAIK SOWBAN',
      time: 'Just now',
      text: newCommentText.trim()
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...(t.comments || []), newComm] } : t));
    setNewCommentText('');
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskData.title.trim(),
      description: newTaskData.description.trim(),
      status: 'backlog',
      priority: newTaskData.priority,
      domain: newTaskData.domain,
      assignee: newTaskData.assignee,
      dueDate: newTaskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      subtasks: [],
      comments: []
    };

    setTasks(prev => [newTask, ...prev]);
    setIsNewTaskModalOpen(false);
    setNewTaskData({
      title: '',
      description: '',
      priority: 'P1',
      domain: 'AI Core',
      assignee: 'SHAIK SOWBAN',
      dueDate: ''
    });

    try {
      setDoc(doc(db, 'team_workspace_tasks', newTask.id), newTask).catch(() => {});
    } catch (_) {}
  };

  const handleInlineTaskCreate = (status) => {
    if (!inlineTaskInput.text.trim()) {
      setInlineTaskInput({ column: null, text: '' });
      return;
    }
    const newTask = {
      id: `task-${Date.now()}`,
      title: inlineTaskInput.text.trim(),
      description: 'Quick task created from sprint board.',
      status: status,
      priority: 'P1',
      domain: 'Engineering',
      assignee: 'SHAIK SOWBAN',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      subtasks: [],
      comments: []
    };
    setTasks(prev => [newTask, ...prev]);
    setInlineTaskInput({ column: null, text: '' });

    try {
      setDoc(doc(db, 'team_workspace_tasks', newTask.id), newTask).catch(() => {});
    } catch (_) {}
  };

  // ── Standup Submission ──
  const handleSubmitStandup = (e) => {
    e.preventDefault();
    if (!myStandup.shipped.trim() && !myStandup.workingOn.trim()) return;

    setIsSubmittingStandup(true);
    const newEntry = {
      id: `std-${Date.now()}`,
      member: user?.displayName || 'SHAIK SOWBAN',
      role: isFounder ? 'Founder, CEO & Tech Lead' : 'Team Member',
      date: 'Just now',
      shipped: myStandup.shipped.trim() || 'Executed sprint task checklist.',
      workingOn: myStandup.workingOn.trim() || 'Next sprint milestones.',
      blockers: myStandup.blockers.trim() || 'None.',
      founderStatus: 'Approved'
    };

    setStandups(prev => [newEntry, ...prev]);
    setMyStandup({ shipped: '', workingOn: '', blockers: '' });
    setIsSubmittingStandup(false);

    try {
      setDoc(doc(db, 'team_workspace_standups', newEntry.id), newEntry).catch(() => {});
    } catch (_) {}
  };

  // ── War Room Message Submission ──
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!myChatMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      author: user?.displayName || 'SHAIK SOWBAN',
      role: isFounder ? 'Founder & CEO' : 'Team Member',
      time: 'Just now',
      text: myChatMessage.trim(),
      badge: isFounder ? 'Executive 👑' : 'Team Update'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setMyChatMessage('');
  };

  // ── Filtered & Sorted Tasks ──
  const filteredAndSortedTasks = useMemo(() => {
    const priorityWeight = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 };

    return tasks
      .filter(t => {
        const matchAssignee = taskFilterAssignee === 'all' || 
          (taskFilterAssignee === 'me' ? (t.assignee.includes('SOWBAN') || t.assignee === user?.displayName) : t.assignee === taskFilterAssignee);
        const matchPriority = taskFilterPriority === 'all' || t.priority === taskFilterPriority;
        const matchSearch = !taskSearchQuery || 
          t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) || 
          t.domain.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
          t.assignee.toLowerCase().includes(taskSearchQuery.toLowerCase());
        return matchAssignee && matchPriority && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return priorityWeight[a.priority] - priorityWeight[b.priority];
        if (sortBy === 'date') return new Date(a.dueDate || '2099') - new Date(b.dueDate || '2099');
        return a.title.localeCompare(b.title);
      });
  }, [tasks, taskFilterAssignee, taskFilterPriority, taskSearchQuery, sortBy, user?.displayName]);

  // Metrics
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const p0BlockersCount = tasks.filter(t => t.priority === 'P0' && t.status !== 'done').length;

  const activeSpec = specs.find(s => s.id === selectedSpecId) || specs[0];

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-gray-100 flex flex-col font-sans antialiased pb-24 animate-fade-in relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* ── Ambient Figma/AI Cosmic Glow Orbs ── */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-10 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── LINEAR / VERCEL STYLE MINIMAL WORKSPACE HEADER ── */}
      <header className="w-full bg-[#0a0d15]/90 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-40 shadow-2xl">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Holographic Brand Emblem + Sprint Telemetry */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-cyan-500/25">
                ⚡
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight hidden sm:inline bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Lumixora Team OS
              </span>
            </div>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            {/* Linear Sprint Telemetry Pill (Responsive: Compact on mobile, Full on desktop) */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-xs font-mono shrink-0">
              <span className="text-cyan-400 font-bold">Sprint 14</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">8d left</span>
              <span className="text-gray-600">•</span>
              <span className="text-emerald-400 font-bold">{doneTasks}/{totalTasks} shipped ({progressPct}%)</span>
              {p0BlockersCount > 0 && (
                <>
                  <span className="text-gray-600 hidden lg:inline">•</span>
                  <span className="text-rose-400 font-bold hidden lg:flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {p0BlockersCount} Blockers
                  </span>
                </>
              )}
            </div>

            <div className="flex md:hidden items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono shrink-0">
              <span className="text-cyan-400 font-bold">S14</span>
              <span className="text-emerald-400 font-bold">{progressPct}%</span>
            </div>

            {/* Editable Objective */}
            <button
              onClick={() => {
                if (!isEditingGoal) setTempGoalText(sprintGoal);
                setIsEditingGoal(!isEditingGoal);
              }}
              className="text-[11px] text-gray-400 hover:text-white truncate max-w-[280px] hidden lg:inline text-left transition-colors cursor-pointer"
              title="Click to edit sprint goal"
            >
              🎯 <span className="underline decoration-white/20 underline-offset-2">{sprintGoal}</span>
            </button>
          </div>

          {/* Right: Instant Video Huddle + AI Bot + New Task */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 1-Click Video Huddle Pill Button */}
            <button
              onClick={() => {
                setActiveWorkspace('huddle');
                setIsInHuddle(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeWorkspace === 'huddle' || isInHuddle
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 font-black animate-pulse'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
              }`}
              title="1-Click Video Huddle & Team Standup Room"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{activeWorkspace === 'huddle' ? 'Live Huddle Active' : '1-Click Huddle'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline" />
            </button>

            {/* AI Team Co-Pilot Button */}
            <button
              onClick={() => setShowAiBotDrawer(!showAiBotDrawer)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-cyan-500/15 hover:from-purple-500/25 hover:to-cyan-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Open AI Team Co-Pilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Linear New Task Shortcut Button */}
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Task</span>
              <kbd className="hidden lg:inline px-1 py-0.2 text-[9px] bg-black/20 rounded font-mono font-normal">C</kbd>
            </button>
          </div>
        </div>

        {/* Tab Row: Sleek Linear Pill Switches with Badges */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto custom-scrollbar border-t border-white/[0.04] py-1.5">
          <button
            onClick={() => setActiveWorkspace('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'kanban'
                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-cyan-400" />
            <span>Board</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-mono font-bold">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveWorkspace('huddle');
              setIsInHuddle(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'huddle'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>Live Huddle</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              9 Live
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspace('warroom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'warroom'
                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>War Room</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-mono font-bold">
              {chatMessages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspace('specs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'specs'
                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Specs & PRDs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-mono font-bold">
              {specs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspace('standups')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'standups'
                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Pulse</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-mono font-bold">
              {standups.length}
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspace('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'vault'
                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Asset Vault</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-mono font-bold">
              {vaultLinks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveWorkspace('roster')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              activeWorkspace === 'roster'
                ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>All 9 Members</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-mono font-bold">
              9
            </span>
          </button>

          {isFounder && (
            <button
              onClick={() => setActiveWorkspace('executive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeWorkspace === 'executive'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Vault</span>
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTENT CONTAINER (FULL-WIDTH) ── */}
      <main className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 py-5 flex-1">

        {/* ───────────────────────────────────────────────────────────────────────────── */}
        {/* 0. 1-CLICK EMBEDDED VIDEO HUDDLE & STANDUP ROOM                               */}
        {/* ───────────────────────────────────────────────────────────────────────────── */}
        {activeWorkspace === 'huddle' && (
          <div className="space-y-4 animate-fade-in relative">
            {/* Floating Reaction Emojis */}
            {huddleReactions.map(r => (
              <div 
                key={r.id} 
                className="absolute bottom-24 text-3xl pointer-events-none animate-bounce z-50 transition-all duration-1000"
                style={{ left: `${r.left}%` }}
              >
                {r.emoji}
              </div>
            ))}

            {/* Video Room Top Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1017] p-3 px-4 rounded-xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  LIVE STANDUP HUDDLE
                </span>
                <span className="text-xs text-gray-300 font-mono">
                  ⏱️ {formatHuddleDuration(huddleDuration)}
                </span>
                <span className="text-xs text-gray-400 hidden md:inline">
                  • Sprint 14 Core Team (9 in room)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Layout Toggle */}
                <div className="bg-black/40 p-1 rounded-lg border border-white/10 flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setHuddleLayout('grid')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      huddleLayout === 'grid' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Grid (3x3)
                  </button>
                  <button
                    onClick={() => setHuddleLayout('spotlight')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      huddleLayout === 'spotlight' ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isScreenSharing && <Monitor className="w-3 h-3 text-indigo-400 animate-pulse" />}
                    <span>{isScreenSharing ? 'Screen Share' : 'Spotlight'}</span>
                  </button>
                </div>

                {/* Toggle Meeting Notes */}
                <button
                  onClick={() => setShowHuddleNotes(!showHuddleNotes)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    showHuddleNotes ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes & Tasks</span>
                </button>

                {/* External Google Meet Fallback */}
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                  title="Open in external Google Meet tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Google Meet ↗</span>
                </a>
              </div>
            </div>

            {/* Video Arena + Optional Side Panel */}
            <div className="flex gap-4 items-start">
              {/* Video Grid Canvas */}
              <div className="flex-1 min-w-0 bg-[#07090e] border border-white/10 rounded-2xl p-4 shadow-2xl relative">
                {huddleLayout === 'grid' ? (
                  <div className="space-y-4">
                    {/* Live Screen Share Stage if Sharing in Grid View */}
                    {isScreenSharing && (
                      <div className="relative w-full aspect-video max-h-[460px] rounded-2xl bg-black border-2 border-indigo-500/60 shadow-[0_0_35px_rgba(99,102,241,0.3)] overflow-hidden flex items-center justify-center animate-fade-in">
                        <video 
                          ref={attachScreenStream} 
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-full object-contain bg-black" 
                          onLoadedMetadata={(e) => e.target.play().catch(() => {})}
                        />
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-300 flex items-center gap-2 border border-indigo-400/30 shadow-lg">
                          <Monitor className="w-4 h-4 text-indigo-400 animate-pulse" />
                          <span>Presenting Screen Live to Sprint Room</span>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <button
                            onClick={() => setHuddleLayout('spotlight')}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer shadow-md"
                          >
                            Full Spotlight
                          </button>
                          <button
                            onClick={handleToggleScreenShare}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                          >
                            Stop Sharing
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3x3 Responsive Grid of All 9 Members */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-h-[500px]">
                    {teamMembers.map(member => {
                      const isCurrentUser = member.id === 'sowban' || (user?.email && member.email && user.email.toLowerCase() === member.email.toLowerCase());
                      const isSpeaking = activeSpeakerId === member.id;
                      
                      return (
                        <div
                          key={member.id}
                          onClick={() => setActiveSpeakerId(member.id)}
                          className={`relative aspect-video rounded-2xl bg-[#0f131d] border overflow-hidden flex flex-col justify-between p-3 transition-all cursor-pointer group shadow-lg ${
                            isSpeaking 
                              ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]' 
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          {/* Real Web Camera or Clean Photo Avatar */}
                          {isCurrentUser && isCameraOn ? (
                            <video 
                              ref={attachLocalStream} 
                              autoPlay 
                              playsInline 
                              muted 
                              className="absolute inset-0 w-full h-full object-cover rounded-2xl" 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0c0f17] via-[#101420] to-[#080a10]">
                              <div className="relative">
                                {isSpeaking && (
                                  <div className="absolute -inset-3 rounded-full bg-cyan-400/20 blur-md animate-ping" />
                                )}
                                <img 
                                  src={member.image} 
                                  alt={member.name}
                                  className="w-20 h-20 rounded-full object-cover border-2 border-white/20 relative z-10 shadow-2xl group-hover:scale-105 transition-transform"
                                />
                              </div>
                            </div>
                          )}

                          {/* Top Bar on Tile: Status Tag */}
                          <div className="relative z-20 flex justify-between items-center text-[10px]">
                            <span className={`px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1 ${
                              isSpeaking ? 'bg-cyan-400 text-black shadow-sm' : 'bg-black/60 text-gray-300'
                            }`}>
                              {isSpeaking ? (
                                <>
                                  <Radio className="w-3 h-3 animate-pulse" />
                                  <span>SPEAKING</span>
                                </>
                              ) : (
                                <span>LISTENING</span>
                              )}
                            </span>

                            {/* Audio Wave Bars or 1-on-1 Direct Call trigger */}
                            <div className="flex items-center gap-1.5">
                              {!isCurrentUser && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartDirectCall(member);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                                  title={`1-on-1 Call with ${member.shortName}`}
                                >
                                  <Video className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>1-on-1 Call</span>
                                </button>
                              )}

                              {isSpeaking && (
                                <div className="flex items-center gap-0.5 bg-black/60 px-2 py-1 rounded-md">
                                  <span className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full" />
                                  <span className="w-1 h-4 bg-cyan-400 animate-pulse rounded-full delay-75" />
                                  <span className="w-1 h-2 bg-cyan-400 animate-pulse rounded-full delay-150" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bottom Bar on Tile: Clean Name & Mic status (NO text over face) */}
                          <div className="relative z-20 flex justify-between items-end bg-gradient-to-t from-black/85 via-black/50 to-transparent -mx-3 -mb-3 p-3 pt-6 rounded-b-2xl">
                            <div className="min-w-0">
                              <span className="font-bold text-white text-xs block truncate leading-tight">
                                {member.shortName || member.name}
                              </span>
                              <span className="text-[10px] text-gray-400 block truncate">
                                {member.role}
                              </span>
                            </div>

                            <div className="shrink-0 ml-2">
                              {isCurrentUser ? (
                                isMicOn ? (
                                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
                                    <Mic className="w-3 h-3" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                                    <MicOff className="w-3 h-3" />
                                  </div>
                                )
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-black/50 text-gray-400 border border-white/10 flex items-center justify-center">
                                  {isSpeaking ? <Mic className="w-3 h-3 text-cyan-400" /> : <MicOff className="w-3 h-3" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Spotlight / Screen Share View */
                <div className="space-y-4">
                  {/* Main Stage */}
                  <div className="relative w-full aspect-video max-h-[500px] rounded-2xl bg-[#0e121b] border border-white/15 overflow-hidden flex items-center justify-center">
                    {isScreenSharing ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <video 
                          ref={attachScreenStream} 
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-full object-contain bg-black" 
                          onLoadedMetadata={(e) => e.target.play().catch(() => {})}
                        />
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-300 flex items-center gap-2 border border-indigo-400/30 shadow-lg">
                          <Monitor className="w-4 h-4 text-indigo-400 animate-pulse" />
                          <span>Presenting Screen Live to Sprint Room</span>
                        </div>
                        <button
                          onClick={handleToggleScreenShare}
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          Stop Sharing
                        </button>
                      </div>
                    ) : (
                        (() => {
                          const speaker = teamMembers.find(m => m.id === activeSpeakerId) || teamMembers[0];
                          const isHostSpeaking = speaker.id === 'sowban';
                          
                          if (isHostSpeaking && isCameraOn) {
                            return (
                              <div className="w-full h-full relative">
                                <video 
                                  ref={attachLocalStream} 
                                  autoPlay 
                                  playsInline 
                                  muted 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute top-3 left-3 bg-cyan-400 text-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                                  <span>You are Live in Spotlight</span>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div className="text-center space-y-3">
                              <img 
                                src={speaker.image} 
                                alt={speaker.name} 
                                className="w-28 h-28 rounded-full object-cover border-4 border-cyan-400 shadow-2xl mx-auto ring-4 ring-cyan-400/20"
                              />
                              <div>
                                <h3 className="text-lg font-black text-white">{speaker.name}</h3>
                                <p className="text-xs text-cyan-400 font-bold">{speaker.role}</p>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                                <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Active Speaker
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </div>

                    {/* Bottom Mini Strip of All 9 Members */}
                    <div className="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                      {teamMembers.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setActiveSpeakerId(m.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl border shrink-0 transition-all cursor-pointer ${
                            activeSpeakerId === m.id ? 'bg-white/15 border-cyan-400 text-white' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <img src={m.image} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                          <div className="text-left text-[11px] leading-tight">
                            <span className="font-bold block truncate max-w-[90px]">{m.shortName}</span>
                            <span className="text-[9px] text-gray-500">{m.id === activeSpeakerId ? 'Speaking' : 'Listening'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── FLOATING HUDDLE CONTROL DOCK (Google Meet / Linear style) ── */}
                <div className="mt-5 p-2 px-4 rounded-2xl bg-[#11141e]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-wrap items-center justify-between gap-3 max-w-2xl mx-auto">
                  {/* Audio & Video Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleMic}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      }`}
                      title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={handleToggleCamera}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isCameraOn ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                    >
                      {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={handleToggleScreenShare}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        isScreenSharing ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      title="Share Screen"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Interaction & Reaction Emojis */}
                  <div className="flex items-center gap-1.5 border-x border-white/10 px-3">
                    {['👏', '🔥', '💡', '🚀', '❤️'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleSendReaction(emoji)}
                        className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-sm transition-transform hover:scale-125 cursor-pointer"
                        title={`Send ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}

                    <button
                      onClick={() => setIsHandRaised(!isHandRaised)}
                      className={`p-1.5 px-2 rounded-lg text-xs font-bold transition-all ml-1 cursor-pointer ${
                        isHandRaised ? 'bg-amber-400 text-black' : 'hover:bg-white/10 text-gray-400'
                      }`}
                      title="Raise Hand"
                    >
                      ✋
                    </button>
                  </div>

                  {/* External Meet Backup + End Call */}
                  <div className="flex items-center gap-2">
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Launch Google Meet Room"
                    >
                      <span>Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={handleEndCall}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>Leave</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Meeting Minutes Drawer (collapsible) */}
              {showHuddleNotes && (
                <div className="w-80 lg:w-96 bg-[#0c0e15] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 shrink-0 animate-slide-in-right">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-purple-400" />
                      <span>Standup Notes & Action Items</span>
                    </span>
                    <button 
                      onClick={() => setShowHuddleNotes(false)}
                      className="text-gray-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <textarea
                    value={huddleNotesText}
                    onChange={e => {
                      setHuddleNotesText(e.target.value);
                      try { localStorage.setItem('lumixora_huddle_notes_v2', e.target.value); } catch(_) {}
                    }}
                    rows={14}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-gray-200 font-mono leading-relaxed outline-none focus:border-cyan-400 custom-scrollbar"
                    placeholder="Type standup bullet points, key blockers, and action items..."
                  />

                  <button
                    onClick={() => {
                      setIsNewTaskModalOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Convert Note to Sprint Task</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 1. SPRINT BOARD (KANBAN & LINEAR LIST VIEWS)                                  */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'kanban' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#111622] p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks, domain, assignee..."
                  value={taskSearchQuery}
                  onChange={e => setTaskSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-brand-teal outline-none"
                />
              </div>

              {/* Assignee Filter (All 9 Real Team Members) */}
              <select
                value={taskFilterAssignee}
                onChange={e => setTaskFilterAssignee(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:border-brand-teal outline-none cursor-pointer"
              >
                <option value="all">All 9 Assignees</option>
                <option value="me">Assigned to Me</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={taskFilterPriority}
                onChange={e => setTaskFilterPriority(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:border-brand-teal outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="P0">P0 - Blocker</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Normal</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:border-brand-teal outline-none cursor-pointer"
              >
                <option value="priority">Sort: Priority (P0 First)</option>
                <option value="date">Sort: Due Date (Earliest)</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* View Switcher: Kanban vs Linear List */}
              <div className="bg-black/40 p-1 rounded-xl border border-white/10 flex items-center gap-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'kanban' ? 'bg-brand-teal text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Kanban Board View"
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'list' ? 'bg-brand-teal text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Linear List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-teal text-black text-xs font-black flex items-center gap-1.5 hover:bg-brand-teal/90 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </div>

          {/* ── KANBAN VIEW ── */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {[
                { id: 'backlog', title: '📥 Backlog', border: 'border-gray-500/30', countBg: 'bg-gray-500/20 text-gray-300' },
                { id: 'in-progress', title: '⚡ In Progress', border: 'border-cyan-500/30', countBg: 'bg-cyan-500/20 text-cyan-300' },
                { id: 'review', title: '🔍 In Review', border: 'border-purple-500/30', countBg: 'bg-purple-500/20 text-purple-300' },
                { id: 'done', title: '🚀 Shipped', border: 'border-emerald-500/30', countBg: 'bg-emerald-500/20 text-emerald-300' }
              ].map(col => {
                const colTasks = filteredAndSortedTasks.filter(t => t.status === col.id);
                const isInlineAdding = inlineTaskInput.column === col.id;

                return (
                  <div key={col.id} className="bg-[#10141f] rounded-2xl border border-white/10 p-3.5 flex flex-col min-h-[500px]">
                    {/* Column Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{col.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.countBg}`}>
                          {colTasks.length}
                        </span>
                      </div>

                      <button
                        onClick={() => setInlineTaskInput({ column: col.id, text: '' })}
                        className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs"
                        title="Quick Add Task"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Inline Quick Add Input */}
                    {isInlineAdding && (
                      <div className="mb-3 p-2.5 rounded-xl bg-black/60 border border-brand-teal/40 space-y-2 animate-fade-in">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Task title (press Enter to save)..."
                          value={inlineTaskInput.text}
                          onChange={e => setInlineTaskInput(prev => ({ ...prev, text: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleInlineTaskCreate(col.id);
                            if (e.key === 'Escape') setInlineTaskInput({ column: null, text: '' });
                          }}
                          className="w-full bg-transparent text-xs text-white placeholder-gray-500 outline-none"
                        />
                        <div className="flex justify-end gap-1.5 pt-1 border-t border-white/10">
                          <button
                            onClick={() => setInlineTaskInput({ column: null, text: '' })}
                            className="px-2 py-0.5 rounded text-[10px] text-gray-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleInlineTaskCreate(col.id)}
                            className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-teal text-black"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Tasks List */}
                    <div className="space-y-2.5 flex-1">
                      {colTasks.length === 0 && !isInlineAdding && (
                        <div className="py-8 text-center text-gray-600 text-xs border border-dashed border-white/5 rounded-xl">
                          No tasks in this stage
                        </div>
                      )}

                      {colTasks.map(task => {
                        const memberInfo = teamMembers.find(m => m.name === task.assignee || m.shortName === task.assignee);

                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className="p-3.5 rounded-xl bg-[#151b28] border border-white/10 hover:border-brand-teal/40 transition-all shadow-sm space-y-2.5 group relative cursor-pointer"
                          >
                            {/* Tags: Priority + Domain */}
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                                task.priority === 'P0' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                                task.priority === 'P1' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              }`}>
                                {task.priority}
                              </span>

                              <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                {task.domain}
                              </span>
                            </div>

                            {/* Task Title */}
                            <h4 className="text-xs font-bold text-gray-100 leading-snug group-hover:text-brand-teal transition-colors">
                              {task.title}
                            </h4>

                            {/* Interactive Subtask Counter */}
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1">
                                <span className="flex items-center gap-1">
                                  <CheckSquare className="w-3 h-3 text-brand-teal" />
                                  <span>{task.subtasks.filter(s => s.done).length} / {task.subtasks.length} subtasks</span>
                                </span>
                                {task.comments && task.comments.length > 0 && (
                                  <span className="flex items-center gap-1 text-gray-400">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{task.comments.length}</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Bottom Row: Assignee + Date + Move Arrows */}
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                              <div className="flex items-center gap-2 truncate max-w-[140px]">
                                <MemberAvatar member={memberInfo} size="w-5 h-5" textSize="text-[9px]" rounded="rounded-full" />
                                <span className="font-semibold text-gray-300 truncate" title={task.assignee}>
                                  {memberInfo?.shortName || task.assignee}
                                </span>
                              </div>

                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                {/* Prev Stage */}
                                {col.id !== 'backlog' && (
                                  <button
                                    onClick={() => {
                                      const stages = ['backlog', 'in-progress', 'review', 'done'];
                                      const prevStage = stages[stages.indexOf(col.id) - 1];
                                      handleMoveTask(task.id, prevStage);
                                    }}
                                    className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors"
                                    title="Move to Previous Stage"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                )}

                                {/* Next Stage */}
                                {col.id !== 'done' && (
                                  <button
                                    onClick={() => {
                                      const stages = ['backlog', 'in-progress', 'review', 'done'];
                                      const nextStage = stages[stages.indexOf(col.id) + 1];
                                      handleMoveTask(task.id, nextStage);
                                    }}
                                    className="w-5 h-5 rounded bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-black flex items-center justify-center transition-colors font-bold"
                                    title="Move to Next Stage"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-gray-500 transition-colors"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── LINEAR LIST VIEW ── */
            <div className="bg-[#10141f] rounded-2xl border border-white/10 p-4 space-y-2 animate-fade-in">
              <div className="grid grid-cols-12 text-[10px] font-black uppercase text-gray-400 px-3 py-2 border-b border-white/10">
                <span className="col-span-1">Priority</span>
                <span className="col-span-5">Task Title</span>
                <span className="col-span-2">Domain</span>
                <span className="col-span-2">Assignee</span>
                <span className="col-span-1">Stage</span>
                <span className="col-span-1 text-right">Actions</span>
              </div>

              {filteredAndSortedTasks.map(task => {
                const memberInfo = teamMembers.find(m => m.name === task.assignee || m.shortName === task.assignee);

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="grid grid-cols-12 items-center text-xs p-3 rounded-xl bg-[#151b28] border border-white/5 hover:border-brand-teal/40 transition-all cursor-pointer group"
                  >
                    <div className="col-span-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                        task.priority === 'P0' ? 'bg-rose-500/20 text-rose-300' :
                        task.priority === 'P1' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="col-span-5 pr-4">
                      <span className="font-bold text-gray-200 group-hover:text-brand-teal transition-colors line-clamp-1">
                        {task.title}
                      </span>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="text-[10px] text-gray-500 block">
                          {task.subtasks.filter(s => s.done).length}/{task.subtasks.length} subtasks done
                        </span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                        {task.domain}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 truncate">
                      <MemberAvatar member={memberInfo} size="w-5 h-5" textSize="text-[9px]" rounded="rounded-full" />
                      <span className="text-gray-300 truncate text-[11px] font-medium">
                        {memberInfo?.shortName || task.assignee}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        task.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                        task.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
                        task.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="w-6 h-6 rounded hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-gray-500"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 2. TEAM WAR ROOM & INSTANT NOTICEBOARD                                        */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'warroom' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Main Chat Stream */}
          <div className="lg:col-span-8 bg-[#10141f] rounded-2xl border border-white/10 p-5 space-y-4 flex flex-col h-[650px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-black text-white">Live Team War Room</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  Instant Synced
                </span>
              </div>
              <span className="text-xs text-gray-400">All 9 team members connected</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {chatMessages.map(msg => {
                const memberInfo = teamMembers.find(m => m.name === msg.author || m.shortName === msg.author);

                return (
                  <div key={msg.id} className="p-3.5 rounded-2xl bg-[#151b28] border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MemberAvatar member={memberInfo} size="w-7 h-7" textSize="text-[10px]" rounded="rounded-xl" />
                        <span className="text-xs font-bold text-white">{msg.author}</span>
                        <span className="text-[10px] text-gray-400">({msg.role})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {msg.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-brand-teal">
                            {msg.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-500 font-mono">{msg.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-200 leading-relaxed pl-9">
                      {msg.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                placeholder="Post update, code snippet, or ping team..."
                value={myChatMessage}
                onChange={e => setMyChatMessage(e.target.value)}
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-rose-400 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Right Active Members List */}
          <div className="lg:col-span-4 bg-[#10141f] rounded-2xl border border-white/10 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-2 border-b border-white/10 pb-3">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Active Team Presence</span>
            </h3>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {teamMembers.map(m => (
                <div key={m.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MemberAvatar member={m} size="w-8 h-8" textSize="text-xs" rounded="rounded-xl" />
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">{m.name}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{m.role}</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 3. SPECS & FEATURE BLUEPRINTS                                                 */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'specs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Left Specs List */}
          <div className="lg:col-span-4 bg-[#10141f] rounded-2xl border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Feature PRDs & Specs</span>
              </span>
              <button
                onClick={() => setIsNewSpecModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-purple-500 text-white text-[11px] font-black flex items-center gap-1 hover:bg-purple-600 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New Spec</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map(spec => {
                const isSelected = spec.id === selectedSpecId;
                return (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpecId(spec.id);
                      setIsEditingSpec(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500/40 text-white shadow-md'
                        : 'bg-[#151b28] border-white/5 hover:border-white/10 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                        {spec.domain}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        spec.status === 'Shipped' ? 'bg-emerald-500/20 text-emerald-300' :
                        spec.status === 'Approved' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {spec.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                      {spec.title}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                      <span>By {spec.author}</span>
                      <span>{spec.lastEdited}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Spec Reader / Editor */}
          <div className="lg:col-span-8 bg-[#10141f] rounded-2xl border border-white/10 p-6 space-y-4">
            {activeSpec ? (
              <>
                <div className="flex items-start justify-between border-b border-white/10 pb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                        {activeSpec.domain}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        Author: <strong>{activeSpec.author}</strong> • Edited {activeSpec.lastEdited}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white">
                      {activeSpec.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isEditingSpec) {
                          setSpecs(prev => prev.map(s => s.id === activeSpec.id ? { ...s, content: specDraftContent } : s));
                          setIsEditingSpec(false);
                        } else {
                          setSpecDraftContent(activeSpec.content);
                          setIsEditingSpec(true);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isEditingSpec ? 'Save Changes' : 'Edit Spec'}</span>
                    </button>
                  </div>
                </div>

                {isEditingSpec ? (
                  <div className="space-y-3">
                    <textarea
                      rows={18}
                      value={specDraftContent}
                      onChange={e => setSpecDraftContent(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl p-4 text-xs font-mono text-gray-200 leading-relaxed outline-none focus:border-purple-500 resize-y"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingSpec(false)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 text-xs text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setSpecs(prev => prev.map(s => s.id === activeSpec.id ? { ...s, content: specDraftContent } : s));
                          setIsEditingSpec(false);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-purple-500 text-white text-xs font-bold"
                      >
                        Save & Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-xs text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
                    {activeSpec.content}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-gray-500 text-xs">
                Select a spec from the left to read or edit.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 4. DAILY PULSE (ASYNC STANDUP)                                               */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'standups' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Check-In Card */}
          <div className="lg:col-span-5 bg-[#10141f] rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Post 60-Second Daily Check-in</h3>
                <p className="text-[11px] text-gray-400">Zero status meetings. Keep all 9 members in sync asynchronously.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitStandup} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                  🟢 1. What did you ship recently?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Completed KaTeX derivations and fixed mobile collapse button..."
                  value={myStandup.shipped}
                  onChange={e => setMyStandup(prev => ({ ...prev, shipped: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-400 block mb-1">
                  🔵 2. What are you building today?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Building Lumixora Team OS and syncing sprint boards..."
                  value={myStandup.workingOn}
                  onChange={e => setMyStandup(prev => ({ ...prev, workingOn: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-rose-400 block mb-1">
                  🔴 3. Any blockers needing Sowban / Founder unblock?
                </label>
                <input
                  type="text"
                  placeholder="e.g. None / Need API keys for OpenAlex..."
                  value={myStandup.blockers}
                  onChange={e => setMyStandup(prev => ({ ...prev, blockers: e.target.value }))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:border-amber-400 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingStandup}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Check-in (+10 Team XP)</span>
              </button>
            </form>
          </div>

          {/* Standup Feed */}
          <div className="lg:col-span-7 bg-[#10141f] rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-teal" />
                <span>Live Team Pulse Feed</span>
              </h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                Active Standups Logged
              </span>
            </div>

            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
              {standups.map(entry => {
                const memberInfo = teamMembers.find(m => m.name === entry.member || m.shortName === entry.member);

                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-[#151b28] border border-white/10 space-y-3 text-xs leading-relaxed"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MemberAvatar member={memberInfo} size="w-8 h-8" textSize="text-xs" rounded="rounded-xl" />
                        <div>
                          <span className="font-bold text-white block">{entry.member}</span>
                          <span className="text-[10px] text-gray-400">{entry.role}</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-gray-500 font-mono">{entry.date}</span>
                    </div>

                    <div className="space-y-1.5 pt-1 pl-2 border-l-2 border-white/10">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-400 block">Shipped:</span>
                        <p className="text-gray-300">{entry.shipped}</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-black uppercase text-cyan-400 block mt-1.5">In Flight:</span>
                        <p className="text-gray-300">{entry.workingOn}</p>
                      </div>

                      {entry.blockers && entry.blockers.toLowerCase() !== 'none' && entry.blockers !== 'None.' && (
                        <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg mt-1.5">
                          <span className="text-[10px] font-black uppercase text-rose-400 block">Blocker:</span>
                          <p className="text-rose-200">{entry.blockers}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 5. ASSET & RESOURCE VAULT                                                     */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'vault' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111622] p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', 'Design & Figma', 'Code & Infra', 'Guidelines & Standards', 'Brand Assets'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setVaultCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    vaultCategoryFilter === cat
                      ? 'bg-cyan-500 text-black shadow-md font-black'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsNewVaultModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-black flex items-center gap-1.5 hover:bg-cyan-400 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Resource</span>
            </button>
          </div>

          {/* Vault Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaultLinks
              .filter(link => vaultCategoryFilter === 'All' || link.category === vaultCategoryFilter)
              .map(link => {
                const isCopied = copiedLink === link.id;

                return (
                  <div
                    key={link.id}
                    className="p-5 rounded-2xl bg-[#10141f] border border-white/10 hover:border-cyan-500/30 transition-all shadow-md flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                          {link.category}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase bg-white/5 px-2 py-0.5 rounded">
                          {link.badge}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {link.title}
                      </h4>

                      <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {link.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link.url);
                          setCopiedLink(link.id);
                          setTimeout(() => setCopiedLink(null), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 transition-all"
                        title="Copy Link"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span className="text-[10px]">{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <a
                        href={link.url}
                        target={link.url.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 6. ALL 9 TEAM MEMBERS ROSTER WITH COMPLETE REAL DOSSIERS                     */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {teamMembers.map(member => {
            const memberTasksCount = tasks.filter(t => (t.assignee === member.name || t.assignee === member.shortName) && t.status !== 'done').length;
            const isBioExpanded = !!expandedMemberBio[member.id];

            return (
              <div
                key={member.id}
                className="p-6 rounded-3xl bg-[#10141f] border border-white/10 hover:border-brand-teal/40 transition-all shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                {/* Header Row: Clean Avatar + Name + Role */}
                <div className="flex items-start gap-4">
                  <MemberAvatar member={member} size="w-16 h-16" textSize="text-xl" rounded="rounded-2xl" />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-black text-white leading-tight truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-brand-teal font-bold mt-0.5 truncate">
                      {member.role}
                    </p>
                    <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                      {member.department || member.division}
                    </span>
                  </div>
                </div>

                {/* Status & Workload Pill */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Workload:</span>
                    <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full text-[10px]">
                      {memberTasksCount} Active Tasks
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {member.status}
                    </span>
                  </div>
                </div>

                {/* Real Bio (Expandable) */}
                {member.bio && (
                  <div className="space-y-1 text-xs">
                    <p className={`text-gray-300 leading-relaxed ${isBioExpanded ? '' : 'line-clamp-2'}`}>
                      {member.bio}
                    </p>
                    <button
                      onClick={() => setExpandedMemberBio(prev => ({ ...prev, [member.id]: !prev[member.id] }))}
                      className="text-[10px] text-brand-teal font-bold hover:underline flex items-center gap-0.5 cursor-pointer pt-0.5"
                    >
                      <span>{isBioExpanded ? 'Show Less' : 'Read Full Bio & Highlights'}</span>
                      {isBioExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {/* Real Highlights (When Expanded) */}
                {isBioExpanded && member.highlights && member.highlights.length > 0 && (
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 animate-fade-in text-[11px]">
                    <span className="font-black text-amber-400 uppercase tracking-wider block text-[10px]">
                      Key Platform Milestones:
                    </span>
                    <ul className="space-y-1 text-gray-300">
                      {member.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-1.5">
                          <span className="text-brand-teal font-bold shrink-0">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Real Skills Tags */}
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {member.skills.slice(0, 4).map((sk, sIdx) => (
                      <span key={sIdx} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
                        {sk}
                      </span>
                    ))}
                    {member.skills.length > 4 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-gray-400">
                        +{member.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer: Email + 1-on-1 Video Call + Filter to Tasks */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 justify-between items-center text-xs text-gray-400">
                  <span className="truncate max-w-[130px] font-mono text-[11px] text-gray-400">{member.email}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartDirectCall(member)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105"
                      title={`Start 1-on-1 Video Call with ${member.name}`}
                    >
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Video Call</span>
                    </button>

                    <button 
                      onClick={() => {
                        setTaskFilterAssignee(member.name);
                        setActiveWorkspace('kanban');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Tasks</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 7. FOUNDER CONFIDENTIAL EXECUTIVE VAULT                                       */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeWorkspace === 'executive' && isFounder && (
        <div className="p-6 rounded-2xl bg-[#10141f] border border-amber-500/30 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Founder Confidential Strategic Vault</h3>
                <p className="text-xs text-gray-400">Private roadmap notes, hiring priorities, and institutional partnerships (Founder Only).</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditingExecutiveNotes) {
                  setExecutiveNotes(tempExecutiveNotes);
                  localStorage.setItem('lumixora_executive_notes', tempExecutiveNotes);
                  setIsEditingExecutiveNotes(false);
                } else {
                  setTempExecutiveNotes(executiveNotes);
                  setIsEditingExecutiveNotes(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-black shadow-md cursor-pointer"
            >
              {isEditingExecutiveNotes ? 'Save Strategic Notes' : 'Edit Notes'}
            </button>
          </div>

          {isEditingExecutiveNotes ? (
            <textarea
              rows={12}
              value={tempExecutiveNotes}
              onChange={e => setTempExecutiveNotes(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl p-4 text-xs font-mono text-gray-200 outline-none focus:border-amber-400 leading-relaxed"
            />
          ) : (
            <div className="prose prose-invert max-w-none text-xs text-gray-300 leading-relaxed whitespace-pre-line p-4 rounded-xl bg-black/40 border border-white/5">
              {executiveNotes}
            </div>
          )}
        </div>
      )}

      </main>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 8. FUTURISTIC FIGMA/AI TEAM CO-PILOT DRAWER (CYBER AI AESTHETIC)             */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {showAiBotDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md h-full bg-[#060812]/95 border-l border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.25)] p-5 flex flex-col justify-between overflow-hidden backdrop-blur-2xl animate-slide-in-right relative">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* AI Bot Header */}
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                    <div className="w-full h-full bg-[#090d1a] rounded-[14px] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>Lumixora AI Team Co-Pilot</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold">v3.0 AI</span>
                    </h3>
                    <p className="text-[11px] text-gray-400">Autonomous Sprint Intelligence • Gemini 2.5</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAiBotDrawer(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Quick AI Action Pills */}
              <div className="pt-3 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
                <button
                  onClick={() => handleAskAiBot('Summarize today standup and key updates')}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap font-semibold cursor-pointer transition-all"
                >
                  ⚡ Standup Summary
                </button>
                <button
                  onClick={() => handleAskAiBot('Triage all P0 blockers and suggest solutions')}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap font-semibold cursor-pointer transition-all"
                >
                  🚨 Triage Blockers
                </button>
                <button
                  onClick={() => handleAskAiBot('Audit workload distribution across the 9 members')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap font-semibold cursor-pointer transition-all"
                >
                  ⚖️ Audit Workload
                </button>
                <button
                  onClick={() => handleAskAiBot('Generate draft PRD for ATS Resume Scorer')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap font-semibold cursor-pointer transition-all"
                >
                  📋 Draft PRD
                </button>
              </div>
            </div>

            {/* AI Messages Stream */}
            <div className="flex-1 my-4 overflow-y-auto pr-1 space-y-3 custom-scrollbar relative z-10">
              {aiBotMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-100 ml-6 text-right'
                      : 'bg-[#0d101c]/90 border border-white/10 text-gray-200 mr-2 shadow-xl whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {aiBotGenerating && (
                <div className="p-3.5 rounded-2xl bg-[#0d101c]/90 border border-cyan-500/40 text-xs text-cyan-300 flex items-center gap-2.5 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing Sprint 14 neural telemetry...</span>
                </div>
              )}
            </div>

            {/* AI Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAskAiBot();
              }}
              className="pt-3 border-t border-white/10 flex items-center gap-2 relative z-10"
            >
              <input
                type="text"
                placeholder="Ask AI Copilot about sprint, blockers, tasks..."
                value={aiBotPrompt}
                onChange={e => setAiBotPrompt(e.target.value)}
                className="flex-1 bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={aiBotGenerating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:opacity-90 text-black font-extrabold text-xs shadow-md shadow-cyan-400/25 transition-all cursor-pointer disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 9. 1-ON-1 DIRECT VIDEO CALL STUDIO ROOM                                       */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {directCallMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6 animate-fade-in">
          <div className="w-full max-w-5xl bg-[#080b13] border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] flex flex-col justify-between overflow-hidden max-h-[92vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0b0e18]/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="/founder_sowban.png" alt="Shaik Sowban" className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400" />
                  <img src={directCallMember.image} alt={directCallMember.name} className="w-9 h-9 rounded-full object-cover border-2 border-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>1-on-1 Video Standup • {directCallMember.shortName || directCallMember.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-400">{directCallMember.role} • {directCallMember.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-gray-300 font-bold">
                  ⏱️ {formatHuddleDuration(huddleDuration)}
                </span>
                <button
                  onClick={handleEndCall}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                  title="Close Call"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Feeds Grid (Dual Screen) */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
              
              {/* Tile 1: User (Shaik Sowban) */}
              <div className="relative aspect-video rounded-2xl bg-[#0f131d] border border-cyan-500/40 overflow-hidden flex flex-col justify-between p-3.5 shadow-2xl group">
                {isCameraOn ? (
                  <video 
                    ref={attachLocalStream} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0d16] via-[#101422] to-[#080a12]">
                    <div className="relative text-center space-y-2">
                      <img 
                        src="/founder_sowban.png" 
                        alt="Shaik Sowban"
                        className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 shadow-2xl mx-auto ring-4 ring-cyan-400/20"
                      />
                      <p className="text-xs text-gray-400 font-semibold">Camera is Turned Off</p>
                    </div>
                  </div>
                )}

                {/* Top Status */}
                <div className="relative z-10 flex justify-between items-center text-[10px]">
                  <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-cyan-400 text-black">
                    YOU (HOST)
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md text-cyan-300">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>720p HD</span>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-10 flex justify-between items-end bg-gradient-to-t from-black/85 via-black/40 to-transparent -mx-3.5 -mb-3.5 p-3.5 pt-6 rounded-b-2xl">
                  <div>
                    <span className="font-black text-white text-xs block">Shaik Sowban</span>
                    <span className="text-[10px] text-cyan-400 block">Founder, CEO & Tech Lead</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
                    {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                </div>
              </div>

              {/* Tile 2: Peer Team Member */}
              <div className="relative aspect-video rounded-2xl bg-[#0f131d] border border-purple-500/40 overflow-hidden flex flex-col justify-between p-3.5 shadow-2xl group">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0c0f1a] via-[#121626] to-[#090b14]">
                  <div className="relative text-center space-y-2.5">
                    <div className="relative inline-block">
                      <div className="absolute -inset-3 rounded-full bg-purple-500/25 blur-lg animate-ping" />
                      <img 
                        src={directCallMember.image} 
                        alt={directCallMember.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-purple-400 shadow-2xl mx-auto relative z-10"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{directCallMember.shortName || directCallMember.name}</h4>
                      <p className="text-[11px] text-purple-300 font-bold">{directCallMember.role}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connected • {directCallMember.status || 'Active in Standup'}
                    </div>
                  </div>
                </div>

                {/* Top Status */}
                <div className="relative z-10 flex justify-between items-center text-[10px]">
                  <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-purple-500 text-white">
                    SPEAKING
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md text-emerald-400">
                    <span className="w-1 h-3 bg-emerald-400 animate-pulse rounded-full" />
                    <span className="w-1 h-4 bg-emerald-400 animate-pulse rounded-full delay-75" />
                    <span className="w-1 h-2 bg-emerald-400 animate-pulse rounded-full delay-150" />
                    <span className="text-[9px] font-mono ml-1">Live Audio</span>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-10 flex justify-between items-end bg-gradient-to-t from-black/85 via-black/40 to-transparent -mx-3.5 -mb-3.5 p-3.5 pt-6 rounded-b-2xl">
                  <div>
                    <span className="font-black text-white text-xs block">{directCallMember.name}</span>
                    <span className="text-[10px] text-gray-400 block">{directCallMember.department}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

            </div>

            {/* Screen Share Preview Tile if active */}
            {isScreenSharing && (
              <div className="px-6 pb-2">
                <div className="w-full aspect-video max-h-[300px] rounded-2xl bg-black border border-indigo-500/50 relative overflow-hidden flex items-center justify-center">
                  <video ref={attachScreenStream} autoPlay playsInline className="w-full h-full object-contain" />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white text-[10px] font-bold flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Sharing Screen with {directCallMember.shortName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Call Controls Dock */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#090c15] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMic}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${
                    isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  }`}
                  title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleToggleCamera}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${
                    isCameraOn ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                >
                  {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleToggleScreenShare}
                  className={`p-3 rounded-2xl transition-all cursor-pointer ${
                    isScreenSharing ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Share Screen"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              {/* Center Quick Actions */}
              <div className="flex items-center gap-2">
                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Open Dedicated Google Meet Call"
                >
                  <span>Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setDirectCallMember(null);
                    setActiveWorkspace('huddle');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Join Full 9-Member Standup</span>
                </button>
              </div>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* 10. FLOATING PICTURE-IN-PICTURE (PiP) VIDEO CALL DOCK                          */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {isInHuddle && activeWorkspace !== 'huddle' && !directCallMember && (
        <div className="fixed bottom-6 right-6 z-40 w-72 sm:w-80 rounded-2xl bg-[#090c15]/95 border border-cyan-500/40 shadow-[0_10px_40px_rgba(6,182,212,0.3)] backdrop-blur-2xl p-3.5 animate-slide-up space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black text-white">Call Active</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30 font-bold">
                {formatHuddleDuration(huddleDuration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveWorkspace('huddle')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Expand to Full Huddle Room"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleEndCall}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-all cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mini Video Feed */}
          <div className="relative aspect-video rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
            {isCameraOn ? (
              <video ref={attachLocalStream} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center gap-2.5">
                <img 
                  src={teamMembers.find(m => m.id === activeSpeakerId)?.image || '/founder_sowban.png'} 
                  alt="Speaker" 
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block truncate max-w-[140px]">
                    {teamMembers.find(m => m.id === activeSpeakerId)?.name || 'Team Speaker'}
                  </span>
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> Speaking
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mini Quick Bar */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={handleToggleMic}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isMicOn ? 'bg-white/10 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
            </button>
            <button
              onClick={handleToggleCamera}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isCameraOn ? 'bg-cyan-400 text-black font-bold' : 'bg-white/10 text-white'
              }`}
            >
              {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setActiveWorkspace('huddle')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-bold text-[11px] cursor-pointer"
            >
              Open Room
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* SLIDING FLYOUT DRAWER: INTERACTIVE TASK DETAIL                                */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-full bg-[#10141f] border-l border-white/15 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded font-mono ${
                    selectedTask.priority === 'P0' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    selectedTask.priority === 'P1' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {selectedTask.priority}
                  </span>
                  <span className="text-xs font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded">
                    {selectedTask.domain}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Task Title & Status Selector */}
              <div className="space-y-3">
                <h2 className="text-xl font-black text-white leading-snug">
                  {selectedTask.title}
                </h2>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-bold">Stage:</span>
                  {['backlog', 'in-progress', 'review', 'done'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleMoveTask(selectedTask.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedTask.status === st
                          ? 'bg-brand-teal text-black font-black shadow'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignee & Due Date Row */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/5 text-xs">
                <div>
                  <span className="text-gray-400 block mb-1">Assignee:</span>
                  <select
                    value={selectedTask.assignee}
                    onChange={e => {
                      const newAssignee = e.target.value;
                      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, assignee: newAssignee } : t));
                    }}
                    className="w-full bg-[#151b28] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-gray-400 block mb-1">Target Due Date:</span>
                  <input
                    type="date"
                    value={selectedTask.dueDate || ''}
                    onChange={e => {
                      const newDate = e.target.value;
                      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, dueDate: newDate } : t));
                    }}
                    className="w-full bg-[#151b28] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              {selectedTask.description && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 block">Description:</span>
                  <p className="text-xs text-gray-300 leading-relaxed p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {/* ── Interactive Subtask Checklist ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-teal flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4" />
                    <span>Subtask Checklist ({selectedTask.subtasks?.filter(s => s.done).length || 0} / {selectedTask.subtasks?.length || 0})</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {(selectedTask.subtasks || []).map(st => (
                    <div
                      key={st.id}
                      onClick={() => handleToggleSubtask(selectedTask.id, st.id)}
                      className="p-2.5 rounded-xl bg-[#151b28] border border-white/5 hover:border-white/15 flex items-center gap-2.5 text-xs cursor-pointer select-none transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={st.done}
                        onChange={() => {}}
                        className="accent-brand-teal w-4 h-4 rounded cursor-pointer"
                      />
                      <span className={`flex-1 ${st.done ? 'line-through text-gray-500' : 'text-gray-200 font-medium'}`}>
                        {st.text}
                      </span>
                    </div>
                  ))}

                  {/* Add Subtask Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add a new subtask..."
                      value={newSubtaskText}
                      onChange={e => setNewSubtaskText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask(selectedTask.id);
                        }
                      }}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-teal"
                    />
                    <button
                      onClick={() => handleAddSubtask(selectedTask.id)}
                      className="px-3 py-1.5 rounded-xl bg-brand-teal text-black text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Task Comments & Activity ── */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Discussion & Activity ({selectedTask.comments?.length || 0})</span>
                </span>

                <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                  {(selectedTask.comments || []).map(comm => (
                    <div key={comm.id} className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <strong className="text-white">{comm.author}</strong>
                        <span>{comm.time}</span>
                      </div>
                      <p className="text-gray-300">{comm.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Leave comment or update link..."
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddComment(selectedTask.id);
                      }
                    }}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={() => handleAddComment(selectedTask.id)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>

              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-brand-teal text-black font-black shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE NEW TASK                                                        */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111622] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-teal" />
                <span>Create New Sprint Task</span>
              </h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Mobile Bottom Navigation bar"
                  value={newTaskData.title}
                  onChange={e => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Description / Spec Context</label>
                <textarea
                  rows={3}
                  placeholder="Requirements, acceptance criteria, or design links..."
                  value={newTaskData.description}
                  onChange={e => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-brand-teal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Priority</label>
                  <select
                    value={newTaskData.priority}
                    onChange={e => setNewTaskData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="P0">P0 - Blocker</option>
                    <option value="P1">P1 - High</option>
                    <option value="P2">P2 - Normal</option>
                    <option value="P3">P3 - Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">Domain</label>
                  <select
                    value={newTaskData.domain}
                    onChange={e => setNewTaskData(prev => ({ ...prev, domain: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="AI Core">AI Core</option>
                    <option value="Curriculum">Curriculum</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="AI Solutions">AI Solutions</option>
                    <option value="Growth & Marketing">Growth & Marketing</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Operations & QA">Operations & QA</option>
                    <option value="DevOps / Infra">DevOps / Infra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Assignee</label>
                  <select
                    value={newTaskData.assignee}
                    onChange={e => setNewTaskData(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={e => setNewTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-teal text-black text-xs font-black shadow-md cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE NEW SPEC                                                        */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {isNewSpecModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111622] border border-white/15 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Author New Feature Spec</span>
              </h3>
              <button onClick={() => setIsNewSpecModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSpecData.title.trim()) return;

                const newSpec = {
                  id: `spec-${Date.now()}`,
                  title: newSpecData.title.trim(),
                  domain: newSpecData.domain,
                  status: newSpecData.status,
                  author: user?.displayName || 'SHAIK SOWBAN',
                  lastEdited: 'Just now',
                  content: newSpecData.content.trim() || '### 1. Overview\nDescribe the feature motivation and scope.\n\n### 2. Requirements\n- Point 1\n- Point 2'
                };

                setSpecs(prev => [newSpec, ...prev]);
                setSelectedSpecId(newSpec.id);
                setIsNewSpecModalOpen(false);
                setNewSpecData({ title: '', domain: 'Product Strategy', status: 'Draft', content: '' });

                try {
                  setDoc(doc(db, 'team_workspace_specs', newSpec.id), newSpec).catch(() => {});
                } catch (_) {}
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Spec Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRD: Offline Student Notes Synchronization"
                  value={newSpecData.title}
                  onChange={e => setNewSpecData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Domain</label>
                  <select
                    value={newSpecData.domain}
                    onChange={e => setNewSpecData(prev => ({ ...prev, domain: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Product Strategy">Product Strategy</option>
                    <option value="Engineering">Engineering</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Academics">Academics</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">Initial Status</label>
                  <select
                    value={newSpecData.status}
                    onChange={e => setNewSpecData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Initial Content (Markdown)</label>
                <textarea
                  rows={6}
                  placeholder="### 1. Problem Statement&#10;### 2. Proposed Architecture"
                  value={newSpecData.content}
                  onChange={e => setNewSpecData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSpecModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-500 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  Create Spec
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD RESOURCE TO VAULT                                                  */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {isNewVaultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111622] border border-white/15 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>Pin Resource to Vault</span>
              </h3>
              <button onClick={() => setIsNewVaultModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newVaultData.title.trim() || !newVaultData.url.trim()) return;

                const newLink = {
                  id: `vault-${Date.now()}`,
                  title: newVaultData.title.trim(),
                  category: newVaultData.category,
                  description: newVaultData.description.trim() || 'Shared team resource.',
                  url: newVaultData.url.trim(),
                  badge: newVaultData.badge.trim() || 'Resource'
                };

                setVaultLinks(prev => [newLink, ...prev]);
                setIsNewVaultModalOpen(false);
                setNewVaultData({ title: '', category: 'Design & Figma', description: '', url: '', badge: 'Resource' });

                try {
                  setDoc(doc(db, 'team_workspace_vault', newLink.id), newLink).catch(() => {});
                } catch (_) {}
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-gray-300 block mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supabase Auth Dashboard"
                  value={newVaultData.title}
                  onChange={e => setNewVaultData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Destination URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={newVaultData.url}
                  onChange={e => setNewVaultData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-300 block mb-1">Category</label>
                  <select
                    value={newVaultData.category}
                    onChange={e => setNewVaultData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Design & Figma">Design & Figma</option>
                    <option value="Code & Infra">Code & Infra</option>
                    <option value="Guidelines & Standards">Guidelines & Standards</option>
                    <option value="Brand Assets">Brand Assets</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-300 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Figma / GitHub"
                    value={newVaultData.badge}
                    onChange={e => setNewVaultData(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Quick note on what this link is for..."
                  value={newVaultData.description}
                  onChange={e => setNewVaultData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewVaultModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-black shadow-md cursor-pointer"
                >
                  Pin to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

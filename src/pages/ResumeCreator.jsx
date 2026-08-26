import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Download, Sparkles, Plus, Trash2, Eye, Edit3, 
  CheckCircle2, AlertCircle, RefreshCw, Briefcase, GraduationCap, 
  Code2, Award, FolderGit2, Mail, Phone, Globe, 
  MapPin, Sliders, Palette, ZoomIn, ZoomOut, Check, ArrowRight, 
  Zap, Copy, Layers, Share2, Printer, ShieldCheck, Layout,
  SlidersHorizontal, CheckSquare, Sparkle, ExternalLink, MousePointer,
  Pipette
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';
import { callAICompletion } from '../services/aiService';

// ─── ROLE PRESETS (Ready-to-Use 1-Click Starter Kits) ─────────────────────────
const ROLE_PRESETS = {
  'fullstack': {
    name: '💻 Full-Stack / SDE Developer',
    personalInfo: {
      fullName: 'Rahul Sharma',
      headline: 'Full-Stack Software Engineer & Distributed Systems Developer',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      location: 'Kurnool, AP, India',
      linkedin: 'linkedin.com/in/rahulsharma-dev',
      github: 'github.com/rahul-sharma',
      portfolio: 'rahulsharma.dev',
      summary: 'Results-driven Software Engineer with strong experience in full-stack web architectures, distributed systems, and real-time APIs. Experienced in React, Node.js, and cloud deployments with a focus on scalable high-concurrency systems.'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.Tech in Computer Science and Engineering',
        institution: 'G. Pulla Reddy Engineering College',
        location: 'Kurnool, AP',
        duration: '2023 - 2027',
        grade: 'CGPA: 8.9 / 10.0'
      }
    ],
    experience: [
      {
        id: 'exp_1',
        role: 'Full Stack Developer Intern',
        company: 'TechCorp Solutions',
        location: 'Bangalore (Remote)',
        duration: 'May 2025 - July 2025',
        points: [
          'Architected high-throughput WebSocket communication pipeline handling 15,000+ daily concurrent client connections.',
          'Engineered Redis caching layer, decreasing database query overhead and reducing latency by 42%.',
          'Automated CI/CD deployment pipelines using GitHub Actions, decreasing release cycle times by 30%.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Lumixora - AI Academic Engine',
        techStack: 'React 19, Vite, Firebase, Gemini AI, Tailwind CSS',
        link: 'https://lumixora-6497b.web.app',
        github: 'github.com/rahul-sharma/lumixora',
        points: [
          'Engineered an AI-assisted campus operating system adopted by 1,200+ engineering scholars.',
          'Integrated multi-modal generative AI assistants and institutional GPA predictors with 99.4% precision.',
          'Optimized bundle size via dynamic code-splitting and asset compression, achieving 98 Lighthouse score.'
        ]
      },
      {
        id: 'proj_2',
        title: 'BlockVote - Decentralized Zero-Knowledge Voting',
        techStack: 'Solidity, Polygon zkEVM, Ethers.js, Next.js',
        link: 'https://blockvote.vercel.app',
        github: 'github.com/rahul-sharma/blockvote',
        points: [
          'Engineered tamper-proof voting smart contracts on Polygon zkEVM for campus student council elections.',
          'Integrated zk-SNARK zero-knowledge proofs to verify voter eligibility while preserving 100% voter anonymity.'
        ]
      }
    ],
    skills: {
      languages: 'Java, JavaScript (ES6+), TypeScript, Python, C++, SQL',
      frameworks: 'React.js, Next.js, Node.js, Express.js, FastAPI, Tailwind CSS',
      databases: 'PostgreSQL, MongoDB, Redis, Firebase Firestore',
      tools: 'Git, Docker, Linux, Postman, Vercel, AWS (S3, EC2)'
    },
    certifications: [
      'Smart India Hackathon (SIH) - Top 5 National Finalist (2025)',
      'LeetCode Top 5% Global Rank (Knight Badge - 1920+ Rating, 450+ Solved)',
      'AWS Certified Cloud Practitioner (Foundational)'
    ]
  },

  'ai_data': {
    name: '🤖 AI & Data Science Engineer',
    personalInfo: {
      fullName: 'Ananya Reddy',
      headline: 'Machine Learning & Data Science Engineer',
      email: 'ananya.reddy@example.com',
      phone: '+91 91234 56789',
      location: 'Hyderabad, TS, India',
      linkedin: 'linkedin.com/in/ananya-ml',
      github: 'github.com/ananya-ai',
      portfolio: 'ananya-ai.github.io',
      summary: 'Data Scientist & ML Engineer specializing in Large Language Models (LLMs), Computer Vision, and Predictive Analytics. Experienced in fine-tuning open-source transformers and deploying scalable inference pipelines.'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.Tech in Artificial Intelligence & Machine Learning',
        institution: 'G. Pulla Reddy Engineering College',
        location: 'Kurnool, AP',
        duration: '2023 - 2027',
        grade: 'CGPA: 9.2 / 10.0'
      }
    ],
    experience: [
      {
        id: 'exp_1',
        role: 'Data Science Intern',
        company: 'NeuralCraft Labs',
        location: 'Hyderabad, India',
        duration: 'June 2025 - August 2025',
        points: [
          'Fine-tuned Llama 3 8B model on specialized legal corpus, achieving 89% accuracy on extraction benchmark.',
          'Engineered vector search retrieval pipeline using LangChain, Qdrant, and OpenAI embeddings.',
          'Reduced model inference costs by 55% using 4-bit AWQ quantization and vLLM batching.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'MedVision - AI Diagnostic Radiology Assistant',
        techStack: 'PyTorch, TorchVision, FastAPI, Docker, Streamlit',
        link: 'https://medvision-ai.demo.app',
        github: 'github.com/ananya-ai/medvision',
        points: [
          'Trained DenseNet-121 CNN to classify 14 chest pathologies from 100k+ NIH X-ray dataset.',
          'Achieved 0.93 AUC score with Grad-CAM visual heatmaps highlighting affected lung regions.',
          'Packaged API with FastAPI and ONNX runtime for sub-100ms inference on CPU instances.'
        ]
      },
      {
        id: 'proj_2',
        title: 'StockPulse - Real-time Financial Sentiment Stream',
        techStack: 'Python, Apache Kafka, BERT, Scikit-learn, Plotly',
        link: 'https://stockpulse.vercel.app',
        github: 'github.com/ananya-ai/stockpulse',
        points: [
          'Processed 50,000+ real-time daily financial tweets and news headlines to predict intraday volatility.',
          'Achieved 78% directional accuracy against standard NIFTY50 market open price movements.'
        ]
      }
    ],
    skills: {
      languages: 'Python, R, SQL, C++, Bash',
      frameworks: 'PyTorch, TensorFlow, Scikit-learn, HuggingFace, LangChain, FastAPI',
      databases: 'PostgreSQL, Qdrant, ChromaDB, Pandas, NumPy',
      tools: 'Docker, MLflow, Weights & Biases, Git, Linux, Google Cloud Platform'
    },
    certifications: [
      'DeepLearning.AI Deep Learning Specialization (Andrew Ng)',
      'Kaggle Competitions Master (Top 2% Global)',
      'TensorFlow Developer Certificate'
    ]
  },

  'frontend': {
    name: '🎨 Frontend & UI/UX Engineer',
    personalInfo: {
      fullName: 'Sai Karthik',
      headline: 'Frontend Engineer & Interactive UI Specialist',
      email: 'sai.karthik@example.com',
      phone: '+91 94400 11223',
      location: 'Bangalore, KA, India',
      linkedin: 'linkedin.com/in/sai-karthik-ui',
      github: 'github.com/saikarthik-dev',
      portfolio: 'karthik.design',
      summary: 'Frontend Engineer passionate about crafting pixel-perfect, accessible, and high-performance user interfaces. Expert in React, Next.js, Framer Motion, and design systems.'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.Tech in Computer Science',
        institution: 'G. Pulla Reddy Engineering College',
        location: 'Kurnool, AP',
        duration: '2023 - 2027',
        grade: 'CGPA: 8.7 / 10.0'
      }
    ],
    experience: [
      {
        id: 'exp_1',
        role: 'Frontend Developer Intern',
        company: 'PixelCraft Studio',
        location: 'Bangalore, India',
        duration: 'May 2025 - July 2025',
        points: [
          'Re-architected core SaaS dashboard from legacy jQuery to React & Tailwind, increasing session engagement by 28%.',
          'Implemented design token system in Storybook ensuring consistent UI components across 4 web apps.',
          'Audited WCAG accessibility compliance, taking Lighthouse Accessibility score from 74 to 100.'
        ]
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'DesignMotion - Interactive CSS & SVG Animation Engine',
        techStack: 'React, TypeScript, Three.js, GSAP, Tailwind CSS',
        link: 'https://designmotion.dev',
        github: 'github.com/saikarthik-dev/design-motion',
        points: [
          'Built a web-based keyframe generator used by 3,500+ UI/UX designers globally.',
          'Exported zero-dependency pure CSS keyframe code and Lottie animations.'
        ]
      }
    ],
    skills: {
      languages: 'JavaScript (ES6+), TypeScript, HTML5, CSS3/Sass',
      frameworks: 'React.js, Next.js, Tailwind CSS, Framer Motion, Redux Toolkit, Three.js',
      databases: 'Firebase, Supabase, REST APIs, GraphQL',
      tools: 'Figma, Storybook, Vite, Webpack, Git, Jest, Cypress'
    },
    certifications: [
      'Meta Frontend Developer Professional Certificate',
      'Hackathon Best UI/UX Winner (Devfolio Buildathon 2025)'
    ]
  },

  'fresher': {
    name: '🎓 Campus Fresher / Core Engineering',
    personalInfo: {
      fullName: 'Vikram Patel',
      headline: 'Electronics & Computer Engineering Scholar',
      email: 'vikram.patel@example.com',
      phone: '+91 97000 88990',
      location: 'Kurnool, AP, India',
      linkedin: 'linkedin.com/in/vikram-patel',
      github: 'github.com/vikram-core',
      portfolio: '',
      summary: 'Enthusiastic and detail-oriented engineering student with strong analytical mindset, solid command over DSA, C++, and Embedded IoT systems. Looking to contribute technical acumen to challenging software and hardware projects.'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.Tech in Electronics and Communication Engineering',
        institution: 'G. Pulla Reddy Engineering College',
        location: 'Kurnool, AP',
        duration: '2023 - 2027',
        grade: 'CGPA: 8.6 / 10.0'
      },
      {
        id: 'edu_2',
        degree: 'Class XII (Senior Secondary)',
        institution: 'Narayana Junior College',
        location: 'Kurnool, AP',
        duration: '2021 - 2023',
        grade: '95.2%'
      }
    ],
    experience: [],
    projects: [
      {
        id: 'proj_1',
        title: 'Smart AgriNode - IoT Soil Telemetry & Drip Automation',
        techStack: 'C++, ESP32, MQTT, Python, Chart.js, LoRaWAN',
        link: '',
        github: 'github.com/vikram-core/agri-node',
        points: [
          'Engineered a solar-powered soil monitoring sensor transmitting moisture & pH data over 5km via LoRaWAN.',
          'Programmed automated relay actuator triggering precision micro-drip irrigation when moisture fell below 30%.'
        ]
      },
      {
        id: 'proj_2',
        title: 'Student Grade & Attendance Tracker Console',
        techStack: 'C++, Object Oriented Programming, File I/O',
        link: '',
        github: 'github.com/vikram-core/grade-tracker',
        points: [
          'Developed a console application implementing custom binary search trees and hashing for student record retrieval in O(1) time.'
        ]
      }
    ],
    skills: {
      languages: 'C, C++, Java, Python, SQL',
      frameworks: 'Arduino IDE, Embedded C, FreeRTOS, Flask',
      databases: 'MySQL, SQLite',
      tools: 'Git, Keil uVision, MATLAB, Multisim, VS Code'
    },
    certifications: [
      'NPTEL Elite Certificate in Data Structures & Algorithms in C++',
      'College Annual Technical Symposium - 1st Prize in Paper Presentation'
    ]
  }
};

// ─── TEMPLATES CATALOG ────────────────────────────────────────────────────────
const TEMPLATES = [
  { 
    id: 'jakes', 
    name: "Jake's Resume (Overleaf / LaTeX)", 
    tag: '👑 #1 Tech Favorite',
    desc: 'The world-famous LaTeX template used by 90% of FAANG engineers. Guaranteed 100% ATS score.'
  },
  { 
    id: 'novoresume', 
    name: 'Novoresume 2-Column Sidebar', 
    tag: '🎨 Premium Layout',
    desc: 'High-contrast left sidebar for Contact & Skills with rich main experience timeline.'
  },
  { 
    id: 'modern', 
    name: 'Silicon Valley Single-Column', 
    tag: '⚡ Modern ATS',
    desc: 'Clean modern sans-serif with bold accents and structured bullet formatting.'
  },
  { 
    id: 'harvard', 
    name: 'Ivy League / Harvard Classic', 
    tag: '🏛️ Traditional',
    desc: 'Formal academic serif typography with centered headers and all-caps sections.'
  },
  { 
    id: 'minimal', 
    name: 'Executive Minimalist', 
    tag: '💼 FlowCV Style',
    desc: 'Ultra-clean corporate layout with subtle dividers and spacious reading rhythm.'
  }
];

const FONTS = [
  { id: 'sans', name: 'Inter / Modern Sans', css: 'Inter, system-ui, sans-serif' },
  { id: 'serif', name: 'Computer Modern / LaTeX Serif', css: '"Times New Roman", Times, Georgia, serif' },
  { id: 'georgia', name: 'Georgia Elegant', css: 'Georgia, serif' },
  { id: 'roboto', name: 'Roboto Clean', css: 'Roboto, system-ui, sans-serif' },
  { id: 'mono', name: 'JetBrains Code Mono', css: '"JetBrains Mono", monospace' }
];

const PRESET_COLORS = [
  { name: 'Classic Noir Black', hex: '#111827', bg: 'bg-[#111827]' },
  { name: 'Navy Blue', hex: '#1e3a8a', bg: 'bg-[#1e3a8a]' },
  { name: 'Ocean Cyan / Teal', hex: '#0284c7', bg: 'bg-[#0284c7]' },
  { name: 'Teal Emerald', hex: '#00b4d8', bg: 'bg-[#00b4d8]' },
  { name: 'Royal Indigo', hex: '#6366f1', bg: 'bg-[#6366f1]' },
  { name: 'Deep Purple', hex: '#7c3aed', bg: 'bg-[#7c3aed]' },
  { name: 'Forest Emerald', hex: '#059669', bg: 'bg-[#059669]' },
  { name: 'Burgundy Crimson', hex: '#991b1b', bg: 'bg-[#991b1b]' },
  { name: 'Rose Red', hex: '#e11d48', bg: 'bg-[#e11d48]' },
  { name: 'Warm Amber Bronze', hex: '#b45309', bg: 'bg-[#b45309]' }
];

export default function ResumeCreator({ user, setActiveTab: _setActiveTab }) {
  const { addToast } = useToast();
  const userId = user?.uid || user?.email || 'scholar_user';
  const resumePrintRef = useRef(null);

  // Resume state
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem(`lumixora_resume_${userId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ROLE_PRESETS.fullstack;
  });

  const [activeTemplate, setActiveTemplate] = useState('jakes');
  const [activeFont, setActiveFont] = useState('sans');
  const [accentColor, setAccentColor] = useState('#111827');
  const [activeEditorTab, setActiveEditorTab] = useState('personal');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(90);

  // Modals
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isLatexModalOpen, setIsLatexModalOpen] = useState(false);
  const [atsReviewModal, setAtsReviewModal] = useState(false);

  // AI Assistant State
  const [aiGenerating, setAiGenerating] = useState(false);
  const [atsFeedback, setAtsFeedback] = useState(null);
  const [atsScore, setAtsScore] = useState(92);

  const parseAtsScore = (text, fallbackScore = 92) => {
    if (!text) return fallbackScore;
    const match = text.match(/(?:Overall ATS Score|Compatibility Score|Score)[:\s*]+(\d{2,3})(?:\s*\/\s*100)?/i) || text.match(/(\d{2,3})\s*\/\s*100/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num >= 40 && num <= 100) return num;
    }
    return fallbackScore;
  };

  // Auto-Save
  useEffect(() => {
    localStorage.setItem(`lumixora_resume_${userId}`, JSON.stringify(resumeData));
  }, [resumeData, userId]);

  useEffect(() => {
    const loadCloudResume = async () => {
      if (!user?.uid && !user?.email) return;
      try {
        const snap = await getDoc(doc(db, 'user_resumes', userId));
        if (snap.exists()) {
          const data = snap.data();
          if (data.resumeData) {
            setResumeData(data.resumeData);
            if (data.template) setActiveTemplate(data.template);
            if (data.accentColor) setAccentColor(data.accentColor);
            if (data.font) setActiveFont(data.font);
          }
        }
      } catch (err) {
        console.warn('Cloud resume load note:', err);
      }
    };
    loadCloudResume();
  }, [userId, user?.uid, user?.email]);

  const saveCloudResume = async (updatedData = resumeData) => {
    if (!user?.uid && !user?.email) return;
    try {
      await setDoc(doc(db, 'user_resumes', userId), {
        userId,
        resumeData: updatedData,
        template: activeTemplate,
        accentColor,
        font: activeFont,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {}
  };

  // ─── INLINE DIRECT CANVAS EDIT HELPER ───────────────────────────────────────
  const handleInlineEdit = (section, field, value, index = null, subIndex = null) => {
    setResumeData(prev => {
      const updated = { ...prev };
      if (section === 'personalInfo') {
        updated.personalInfo = { ...updated.personalInfo, [field]: value };
      } else if (section === 'skills') {
        updated.skills = { ...updated.skills, [field]: value };
      } else if (section === 'education' && index !== null) {
        updated.education = [...updated.education];
        updated.education[index] = { ...updated.education[index], [field]: value };
      } else if (section === 'experience' && index !== null) {
        updated.experience = [...updated.experience];
        if (subIndex !== null && field === 'point') {
          const points = [...(updated.experience[index].points || [])];
          points[subIndex] = value;
          updated.experience[index] = { ...updated.experience[index], points };
        } else {
          updated.experience[index] = { ...updated.experience[index], [field]: value };
        }
      } else if (section === 'projects' && index !== null) {
        updated.projects = [...updated.projects];
        if (subIndex !== null && field === 'point') {
          const points = [...(updated.projects[index].points || [])];
          points[subIndex] = value;
          updated.projects[index] = { ...updated.projects[index], points };
        } else {
          updated.projects[index] = { ...updated.projects[index], [field]: value };
        }
      } else if (section === 'certifications' && index !== null) {
        updated.certifications = [...updated.certifications];
        updated.certifications[index] = value;
      }
      return updated;
    });
  };

  // ─── 1-CLICK A4 PDF DOWNLOAD (High-Resolution Vector Crisp) ─────────────────
  const handleDownloadPdf = async () => {
    if (!resumePrintRef.current) return;
    setIsExportingPdf(true);
    addToast({ message: '📄 Generating high-resolution ATS A4 PDF...', type: 'info' });

    let container = null;
    try {
      const originalElement = resumePrintRef.current;
      
      // Create a temporary hidden container with fixed 794px width (standard A4 at 96 DPI)
      container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '794px';
      container.style.minHeight = '1123px';
      container.style.backgroundColor = '#ffffff';
      container.style.zIndex = '-9999';
      container.style.transform = 'none';

      // Clone the resume content
      const clone = originalElement.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.boxShadow = 'none';
      clone.style.margin = '0';
      clone.style.width = '794px';
      
      // Remove any interactive buttons/controls from clone
      const buttons = clone.querySelectorAll('button, .print\\:hidden');
      buttons.forEach(b => b.remove());

      container.appendChild(clone);
      document.body.appendChild(container);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: clone.scrollHeight > 1123 ? clone.scrollHeight : 1123
      });

      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
        container = null;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `${(resumeData.personalInfo.fullName || 'Scholar').replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);

      addToast({ message: `🎉 Successfully downloaded ${fileName}!`, type: 'success' });
      saveCloudResume();
    } catch (err) {
      console.warn('html2canvas error, triggering seamless vector print dialog:', err);
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
      triggerIframePrint();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // ─── SEAMLESS VECTOR PRINT (100% Native Vector PDF via Hidden Iframe) ────────
  const triggerIframePrint = () => {
    if (!resumePrintRef.current) return;
    try {
      const content = resumePrintRef.current.innerHTML;
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: A4 portrait; margin: 0; }
              body { 
                margin: 0; 
                padding: 0; 
                background: #ffffff; 
                font-family: ${selectedFontCss};
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #resume-canvas {
                width: 100% !important;
                min-height: 100% !important;
                box-shadow: none !important;
                padding: 28px 36px !important;
              }
              .print\\:hidden, button { display: none !important; }
            </style>
          </head>
          <body>
            <div id="resume-canvas" style="width: 794px; margin: 0 auto; color: #111827;">
              ${content}
            </div>
            <script>
              setTimeout(() => {
                window.focus();
                window.print();
              }, 400);
            </script>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);
    } catch (e) {
      window.print();
    }
  };

  // ─── LOAD ROLE PRESET ───────────────────────────────────────────────────────
  const handleApplyPreset = (presetKey) => {
    const selected = ROLE_PRESETS[presetKey];
    if (selected) {
      setResumeData(JSON.parse(JSON.stringify(selected)));
      setIsPresetModalOpen(false);
      addToast({ message: `Loaded ${selected.name} template!`, type: 'success' });
    }
  };

  // ─── GENERATE OVERLEAF / LATEX CODE ─────────────────────────────────────────
  const generateLatexCode = () => {
    const p = resumeData.personalInfo;
    return `%-------------------------
% Jake's Resume in LaTeX (Exported from Lumixora)
%------------------------

\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${p.fullName || 'YOUR NAME'}} \\\\ \\vspace{1pt}
    \\small ${p.phone} $|$ \\href{mailto:${p.email}}{${p.email}} $|$ 
    \\href{https://${p.linkedin}}{${p.linkedin}} $|$
    \\href{https://${p.github}}{${p.github}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${resumeData.education.map(edu => `    \\resumeSubheading
      {${edu.institution}}{${edu.location}}
      {${edu.degree}}{${edu.duration}}`).join('\n')}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${resumeData.experience.map(exp => `    \\resumeSubheading
      {${exp.role}}{${exp.duration}}
      {${exp.company}}{${exp.location}}
      \\resumeItemListStart
${exp.points.map(pt => `        \\resumeItem{${pt}}`).join('\n')}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
${resumeData.projects.map(proj => `    \\resumeProjectHeading
      {\\textbf{${proj.title}} $|$ \\emph{${proj.techStack}}}{${proj.github || ''}}
      \\resumeItemListStart
${proj.points.map(pt => `        \\resumeItem{${pt}}`).join('\n')}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${resumeData.skills.languages}} \\\\
     \\textbf{Frameworks}{: ${resumeData.skills.frameworks}} \\\\
     \\textbf{Developer Tools}{: ${resumeData.skills.tools}} \\\\
     \\textbf{Libraries/Databases}{: ${resumeData.skills.databases}}
    }}
 \\end{itemize}

\\end{document}`;
  };

  // ─── AI ENHANCEMENTS ────────────────────────────────────────────────────────
  const handleAiPolishSummary = async () => {
    setAiGenerating(true);
    const prompt = `You are a Silicon Valley Tech Recruiter. Rewrite the following resume summary to be punchy, quantifiable, highly professional, and ATS-optimized:
Current Summary: "${resumeData.personalInfo.summary}"
Headline: "${resumeData.personalInfo.headline}"
Return ONLY the polished 2-3 sentence summary.`;

    try {
      const polished = await callAICompletion(prompt);
      if (polished && polished.trim()) {
        setResumeData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, summary: polished.trim().replace(/^["']|["']$/g, '') }
        }));
        addToast({ message: '✨ AI refined summary!', type: 'success' });
      }
    } catch (e) {
      addToast({ message: 'AI refinement unavailable.', type: 'error' });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAiPolishBullet = async (expIndex, pointIndex, currentText, isProject = false) => {
    setAiGenerating(true);
    const prompt = `Rewrite this resume bullet point into the Google/Amazon XYZ Format: "Accomplished [X] as measured by [Y] by doing [Z]".
Original: "${currentText}"
Return ONLY the single refined bullet point with strong action verbs.`;

    try {
      const refined = await callAICompletion(prompt);
      if (refined && refined.trim()) {
        const cleanText = refined.trim().replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '');
        if (isProject) {
          setResumeData(prev => {
            const copy = [...prev.projects];
            copy[expIndex].points[pointIndex] = cleanText;
            return { ...prev, projects: copy };
          });
        } else {
          setResumeData(prev => {
            const copy = [...prev.experience];
            copy[expIndex].points[pointIndex] = cleanText;
            return { ...prev, experience: copy };
          });
        }
        addToast({ message: '✨ Bullet converted to XYZ format!', type: 'success' });
      }
    } catch (e) {
      addToast({ message: 'AI polish error.', type: 'error' });
    } finally {
      setAiGenerating(false);
    }
  };

  // AI & Local ATS Check
  const handleRunAtsCheck = async () => {
    setAiGenerating(true);
    setAtsReviewModal(true);
    setAtsFeedback(null);

    // 1. Calculate deterministic ATS metrics
    let calculatedScore = 70;
    const strengths = [];
    const improvements = [];
    const missingKeywords = [];

    // Contact checks
    const p = resumeData.personalInfo;
    if (p.email && p.phone) calculatedScore += 5;
    if (p.linkedin && p.github) {
      calculatedScore += 5;
      strengths.push("✅ Complete Digital Footprint (LinkedIn + GitHub verified).");
    } else {
      improvements.push("Add active GitHub and LinkedIn profile links.");
    }

    // Action Verb & Metric check in bullets
    const allBullets = [
      ...resumeData.experience.flatMap(e => e.points || []),
      ...resumeData.projects.flatMap(pr => pr.points || [])
    ];

    const actionVerbs = ['architected', 'engineered', 'optimized', 'developed', 'integrated', 'automated', 'implemented', 'designed', 'built', 'reduced', 'scaled', 'fine-tuned', 'trained'];
    const metricPattern = /(\d+[%kK+]?|\$\d+|\b\d+\b|latency|throughput|reduced|increased)/i;

    let verbMatches = 0;
    let metricMatches = 0;

    allBullets.forEach(b => {
      const lower = b.toLowerCase();
      if (actionVerbs.some(v => lower.includes(v))) verbMatches++;
      if (metricPattern.test(b)) metricMatches++;
    });

    if (verbMatches >= 3) {
      calculatedScore += 8;
      strengths.push(`✅ High Action Verb Density (${verbMatches} strong executive action verbs detected).`);
    } else {
      improvements.push("Start bullet points with strong power verbs (e.g. 'Architected', 'Engineered', 'Spearheaded').");
    }

    if (metricMatches >= 2) {
      calculatedScore += 10;
      strengths.push("✅ Strong Quantifiable Impact (Percentages, metrics, or performance gains found).");
    } else {
      improvements.push("Include measurable numbers and business impact (e.g. 'reduced latency by 35%', 'handled 5k+ users').");
    }

    // Skills check
    const skillsStr = `${resumeData.skills.languages} ${resumeData.skills.frameworks} ${resumeData.skills.tools} ${resumeData.skills.databases}`.toLowerCase();
    const commonKeywords = ['git', 'docker', 'sql', 'rest', 'api', 'react', 'python', 'javascript', 'linux', 'aws', 'cloud'];
    const foundKeywords = commonKeywords.filter(k => skillsStr.includes(k));

    if (foundKeywords.length >= 4) {
      calculatedScore += 5;
      strengths.push(`✅ Industry Keyword Density (${foundKeywords.slice(0, 5).join(', ')} detected).`);
    } else {
      missingKeywords.push('Docker', 'Git CI/CD', 'REST APIs', 'Cloud (AWS/GCP)');
    }

    calculatedScore = Math.min(98, Math.max(65, calculatedScore));

    const prompt = `You are a Silicon Valley Senior ATS Algorithm & Tech Recruiter.
Analyze this resume data:
Name: ${p.fullName} | Role: ${p.headline}
Skills: ${JSON.stringify(resumeData.skills)}
Experience: ${JSON.stringify(resumeData.experience)}
Projects: ${JSON.stringify(resumeData.projects)}
Education: ${JSON.stringify(resumeData.education)}

Provide a concise, professional ATS breakdown:
1. ⭐ Overall ATS Score: [Score]/100
2. 🎯 Key Strengths (3 bullet points)
3. ⚡ Recommended Optimizations (3 bullet points)
4. 🔑 Missing High-Value Tech Keywords`;

    try {
      const response = await callAICompletion(prompt);
      if (response && response.trim()) {
        const cleanFeedback = response.trim();
        setAtsFeedback(cleanFeedback);
        const parsed = parseAtsScore(cleanFeedback, calculatedScore);
        setAtsScore(parsed);
      } else {
        // Fallback to our structured engine
        setAtsScore(calculatedScore);
        setAtsFeedback(`### ⭐ ATS Compatibility Score: ${calculatedScore} / 100

#### 🎯 Key Strengths:
${strengths.length > 0 ? strengths.map(s => `- ${s}`).join('\n') : '- Clean single-page ATS layout with standard hierarchy.'}
- Standardized section titles optimized for Taleo, Workday, and Greenhouse ATS parsers.
- Clean contact header with parseable email, location, and phone tokens.

#### ⚡ Recommended Optimizations:
${improvements.length > 0 ? improvements.map(imp => `- 💡 ${imp}`).join('\n') : '- Convert project bullets to Google XYZ format: "Accomplished [X] as measured by [Y] by doing [Z]".'}
- Ensure skill groupings are comma-separated for exact machine tokenization.
- Add live deployed URLs or GitHub repo links next to key project titles.

#### 🔑 Recommended Tech Keywords to Include:
${missingKeywords.length > 0 ? missingKeywords.map(k => `\`${k}\``).join(' • ') : '`CI/CD Pipelines` • `Distributed Systems` • `Unit Testing (Jest/PyTest)` • `Redis Caching`'}`);
      }
    } catch (e) {
      setAtsScore(calculatedScore);
      setAtsFeedback(`### ⭐ ATS Compatibility Score: ${calculatedScore} / 100

#### 🎯 Key Strengths:
${strengths.map(s => `- ${s}`).join('\n')}
- Standardized section headers and compliant A4 vector typography.

#### ⚡ Recommended Optimizations:
${improvements.map(imp => `- 💡 ${imp}`).join('\n')}

#### 🔑 Recommended Tech Keywords to Include:
\`CI/CD Pipelines\` • \`System Design\` • \`RESTful APIs\` • \`Unit Testing\``);
    } finally {
      setAiGenerating(false);
    }
  };

  // Section Add / Delete
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: `edu_${Date.now()}`,
        degree: 'B.Tech in Engineering',
        institution: 'University Name',
        location: 'City, State',
        duration: '2023 - 2027',
        grade: 'CGPA: 8.5'
      }]
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: `exp_${Date.now()}`,
        role: 'Software Engineer Intern',
        company: 'Company Name',
        location: 'Remote / City',
        duration: 'May 2025 - July 2025',
        points: ['Implemented core backend APIs and optimized database queries.']
      }]
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const addExpBullet = (expIndex) => {
    setResumeData(prev => {
      const copy = [...prev.experience];
      copy[expIndex].points = [...(copy[expIndex].points || []), 'Engineered scalable features delivering measurable improvements.'];
      return { ...prev, experience: copy };
    });
  };

  const removeExpBullet = (expIndex, ptIndex) => {
    setResumeData(prev => {
      const copy = [...prev.experience];
      copy[expIndex].points = copy[expIndex].points.filter((_, i) => i !== ptIndex);
      return { ...prev, experience: copy };
    });
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: `proj_${Date.now()}`,
        title: 'New Web Application / AI Tool',
        techStack: 'React, Node.js, Python, Firebase',
        link: 'https://demo.vercel.app',
        github: 'github.com/username/project',
        points: ['Built and deployed high-performance full-stack application.']
      }]
    }));
  };

  const removeProject = (id) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addProjBullet = (projIndex) => {
    setResumeData(prev => {
      const copy = [...prev.projects];
      copy[projIndex].points = [...(copy[projIndex].points || []), 'Architected new module and optimized rendering performance.'];
      return { ...prev, projects: copy };
    });
  };

  const removeProjBullet = (projIndex, ptIndex) => {
    setResumeData(prev => {
      const copy = [...prev.projects];
      copy[projIndex].points = copy[projIndex].points.filter((_, i) => i !== ptIndex);
      return { ...prev, projects: copy };
    });
  };

  const selectedFontCss = FONTS.find(f => f.id === activeFont)?.css || 'Inter, system-ui, sans-serif';

  // Inline Editable Element styling helper
  const inlineClass = "outline-none hover:bg-black/5 focus:bg-blue-50 focus:ring-1 focus:ring-blue-400 rounded px-1 transition-all inline-block";

  return (
    <div className="w-full space-y-8 animate-fade-in">
        
        {/* ─── HERO HEADER ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-950/60 to-black/90 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f5d4]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-xs font-black uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5 animate-pulse" /> Overleaf / Novoresume / Canva ATS Studio
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-teal-300 to-cyan-400">Resume Creator</span>
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Click and edit <b>any text directly on the resume paper</b> or use the form builder. Choose custom color themes, export to LaTeX & download vector A4 PDFs.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-105"
              >
                <Sparkle className="w-4 h-4 text-purple-400" /> Role Presets ⚡
              </button>

              <button
                onClick={() => setIsLatexModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/20 font-bold text-xs flex items-center gap-2 cursor-pointer"
                title="View & Copy Overleaf LaTeX Code"
              >
                <Code2 className="w-4 h-4" /> Copy LaTeX (.tex)
              </button>

              <button
                onClick={handleRunAtsCheck}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#00f5d4] border border-[#00f5d4]/40 font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> ATS Scan
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f5d4] to-[#00b4d8] text-black font-black text-xs sm:text-sm shadow-[0_4px_20px_rgba(0,245,212,0.3)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Rendering...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download PDF (A4)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── TEMPLATES & CONTROLS TOOLBAR ─── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10">
            {/* Template Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Layout className="w-3.5 h-3.5 text-[#00f5d4]" /> Template:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTemplate === t.id
                        ? 'bg-[#00f5d4] text-black shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{t.name.split(' ')[0]}</span>
                    <span className="text-[9px] opacity-75 font-normal">({t.tag})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font & Color Customizer Toolbar */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase">Font:</span>
                <select
                  value={activeFont}
                  onChange={(e) => setActiveFont(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4] cursor-pointer"
                >
                  {FONTS.map(f => (
                    <option key={f.id} value={f.id} className="bg-neutral-900">{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Color Palette Selector + Custom Color Picker */}
              <div className="flex items-center gap-2 bg-black/40 p-1.5 px-3 rounded-xl border border-white/10">
                <span className="text-xs font-bold text-gray-400 uppercase mr-1">Color:</span>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    className={`w-4 h-4 rounded-full ${c.bg} transition-all cursor-pointer ${
                      accentColor === c.hex ? 'ring-2 ring-white scale-125 shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}

                {/* Custom Color Wheel Picker */}
                <label 
                  className="relative flex items-center justify-center w-5 h-5 rounded-full border border-dashed border-white/40 hover:border-white cursor-pointer ml-1.5 transition-all overflow-hidden" 
                  title="Pick Custom Color"
                >
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <Pipette className="w-2.5 h-2.5 text-white pointer-events-none" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SPLIT VIEW: FORM EDITOR (LEFT) VS LIVE PREVIEW (RIGHT) ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ─── LEFT COLUMN: RESUME FORM BUILDER ─────────────────────── */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Editor Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
              {[
                { id: 'personal', label: 'Personal', icon: Mail },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'skills', label: 'Skills', icon: Code2 },
                { id: 'certifications', label: 'Awards', icon: Award },
              ].map(tab => {
                const IconComp = tab.icon;
                const isActive = activeEditorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEditorTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                      isActive
                        ? 'bg-[#00f5d4] text-black border-[#00f5d4] shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Panels */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/60 shadow-xl space-y-4">
              
              {/* 1. PERSONAL INFO TAB */}
              {activeEditorTab === 'personal' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Mail className="w-4 h-4 text-[#00f5d4]" /> Contact & Profile Header
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">Headline / Target Role</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.headline}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, headline: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.github}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, github: e.target.value }
                        }))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-gray-400">Professional Summary / Objective</label>
                      <button
                        type="button"
                        onClick={handleAiPolishSummary}
                        disabled={aiGenerating}
                        className="text-[10px] text-[#00f5d4] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> AI Polish
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#00f5d4] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. EDUCATION TAB */}
              {activeEditorTab === 'education' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#00f5d4]" /> Academic Degrees
                    </h3>
                    <button
                      onClick={addEducation}
                      className="px-3 py-1 rounded-xl bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] text-[11px] font-extrabold border border-[#00f5d4]/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Degree
                    </button>
                  </div>

                  {resumeData.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#00f5d4]">Degree #{idx + 1}</span>
                        {resumeData.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="text-gray-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Degree (e.g. B.Tech in CSE)"
                          value={edu.degree}
                          onChange={(e) => {
                            const copy = [...resumeData.education];
                            copy[idx].degree = e.target.value;
                            setResumeData({ ...resumeData, education: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                        <input
                          type="text"
                          placeholder="College / University"
                          value={edu.institution}
                          onChange={(e) => {
                            const copy = [...resumeData.education];
                            copy[idx].institution = e.target.value;
                            setResumeData({ ...resumeData, education: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Duration (e.g. 2023 - 2027)"
                          value={edu.duration}
                          onChange={(e) => {
                            const copy = [...resumeData.education];
                            copy[idx].duration = e.target.value;
                            setResumeData({ ...resumeData, education: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                        <input
                          type="text"
                          placeholder="CGPA / Grade (e.g. CGPA: 8.9 / 10)"
                          value={edu.grade}
                          onChange={(e) => {
                            const copy = [...resumeData.education];
                            copy[idx].grade = e.target.value;
                            setResumeData({ ...resumeData, education: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. EXPERIENCE TAB */}
              {activeEditorTab === 'experience' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#00f5d4]" /> Internships & Work Experience
                    </h3>
                    <button
                      onClick={addExperience}
                      className="px-3 py-1 rounded-xl bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] text-[11px] font-extrabold border border-[#00f5d4]/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Role
                    </button>
                  </div>

                  {resumeData.experience.map((exp, expIdx) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#00f5d4]">Experience #{expIdx + 1}</span>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-gray-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.role}
                          onChange={(e) => {
                            const copy = [...resumeData.experience];
                            copy[expIdx].role = e.target.value;
                            setResumeData({ ...resumeData, experience: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => {
                            const copy = [...resumeData.experience];
                            copy[expIdx].company = e.target.value;
                            setResumeData({ ...resumeData, experience: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Duration (e.g. May 2025 - July 2025)"
                          value={exp.duration}
                          onChange={(e) => {
                            const copy = [...resumeData.experience];
                            copy[expIdx].duration = e.target.value;
                            setResumeData({ ...resumeData, experience: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                        <input
                          type="text"
                          placeholder="Location (e.g. Remote, Bangalore)"
                          value={exp.location}
                          onChange={(e) => {
                            const copy = [...resumeData.experience];
                            copy[expIdx].location = e.target.value;
                            setResumeData({ ...resumeData, experience: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Impact Bullets</span>
                          <button
                            type="button"
                            onClick={() => addExpBullet(expIdx)}
                            className="text-[10px] text-[#00f5d4] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>
                        {exp.points.map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={pt}
                              onChange={(e) => {
                                const copy = [...resumeData.experience];
                                copy[expIdx].points[ptIdx] = e.target.value;
                                setResumeData({ ...resumeData, experience: copy });
                              }}
                              className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs leading-snug focus:outline-none focus:border-[#00f5d4] resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAiPolishBullet(expIdx, ptIdx, pt, false)}
                              className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 shrink-0 cursor-pointer"
                              title="Convert to XYZ Format"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExpBullet(expIdx, ptIdx)}
                              className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-rose-400 shrink-0 cursor-pointer"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. PROJECTS TAB */}
              {activeEditorTab === 'projects' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-[#00f5d4]" /> Technical Projects
                    </h3>
                    <button
                      onClick={addProject}
                      className="px-3 py-1 rounded-xl bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] text-[11px] font-extrabold border border-[#00f5d4]/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Project
                    </button>
                  </div>

                  {resumeData.projects.map((proj, projIdx) => (
                    <div key={proj.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#00f5d4]">Project #{projIdx + 1}</span>
                        <button
                          onClick={() => removeProject(proj.id)}
                          className="text-gray-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={proj.title}
                          onChange={(e) => {
                            const copy = [...resumeData.projects];
                            copy[projIdx].title = e.target.value;
                            setResumeData({ ...resumeData, projects: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack"
                          value={proj.techStack}
                          onChange={(e) => {
                            const copy = [...resumeData.projects];
                            copy[projIdx].techStack = e.target.value;
                            setResumeData({ ...resumeData, projects: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Live Demo URL"
                          value={proj.link}
                          onChange={(e) => {
                            const copy = [...resumeData.projects];
                            copy[projIdx].link = e.target.value;
                            setResumeData({ ...resumeData, projects: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                        <input
                          type="text"
                          placeholder="GitHub Repository URL"
                          value={proj.github}
                          onChange={(e) => {
                            const copy = [...resumeData.projects];
                            copy[projIdx].github = e.target.value;
                            setResumeData({ ...resumeData, projects: copy });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Impact Highlights</span>
                          <button
                            type="button"
                            onClick={() => addProjBullet(projIdx)}
                            className="text-[10px] text-[#00f5d4] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>
                        {proj.points.map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={pt}
                              onChange={(e) => {
                                const copy = [...resumeData.projects];
                                copy[projIdx].points[ptIdx] = e.target.value;
                                setResumeData({ ...resumeData, projects: copy });
                              }}
                              className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs leading-snug focus:outline-none focus:border-[#00f5d4] resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAiPolishBullet(projIdx, ptIdx, pt, true)}
                              className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 shrink-0 cursor-pointer"
                              title="Convert to XYZ Format"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProjBullet(projIdx, ptIdx)}
                              className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-rose-400 shrink-0 cursor-pointer"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. SKILLS TAB */}
              {activeEditorTab === 'skills' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-2">
                    <Code2 className="w-4 h-4 text-[#00f5d4]" /> Technical Skills Matrix
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Programming Languages</label>
                    <input
                      type="text"
                      value={resumeData.skills.languages}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        skills: { ...prev.skills, languages: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Frameworks & Web Tech</label>
                    <input
                      type="text"
                      value={resumeData.skills.frameworks}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        skills: { ...prev.skills, frameworks: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Databases & Caching</label>
                    <input
                      type="text"
                      value={resumeData.skills.databases}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        skills: { ...prev.skills, databases: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Tools, Cloud & DevOps</label>
                    <input
                      type="text"
                      value={resumeData.skills.tools}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        skills: { ...prev.skills, tools: e.target.value }
                      }))}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                    />
                  </div>
                </div>
              )}

              {/* 6. AWARDS TAB */}
              {activeEditorTab === 'certifications' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#00f5d4]" /> Honors & Certifications
                    </h3>
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        certifications: [...prev.certifications, 'New Certification / Contest Award (2025)']
                      }))}
                      className="px-3 py-1 rounded-xl bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] text-[11px] font-extrabold border border-[#00f5d4]/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>

                  {resumeData.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => {
                          const copy = [...resumeData.certifications];
                          copy[idx] = e.target.value;
                          setResumeData({ ...resumeData, certifications: copy });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#00f5d4]"
                      />
                      <button
                        onClick={() => setResumeData(prev => ({
                          ...prev,
                          certifications: prev.certifications.filter((_, i) => i !== idx)
                        }))}
                        className="text-gray-500 hover:text-rose-400 p-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* ─── RIGHT COLUMN: 1:1 LIVE A4 PREVIEW WITH DIRECT CANVAS INLINE EDITING ──── */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-4">
            
            {/* Top Preview Controls & Interactive Hint */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Eye className="w-4 h-4 text-[#00f5d4]" /> Live A4 Vector Canvas ({activeTemplate.toUpperCase()})
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <MousePointer className="w-3 h-3 animate-bounce" /> Click any text to edit
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-gray-300">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* A4 Paper Scaled Wrapper */}
            <div className="w-full overflow-x-auto p-4 flex justify-center bg-black/40 rounded-3xl border border-white/10 shadow-2xl">
              <div 
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="transition-transform duration-200"
              >
                
                {/* ─── 1. JAKE'S RESUME (OVERLEAF / LATEX GOLD STANDARD) ─── */}
                {activeTemplate === 'jakes' && (
                  <div
                    ref={resumePrintRef}
                    id="resume-canvas"
                    style={{
                      width: '794px',
                      minHeight: '1123px',
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      fontFamily: selectedFontCss,
                      padding: '32px 38px',
                      boxSizing: 'border-box'
                    }}
                    className="shadow-2xl rounded-sm select-text text-left"
                  >
                    {/* Header */}
                    <div className="text-center pb-2 border-b-2" style={{ borderColor: accentColor }}>
                      <h1 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleInlineEdit('personalInfo', 'fullName', e.currentTarget.textContent)}
                        className={`text-2xl font-bold uppercase tracking-wider ${inlineClass}`}
                        style={{ color: accentColor }}
                      >
                        {resumeData.personalInfo.fullName || 'YOUR NAME'}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-700 mt-1 font-medium">
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'phone', e.currentTarget.textContent)}
                          className={inlineClass}
                        >
                          {resumeData.personalInfo.phone}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'email', e.currentTarget.textContent)}
                          className={inlineClass}
                        >
                          {resumeData.personalInfo.email}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'linkedin', e.currentTarget.textContent)}
                          className={inlineClass}
                        >
                          {resumeData.personalInfo.linkedin}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'github', e.currentTarget.textContent)}
                          className={inlineClass}
                        >
                          {resumeData.personalInfo.github}
                        </span>
                      </div>
                    </div>

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mt-3">
                        <h2 
                          className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 flex items-center justify-between"
                          style={{ color: accentColor, borderColor: accentColor }}
                        >
                          <span>Education</span>
                          <button onClick={addEducation} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add</button>
                        </h2>
                        <div className="space-y-1.5">
                          {resumeData.education.map((edu, idx) => (
                            <div key={edu.id} className="text-[9.5px]">
                              <div className="flex justify-between items-baseline font-bold text-gray-900">
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('education', 'institution', e.currentTarget.textContent, idx)}
                                  className={inlineClass}
                                >
                                  {edu.institution}
                                </span>
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('education', 'location', e.currentTarget.textContent, idx)}
                                  className={`font-medium text-[9px] text-gray-600 ${inlineClass}`}
                                >
                                  {edu.location}
                                </span>
                              </div>
                              <div className="flex justify-between items-baseline italic text-gray-800 text-[9px]">
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('education', 'degree', e.currentTarget.textContent, idx)}
                                  className={inlineClass}
                                >
                                  {edu.degree}
                                </span>
                                <span className="not-italic font-bold text-gray-700">
                                  <span 
                                    contentEditable 
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleInlineEdit('education', 'duration', e.currentTarget.textContent, idx)}
                                    className={inlineClass}
                                  >
                                    {edu.duration}
                                  </span>
                                  {edu.grade && (
                                    <>
                                      {' | '}
                                      <span 
                                        contentEditable 
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleInlineEdit('education', 'grade', e.currentTarget.textContent, idx)}
                                        className={inlineClass}
                                      >
                                        {edu.grade}
                                      </span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mt-3">
                        <h2 
                          className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 flex items-center justify-between"
                          style={{ color: accentColor, borderColor: accentColor }}
                        >
                          <span>Experience</span>
                          <button onClick={addExperience} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add</button>
                        </h2>
                        <div className="space-y-2">
                          {resumeData.experience.map((exp, expIdx) => (
                            <div key={exp.id} className="text-[9.5px]">
                              <div className="flex justify-between items-baseline font-bold text-gray-900">
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('experience', 'role', e.currentTarget.textContent, expIdx)}
                                  className={inlineClass}
                                >
                                  {exp.role}
                                </span>
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('experience', 'duration', e.currentTarget.textContent, expIdx)}
                                  className={`font-medium text-[9px] text-gray-600 ${inlineClass}`}
                                >
                                  {exp.duration}
                                </span>
                              </div>
                              <div className="flex justify-between items-baseline italic text-gray-800 text-[9px]">
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('experience', 'company', e.currentTarget.textContent, expIdx)}
                                  className={inlineClass}
                                >
                                  {exp.company}
                                </span>
                                <span 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleInlineEdit('experience', 'location', e.currentTarget.textContent, expIdx)}
                                  className={`not-italic text-gray-600 ${inlineClass}`}
                                >
                                  {exp.location}
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 space-y-0.5 mt-0.5 text-gray-800 text-[9px] leading-snug">
                                {exp.points.map((pt, ptIdx) => (
                                  <li key={ptIdx}>
                                    <span 
                                      contentEditable 
                                      suppressContentEditableWarning
                                      onBlur={(e) => handleInlineEdit('experience', 'point', e.currentTarget.textContent, expIdx, ptIdx)}
                                      className={inlineClass}
                                    >
                                      {pt}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div className="mt-3">
                        <h2 
                          className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 flex items-center justify-between"
                          style={{ color: accentColor, borderColor: accentColor }}
                        >
                          <span>Projects</span>
                          <button onClick={addProject} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add</button>
                        </h2>
                        <div className="space-y-2">
                          {resumeData.projects.map((proj, projIdx) => (
                            <div key={proj.id} className="text-[9.5px]">
                              <div className="flex justify-between items-baseline font-bold text-gray-900">
                                <span>
                                  <span 
                                    contentEditable 
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleInlineEdit('projects', 'title', e.currentTarget.textContent, projIdx)}
                                    className={inlineClass}
                                  >
                                    {proj.title}
                                  </span>
                                  {' | '}
                                  <span 
                                    contentEditable 
                                    suppressContentEditableWarning
                                    onBlur={(e) => handleInlineEdit('projects', 'techStack', e.currentTarget.textContent, projIdx)}
                                    className={`font-normal italic text-[9px] text-gray-700 ${inlineClass}`}
                                  >
                                    {proj.techStack}
                                  </span>
                                </span>
                                <span className="font-mono text-[8.5px] font-normal text-gray-600">
                                  {proj.link ? '[Live Demo]' : ''} {proj.github ? '[GitHub]' : ''}
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 space-y-0.5 mt-0.5 text-gray-800 text-[9px] leading-snug">
                                {proj.points.map((pt, ptIdx) => (
                                  <li key={ptIdx}>
                                    <span 
                                      contentEditable 
                                      suppressContentEditableWarning
                                      onBlur={(e) => handleInlineEdit('projects', 'point', e.currentTarget.textContent, projIdx, ptIdx)}
                                      className={inlineClass}
                                    >
                                      {pt}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Skills */}
                    <div className="mt-3">
                      <h2 
                        className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5"
                        style={{ color: accentColor, borderColor: accentColor }}
                      >
                        Technical Skills
                      </h2>
                      <div className="space-y-0.5 text-[9px] text-gray-800">
                        <div>
                          <strong>Languages:</strong>{' '}
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => handleInlineEdit('skills', 'languages', e.currentTarget.textContent)}
                            className={inlineClass}
                          >
                            {resumeData.skills.languages}
                          </span>
                        </div>
                        <div>
                          <strong>Frameworks:</strong>{' '}
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => handleInlineEdit('skills', 'frameworks', e.currentTarget.textContent)}
                            className={inlineClass}
                          >
                            {resumeData.skills.frameworks}
                          </span>
                        </div>
                        <div>
                          <strong>Developer Tools:</strong>{' '}
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => handleInlineEdit('skills', 'tools', e.currentTarget.textContent)}
                            className={inlineClass}
                          >
                            {resumeData.skills.tools}
                          </span>
                        </div>
                        <div>
                          <strong>Databases/Libraries:</strong>{' '}
                          <span 
                            contentEditable 
                            suppressContentEditableWarning
                            onBlur={(e) => handleInlineEdit('skills', 'databases', e.currentTarget.textContent)}
                            className={inlineClass}
                          >
                            {resumeData.skills.databases}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                      <div className="mt-3">
                        <h2 
                          className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5"
                          style={{ color: accentColor, borderColor: accentColor }}
                        >
                          Honors & Certifications
                        </h2>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-[9px] text-gray-800">
                          {resumeData.certifications.map((cert, i) => (
                            <li key={i}>
                              <span 
                                contentEditable 
                                suppressContentEditableWarning
                                onBlur={(e) => handleInlineEdit('certifications', 'cert', e.currentTarget.textContent, i)}
                                className={inlineClass}
                              >
                                {cert}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── 2. NOVORESUME TWO-COLUMN SIDEBAR TEMPLATE ─────────── */}
                {activeTemplate === 'novoresume' && (
                  <div
                    ref={resumePrintRef}
                    id="resume-canvas"
                    style={{
                      width: '794px',
                      minHeight: '1123px',
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      fontFamily: selectedFontCss,
                      boxSizing: 'border-box'
                    }}
                    className="shadow-2xl rounded-sm select-text text-left flex flex-row overflow-hidden"
                  >
                    {/* Left Sidebar */}
                    <div 
                      style={{ width: '260px', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '32px 24px' }}
                      className="space-y-4"
                    >
                      <div>
                        <h1 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'fullName', e.currentTarget.textContent)}
                          className={`text-xl font-black leading-tight ${inlineClass}`}
                          style={{ color: accentColor }}
                        >
                          {resumeData.personalInfo.fullName}
                        </h1>
                        <p 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'headline', e.currentTarget.textContent)}
                          className={`text-[10px] font-bold uppercase mt-0.5 text-gray-600 ${inlineClass}`} 
                        >
                          {resumeData.personalInfo.headline}
                        </p>
                      </div>

                      {/* Contact */}
                      <div className="space-y-1.5 text-[9px] text-gray-600 border-t pt-3">
                        <span className="font-bold text-[10px] uppercase block" style={{ color: accentColor }}>Contact</span>
                        <div className="truncate">
                          ✉️{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'email', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.personalInfo.email}
                          </span>
                        </div>
                        <div>
                          📞{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'phone', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.personalInfo.phone}
                          </span>
                        </div>
                        <div>
                          📍{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'location', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.personalInfo.location}
                          </span>
                        </div>
                        <div className="truncate">
                          🔗{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'linkedin', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.personalInfo.linkedin}
                          </span>
                        </div>
                        <div className="truncate">
                          💻{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'github', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.personalInfo.github}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2 border-t pt-3">
                        <span className="font-bold text-[10px] uppercase block" style={{ color: accentColor }}>Skills & Tools</span>
                        <div>
                          <span className="font-bold text-[8.5px] text-gray-800 block">Languages</span>
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'languages', e.currentTarget.textContent)} className={`text-[8.5px] text-gray-600 ${inlineClass}`}>
                            {resumeData.skills.languages}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-[8.5px] text-gray-800 block">Frameworks</span>
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'frameworks', e.currentTarget.textContent)} className={`text-[8.5px] text-gray-600 ${inlineClass}`}>
                            {resumeData.skills.frameworks}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-[8.5px] text-gray-800 block">Databases</span>
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'databases', e.currentTarget.textContent)} className={`text-[8.5px] text-gray-600 ${inlineClass}`}>
                            {resumeData.skills.databases}
                          </span>
                        </div>
                      </div>

                      {/* Education in Sidebar */}
                      <div className="space-y-2 border-t pt-3">
                        <span className="font-bold text-[10px] uppercase block" style={{ color: accentColor }}>Education</span>
                        {resumeData.education.map((edu, idx) => (
                          <div key={edu.id} className="text-[8.5px]">
                            <div contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'degree', e.currentTarget.textContent, idx)} className={`font-bold text-gray-800 ${inlineClass}`}>
                              {edu.degree}
                            </div>
                            <div contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'institution', e.currentTarget.textContent, idx)} className={`text-gray-500 ${inlineClass}`}>
                              {edu.institution}
                            </div>
                            <div className="text-gray-400 font-mono text-[8px]">
                              <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'duration', e.currentTarget.textContent, idx)} className={inlineClass}>
                                {edu.duration}
                              </span>
                              {' | '}
                              <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'grade', e.currentTarget.textContent, idx)} className={inlineClass}>
                                {edu.grade}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Main Column */}
                    <div className="flex-1 p-8 space-y-4" style={{ padding: '32px 28px' }}>
                      {/* Summary */}
                      {resumeData.personalInfo.summary && (
                        <div>
                          <h2 className="text-[11px] font-black uppercase tracking-wider pb-0.5 border-b mb-1" style={{ color: accentColor, borderColor: accentColor }}>
                            Profile Summary
                          </h2>
                          <p 
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleInlineEdit('personalInfo', 'summary', e.currentTarget.textContent)}
                            className={`text-[9.5px] text-gray-700 leading-relaxed text-justify ${inlineClass}`}
                          >
                            {resumeData.personalInfo.summary}
                          </p>
                        </div>
                      )}

                      {/* Experience */}
                      {resumeData.experience.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-black uppercase tracking-wider pb-0.5 border-b mb-1.5 flex items-center justify-between" style={{ color: accentColor, borderColor: accentColor }}>
                            <span>Work Experience</span>
                            <button onClick={addExperience} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add Role</button>
                          </h2>
                          <div className="space-y-2">
                            {resumeData.experience.map((exp, expIdx) => (
                              <div key={exp.id} className="text-[9.5px]">
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>
                                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'role', e.currentTarget.textContent, expIdx)} className={inlineClass}>
                                      {exp.role}
                                    </span>
                                    {' '}
                                    <span className="font-normal text-gray-600">
                                      @ <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'company', e.currentTarget.textContent, expIdx)} className={inlineClass}>{exp.company}</span>
                                    </span>
                                  </span>
                                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'duration', e.currentTarget.textContent, expIdx)} className={`text-gray-500 font-mono text-[8.5px] ${inlineClass}`}>
                                    {exp.duration}
                                  </span>
                                </div>
                                <ul className="list-disc list-outside pl-3.5 space-y-0.5 mt-0.5 text-gray-700 text-[9px] leading-snug">
                                  {exp.points.map((pt, ptIdx) => (
                                    <li key={ptIdx}>
                                      <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'point', e.currentTarget.textContent, expIdx, ptIdx)} className={inlineClass}>
                                        {pt}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {resumeData.projects.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-black uppercase tracking-wider pb-0.5 border-b mb-1.5 flex items-center justify-between" style={{ color: accentColor, borderColor: accentColor }}>
                            <span>Technical Projects</span>
                            <button onClick={addProject} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add Project</button>
                          </h2>
                          <div className="space-y-2">
                            {resumeData.projects.map((proj, projIdx) => (
                              <div key={proj.id} className="text-[9.5px]">
                                <div className="flex justify-between font-bold text-gray-900">
                                  <span>
                                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('projects', 'title', e.currentTarget.textContent, projIdx)} className={inlineClass}>
                                      {proj.title}
                                    </span>
                                    {' '}
                                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('projects', 'techStack', e.currentTarget.textContent, projIdx)} className={`font-normal text-gray-500 text-[8.5px] ${inlineClass}`}>
                                      ({proj.techStack})
                                    </span>
                                  </span>
                                </div>
                                <ul className="list-disc list-outside pl-3.5 space-y-0.5 mt-0.5 text-gray-700 text-[9px] leading-snug">
                                  {proj.points.map((pt, ptIdx) => (
                                    <li key={ptIdx}>
                                      <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('projects', 'point', e.currentTarget.textContent, projIdx, ptIdx)} className={inlineClass}>
                                        {pt}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {resumeData.certifications.length > 0 && (
                        <div>
                          <h2 className="text-[11px] font-black uppercase tracking-wider pb-0.5 border-b mb-1" style={{ color: accentColor, borderColor: accentColor }}>
                            Honors & Awards
                          </h2>
                          <ul className="list-disc list-outside pl-3.5 space-y-0.5 text-[9px] text-gray-700">
                            {resumeData.certifications.map((cert, i) => (
                              <li key={i}>
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('certifications', 'cert', e.currentTarget.textContent, i)} className={inlineClass}>
                                  {cert}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── 3. MODERN SINGLE-COLUMN (SILICON VALLEY / HARVARD / MINIMAL) ─── */}
                {(activeTemplate === 'modern' || activeTemplate === 'harvard' || activeTemplate === 'minimal') && (
                  <div
                    ref={resumePrintRef}
                    id="resume-canvas"
                    style={{
                      width: '794px',
                      minHeight: '1123px',
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      fontFamily: selectedFontCss,
                      padding: '34px 40px',
                      boxSizing: 'border-box'
                    }}
                    className="shadow-2xl rounded-sm select-text text-left"
                  >
                    {/* Header */}
                    <div className="text-center pb-2.5 border-b-2" style={{ borderColor: accentColor }}>
                      <h1 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleInlineEdit('personalInfo', 'fullName', e.currentTarget.textContent)}
                        className={`text-2xl font-black uppercase tracking-wide ${inlineClass}`} 
                        style={{ color: accentColor }}
                      >
                        {resumeData.personalInfo.fullName || 'YOUR NAME'}
                      </h1>
                      <p 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleInlineEdit('personalInfo', 'headline', e.currentTarget.textContent)}
                        className={`text-xs font-bold text-gray-700 mt-0.5 tracking-wider uppercase ${inlineClass}`}
                      >
                        {resumeData.personalInfo.headline}
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9.5px] text-gray-600 mt-1.5 font-medium">
                        <span>
                          📞 <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'phone', e.currentTarget.textContent)} className={inlineClass}>{resumeData.personalInfo.phone}</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          ✉️ <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'email', e.currentTarget.textContent)} className={inlineClass}>{resumeData.personalInfo.email}</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          📍 <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'location', e.currentTarget.textContent)} className={inlineClass}>{resumeData.personalInfo.location}</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          🔗 <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'linkedin', e.currentTarget.textContent)} className={inlineClass}>{resumeData.personalInfo.linkedin}</span>
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          💻 <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('personalInfo', 'github', e.currentTarget.textContent)} className={inlineClass}>{resumeData.personalInfo.github}</span>
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.personalInfo.summary && (
                      <div className="mt-2.5">
                        <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5 mb-1" style={{ color: accentColor, borderColor: accentColor }}>
                          Professional Summary
                        </h2>
                        <p 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleInlineEdit('personalInfo', 'summary', e.currentTarget.textContent)}
                          className={`text-[9.5px] text-gray-700 leading-relaxed text-justify ${inlineClass}`}
                        >
                          {resumeData.personalInfo.summary}
                        </p>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mt-2.5">
                        <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5 mb-1 flex items-center justify-between" style={{ color: accentColor, borderColor: accentColor }}>
                          <span>Education</span>
                          <button onClick={addEducation} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add</button>
                        </h2>
                        <div className="space-y-1">
                          {resumeData.education.map((edu, idx) => (
                            <div key={edu.id} className="text-[9.5px]">
                              <div className="flex justify-between font-bold text-gray-900">
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'degree', e.currentTarget.textContent, idx)} className={inlineClass}>
                                  {edu.degree}
                                </span>
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'duration', e.currentTarget.textContent, idx)} className={`font-mono text-gray-500 text-[8.5px] ${inlineClass}`}>
                                  {edu.duration}
                                </span>
                              </div>
                              <div className="flex justify-between text-gray-600 text-[9px]">
                                <span>
                                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'institution', e.currentTarget.textContent, idx)} className={inlineClass}>{edu.institution}</span>, <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'location', e.currentTarget.textContent, idx)} className={inlineClass}>{edu.location}</span>
                                </span>
                                <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('education', 'grade', e.currentTarget.textContent, idx)} className={`font-semibold text-gray-800 ${inlineClass}`}>
                                  {edu.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technical Skills */}
                    <div className="mt-2.5">
                      <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5 mb-1" style={{ color: accentColor, borderColor: accentColor }}>
                        Technical Skills
                      </h2>
                      <div className="space-y-0.5 text-[9.5px] text-gray-700">
                        <div>
                          <strong>Languages:</strong>{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'languages', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.skills.languages}
                          </span>
                        </div>
                        <div>
                          <strong>Frameworks & Web:</strong>{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'frameworks', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.skills.frameworks}
                          </span>
                        </div>
                        <div>
                          <strong>Databases & Cloud:</strong>{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'databases', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.skills.databases}
                          </span>
                          ,{' '}
                          <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('skills', 'tools', e.currentTarget.textContent)} className={inlineClass}>
                            {resumeData.skills.tools}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mt-2.5">
                        <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5 mb-1 flex items-center justify-between" style={{ color: accentColor, borderColor: accentColor }}>
                          <span>Experience & Internships</span>
                          <button onClick={addExperience} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add</button>
                        </h2>
                        <div className="space-y-1.5">
                          {resumeData.experience.map((exp, expIdx) => (
                            <div key={exp.id} className="text-[9.5px]">
                              <div className="flex justify-between font-bold text-gray-900">
                                <span>
                                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'role', e.currentTarget.textContent, expIdx)} className={inlineClass}>{exp.role}</span> — <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'company', e.currentTarget.textContent, expIdx)} className={`font-semibold text-gray-700 ${inlineClass}`}>{exp.company}</span>
                                </span>
                                <span className="font-mono text-gray-500 text-[8.5px]">
                                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'duration', e.currentTarget.textContent, expIdx)} className={inlineClass}>{exp.duration}</span> | <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'location', e.currentTarget.textContent, expIdx)} className={inlineClass}>{exp.location}</span>
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 space-y-0.5 mt-0.5 text-gray-700 text-[9px] leading-snug">
                                {exp.points.map((pt, ptIdx) => (
                                  <li key={ptIdx}>
                                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('experience', 'point', e.currentTarget.textContent, expIdx, ptIdx)} className={inlineClass}>
                                      {pt}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div className="mt-2.5">
                        <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5 mb-1 flex items-center justify-between" style={{ color: accentColor, borderColor: accentColor }}>
                          <span>Technical Projects</span>
                          <button onClick={addProject} className="text-[9px] font-normal text-blue-600 hover:underline cursor-pointer print:hidden">+ Add</button>
                        </h2>
                        <div className="space-y-1.5">
                          {resumeData.projects.map((proj, projIdx) => (
                            <div key={proj.id} className="text-[9.5px]">
                              <div className="flex justify-between font-bold text-gray-900">
                                <span>
                                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('projects', 'title', e.currentTarget.textContent, projIdx)} className={inlineClass}>{proj.title}</span>
                                  <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('projects', 'techStack', e.currentTarget.textContent, projIdx)} className={`font-normal text-gray-500 text-[8.5px] ml-1.5 ${inlineClass}`}>
                                    ({proj.techStack})
                                  </span>
                                </span>
                                <span className="font-mono text-gray-500 text-[8.5px]">
                                  {proj.link && <span>[Live Demo]</span>} {proj.github && <span>[GitHub]</span>}
                                </span>
                              </div>
                              <ul className="list-disc list-outside pl-4 space-y-0.5 mt-0.5 text-gray-700 text-[9px] leading-snug">
                                {proj.points.map((pt, ptIdx) => (
                                  <li key={ptIdx}>
                                    <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('projects', 'point', e.currentTarget.textContent, projIdx, ptIdx)} className={inlineClass}>
                                      {pt}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                      <div className="mt-2.5">
                        <h2 className="text-[10.5px] font-black uppercase tracking-wider border-b pb-0.5 mb-1" style={{ color: accentColor, borderColor: accentColor }}>
                          Honors & Certifications
                        </h2>
                        <ul className="list-disc list-outside pl-4 space-y-0.5 text-[9px] text-gray-700">
                          {resumeData.certifications.map((cert, i) => (
                            <li key={i}>
                              <span contentEditable suppressContentEditableWarning onBlur={(e) => handleInlineEdit('certifications', 'cert', e.currentTarget.textContent, i)} className={inlineClass}>
                                {cert}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

        {/* ─── MODAL: ROLE PRESETS ─────────────────────────────────────── */}
        {isPresetModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#10101c] border border-purple-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Choose Role Starter Kit</h2>
                  <p className="text-xs text-gray-400">Pre-fill your resume with top-tier project points and skills.</p>
                </div>
                <button
                  onClick={() => setIsPresetModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(ROLE_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handleApplyPreset(key)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-black text-white group-hover:text-[#00f5d4] block mb-1">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-gray-400 block line-clamp-2">
                      {preset.personalInfo.headline}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: OVERLEAF / LATEX CODE ────────────────────────────── */}
        {isLatexModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#0e0e1a] border border-white/20 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Overleaf / LaTeX Source Code (.tex)</h2>
                  <p className="text-xs text-gray-400">Paste directly into Overleaf or your local TeX compiler.</p>
                </div>
                <button onClick={() => setIsLatexModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
              </div>

              <pre className="flex-1 overflow-y-auto p-4 rounded-2xl bg-black border border-white/10 font-mono text-[10px] text-emerald-400 custom-scrollbar">
                {generateLatexCode()}
              </pre>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateLatexCode());
                    addToast({ message: 'Copied LaTeX code to clipboard!', type: 'success' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#00f5d4] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy LaTeX Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL: ATS REVIEW SCANNER ───────────────────────────────── */}
        {atsReviewModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#0e0e1a] border border-[#00f5d4]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#00f5d4] uppercase">ATS Compliance Scan</span>
                  <h2 className="text-xl font-black text-white">Resume ATS Evaluation</h2>
                </div>
                <button onClick={() => setAtsReviewModal(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
              </div>

              {aiGenerating ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 border-4 border-[#00f5d4]/20 border-t-[#00f5d4] rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-300 font-bold animate-pulse">
                    Evaluating ATS parseability & keyword density...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const currentScore = parseAtsScore(atsFeedback, atsScore || 92);
                    const getBadge = (s) => {
                      if (s >= 90) return { label: 'Top 5% Resume Quality 🚀', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', boxBg: 'bg-emerald-500/10 border-emerald-500/30' };
                      if (s >= 80) return { label: 'Competitive Tier (Top 15%) ⭐', badgeBg: 'bg-[#00f5d4]/20 text-[#00f5d4] border-[#00f5d4]/40', boxBg: 'bg-[#00f5d4]/10 border-[#00f5d4]/30' };
                      if (s >= 70) return { label: 'Good ATS Baseline 👍', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', boxBg: 'bg-amber-500/10 border-amber-500/30' };
                      return { label: 'Needs Optimization ⚠️', badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', boxBg: 'bg-rose-500/10 border-rose-500/30' };
                    };
                    const b = getBadge(currentScore);

                    return (
                      <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${b.boxBg}`}>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">ATS Score</span>
                          <span className="text-3xl font-black text-white">{currentScore} / 100</span>
                        </div>
                        <span className={`px-3 py-1.5 rounded-xl border text-xs font-black ${b.badgeBg}`}>
                          {b.label}
                        </span>
                      </div>
                    );
                  })()}

                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-200 leading-relaxed whitespace-pre-wrap font-sans custom-scrollbar max-h-[50vh] overflow-y-auto">
                    {atsFeedback}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setAtsReviewModal(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#00f5d4] text-black font-extrabold text-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
  );
}

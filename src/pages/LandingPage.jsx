import React, { useState, useEffect } from 'react';
import { ChevronDown, PlayCircle, Download, CheckCircle, Code, GraduationCap, ArrowRight, MonitorPlay, Zap, Shield, Sparkles, Mail, HelpCircle, Flame, Brain, Cpu, Trophy, Target, Activity, Star, CheckCircle2, X, Users, Heart, BookOpen, Award, Sun, Send, Bell, ExternalLink, Globe } from 'lucide-react';
import OurTeamPortal from './OurTeamPortal';

const teamMembersDetails = {
  vamsika: {
    name: "PERAM VAMSIKA",
    role: "Feature Research & Student Insights",
    department: "Feature Strategy & Product Innovation",
    lead: "Feature Strategy Team (under C. Manasa)",
    image: "/team_vamsika.png",
    color: "amber",
    gradient: "from-amber-400 to-orange-500",
    borderBadge: "border-amber-400/30 text-amber-400 bg-amber-400/10",
    bio: "Key driver in Vyomra's Feature Strategy division, spearheading student needs discovery, academic workflow analysis, and real-time usability research to make learning seamless.",
    highlights: [
      "Conducts in-depth qualitative & quantitative campus surveys to uncover real student pain points.",
      "Researches and benchmarks top-tier EdTech solutions to ideate intuitive platform features.",
      "Collaborates directly with UI/UX and engineering teams to transform student feedback into actionable roadmaps.",
      "Validates feature prototypes against real academic workflows before general release."
    ],
    skills: ["Student Insights", "Feature Viability Research", "Workflow Optimization", "UX Discovery", "Survey Analytics"]
  },
  yaswitha: {
    name: "RAAVI YASWITHA",
    role: "Problem Identification & User Testing",
    department: "Feature Strategy & Quality Engineering",
    lead: "Feature Strategy Team (under C. Manasa)",
    image: "/team_yaswitha.jpg",
    color: "amber",
    gradient: "from-amber-400 to-orange-500",
    borderBadge: "border-amber-400/30 text-amber-400 bg-amber-400/10",
    bio: "Specializes in identifying high-friction obstacles in the student learning experience, performing rigorous end-to-end user beta tests, and verifying problem-solution fit across Vyomra.",
    highlights: [
      "Pinpoints critical friction points and edge cases across student navigation and study flows.",
      "Organizes and facilitates interactive student beta testing sessions for new Vyomra releases.",
      "Gathers bug reports, performance bottlenecks, and UX feedback to drive iterative refinements.",
      "Ensures every Vyomra feature delivers immediate, tangible value for daily student life."
    ],
    skills: ["Problem Identification", "User Beta Testing", "Usability Heuristics", "Feedback Synthesis", "Quality Validation"]
  },
  manasa: {
    name: "C. MANASA",
    role: "Product Innovation Lead — Head of Feature Strategy & Student Insights",
    department: "Product Leadership",
    lead: "Team Lead — Feature Strategy Division",
    image: "/team_manasa.jpg",
    color: "amber",
    gradient: "from-amber-400 to-orange-500",
    borderBadge: "border-amber-400/30 text-amber-400 bg-amber-400/10",
    bio: "Leads the feature ideation engine at Vyomra. Identifies emerging campus challenges, analyzes student behavioural patterns, and directs product roadmap discovery.",
    highlights: [
      "Directs the Feature Strategy team (including Peram Vamsika & Raavi Yaswitha) in discovering student pain points.",
      "Authors feature specification documents and translates complex academic workflows into elegant software concepts.",
      "Aligns product initiatives with student academic success metrics and user retention goals.",
      "Bridges student communities and tech architects to accelerate feature delivery."
    ],
    skills: ["Product Innovation", "Feature Roadmapping", "Student Analytics", "Team Leadership", "Design Thinking"]
  },
  sowban: {
    name: "SHAIK SOWBAN",
    role: "Founder, CEO & Tech Lead",
    department: "Executive Leadership & Engineering",
    lead: "Platform Founder & Chief Architect",
    image: "/founder_sowban.png",
    color: "teal",
    gradient: "from-brand-teal to-brand-blue",
    borderBadge: "border-brand-teal/30 text-brand-teal bg-brand-teal/10",
    bio: "Visionary founder and chief software architect behind Vyomra. Leading system architecture, AI model integrations, scalable cloud infrastructure, and the core platform vision.",
    highlights: [
      "Architected the entire Vyomra Student OS full-stack ecosystem from concept to production.",
      "Engineered the AI Future Twin, automated code execution engines, and smart academic portfolios.",
      "Directs cross-functional engineering, infrastructure scaling, and real-time security protocols.",
      "Drives the mission to democratize state-of-the-art AI tooling for every university student."
    ],
    skills: ["System Architecture", "Full-Stack Development", "AI/ML Integration", "Cloud Infrastructure", "Product Vision"]
  },
  ushasree: {
    name: "Y. USHA SREE",
    role: "AI & Innovation Lead — Head of Intelligent Systems",
    department: "AI & Research Division",
    lead: "Lead — Intelligent Systems",
    image: "/team_ushasree.jpg",
    color: "violet",
    gradient: "from-violet-400 via-purple-500 to-indigo-500",
    borderBadge: "border-violet-400/30 text-violet-400 bg-violet-400/10",
    bio: "Pioneers cutting-edge artificial intelligence architectures, personalized learning models, automated academic evaluation pipelines, and next-gen smart tools.",
    highlights: [
      "Designs and fine-tunes specialized prompt engineering pipelines for Vyomra AI.",
      "Develops adaptive learning algorithms that tailor content difficulty to individual student progress.",
      "Researches emerging neural architectures and multimodal AI agents for academic coaching.",
      "Ensures high-accuracy, hallucination-free AI assistance across STEM subjects."
    ],
    skills: ["AI Architecture", "Prompt Engineering", "Adaptive Learning", "Evaluation Models", "AI Innovation"]
  },
  akhil: {
    name: "M. AKHIL",
    role: "Head of Growth & Outreach — Marketing Head",
    department: "Growth & Community",
    lead: "Lead — Growth & Campus Partnerships",
    image: "/team_akhil.jpg",
    color: "purple",
    gradient: "from-brand-purple to-brand-pink",
    borderBadge: "border-brand-purple/30 text-brand-purple bg-brand-purple/10",
    bio: "Drives institutional expansion, student ambassador programs, brand awareness campaigns, and community engagement initiatives across universities.",
    highlights: [
      "Scales campus outreach programs to onboard student communities and collegiate clubs.",
      "Orchestrates omnichannel digital marketing campaigns and campus hackathon sponsorships.",
      "Builds strategic relationships with academic departments and student leaders.",
      "Analyzes user acquisition funnels to maximize organic platform adoption."
    ],
    skills: ["Growth Strategy", "Campus Outreach", "Brand Marketing", "Community Building", "Digital Campaigns"]
  },
  pooja: {
    name: "A. POOJA REDDY",
    role: "Mentorship & Support Lead — Head of Doubt Solver Network",
    department: "Academic Mentorship & Student Support",
    lead: "Lead — Mentorship Operations",
    image: "/team_pooja.jpg",
    color: "cyan",
    gradient: "from-cyan-400 to-blue-600",
    borderBadge: "border-cyan-400/30 text-cyan-400 bg-cyan-400/10",
    bio: "Manages Vyomra's extensive human mentor network and 24/7 student doubt resolution infrastructure to ensure zero learning roadblocks.",
    highlights: [
      "Oversees peer mentor recruitment, onboarding, and quality assurance processes.",
      "Maintains rapid doubt resolution SLAs across engineering and science disciplines.",
      "Fosters empathetic student support systems and personalized peer tutoring sessions.",
      "Monitors academic discussion threads to uphold high accuracy and clarity standards."
    ],
    skills: ["Mentorship Management", "Doubt Resolution", "Student Support", "Academic QA", "Community Care"]
  },
  chandrika: {
    name: "C. CHANDRIKA",
    role: "Campus Ops Lead — Head of Operations & Support",
    department: "Academic Operations",
    lead: "Lead — Operations & Academic Verification",
    image: "/team_chandrika.jpg",
    color: "emerald",
    gradient: "from-emerald-400 to-teal-600",
    borderBadge: "border-emerald-400/30 text-emerald-400 bg-emerald-400/10",
    bio: "Oversees daily platform operations, curriculum alignment, verified study material repositories, and academic content curation.",
    highlights: [
      "Audits and verifies university syllabus notes, lecture summaries, and reference materials.",
      "Streamlines operational pipelines for content uploads and faculty contributions.",
      "Coordinates cross-department operations to maintain high uptime and resource availability.",
      "Drives student success initiatives through structured academic resource management."
    ],
    skills: ["Operations Management", "Curriculum Curation", "Academic Verification", "Process Optimization", "Student Success"]
  },
  tousif: {
    name: "SHAIK TOUSIF BASHA",
    role: "AI Solutions & Prototyping Lead",
    department: "Rapid Prototyping & AI Labs",
    lead: "Lead — Prototyping & POCs",
    image: "/team_tousif.jpg",
    color: "blue",
    gradient: "from-blue-400 via-indigo-500 to-cyan-400",
    borderBadge: "border-blue-400/30 text-blue-400 bg-blue-400/10",
    bio: "Specializes in rapid prototyping, AI tool exploration, and transforming experimental feature concepts into functional proof-of-concept demos.",
    highlights: [
      "Leverages state-of-the-art AI development tools to build working prototypes in record time.",
      "Conducts feasibility tests on experimental UI designs and AI workflow integrations.",
      "Builds interactive sandboxes for testing bleeding-edge edtech features before full implementation.",
      "Accelerates developer velocity through automated code generation and workflow scripts."
    ],
    skills: ["Rapid Prototyping", "AI Experimentation", "POC Engineering", "Demo Development", "Developer Tooling"]
  },
  riyaz: {
    name: "SYED RIYAZ",
    role: "AI Solutions & Prototyping Member",
    department: "AI Solutions & Prototyping Team",
    lead: "AI Solutions & Prototyping Team (under Shaik Tousif Basha)",
    image: "/team_riyaz.png",
    color: "cyan",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    borderBadge: "border-cyan-400/30 text-cyan-400 bg-cyan-400/10",
    bio: "Core AI solutions developer and rapid prototyping member. Specializes in building proof-of-concept AI modules, intelligent automation pipelines, and model evaluation.",
    highlights: [
      "Develops rapid AI prototypes and experimental feature proof-of-concepts under the AI Solutions division.",
      "Collaborates on LLM integration, prompt design, and automated workflow pipelines.",
      "Tests and optimizes AI-powered student tools for performance, accuracy, and latency.",
      "Works alongside team leads to translate cutting-edge AI research into working platform prototypes."
    ],
    skills: ["AI Prototyping", "Prompt Engineering", "Python", "Proof of Concepts", "Model Evaluation"]
  },
  ushaeswari: {
    name: "USHA ESWARI",
    role: "Product Testing & Quality Assurance Lead",
    department: "Product Testing & Quality Assurance",
    lead: "Lead — Product Testing & Quality Assurance",
    image: "/team_ushaeswari.jpg",
    color: "rose",
    gradient: "from-rose-400 via-pink-500 to-indigo-500",
    borderBadge: "border-rose-400/30 text-rose-400 bg-rose-400/10",
    bio: "Directs comprehensive product testing workflows, quality benchmarks, automated test suites, and defect tracking across the Vyomra ecosystem.",
    highlights: [
      "Leads end-to-end product testing pipelines and quality assurance standards across all student features.",
      "Designs and executes robust functional, regression, and user acceptance test suites.",
      "Collaborates with product and engineering teams to identify defects, edge cases, and performance bottlenecks.",
      "Ensures seamless, bug-free releases and optimal stability for thousands of active university users."
    ],
    skills: ["Product Testing", "Quality Assurance", "Test Automation", "Bug Tracking & QA", "User Acceptance Testing"]
  }
};

const freedomFighters = [
  { name: "Mahatma Gandhi", src: "/images/fighters/gandhi_portrait_1786790642751.jpg" },
  { name: "Bhagat Singh", src: "/images/fighters/bhagat_singh_portrait_1786790921290.jpg" },
  { name: "Subhas Chandra Bose", src: "/images/fighters/bose_portrait_1786790949740.jpg" },
  { name: "Sardar Vallabhbhai Patel", src: "/images/fighters/patel_portrait_1786791149012.jpg" },
  { name: "B. R. Ambedkar", src: "/images/fighters/ambedkar_portrait_1786791272300.jpg" },
  { name: "Rani Lakshmibai", src: "/images/fighters/lakshmibai_portrait_1786791406245.jpg" },
];

const sessionalExamImages = [
  {
    title: "Deep Focus & Sessional Mastery",
    subtitle: "Turn focused study hours into top engineering CGPA & distinction.",
    src: "/images/exams/library_focus.jpg",
    tip: "Review previous year papers, master unit formulas, and practice code hands-on.",
    tag: "Exam Mode Active 🎯",
    gradient: "from-amber-400 to-orange-500",
    quote: "Success in exams isn't about last-minute panic, it's about calm focus, clear fundamentals, and believing in your hard work."
  },
  {
    title: "All The Best For Your Sessionals!",
    subtitle: "Confidence, calm mind, and clear answers guarantee victory.",
    src: "/images/exams/exam_success.jpg",
    tip: "Stay energized, write answers neatly with neat diagrams, and manage your time smartly.",
    tag: "High Score Mindset ⚡",
    gradient: "from-emerald-400 to-teal-500",
    quote: "You have prepared and worked hard. Walk into the exam hall with your head high and conquer every question!"
  },
  {
    title: "Smart AI Revision & Doubt Solving",
    subtitle: "Instant concept summaries and formulas right when you need them.",
    src: "/images/exams/desk_revision.jpg",
    tip: "Use Vyomra AI to clarify doubts, review code logic, and test yourself with flash quizzes.",
    tag: "Late Night Revision 🚀",
    gradient: "from-cyan-400 to-blue-500",
    quote: "Small consistent revisions turn tough syllabus units into effortless high scores."
  }
];

export const checkIsSessionalExams = () => {
  return false;
};

function SessionalExamsBackgroundAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sessionalExamImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const floatingSymbols = [
    { symbol: "🎯", left: "6%", delay: "0s", dur: "14s", size: "text-2xl" },
    { symbol: "📚", left: "20%", delay: "3s", dur: "16s", size: "text-xl" },
    { symbol: "⚡", left: "35%", delay: "1.5s", dur: "12s", size: "text-lg" },
    { symbol: "💡", left: "50%", delay: "4s", dur: "18s", size: "text-xl" },
    { symbol: "✨", left: "65%", delay: "2s", dur: "15s", size: "text-2xl" },
    { symbol: "🔥", left: "80%", delay: "5s", dur: "13s", size: "text-lg" },
    { symbol: "🏆", left: "92%", delay: "0.5s", dur: "17s", size: "text-xl" },
  ];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      <style>{`
        @keyframes floatExamSymbols {
          0% {
            transform: translateY(110vh) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            transform: translateY(-20vh) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Background Images Slideshow */}
      {sessionalExamImages.map((item, idx) => (
        <div 
          key={item.title}
          className={`absolute inset-0 transition-opacity duration-2000 ${idx === currentIndex ? 'opacity-40' : 'opacity-0'}`}
        >
          <img 
            src={item.src} 
            alt={item.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
          />
        </div>
      ))}

      {/* Subtle Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/85 via-[#0a0a0f]/60 to-[#0a0a0f]/95 pointer-events-none"></div>

      {/* Radiant Floating Symbols */}
      {floatingSymbols.map((item, idx) => (
        <div
          key={idx}
          className={`absolute bottom-0 select-none ${item.size} opacity-40`}
          style={{
            left: item.left,
            animation: `floatExamSymbols ${item.dur} infinite linear`,
            animationDelay: item.delay
          }}
        >
          {item.symbol}
        </div>
      ))}

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-[140px]"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gradient-to-bl from-teal-500/15 via-blue-500/10 to-transparent rounded-full blur-[130px]"></div>

      {/* Bottom Motivation Nametag */}
      <div className="absolute bottom-6 left-6 md:left-10 z-10 bg-black/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.25)] max-w-sm sm:max-w-md pointer-events-auto">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-b-2xl"></div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">🎯</span>
          <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">Sessional Exams 2026</span>
        </div>
        <p className="text-xs md:text-sm font-bold text-white tracking-wide">
          {sessionalExamImages[currentIndex].title}
        </p>
        <p className="text-[11px] text-amber-200/80 mt-0.5 line-clamp-1">
          {sessionalExamImages[currentIndex].tip}
        </p>
      </div>
    </div>
  );
}

function IndependenceDayAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % freedomFighters.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* Background Images */}
      {freedomFighters.map((fighter, idx) => (
        <div 
          key={fighter.name}
          className={`absolute inset-0 transition-opacity duration-2000 ${idx === currentIndex ? 'opacity-60' : 'opacity-0'}`}
        >
          <img 
            src={fighter.src} 
            alt={fighter.name}
            className="w-full h-full object-cover object-[center_15%]"
          />
        </div>
      ))}
      {/* Subtle Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/40 to-[#0a0a0f]/90 pointer-events-none"></div>
      
      {/* Nametag */}
      <div className="absolute bottom-10 left-10 z-10 bg-black/60 backdrop-blur-md px-6 py-2 rounded-xl border border-white/20 shadow-2xl">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500"></div>
        <p className="text-[10px] md:text-sm font-bold text-gray-300 tracking-widest uppercase">
          Remembering <span className="text-white text-base ml-1">{freedomFighters[currentIndex].name}</span>
        </p>
      </div>
    </div>
  );
}

function TeamAvatar({ src, name, gradient = "from-teal-400 to-emerald-500", size = "w-24 h-24", textSize = "text-2xl" }) {
  const [imgError, setImgError] = useState(false);
  
  const getInitials = (n) => {
    if (!n) return 'T';
    const clean = n.replace(/[^a-zA-Z\s]/g, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`relative ${size} mx-auto mb-5 shrink-0`}>
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      {src && !imgError ? (
        <img 
          src={src} 
          alt="" 
          onError={() => setImgError(true)}
          className={`${size} rounded-full object-cover relative z-10 border-2 border-white/20 group-hover:scale-105 transition-transform duration-500 shadow-xl`} 
        />
      ) : (
        <div className={`${size} rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center font-black ${textSize} text-white border-2 border-white/20 relative z-10 shadow-xl select-none group-hover:scale-105 transition-transform duration-500`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

export default function LandingPage({ onLoginClick }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [evalState, setEvalState] = useState('idle');
  const [showTeamPortal, setShowTeamPortal] = useState(false);
  const [isSessionalExams, setIsSessionalExams] = useState(checkIsSessionalExams);
  const [examCheerCount, setExamCheerCount] = useState(() => {
    try { return parseInt(localStorage.getItem('lumixora_exam_cheers') || '342'); } catch(e) { return 342; }
  });
  const [hasCheered, setHasCheered] = useState(false);
  const [showCheerToast, setShowCheerToast] = useState(false);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  const today = new Date();
  const isIndependenceDay = today.getMonth() === 7 && today.getDate() === 15;

  const handleSendCheer = () => {
    if (hasCheered) return;
    const newCount = examCheerCount + 1;
    setExamCheerCount(newCount);
    setHasCheered(true);
    setShowCheerToast(true);
    try {
      localStorage.setItem('lumixora_exam_cheers', newCount.toString());
    } catch(e) {}
    setTimeout(() => setShowCheerToast(false), 4000);
  };

  const handleRunCode = () => {
    if (evalState === 'running') return;
    setEvalState('running');
    setTimeout(() => {
      setEvalState('success');
    }, 2000);
  };

  if (showTeamPortal) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-brand-teal/30 selection:text-brand-teal relative p-4 sm:p-8 force-dark">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTeamPortal(false)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-2 border border-white/10 transition-all cursor-pointer shadow-lg"
            >
              &larr; Back to Home
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setShowTeamPortal(false); onLoginClick('student'); }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold text-xs shadow-md cursor-pointer"
              >
                Student Login
              </button>
            </div>
          </div>
          <OurTeamPortal user={null} setActiveTab={() => {}} />
        </div>
      </div>
    );
  }

  const faqs = [
    { q: "What is Vyomra?", a: "Vyomra is an advanced AI-powered educational ecosystem that combines an AI Future Twin, personal mentoring, interactive coding practice, and peer collaboration to supercharge your academic journey." },
    { q: "How does the AI Future Twin work?", a: "Your Future Twin analyzes your current skills, goals, and academic performance to simulate your career trajectory, providing step-by-step guidance to achieve your dream placements." },
    { q: "Can I use Vyomra for coding practice?", a: "Yes! Vyomra features a built-in code editor, personalized problem sets, and an AI mentor to help you debug and learn multiple programming languages hands-on." },
    { q: "Is Vyomra available for faculty members?", a: "Absolutely. Faculty members can use the Admin portal to track student attendance, monitor academic progress, evaluate assignments using AI, and manage classroom activities." },
    { q: "Does Vyomra support collaborative learning?", a: "We strongly encourage it! With features like 'Study With Me', Doubt Solving forums, and a centralized Learning Hub, you can collaborate with peers seamlessly." },
    { q: "Are my notes and study materials secure?", a: "Yes, all your contributed notes, tasks, and private data are securely stored using enterprise-grade encryption. You have full control over what you share with the community." },
    { q: "How do I get started?", a: "Simply click on 'Student Login' or 'Faculty Login' above using your institutional email address to access your personalized dashboard." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-brand-teal/30 selection:text-brand-teal relative overflow-hidden force-dark">
      
      {/* Sessional Exams High-Energy Background Slideshow with Real Study Focus Photos */}
      {isSessionalExams ? (
        <SessionalExamsBackgroundAnimation />
      ) : isIndependenceDay ? (
        <IndependenceDayAnimation />
      ) : null}

      {/* Sessional Exams High-Energy Top Ribbon Banner */}
      {isSessionalExams && (
        <div className="relative z-50 bg-gradient-to-r from-amber-600/95 via-orange-600/95 to-emerald-700/95 text-white text-xs font-black py-2.5 px-4 text-center shadow-2xl border-b border-amber-400/40 flex items-center justify-center gap-2 sm:gap-4 flex-wrap backdrop-blur-md">
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-black border border-white/20 shadow-inner">
            <span className="text-sm">🎯</span> Sessional Exams 2026
          </span>
          <span className="font-bold text-white tracking-wide text-xs sm:text-sm">
            All the best to all college students! Stay calm, write with confidence & score top grades! ⚡
          </span>
          <a 
            href="#sessional-wishes"
            className="px-3.5 py-1 rounded-full bg-white text-gray-900 text-[11px] font-black hover:bg-amber-100 transition-all shadow-md cursor-pointer uppercase tracking-wider inline-flex items-center gap-1"
          >
            Exam Motivation & Tips 🚀
          </a>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${isSessionalExams ? 'bg-amber-500/15' : isIndependenceDay ? 'bg-orange-500/20' : 'bg-brand-teal/10'} rounded-full blur-[120px]`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${isSessionalExams ? 'bg-emerald-500/15' : isIndependenceDay ? 'bg-green-500/20' : 'bg-brand-purple/10'} rounded-full blur-[120px]`}></div>
        <div className={`absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] ${isSessionalExams ? 'bg-cyan-500/10' : isIndependenceDay ? 'bg-white/10' : 'bg-brand-pink/5'} rounded-full blur-[150px]`}></div>
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djIwaC0ydi0yMGgtMjB2LTJoMjB2LTIwaDJ2MjBoMjB2MnoiLz48L2c+PC9nPjwvc3ZnPg==')` }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/lumixora_logo.jpg" alt="VYOMRA Logo" className="w-14 h-14 rounded-full object-cover shadow-lg shadow-brand-teal/20 border border-cyan-500/30" />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tight leading-none">Lumixora</span>
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest mt-0.5">by VYOMRA</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-300">
          <button 
            onClick={() => setShowTeamPortal(true)} 
            className="hover:text-brand-teal transition-colors flex items-center gap-1.5 cursor-pointer bg-transparent border-none text-gray-300 font-bold"
          >
            <Users className="w-4 h-4 text-brand-teal" />
            <span>Team Portal</span>
          </button>
          <button onClick={() => onLoginClick('student')} className="hover:text-brand-teal transition-colors cursor-pointer">Student Login</button>
          <button onClick={() => onLoginClick('faculty')} className="hover:text-brand-purple transition-colors cursor-pointer">Faculty Login</button>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => setShowTeamPortal(true)} 
            className="px-3 py-1.5 bg-brand-teal/10 border border-brand-teal/30 rounded-lg text-xs font-bold text-brand-teal hover:bg-brand-teal/20 transition-colors"
          >
            Team
          </button>
          <button onClick={() => onLoginClick('student')} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition-colors">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center">
        {isSessionalExams ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-xs font-black mb-8 uppercase tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.25)] animate-pulse">
            <span className="text-base">🎯</span> Sessional Exams Active • All The Best to All Students! <span className="text-base">⚡</span>
          </div>
        ) : isIndependenceDay ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 via-white/20 to-green-500/20 border border-white/20 text-white text-xs font-bold mb-8 uppercase tracking-widest">
            <span className="text-base">🇮🇳</span> Happy Independence Day <span className="text-base">🇮🇳</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold mb-8 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Your AI Learning Companion
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8 drop-shadow-2xl">
          Supercharge Your <br/>
          <span className={`text-transparent bg-clip-text ${
            isSessionalExams
              ? 'bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-300'
              : isIndependenceDay 
                ? 'bg-gradient-to-r from-orange-400 via-white to-green-500' 
                : 'bg-gradient-to-r from-brand-teal via-brand-blue to-brand-purple'
          }`}>
            Academic Journey
          </span>
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          {isSessionalExams 
            ? "Conquer your college sessional exams with laser focus, quick AI doubt solving, syllabus mastery, and calm confidence. We believe in your success!"
            : "The ultimate student ecosystem to master coding, collaborate with peers, and track your progress with an advanced AI mentor—designed to help you achieve your dream placements."
          }
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => onLoginClick('demo')} className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(105,56,239,0.4)] font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105">
            Start Exploring <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onLoginClick('student')} 
            className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-amber-400" /> Student Login
          </button>
        </div>

        {/* Workable Help & Support Badge */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 backdrop-blur-md shadow-lg">
          <HelpCircle className="w-4 h-4 text-brand-teal shrink-0" />
          <span>If you face any login / register issues or queries, contact</span>
          <a 
            href="mailto:249xa33106@gprec.ac.in?subject=Vyomra%20Login%20/%20Register%20Support%20Query" 
            className="font-bold text-brand-teal hover:underline flex items-center gap-1.5 bg-brand-teal/10 px-2.5 py-1 rounded-lg border border-brand-teal/30 hover:bg-brand-teal/20 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            249xa33106@gprec.ac.in
          </a>
        </div>
      </section>

      {/* Sessional Exams Wishes & Motivation Showcase Card */}
      {isSessionalExams && (
        <section id="sessional-wishes" className="relative z-10 max-w-6xl mx-auto px-6 py-10">
          <div className="bg-gradient-to-br from-[#12121e]/90 via-[#0e1626]/90 to-[#101b15]/90 rounded-3xl p-6 sm:p-10 border-2 border-amber-500/30 shadow-[0_20px_60px_rgba(245,158,11,0.15)] relative overflow-hidden backdrop-blur-xl">
            {/* Corner Decorative Aura */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                    <Trophy className="w-3.5 h-3.5" /> Sessional Exams 2026 Motivation
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    All The Best To Every Engineering & College Student! 🎯
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base mt-1">
                    Your preparation, hard work, and calm focus will turn this sessional into an outstanding score!
                  </p>
                </div>

                {/* Interactive Cheer / Wish Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleSendCheer}
                    className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-xl transition-all cursor-pointer ${
                      hasCheered 
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasCheered ? 'fill-emerald-400 text-emerald-400' : 'fill-black text-black'}`} />
                    <span>{hasCheered ? '✨ Best Wishes Sent!' : 'Send Good Luck Cheer'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/20 text-[11px] font-extrabold">
                      {examCheerCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* Toast Notification */}
              {showCheerToast && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your warm wishes have been sent to all students preparing for sessionals! All the very best! 🏆</span>
                </div>
              )}

              {/* 3 Interactive Motivational Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {sessionalExamImages.map((exam, idx) => (
                  <div 
                    key={exam.title}
                    onClick={() => setActiveQuoteIdx(idx)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      activeQuoteIdx === idx 
                        ? 'bg-white/10 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02]' 
                        : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-amber-400 tracking-wider">
                        {exam.tag}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">0{idx + 1}/03</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      "{exam.quote}"
                    </p>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-amber-200/90 font-medium">
                      <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{exam.tip}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* High Yield Sessional Exam Golden Rules */}
              <div className="bg-black/50 p-5 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-black text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Time Strategy</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Scan paper for 2 mins, start with questions you know best to build rock-solid confidence.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-black text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Diagrams & Equations</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Draw neat labeled block diagrams and box final numerical answers with units.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 font-black text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Calm & Sharp Mind</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Take a deep breath before tough questions. Your continuous hard work will yield great results!</p>
                  </div>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Vyomra AI & Peer Notes Ready for Fast 1-Click Revision</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onLoginClick('student')}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer shadow-lg"
                  >
                    Open Student Portal &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Demo Section */}
      <section id="demo" className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="glass-panel rounded-3xl p-2 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-teal/10 transition-colors"></div>
          <div className="w-full relative overflow-hidden rounded-2xl shadow-2xl bg-black">
              <img src="/infographic.jpg" alt="Vyomra Student OS Features" className="w-full h-auto object-contain rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.2] mb-6">
              The Ultimate <br/>
              <span className="text-brand-purple">Student OS.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 font-medium leading-relaxed">
              Vyomra transforms your educational journey by combining an intelligent AI mentor with a gamified learning ecosystem designed exclusively for students.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-5 glass-panel p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-brand-teal" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI-Powered Mentorship</h3>
                  <p className="text-sm text-gray-400 mt-1">Instant code debugging, doubt resolution, and personalized study paths.</p>
                </div>
              </div>

              <div className="flex items-center gap-5 glass-panel p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Career & Placement Prep</h3>
                  <p className="text-sm text-gray-400 mt-1">Master technical interviews, build standout portfolios, and track progress toward your dream job.</p>
                </div>
              </div>

              <div className="flex items-center gap-5 glass-panel p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">My Academics & Marks Engine</h3>
                  <p className="text-sm text-gray-400 mt-1">Track Mid-1, Mid-2, End-Sem marks, SGPA progression, and subject-wise attendance with zero clutter.</p>
                </div>
              </div>

              <div className="flex items-center gap-5 glass-panel p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-brand-pink" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Integrated Workspaces</h3>
                  <p className="text-sm text-gray-400 mt-1">Code, collaborate, and track your academic progress all in one unified platform.</p>
                </div>
              </div>
            </div>
            
            <button onClick={() => onLoginClick('demo')} className="px-8 py-4 bg-[#6938EF] hover:bg-[#5425D6] text-white shadow-[0_0_30px_rgba(105,56,239,0.3)] font-bold rounded-xl transition-all flex items-center gap-2">
              Start Exploring <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative min-h-[520px] w-full max-w-lg mx-auto lg:max-w-none flex items-center justify-center">
             
             {/* Neon Glow Aura Backgrounds */}
             <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse"></div>
             <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-teal-500/30 via-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse"></div>

             {/* Main Holographic Neural IDE Card */}
             <div className="relative w-full max-w-[420px] bg-[#0c0c16]/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 space-y-4">
                
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-[0_0_8px_#ef4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-[0_0_8px_#f59e0b]"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[11px] font-mono font-bold text-gray-400 ml-2">⚡ SDE_Placement_Twin.py</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>AI LIVE</span>
                  </div>
                </div>

                {/* Code Window */}
                <div className="bg-black/60 p-4 rounded-2xl border border-white/5 font-mono text-[11px] leading-relaxed text-gray-300 space-y-1">
                  <p><span className="text-pink-400 font-bold">import</span> <span className="text-cyan-300">lumixora.twin</span> <span className="text-pink-400 font-bold">as</span> <span className="text-yellow-300">AI</span></p>
                  <p className="text-gray-500 pt-1"># 1. Initialize Student Future Twin</p>
                  <p><span className="text-blue-400">scholar</span> = <span className="text-yellow-300">AI</span>.<span className="text-purple-300">PlacementTwin</span>(<span className="text-emerald-300">"SDE-1"</span>, target=<span className="text-emerald-300">"₹45 LPA"</span>)</p>
                  <p className="text-gray-500 pt-1"># 2. Run Autonomous Code & Mock Viva</p>
                  <p><span className="text-blue-400">benchmark</span> = <span className="text-blue-400">scholar</span>.<span className="text-purple-300">evaluate_mastery</span>()</p>
                  <p className="text-cyan-300 font-bold pt-1">print(<span className="text-emerald-300">f"✨ Readiness: {'{'}<span className="text-yellow-300">benchmark.score</span>{'}'}% (Google Ready)"</span>)</p>
                </div>

                {/* Live Action Bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">Streak:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-black flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400 fill-current" /> 42 Days
                    </span>
                  </div>

                  <button
                    onClick={handleRunCode}
                    disabled={evalState === 'running'}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs cursor-pointer shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center gap-1.5 hover:scale-105 transition-transform"
                  >
                    <PlayCircle className={`w-3.5 h-3.5 text-white ${evalState === 'running' ? 'animate-spin' : 'fill-current'}`} />
                    <span>{evalState === 'running' ? 'Simulating...' : 'Run AI Benchmark'}</span>
                  </button>
                </div>
             </div>

             {/* Floating Holographic AI Score Badge */}
             <div className="absolute -top-6 -right-2 md:-right-6 w-[220px] bg-black/80 backdrop-blur-2xl rounded-3xl border border-emerald-500/40 p-4 z-20 shadow-[0_10px_30px_rgba(16,185,129,0.3)] animate-float space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> SDE Placement Twin
                  </span>
                  <span className="text-[9px] font-black text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/20">VERIFIED</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-[3px] border-white/10 flex items-center justify-center relative shrink-0">
                    <svg className={`absolute inset-0 w-full h-full transform -rotate-90 ${evalState === 'running' ? 'animate-spin' : ''}`}>
                      <circle cx="28" cy="28" r="23" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="144" strokeDashoffset={evalState === 'success' ? "6" : "144"} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <span className="text-sm font-black text-white">
                      {evalState === 'success' ? '98%' : evalState === 'running' ? '...' : '94%'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-black text-white block">Top 1% Candidate</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Offer Ready ⭐</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[9px] text-gray-300 font-medium">
                  🏢 Google • Amazon SDE-1
                </div>
             </div>

             {/* Floating Offer Unlocked Notification Pill */}
             <div className={`absolute -bottom-6 -left-2 md:-left-6 bg-gradient-to-r from-purple-900/90 to-black/90 backdrop-blur-2xl rounded-2xl border border-purple-500/40 p-3.5 z-20 shadow-[0_10px_30px_rgba(168,85,247,0.3)] transition-all duration-500 flex items-center gap-3 ${
               evalState === 'success' ? 'scale-105 border-purple-400' : ''
             }`}>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">Package Unlocked</span>
                    <span className="text-[9px] font-black bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded">Tier-1</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-400 block">₹32 - ₹45 LPA (SDE)</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section id="team" className="relative z-10 py-24 border-b border-white/5 bg-[#08080d]/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Driving Educational Innovation
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-blue to-brand-purple">Team</span>
            </h2>
            <p className="text-gray-400 font-medium text-base">
              The passionate leaders, marketing strategists, and tech innovators building the future of student academic operating systems.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowTeamPortal(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-teal via-[#0d9488] to-brand-blue text-black font-extrabold text-xs shadow-xl hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Dedicated Team Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Member 1: Founder & CEO & Tech Lead */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.sowban)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-brand-teal/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full blur-2xl group-hover:bg-brand-teal/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/founder_sowban.png" 
                  name="SHAIK SOWBAN" 
                  gradient="from-brand-teal to-brand-blue" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full uppercase tracking-widest border border-brand-teal/20 inline-block mb-2">
                    Founder, CEO & Tech Lead
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-brand-teal transition-colors">SHAIK SOWBAN</h3>
                  <p className="text-xs font-bold text-gray-400">Chief Architect & Tech Lead</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Founder & Lead Tech Architect driving AI models, software development, cloud infrastructure & ecosystem scaling.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-brand-teal group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 2: C. MANASA (Team Lead • Feature Strategy) */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.manasa)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_manasa.jpg" 
                  name="C. MANASA" 
                  gradient="from-amber-400 to-orange-500" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/20 inline-block mb-2">
                    Team Lead • Feature Strategy
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">C. MANASA</h3>
                  <p className="text-xs font-bold text-gray-400">Product Innovation Lead</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Discovers real campus problems, researches student pain points, and conceptualizes breakthrough features.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-amber-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 3: PERAM VAMSIKA */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.vamsika)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_vamsika.png" 
                  name="PERAM VAMSIKA" 
                  gradient="from-amber-400 to-orange-500" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/20 inline-block mb-2">
                    Feature Strategy
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">PERAM VAMSIKA</h3>
                  <p className="text-xs font-bold text-gray-400">Feature Research & Student Insights</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Conducts campus surveys and student workflow analysis to design practical, high-impact platform tools.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-amber-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 4: RAAVI YASWITHA */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.yaswitha)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_yaswitha.jpg" 
                  name="RAAVI YASWITHA" 
                  gradient="from-amber-400 to-orange-500" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/20 inline-block mb-2">
                    Feature Strategy
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">RAAVI YASWITHA</h3>
                  <p className="text-xs font-bold text-gray-400">Problem Identification & User Testing</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Identifies core student friction points and performs end-to-end user beta tests for seamless UX quality.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-amber-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 5: Y. USHA SREE - AI & Innovation Lead */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.ushasree)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-violet-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400/10 rounded-full blur-2xl group-hover:bg-violet-400/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_ushasree.jpg" 
                  name="Y. USHA SREE" 
                  gradient="from-violet-400 via-purple-500 to-indigo-500" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-violet-400/20 inline-block mb-2">
                    AI & Innovation Lead
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-violet-300 transition-colors">Y. USHA SREE</h3>
                  <p className="text-xs font-bold text-gray-400">Head of Intelligent Systems</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Pioneering intelligent AI architectures, smart student learning models, and next-generation educational innovation.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-violet-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 6: M. AKHIL - Marketing Head */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.akhil)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-brand-purple/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-2xl group-hover:bg-brand-purple/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_akhil.jpg" 
                  name="M. AKHIL" 
                  gradient="from-brand-purple to-brand-pink" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full uppercase tracking-widest border border-brand-purple/20 inline-block mb-2">
                    Marketing Head
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-brand-purple transition-colors">M. AKHIL</h3>
                  <p className="text-xs font-bold text-gray-400">Head of Growth & Outreach</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Leading brand strategy, campus expansion, digital marketing campaigns, and student community partnerships.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-brand-purple group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 7: A. POOJA REDDY - Mentorship & Support Lead */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.pooja)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_pooja.jpg" 
                  name="A. POOJA REDDY" 
                  gradient="from-cyan-400 to-blue-600" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-400/20 inline-block mb-2">
                    Mentorship Head
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">A. POOJA REDDY</h3>
                  <p className="text-xs font-bold text-gray-400">Head of Doubt Solver Network</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Manages human mentor network, speeds up doubt resolution responses, and assists students 24/7.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-cyan-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 8: C. CHANDRIKA - Operations Head */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.chandrika)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_chandrika.jpg" 
                  name="C. CHANDRIKA" 
                  gradient="from-emerald-400 to-teal-600" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20 inline-block mb-2">
                    Operations Head
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors">C. CHANDRIKA</h3>
                  <p className="text-xs font-bold text-gray-400">Head of Operations & Support</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Overseeing academic content verification, student support, mentorship programs, and daily campus operations.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-emerald-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member 9: SHAIK TOUSIF BASHA - AI Solutions & Prototyping Lead */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.tousif)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-blue-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_tousif.jpg" 
                  name="SHAIK TOUSIF BASHA" 
                  gradient="from-blue-400 via-indigo-500 to-cyan-400" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20 inline-block mb-2">
                    AI Solutions Lead
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-blue-300 transition-colors">SHAIK TOUSIF BASHA</h3>
                  <p className="text-xs font-bold text-gray-400">AI Solutions & Prototyping Lead</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Uses AI tools to rapidly build demos, prototypes, and proof-of-concepts for new VYOMRA features.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-blue-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member: SYED RIYAZ - AI Solutions & Prototyping Member */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.riyaz)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_riyaz.png" 
                  name="SYED RIYAZ" 
                  gradient="from-cyan-400 via-blue-500 to-indigo-500" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-500/20 inline-block mb-2">
                    AI Solutions Member
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">SYED RIYAZ</h3>
                  <p className="text-xs font-bold text-gray-400">AI Solutions & Prototyping Member</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Builds rapid AI-driven prototypes, proofs-of-concept, and intelligent automation workflows.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-cyan-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>

            {/* Team Member: USHA ESWARI - Product Testing & QA Lead */}
            <div 
              onClick={() => setSelectedMember(teamMembersDetails.ushaeswari)}
              className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-rose-400/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl group-hover:bg-rose-400/20 transition-all"></div>
              
              <div>
                <TeamAvatar 
                  src="/team_ushaeswari.jpg" 
                  name="USHA ESWARI" 
                  gradient="from-rose-400 via-pink-500 to-indigo-500" 
                />

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-400/20 inline-block mb-2">
                    Product Testing & QA Lead
                  </span>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-rose-300 transition-colors">USHA ESWARI</h3>
                  <p className="text-xs font-bold text-gray-400">Quality Assurance Lead</p>
                  <p className="text-xs text-gray-400 pt-2.5 leading-relaxed">
                    Directs product testing workflows, automated test suites, quality benchmarks, and defect tracking across Vyomra.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-5 text-center">
                <span className="text-[11px] font-extrabold text-rose-400 group-hover:underline">View Profile & Details &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="relative z-10 py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 uppercase tracking-widest">
            <Shield className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 font-medium mb-12">
            If you face any login / register issues or queries,<br/>
            please contact us directly at:{' '}
            <a 
              href="mailto:249xa33106@gprec.ac.in?subject=Vyomra%20Support%20Query" 
              className="text-brand-teal font-bold hover:underline inline-flex items-center gap-1 bg-brand-teal/10 px-3 py-1 rounded-lg border border-brand-teal/30 hover:bg-brand-teal/20 transition-colors ml-1"
            >
              <Mail className="w-4 h-4" /> 249xa33106@gprec.ac.in
            </a>
          </p>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-white font-bold text-sm md:text-base hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-brand-teal transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                  <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#050508] py-12 text-center border-t border-white/5 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src="/lumixora_logo.jpg" alt="VYOMRA Logo" className="w-10 h-10 rounded-full object-cover shadow-md border border-cyan-500/30" />
          <div className="flex flex-col text-left">
            <span className="text-xl font-black text-white tracking-tight leading-none">Lumixora</span>
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest mt-0.5">A Project of VYOMRA</span>
          </div>
        </div>
        <p className="text-cyan-400/90 text-xs font-black tracking-widest uppercase mb-2">IDEAS TODAY • IMPACT TOMORROW</p>
        <p className="text-gray-500 text-xs font-medium mb-1">Autonomous Multi-Campus Student OS & Placement Twin Ecosystem.</p>
        <p className="text-gray-400 text-xs font-bold mb-4 tracking-wide">Founded & Led by SHAIK SOWBAN</p>
        
        {/* Workable Contact Email in Footer */}
        <div className="my-6">
          <a 
            href="mailto:249xa33106@gprec.ac.in?subject=Vyomra%20Login%20/%20Register%20Support%20Query"
            className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all shadow-md"
          >
            <Mail className="w-4 h-4 text-brand-teal shrink-0" />
            <span>Login / Register Issues & Queries:</span>
            <strong className="text-brand-teal hover:underline">249xa33106@gprec.ac.in</strong>
          </a>
        </div>

        <p className="text-gray-600 text-xs font-bold tracking-widest">&copy; 2026 VYOMRA. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Fixed Founder Cinematic Badge */}
      <div 
        onClick={() => setSelectedMember(teamMembersDetails.sowban)}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center animate-fade-in-up hidden md:flex cursor-pointer"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal via-brand-purple to-brand-blue rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
          <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-brand-teal via-brand-purple to-brand-blue shadow-2xl">
             <img src="/founder_sowban.png" alt="Founder Shaik Sowban" className="w-full h-full object-cover rounded-full border-2 border-[#0a0a0f] transform transition-transform duration-700 group-hover:scale-110" />
          </div>
          {/* Cinematic ring */}
          <div className="absolute -inset-1 border border-white/20 rounded-full animate-[spin_8s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="mt-3 glass-panel px-4 py-2 rounded-xl border border-white/10 text-center shadow-xl backdrop-blur-md bg-black/60 group-hover:-translate-y-1 transition-transform">
          <span className="block text-[10px] font-black text-brand-teal tracking-widest uppercase mb-0.5">Founder</span>
          <span className="block text-sm font-bold text-white tracking-wide">SHAIK SOWBAN</span>
        </div>
      </div>

      {/* Team Member Full Detail Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#0e1017] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Ambient Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${selectedMember.gradient} rounded-full blur-3xl opacity-20 pointer-events-none`}></div>
            <div className={`absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr ${selectedMember.gradient} rounded-full blur-3xl opacity-15 pointer-events-none`}></div>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all shadow-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/10 text-center sm:text-left">
                <TeamAvatar 
                  src={selectedMember.image} 
                  name={selectedMember.name} 
                  gradient={selectedMember.gradient} 
                  size="w-28 h-28" 
                  textSize="text-3xl" 
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedMember.borderBadge}`}>
                      {selectedMember.department}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide">{selectedMember.name}</h3>
                  <p className="text-sm font-bold text-gray-300">{selectedMember.role}</p>
                  {selectedMember.lead && (
                    <p className="text-xs text-gray-500 font-medium">{selectedMember.lead}</p>
                  )}
                </div>
              </div>

              {/* Bio & Mission */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-teal" /> Overview & Mission
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  {selectedMember.bio}
                </p>
              </div>

              {/* Key Contributions & Responsibilities */}
              {selectedMember.highlights && selectedMember.highlights.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" /> Key Responsibilities & Contributions
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedMember.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 shrink-0"></span>
                        <span className="text-xs text-gray-300 font-medium leading-normal">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Domains */}
              {selectedMember.skills && selectedMember.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Core Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500">VYOMRA Student OS Leadership</span>
              <button 
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

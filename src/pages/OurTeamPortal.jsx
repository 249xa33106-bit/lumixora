import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Shield, Sparkles, Star, Search, Filter, Plus, Edit3, Trash2, 
  ArrowRight, ExternalLink, X, Check, Award, ChevronRight, Mail, 
  Building2, GraduationCap, Cpu, Layers, HeartHandshake, Eye, Briefcase
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useToast } from '../context/ToastContext';

// Default Team Directory Data with Complete Dossiers
export const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'sowban',
    name: 'SHAIK SOWBAN',
    role: 'Founder, CEO & Tech Lead',
    division: 'executive',
    divisionLabel: 'Executive Leadership',
    department: 'Executive Leadership & Engineering',
    lead: 'Platform Founder & Chief Architect',
    image: '/founder_sowban.png',
    color: 'teal',
    gradient: 'from-brand-teal via-[#0d9488] to-brand-blue',
    borderBadge: 'border-brand-teal/40 text-brand-teal bg-brand-teal/10',
    bio: 'Visionary founder and chief software architect behind Vyomra. Leading system architecture, AI model integrations, scalable cloud infrastructure, and the core platform vision.',
    highlights: [
      'Architected the entire Vyomra Student OS full-stack ecosystem from concept to production.',
      'Engineered the AI Future Twin, automated code execution engines, and smart academic portfolios.',
      'Directs cross-functional engineering, infrastructure scaling, and real-time security protocols.',
      'Drives the mission to democratize state-of-the-art AI tooling for every university student.'
    ],
    skills: ['System Architecture', 'Full-Stack Development', 'AI/ML Integration', 'Cloud Infrastructure', 'Product Vision'],
    priority: 1
  },
  {
    id: 'ishrath',
    name: 'ISHRATH JAHAN',
    role: 'Under Founder',
    division: 'executive',
    divisionLabel: 'Executive Core Team',
    department: 'Executive Core Team',
    lead: 'Directly Under Founder (Shaik Sowban)',
    image: '/team_ishrath.png',
    color: 'teal',
    gradient: 'from-teal-400 to-emerald-500',
    borderBadge: 'border-teal-400/40 text-teal-300 bg-teal-400/10',
    bio: 'Core executive team member working directly under the Founder, assisting in platform execution, operations, and ecosystem strategy across Vyomra.',
    highlights: [
      'Works directly under the Founder to coordinate strategic platform initiatives and milestones.',
      'Assists in cross-department operations, student support, and academic workflow management.',
      'Maintains direct communication channels with the Founder to execute product improvements.',
      'Supports core community growth and student engagement across universities.'
    ],
    skills: ['Under Founder', 'Executive Support', 'Core Operations', 'Platform Strategy', 'Team Coordination'],
    priority: 2
  },
  {
    id: 'arshiya',
    name: 'ARSHIYA SULTANA',
    role: 'Under Founder',
    division: 'executive',
    divisionLabel: 'Executive Core Team',
    department: 'Executive Core Team',
    lead: 'Directly Under Founder (Shaik Sowban)',
    image: '/team_arshiya.png',
    color: 'pink',
    gradient: 'from-pink-400 to-rose-500',
    borderBadge: 'border-pink-400/40 text-pink-300 bg-pink-400/10',
    bio: 'Core executive team member working directly under the Founder, assisting in platform research, quality assurance, and core feature initiatives across Vyomra.',
    highlights: [
      'Works directly under the Founder on key academic research and platform quality standards.',
      'Coordinates with the Founder to evaluate and refine student learning tools.',
      'Assists in resource structuring, verified content curation, and feature feedback.',
      'Drives student experience optimization directly aligned with the Founder vision.'
    ],
    skills: ['Under Founder', 'Executive Support', 'Academic Research', 'Quality Assurance', 'Feature Strategy'],
    priority: 3
  },
  {
    id: 'manasa',
    name: 'C. MANASA',
    role: 'Team Lead • Feature Strategy',
    division: 'feature-strategy',
    divisionLabel: 'Feature Strategy & Product Innovation',
    department: 'Feature Strategy & Innovation',
    lead: 'Feature Strategy Team Lead',
    image: '/team_manasa.jpg',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    borderBadge: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
    bio: 'Leads the feature ideation engine at Vyomra. Identifies emerging campus challenges, analyzes student behavioural patterns, and directs product roadmap discovery.',
    highlights: [
      'Directs the Feature Strategy team in discovering student pain points and campus needs.',
      'Authors feature specification documents and translates academic workflows into elegant concepts.',
      'Aligns product initiatives with student academic success metrics and user retention goals.',
      'Bridges student communities and tech architects to accelerate feature delivery.'
    ],
    skills: ['Product Innovation', 'Feature Roadmapping', 'Student Analytics', 'Team Leadership', 'Design Thinking'],
    priority: 4
  },
  {
    id: 'vamsika',
    name: 'PERAM VAMSIKA',
    role: 'Feature Research & Student Insights',
    division: 'feature-strategy',
    divisionLabel: 'Feature Strategy & Product Innovation',
    department: 'Feature Strategy Team',
    lead: 'Under Feature Strategy Lead (C. Manasa)',
    image: '/team_vamsika.png',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    borderBadge: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
    bio: 'Key driver in Vyomra Feature Strategy division, spearheading student needs discovery, academic workflow analysis, and real-time usability research.',
    highlights: [
      'Conducts in-depth qualitative & quantitative campus surveys to uncover real student pain points.',
      'Researches and benchmarks top-tier EdTech solutions to ideate intuitive platform features.',
      'Collaborates directly with UI/UX and engineering teams to transform student feedback into roadmaps.',
      'Validates feature prototypes against real academic workflows before general release.'
    ],
    skills: ['Student Insights', 'Feature Viability Research', 'Workflow Optimization', 'UX Discovery', 'Survey Analytics'],
    priority: 5
  },
  {
    id: 'yaswitha',
    name: 'RAAVI YASWITHA',
    role: 'Problem Identification & User Testing',
    division: 'feature-strategy',
    divisionLabel: 'Feature Strategy & Product Innovation',
    department: 'Feature Strategy Team',
    lead: 'Under Feature Strategy Lead (C. Manasa)',
    image: '/team_yaswitha.jpg',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    borderBadge: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
    bio: 'Drives student-centric problem discovery and usability testing. Evaluates prototype friction points and ensures every Vyomra feature is effortless to use.',
    highlights: [
      'Specializes in identifying day-to-day academic blockers and study habit bottlenecks.',
      'Executes rigorous user testing protocols across diverse student batches.',
      'Compiles structured usability reports for development sprints and design revamps.',
      'Champions accessibility and simplicity across the student user journey.'
    ],
    skills: ['Problem Discovery', 'Usability Testing', 'Friction Analysis', 'User Feedback Loops', 'Quality Assurance'],
    priority: 6
  },
  {
    id: 'ushasree',
    name: 'Y. USHA SREE',
    role: 'AI & Innovation Lead',
    division: 'ai-tech',
    divisionLabel: 'AI & Intelligent Systems',
    department: 'AI & Research Division',
    lead: 'Head of Intelligent Systems',
    image: '/team_ushasree.jpg',
    color: 'violet',
    gradient: 'from-violet-400 via-purple-500 to-indigo-500',
    borderBadge: 'border-violet-400/40 text-violet-300 bg-violet-400/10',
    bio: 'Pioneering intelligent AI architectures, adaptive learning engines, and next-generation educational innovation across Vyomra.',
    highlights: [
      'Leads prompt engineering, LLM fine-tuning, and personalized tutoring pipelines.',
      'Researches predictive learning analytics to identify early student intervention signals.',
      'Collaborates with engineering to deploy low-latency, scalable AI microservices.',
      'Ensures ethical AI deployment, data privacy compliance, and model accuracy.'
    ],
    skills: ['AI Systems', 'Prompt Engineering', 'Adaptive Tutoring', 'NLP & LLMs', 'Educational AI'],
    priority: 7
  },
  {
    id: 'tousif',
    name: 'SHAIK TOUSIF BASHA',
    role: 'AI Solutions & Prototyping Lead',
    division: 'ai-tech',
    divisionLabel: 'AI & Intelligent Systems',
    department: 'AI Solutions Division',
    lead: 'Lead — AI Solutions & Rapid Prototyping',
    image: '/team_tousif.jpg',
    color: 'blue',
    gradient: 'from-blue-400 via-indigo-500 to-cyan-400',
    borderBadge: 'border-blue-400/40 text-blue-300 bg-blue-400/10',
    bio: 'Harnesses cutting-edge AI tools to rapidly build demos, prototypes, and proof-of-concepts for new platform tools and automated features.',
    highlights: [
      'Builds rapid AI-driven proofs-of-concept for experimental platform modules.',
      'Bridges cutting-edge generative AI models into actionable student features.',
      'Optimizes developer workflow and prototyping velocity across engineering sprints.',
      'Tests bleeding-edge APIs to continuously expand Vyomra intelligence capabilities.'
    ],
    skills: ['AI Prototyping', 'Rapid Proof-of-Concepts', 'Tool Integration', 'Automation', 'Full-Stack Prototyping'],
    priority: 8
  },
  {
    id: 'riyaz',
    name: 'SYED RIYAZ',
    role: 'AI Solutions & Prototyping Member',
    division: 'ai-tech',
    divisionLabel: 'AI & Intelligent Systems',
    department: 'AI Solutions Division',
    lead: 'Under AI Solutions Lead (Shaik Tousif Basha)',
    image: '/team_riyaz.png',
    color: 'cyan',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    borderBadge: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10',
    bio: 'Core AI solutions developer and rapid prototyping member. Specializes in building proof-of-concept AI modules, intelligent automation pipelines, and model evaluation.',
    highlights: [
      'Develops rapid AI prototypes and experimental feature proof-of-concepts under the AI Solutions division.',
      'Collaborates on LLM integration, prompt design, and automated workflow pipelines.',
      'Tests and optimizes AI-powered student tools for performance, accuracy, and latency.',
      'Works alongside team leads to translate cutting-edge AI research into working platform prototypes.'
    ],
    skills: ['AI Prototyping', 'Prompt Engineering', 'Python', 'Proof of Concepts', 'Model Evaluation'],
    priority: 9
  },
  {
    id: 'chandrika',
    name: 'C. CHANDRIKA',
    role: 'Operations Head',
    division: 'operations',
    divisionLabel: 'Operations & Quality Management',
    department: 'Operations & Support Division',
    lead: 'Head of Operations & Support',
    image: '/team_chandrika.jpg',
    color: 'emerald',
    gradient: 'from-emerald-400 to-teal-600',
    borderBadge: 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10',
    bio: 'Oversees academic content verification, student support channels, mentorship programs, and daily campus operational logistics.',
    highlights: [
      'Manages verified study material pipelines and faculty review coordination.',
      'Streamlines support desk response times and student satisfaction ratings.',
      'Coordinates campus ambassador programs and institutional stakeholder communication.',
      'Establishes standard operating procedures for scalable academic platform operations.'
    ],
    skills: ['Operations Management', 'Content Verification', 'Student Support', 'Process Optimization', 'Campus Logistics'],
    priority: 9
  },
  {
    id: 'akhil',
    name: 'M. AKHIL',
    role: 'Marketing Head',
    division: 'marketing',
    divisionLabel: 'Marketing & Brand Strategy',
    department: 'Growth & Marketing Division',
    lead: 'Head of Growth & Outreach',
    image: '/team_akhil.jpg',
    color: 'purple',
    gradient: 'from-brand-purple to-brand-pink',
    borderBadge: 'border-brand-purple/40 text-purple-300 bg-brand-purple/10',
    bio: 'Leading brand strategy, university expansion, digital outreach campaigns, and student community partnerships across colleges.',
    highlights: [
      'Directs multi-channel growth campaigns driving thousands of student registrations.',
      'Authors brand storytelling and visual narrative across student media platforms.',
      'Builds strategic partnerships with student clubs, technical societies, and colleges.',
      'Analyzes acquisition funnels and referral loops to maximize platform adoption.'
    ],
    skills: ['Growth Marketing', 'Brand Strategy', 'Community Outreach', 'Digital Campaigns', 'Student Engagement'],
    priority: 10
  },
  {
    id: 'pooja',
    name: 'A. POOJA REDDY',
    role: 'Mentorship Head',
    division: 'mentorship',
    divisionLabel: 'Mentorship & Student Support',
    department: 'Mentorship Division',
    lead: 'Head of Doubt Solver Network',
    image: '/team_pooja.jpg',
    color: 'cyan',
    gradient: 'from-cyan-400 to-blue-600',
    borderBadge: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10',
    bio: 'Directs the 24/7 human mentor network, optimizes doubt resolution turnaround times, and provides empathetic academic support.',
    highlights: [
      'Leads a network of top-performing student mentors for real-time concept support.',
      'Monitors doubt resolution SLAs to maintain sub-15-minute response targets.',
      'Develops mentor training modules and quality assurance benchmarks.',
      'Fosters a culture of peer-to-peer collaborative academic acceleration.'
    ],
    skills: ['Mentorship Management', 'Doubt Resolution', 'Student Guidance', 'Quality Benchmarking', 'Community Support'],
    priority: 11
  },
  {
    id: 'ushaeswari',
    name: 'USHA ESWARI',
    role: 'Product Testing & Quality Assurance Lead',
    division: 'operations',
    divisionLabel: 'Operations & Quality Management',
    department: 'Product Testing & QA Division',
    lead: 'Lead — Product Testing & Quality Assurance',
    image: '/team_ushaeswari.jpg',
    color: 'rose',
    gradient: 'from-rose-500 via-pink-500 to-indigo-500',
    borderBadge: 'border-rose-400/40 text-rose-300 bg-rose-400/10',
    bio: 'Directs comprehensive product testing workflows, quality benchmarks, and automated QA validation across the Vyomra ecosystem.',
    highlights: [
      'Leads end-to-end product testing pipelines and quality assurance standards across all student features.',
      'Designs and executes robust functional, regression, and user acceptance test suites.',
      'Collaborates with product and engineering teams to identify defects, edge cases, and performance bottlenecks.',
      'Ensures seamless, bug-free releases and optimal stability for thousands of active university users.'
    ],
    skills: ['Product Testing', 'Quality Assurance', 'Test Automation', 'Bug Tracking & QA', 'User Acceptance Testing'],
    priority: 12
  }
];

function TeamAvatarBadge({ src, name, gradient = "from-teal-400 to-emerald-500", size = "w-20 h-20", textSize = "text-xl" }) {
  const [imgError, setImgError] = useState(false);
  
  const getInitials = (n) => {
    if (!n) return 'T';
    const clean = n.replace(/[^a-zA-Z\s]/g, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className={`relative ${size} shrink-0`}>
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradient} rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity`}></div>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={name} 
          onError={() => setImgError(true)}
          className={`${size} rounded-2xl object-cover relative z-10 border-2 border-white/20 group-hover:scale-105 transition-transform duration-500 shadow-xl`} 
        />
      ) : (
        <div className={`${size} rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center font-black ${textSize} text-white border-2 border-white/20 relative z-10 shadow-xl select-none group-hover:scale-105 transition-transform duration-500`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

export default function OurTeamPortal({ user, setActiveTab }) {
  const toastCtx = useToast();
  const addToast = toastCtx?.addToast || (({ message, type }) => console.log(`[Toast] (${type}):`, message));
  const isFounder = user?.role === 'founder' || 
                    user?.email?.toLowerCase() === 'founder@lumixora.com' ||
                    user?.email?.toLowerCase() === '249xa33106@gmail.com';

  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM_MEMBERS);
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  // Founder CRUD Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    division: 'executive',
    divisionLabel: 'Executive Core',
    department: '',
    lead: '',
    image: '',
    bio: '',
    highlights: '',
    skills: ''
  });

  // Sync custom/updated team members from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'lumixora_team_directory'), (snap) => {
        if (!snap.empty) {
          const dbList = [];
          snap.forEach(d => dbList.push({ id: d.id, ...d.data() }));
          
          // Merge defaults with custom DB entries
          const merged = [...DEFAULT_TEAM_MEMBERS];
          dbList.forEach(dbItem => {
            const idx = merged.findIndex(m => m.id === dbItem.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...dbItem };
            } else {
              merged.push(dbItem);
            }
          });
          setTeamMembers(merged);
        }
      }, (err) => console.warn('Team directory sync note:', err));
      return () => unsub();
    } catch (e) {}
  }, []);

  const divisions = [
    { id: 'all', label: 'All Members', count: teamMembers.length },
    { id: 'executive', label: 'Executive & Under Founder', count: teamMembers.filter(m => m.division === 'executive').length },
    { id: 'feature-strategy', label: 'Feature Strategy & UX', count: teamMembers.filter(m => m.division === 'feature-strategy').length },
    { id: 'ai-tech', label: 'AI & Systems', count: teamMembers.filter(m => m.division === 'ai-tech').length },
    { id: 'operations', label: 'Operations & QA', count: teamMembers.filter(m => m.division === 'operations').length },
    { id: 'marketing', label: 'Growth & Brand', count: teamMembers.filter(m => m.division === 'marketing').length },
    { id: 'mentorship', label: 'Mentorship', count: teamMembers.filter(m => m.division === 'mentorship').length }
  ];

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(m => {
      const matchesDivision = selectedDivision === 'all' || m.division === selectedDivision;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.department?.toLowerCase().includes(q) ||
        (m.skills && m.skills.some(s => s.toLowerCase().includes(q)));
      return matchesDivision && matchesSearch;
    });
  }, [teamMembers, selectedDivision, searchQuery]);

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      id: member.id || `member_${Date.now()}`,
      name: member.name || '',
      role: member.role || '',
      division: member.division || 'executive',
      divisionLabel: member.divisionLabel || 'Executive Core',
      department: member.department || '',
      lead: member.lead || '',
      image: member.image || '',
      bio: member.bio || '',
      highlights: Array.isArray(member.highlights) ? member.highlights.join('\n') : (member.highlights || ''),
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : (member.skills || '')
    });
    setShowEditModal(true);
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      id: `member_${Date.now()}`,
      name: '',
      role: '',
      division: 'executive',
      divisionLabel: 'Executive Leadership',
      department: '',
      lead: '',
      image: '',
      bio: '',
      highlights: '',
      skills: ''
    });
    setShowEditModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      addToast({ message: 'Name and Role are required.', type: 'warning' });
      return;
    }

    const payload = {
      ...formData,
      highlights: formData.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      gradient: formData.gradient || 'from-brand-teal via-[#0d9488] to-brand-blue',
      borderBadge: formData.borderBadge || 'border-brand-teal/40 text-brand-teal bg-brand-teal/10'
    };

    try {
      await setDoc(doc(db, 'lumixora_team_directory', payload.id), payload, { merge: true });
      addToast({ message: 'Team member dossier saved successfully!', type: 'success' });
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      addToast({ message: 'Failed to save team member.', type: 'error' });
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await deleteDoc(doc(db, 'lumixora_team_directory', id));
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      addToast({ message: 'Team member removed.', type: 'info' });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Hero Banner */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 relative overflow-hidden bg-gradient-to-br from-[#0c0d18] via-[#101222] to-[#0a0a14] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Core Leadership & Organization
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Vyomra <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-[#00f5d4] to-brand-blue">Core Team</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Meet the passionate student architects, research leads, feature strategists, and executive contributors driving the Student Academic Operating System.
          </p>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-2xl font-black text-brand-teal block">{teamMembers.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Core Members</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-2xl font-black text-purple-400 block">6</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Divisions</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-2xl font-black text-amber-400 block">100%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student-Led</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-2xl font-black text-emerald-400 block">GPREC</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campus HQ</span>
            </div>
          </div>
        </div>

        {/* Founder Add Member Button */}
        {isFounder && (
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold text-xs shadow-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Team Member
            </button>
          </div>
        )}
      </div>

      {/* Division Navigation Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Division Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar flex-1">
          {divisions.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDivision(d.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedDivision === d.id
                  ? 'bg-gradient-to-r from-brand-teal to-brand-blue text-black shadow-lg font-black'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              <span>{d.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedDivision === d.id ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-gray-400'}`}>
                {d.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, skill..."
            className="w-full bg-[#111118] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-brand-teal/50 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer bg-[#0e101a]/80 shadow-xl"
          >
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${member.gradient} rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity`}></div>

            <div>
              {/* Member Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <TeamAvatarBadge 
                  src={member.image} 
                  name={member.name} 
                  gradient={member.gradient} 
                  size="w-16 h-16" 
                  textSize="text-xl" 
                />

                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${member.borderBadge}`}>
                    {member.divisionLabel || member.department}
                  </span>
                  {member.lead && (
                    <span className="text-[10px] font-medium text-gray-400 text-right">
                      {member.lead}
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Role */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white group-hover:text-brand-teal transition-colors tracking-wide">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-teal" />
                  <span>{member.role}</span>
                </p>
                <p className="text-xs text-gray-400 pt-2 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>

              {/* Key Skills Tags */}
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4">
                  {member.skills.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-300">
                      {s}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-bold text-brand-teal">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-brand-teal group-hover:underline flex items-center gap-1">
                View Full Dossier <ArrowRight className="w-3.5 h-3.5" />
              </span>

              {/* Founder Controls */}
              {isFounder && (
                <div className="flex items-center gap-1.5 z-20" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all"
                    title="Edit Member"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    title="Delete Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-12 text-center glass-panel rounded-3xl border border-white/10 space-y-3">
          <Users className="w-10 h-10 text-gray-500 mx-auto" />
          <p className="text-gray-400 text-sm font-semibold">No team members match your search.</p>
        </div>
      )}

      {/* Member Full Dossier Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#0e101a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br ${selectedMember.gradient} rounded-full blur-3xl opacity-25 pointer-events-none`}></div>
            <div className={`absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr ${selectedMember.gradient} rounded-full blur-3xl opacity-20 pointer-events-none`}></div>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/10 text-center sm:text-left">
                <TeamAvatarBadge 
                  src={selectedMember.image} 
                  name={selectedMember.name} 
                  gradient={selectedMember.gradient} 
                  size="w-24 h-24 sm:w-28 sm:h-28" 
                  textSize="text-3xl" 
                />

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedMember.borderBadge}`}>
                      {selectedMember.department || selectedMember.divisionLabel}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide">{selectedMember.name}</h3>
                  <p className="text-sm font-bold text-gray-300">{selectedMember.role}</p>
                  {selectedMember.lead && (
                    <p className="text-xs text-brand-teal font-semibold">{selectedMember.lead}</p>
                  )}
                </div>
              </div>

              {/* Bio & Mission */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-teal" /> Overview & Strategic Mandate
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  {selectedMember.bio}
                </p>
              </div>

              {/* Key Contributions & Highlights */}
              {selectedMember.highlights && selectedMember.highlights.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-400" /> Key Accomplishments & Initiatives
                  </h4>
                  <div className="space-y-2">
                    {selectedMember.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Competencies */}
              {selectedMember.skills && selectedMember.skills.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" /> Core Skill Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Official Vyomra Contributor</span>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Founder Add / Edit Member Modal */}
      {showEditModal && isFounder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0e101a] border border-white/15 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-teal" />
                {editingMember ? 'Edit Team Member Dossier' : 'Add New Team Member'}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. SHAIK SOWBAN"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Official Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="e.g. Under Founder / Team Lead"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="executive">Executive & Under Founder</option>
                    <option value="feature-strategy">Feature Strategy & UX</option>
                    <option value="ai-tech">AI & Systems</option>
                    <option value="operations">Operations & QA</option>
                    <option value="marketing">Growth & Brand</option>
                    <option value="mentorship">Mentorship</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Hierarchy Reporting Line</label>
                  <input
                    type="text"
                    value={formData.lead}
                    onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                    placeholder="e.g. Directly Under Founder"
                    className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Photo Image URL (e.g. /team_ishrath.png or uploaded link)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="e.g. /team_ishrath.png"
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Mission Overview / Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe member responsibilities and contributions..."
                  className="w-full bg-[#111118] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Highlights / Accomplishments (1 per line)</label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Accomplishment 1&#10;Accomplishment 2"
                  className="w-full bg-[#111118] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Skill Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Executive Support, Operations, AI Systems"
                  className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-xs font-bold text-gray-300 hover:bg-white/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue text-xs font-extrabold text-black hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

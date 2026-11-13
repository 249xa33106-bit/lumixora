import { supabase } from '../config/supabase';
import { callAICompletion } from '../services/aiService';
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, CheckCircle2, ChevronRight, Brain, Code, Rocket, 
  Trophy, Users, Target, Activity, Zap, Shield, Flame, Briefcase, Building2, 
  GraduationCap, Globe, ExternalLink, Play, ChevronDown, Check, Star, 
  Compass, Laptop, Award, BarChart3, TrendingUp, Layers, Terminal, Sparkle,
  Search, BookOpen, Clock, Heart, Send, HelpCircle, X, Lock, CheckCircle, Mail
} from 'lucide-react';
import CampusAmbassadorModal from '../components/CampusAmbassadorModal';
import OurTeamPortal from './OurTeamPortal';
import Realistic3DLogo from '../components/Realistic3DLogo';
import CyberHoloGlobe3D from '../components/CyberHoloGlobe3D';

export default function LandingPage({ onLoginClick }) {
  // Navigation & modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTeamPortal, setShowTeamPortal] = useState(false);
  const [showAmbassadorModal, setShowAmbassadorModal] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase();
      return h === '#ambassador' || h === '#campus-ambassador' || h === '#apply-ambassador' || h === '#ca';
    }
    return false;
  });

  // Audience selector tabs: 'students', 'colleges', 'employers'
  const [selectedAudience, setSelectedAudience] = useState('students');

  // Interactive Career Twin Demo State
  const [activeCompetency, setActiveCompetency] = useState('Problem Solving');
  const [careerPath, setCareerPath] = useState('Software Developer');

  // Interactive AI Mentor Chat Demo State
  const [mentorInput, setMentorInput] = useState('');
  const [mentorHistory, setMentorHistory] = useState([
    {
      sender: 'mentor',
      text: "Hello! I am your Lumixora AI Career Mentor. I've analyzed your Career Twin (78% readiness for Software Developer). Would you like to debug your Dynamic Programming code, prepare for your technical interview, or review project milestones?"
    }
  ]);
  const [isMentorTyping, setIsMentorTyping] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Live Supabase platform statistics
  const [liveStats, setLiveStats] = useState({
    usersCount: 450,
    notesCount: 1195,
    collegesCount: 7,
    campusesLabel: 'GPREC, RGUKT & Partner Campuses'
  });

  useEffect(() => {
    async function fetchLiveStats() {
      try {
        const [usersRes, notesRes] = await Promise.all([
          supabase.from('users').select('college'),
          supabase.from('notes').select('*', { count: 'exact', head: true })
        ]);

        if (usersRes.data) {
          const rawColleges = usersRes.data.map(u => (u.college || '').trim()).filter(c => c && c.length > 2);
          const uniqueColleges = new Set(rawColleges);
          setLiveStats({
            usersCount: usersRes.data.length,
            notesCount: notesRes.count || 1195,
            collegesCount: Math.max(uniqueColleges.size, 5),
            campusesLabel: 'GPREC, RGUKT, AU & Partner Colleges'
          });
        }
      } catch (err) {
        console.error('Error fetching live stats:', err);
      }
    }
    fetchLiveStats();
  }, []);

  // Sync hash routing for campus ambassador
  useEffect(() => {
    const handleHashCheck = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const h = window.location.hash.toLowerCase();
        if (h === '#ambassador' || h === '#campus-ambassador' || h === '#apply-ambassador' || h === '#ca') {
          setShowAmbassadorModal(true);
        }
      }
    };
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // Referral detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('ca');
        if (refCode) {
          localStorage.setItem('lumixora_referral_code', refCode.trim().toUpperCase());
          if (typeof onLoginClick === 'function') onLoginClick('student');
        }
      } catch (e) {}
    }
  }, [onLoginClick]);

  const handleMentorSend = async (e) => {
    e?.preventDefault();
    if (!mentorInput.trim()) return;
    const userMsg = mentorInput.trim();
    setMentorInput('');
    setMentorHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsMentorTyping(true);

    const q = userMsg.toLowerCase().trim();

    // 1. Instant smart intent detector for zero latency on common prompts
    const isIdentity = q.includes('who are you') || q.includes('who r u') || q === 'who r u' || q === 'who are u' || q.includes('what are you') || q.includes('your name');
    const isGreeting = ['hi', 'hlo', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'namaste'].some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'));

    if (isIdentity) {
      setTimeout(() => {
        setIsMentorTyping(false);
        const reply = "I am your **Lumixora AI Career Mentor** (Autonomous Career Twin Agent v2.5)! 🧠\n\nI continuously analyze your student skill vector, assess your job readiness for roles like **" + careerPath + "**, provide instant DSA feedback, run mock technical interviews, and guide your path toward high-tier placements.";
        setMentorHistory(prev => [...prev, { sender: 'mentor', text: reply }]);
      }, 350);
      return;
    }

    if (isGreeting) {
      setTimeout(() => {
        setIsMentorTyping(false);
        const reply = "Hello! 👋 Great to connect with you. I am actively monitoring your Career Twin metrics (" + careerPath + " — 78% readiness).\n\nWhat would you like to work on right now? We can test your DSA algorithms in Code Arena, review your resume benchmarks, or simulate a live technical interview!";
        setMentorHistory(prev => [...prev, { sender: 'mentor', text: reply }]);
      }, 350);
      return;
    }

    // 2. Dynamic AI LLM completion with prompt grounding
    try {
      const systemPrompt = `You are Lumixora AI Career Mentor, an intelligent career copilot for university engineering students. The user is currently training for the role of '${careerPath}' (Career Twin readiness is 78%). Answer concisely, professionally, with actionable engineering advice, code tips, or encouragement. Keep response under 3-4 sentences.`;
      const aiReply = await callAICompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMsg }
        ],
        temperature: 0.6,
        maxTokens: 200
      });

      setIsMentorTyping(false);
      const finalReply = aiReply || `Great question! For ${careerPath}, prioritize mastering core Data Structures & Algorithms, building full-stack projects on GitHub, and tracking your weekly progress in Lumixora's Build Studio.`;
      setMentorHistory(prev => [...prev, { sender: 'mentor', text: finalReply }]);
    } catch (err) {
      setIsMentorTyping(false);
      let fallbackReply = `Great question! For ${careerPath}, prioritize practicing coding challenges in Code Arena and completing your milestones in the Build Studio.`;
      if (q.includes('interview')) {
        fallbackReply = "Let's run a rapid technical screening! 🎯 Question: Can you explain how database indexing works under the hood and why B-Trees are preferred over Hash Indexes for range queries?";
      } else if (q.includes('project')) {
        fallbackReply = "Your engineering portfolio is key! 🚀 Connecting your verified GitHub repositories to Build Studio unlocks the 'Verified Ship' badge and boosts your placement score.";
      }
      setMentorHistory(prev => [...prev, { sender: 'mentor', text: fallbackReply }]);
    }
  };

  const handleAuth = (type = 'student') => {
    if (typeof onLoginClick === 'function') {
      onLoginClick(type);
    }
  };

  if (showTeamPortal) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] text-white p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTeamPortal(false)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              &larr; Back to Landing Page
            </button>
            <button 
              onClick={() => { setShowTeamPortal(false); handleAuth('student'); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7553E8] to-[#08BFD0] text-white font-black text-xs shadow-md cursor-pointer"
            >
              Get Started
            </button>
          </div>
          <OurTeamPortal user={null} setActiveTab={() => {}} />
        </div>
      </div>
    );
  }

  const faqs = [
    { q: "What is Lumixora?", a: "Lumixora is an intelligent career development ecosystem that bridges the gap between learning and getting hired. It combines the Career Twin, AI mentorship, verified project build studio, and placement intelligence into one connected platform." },
    { q: "What is the Career Twin?", a: "Your Career Twin is an evolving AI representation of your professional competencies. It analyzes your real code runs, test scores, milestone completions, and mock interview communication to compute an evidence-backed readiness score." },
    { q: "How do Colleges and TPOs benefit from Lumixora?", a: "Institutions gain real-time visibility into student skill progression across departments, automated proctored diagnostic exams, syllabus alignment, and actionable gap analytics before company hiring drives." },
    { q: "How is Lumixora different from traditional EdTech video courses?", a: "Lumixora focuses on 'Learn → Build → Prove → Prepare → Connect'. Instead of issuing passive certificates of completion, it requires verified GitHub commits, code compiler proof, and clean proctor audits that employers trust." },
    { q: "Can I apply to be a Campus Ambassador?", a: "Yes! Click the 'Campus Ambassador' button in the header or section below. You can represent Lumixora at your college, receive direct 1-on-1 mentorship from founder Shaik Sowban, and earn official leadership credentials." },
    { q: "How do I request my college or university to be onboarded?", a: "If your institution is not yet in our university tenant list, simply email us at lumixora.team@gmail.com with your institution name and official domain. We onboard new engineering campuses within 24-48 hours!" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#101A35] font-sans selection:bg-[#7553E8]/20 selection:text-[#7553E8] relative overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────────
          HEADER & NAVIGATION (Sticky with Campus Ambassador Pill & Logins)
      ───────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#101A35]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* 3D Realistic Attractive Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Realistic3DLogo size="md" />
            <div>
              <span className="text-xl font-black tracking-tight text-[#101A35] font-sora block">LUMIXORA</span>
              <span className="text-[9px] font-bold tracking-widest text-[#7553E8] uppercase block -mt-1">Placement Intelligence</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7 text-xs xl:text-sm font-semibold text-[#101A35]/80">
            <a href="#flow" className="hover:text-[#7553E8] transition-colors">Lumixora Flow</a>
            <a href="#career-twin" className="hover:text-[#7553E8] transition-colors flex items-center gap-1.5">
              <span>Career Twin</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#7553E8]/10 text-[#7553E8]">Signature</span>
            </a>
            <a href="#placement-intelligence" className="hover:text-[#7553E8] transition-colors">Placement Intelligence</a>
            <a href="#ecosystems" className="hover:text-[#7553E8] transition-colors">Solutions</a>
            
            <button 
              onClick={() => setShowTeamPortal(true)} 
              className="hover:text-[#7553E8] transition-colors cursor-pointer bg-transparent border-none text-[#101A35]/80 font-semibold"
            >
              Team
            </button>
            <a href="#founder" className="hover:text-[#7553E8] transition-colors">About Us</a>
          </nav>

          {/* Header Action Buttons (Campus Ambassador + Logins + CTA) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Campus Ambassador Button */}
            <button
              onClick={() => setShowAmbassadorModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/40 text-amber-700 hover:text-black hover:border-amber-500 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Campus Ambassador</span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider">
                Apply
              </span>
            </button>

            {/* Intern Portal Quick Login */}
            <button
              onClick={() => handleAuth('intern')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Interns Workspace Access"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Intern</span>
            </button>

            <button
              onClick={() => handleAuth('student')}
              className="px-3 py-2 text-xs font-bold text-[#101A35] hover:text-[#7553E8] transition-colors cursor-pointer"
            >
              Log In
            </button>

            <button
              onClick={() => handleAuth('student')}
              className="px-4 py-2 rounded-xl bg-[#101A35] hover:bg-[#1E2E5D] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#08BFD0]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowAmbassadorModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-700 font-black text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Ambassador</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2 text-[#101A35]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#101A35]/10 px-6 py-6 space-y-4 shadow-xl">
            <a href="#flow" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#101A35]">Lumixora Flow</a>
            <a href="#career-twin" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#7553E8]">Career Twin (Signature)</a>
            <a href="#placement-intelligence" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#101A35]">Placement Intelligence</a>
            <a href="#campus-ambassador" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-amber-700">Campus Ambassador Program 🌟</a>
            <a href="#ecosystems" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#101A35]">Solutions (Students, Colleges, Employers)</a>
            <a href="#ecosystem-modules" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#101A35]">Product Ecosystem</a>
            <button 
              onClick={() => { setMobileMenuOpen(false); setShowTeamPortal(true); }}
              className="block text-left text-sm font-semibold text-[#101A35]"
            >
              Engineering & Product Team
            </button>
            <a href="#founder" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#101A35]">Founder & Mission</a>
            
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
              <button 
                onClick={() => { setMobileMenuOpen(false); handleAuth('student'); }}
                className="w-full py-3 rounded-xl bg-[#101A35] text-white font-bold text-xs"
              >
                Student Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleAuth('intern'); }}
                className="w-full py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs"
              >
                Intern Portal Sign In
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleAuth('faculty'); }}
                className="w-full py-2.5 rounded-xl bg-[#FAFBFF] border border-gray-200 text-[#101A35] font-bold text-xs"
              >
                Colleges & Faculty Portal
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 01: HERO — FIRST IMPRESSION (Light-mode canvas + Tech visualization)
      ───────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Subtle decorative grid and ambient glowing orbs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#101A3508_1px,transparent_1px),linear-gradient(to_bottom,#101A3508_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-r from-[#7553E8]/15 via-[#08BFD0]/10 to-[#00B987]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7553E8]/20 shadow-sm text-xs font-black uppercase tracking-wider text-[#7553E8]">
              <Sparkles className="w-3.5 h-3.5 text-[#7553E8]" />
              <span>YOUR FUTURE STARTS HERE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-[#101A35] tracking-tight leading-[1.12]">
              Don't Just Learn Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7553E8] via-[#08BFD0] to-[#00B987]">
                Become the Talent Companies Are Looking For.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#101A35]/70 max-w-2xl mx-auto leading-relaxed font-normal">
              Lumixora is an intelligent career development ecosystem that helps students build real-world skills, prove their capabilities, prepare for placements and connect with opportunities.
            </p>

            {/* 3 Core Pillars */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#101A35]/80 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#101A35]/10 shadow-xs">
                <Brain className="w-3.5 h-3.5 text-[#7553E8]" /> AI-Powered
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#101A35]/10 shadow-xs">
                <Target className="w-3.5 h-3.5 text-[#08BFD0]" /> Placement-Focused
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#101A35]/10 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-[#00B987]" /> Gamified Learning
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => handleAuth('student')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#101A35]/15 hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#08BFD0] group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#ecosystem-modules"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 border border-[#101A35]/15 text-[#101A35] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Explore the Ecosystem</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
            </div>

            {/* Trust statement below CTA */}
            <div className="pt-2 flex items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#00B987]" /> Built for students</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#08BFD0]" /> Empowering institutions</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#7553E8]" /> Connecting employers</span>
            </div>
          </div>

          {/* ── HERO VISUAL CONCEPT: Career Twin + 3 Floating Intelligence Panels ── */}
          <div className="mt-14 max-w-5xl mx-auto relative">
            <div className="rounded-3xl p-4 sm:p-8 bg-[#101A35] border border-white/10 shadow-2xl relative overflow-hidden text-white">
              
              {/* Background ambient mesh */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#7553E8]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#08BFD0]/15 rounded-full blur-3xl pointer-events-none" />
              
              {/* Window Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-gray-400 text-[11px]">lumixora.in/career-twin/live-preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00B987] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#00B987] uppercase tracking-wider">Active Intelligence Stream</span>
                </div>
              </div>

              {/* 3 Columns / Floating Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                {/* Panel 1: Career Readiness Score */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-4 hover:border-[#08BFD0]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Career Readiness</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00B987]/20 text-[#00B987]">Calculated</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white font-mono">78%</span>
                    <span className="text-xs text-gray-400 font-semibold">Tier 2: Drive Ready</span>
                  </div>
                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#7553E8] to-[#08BFD0] h-full w-[78%] rounded-full" />
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300 space-y-1">
                    <span className="font-bold text-white block">Target Career Path:</span>
                    <span className="text-[#08BFD0] font-semibold">Software Developer / Cloud SDE</span>
                  </div>
                </div>

                {/* Panel 2: Skill Intelligence Breakdown */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-3.5 hover:border-[#7553E8]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skill Intelligence</span>
                    <span className="text-[10px] text-gray-400 font-mono">4 Assessed Vectors</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-gray-300 mb-1">
                        <span>Problem Solving (DSA)</span>
                        <span className="text-[#08BFD0] font-mono">85%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#08BFD0] h-full w-[85%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-gray-300 mb-1">
                        <span>Programming Execution</span>
                        <span className="text-[#7553E8] font-mono">76%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#7553E8] h-full w-[76%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-gray-300 mb-1">
                        <span>Practical Projects</span>
                        <span className="text-[#00B987] font-mono">72%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00B987] h-full w-[72%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-gray-300 mb-1">
                        <span>Interview Communication</span>
                        <span className="text-amber-400 font-mono">62%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[62%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Placement Journey & Next Actions */}
                <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-3.5 hover:border-[#00B987]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Placement Journey</span>
                    <span className="text-[10px] text-[#00B987] font-bold">12 Milestones Built</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Core Java & SQL Grand Test Passed</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Project Milestone: Auth & API Verified</span>
                    </div>
                  </div>

                  {/* AI Recommendation Alert */}
                  <div className="p-3 rounded-xl bg-[#7553E8]/20 border border-[#7553E8]/30 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#08BFD0] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Recommendation
                    </span>
                    <p className="text-[11px] text-gray-200 leading-snug">
                      Improve communication and complete two practical projects before your next interview simulation.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── 3D CYBER HOLO-GLOBE & LIVE CAMPUS NETWORK ── */}
          <div className="mt-12 max-w-5xl mx-auto">
            <CyberHoloGlobe3D />
          </div>

        </div>
      </section>

      
      

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 02: THE PROBLEM — THE GAP BETWEEN LEARNING AND GETTING HIRED
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F4F6FB] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#7553E8]">Industry Disconnect</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101A35]">
              The Gap Between Learning and Getting Hired.
            </h2>
            <p className="text-sm sm:text-base text-[#101A35]/70">
              Students learn, complete courses and build projects. But the transition from academic learning to industry readiness is still disconnected.
            </p>
          </div>

          {/* 4 Problems Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:border-[#7553E8]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7553E8]/10 text-[#7553E8] flex items-center justify-center font-black">
                01
              </div>
              <h3 className="text-lg font-black text-[#101A35]">Learning without direction</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">What students experience:</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Students drown in random tutorial videos and quizzes, but don't know what to learn next to become competitive.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:border-[#08BFD0]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#08BFD0]/10 text-[#08BFD0] flex items-center justify-center font-black">
                02
              </div>
              <h3 className="text-lg font-black text-[#101A35]">Skills without proof</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">What students experience:</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Having completion certificates is no longer enough. Students cannot demonstrate actual capabilities or verified proof of code.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:border-amber-400/40 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center font-black">
                03
              </div>
              <h3 className="text-lg font-black text-[#101A35]">Preparation without strategy</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">What students experience:</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Blindly taking aptitude tests without knowing their core technical weaknesses or role-specific aptitude expectations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:border-[#00B987]/40 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00B987]/10 text-[#00B987] flex items-center justify-center font-black">
                04
              </div>
              <h3 className="text-lg font-black text-[#101A35]">Talent without visibility</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">What students experience:</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hardworking scholars across Tier-2/3 institutions struggle to reach employers because traditional resumes get filtered out.
              </p>
            </div>

          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#7553E8]/20 max-w-2xl mx-auto text-center shadow-xs">
            <span className="text-sm sm:text-base font-black text-[#101A35]">
              ✨ Lumixora connects every stage of the journey.
            </span>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 03: INTRODUCE LUMIXORA FLOW (One Journey. Five Powerful Stages)
      ───────────────────────────────────────────────────────────────── */}
      <section id="flow" className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#08BFD0]">System Architecture</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101A35]">
              One Journey. Five Powerful Stages.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              The continuous pipeline connecting student preparation to confirmed placement outcomes.
            </p>
          </div>

          {/* 5 Connected Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {/* Step 1: Learn */}
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#7553E8] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-mono font-bold text-[#7553E8]">01. STAGE</span>
                <h3 className="text-2xl font-black text-[#101A35] mt-1 group-hover:text-[#7553E8] transition-colors">LEARN</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Personalized learning, AI mentorship, academic curriculum resources, and structured foundational tracks.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#7553E8]">
                <span>Learnverse Engine</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 2: Build */}
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#08BFD0] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-mono font-bold text-[#08BFD0]">02. STAGE</span>
                <h3 className="text-2xl font-black text-[#101A35] mt-1 group-hover:text-[#08BFD0] transition-colors">BUILD</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Full-stack projects, Monaco coding practice, milestone tasks, and collaborative multi-campus workspaces.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#08BFD0]">
                <span>Build Studio</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 3: Prove */}
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#00B987] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-mono font-bold text-[#00B987]">03. STAGE</span>
                <h3 className="text-2xl font-black text-[#101A35] mt-1 group-hover:text-[#00B987] transition-colors">PROVE</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Grand diagnostic tests, verifiable GitHub repository reviews, tamper-proof certificates, and clean proctor audits.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#00B987]">
                <span>Proof of Skill</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 4: Prepare */}
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">04. STAGE</span>
                <h3 className="text-2xl font-black text-[#101A35] mt-1 group-hover:text-amber-500 transition-colors">PREPARE</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Aptitude drills, company-specific mock tests, AI speech fluency, and realistic technical interview simulations.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-amber-500">
                <span>Placement Radar</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Step 5: Connect */}
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#7553E8] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between group">
              <div>
                <span className="text-xs font-mono font-bold text-[#7553E8]">05. STAGE</span>
                <h3 className="text-2xl font-black text-[#101A35] mt-1 group-hover:text-[#7553E8] transition-colors">CONNECT</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Connect demonstrated candidate talent with institutional TPO drives, national hackathons, and corporate recruiters.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#7553E8]">
                <span>Connectverse</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 04: CAREER TWIN — SIGNATURE PRODUCT INNOVATION
      ───────────────────────────────────────────────────────────────── */}
      <section id="career-twin" className="py-20 md:py-32 bg-[#101A35] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 border-b border-white/10 pb-10">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#08BFD0]">Signature Product Experience</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Meet Your Career Twin.
              </h2>
              <p className="text-base text-gray-300">
                An evolving AI-powered representation of your professional capabilities. It continuously computes your readiness from genuine assessments, coding submissions, and project evidence.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {['Software Developer', 'Full Stack Engineer', 'AI / ML Engineer'].map((role) => (
                <button
                  key={role}
                  onClick={() => setCareerPath(role)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    careerPath === role ? 'bg-[#7553E8] text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Capabilities List */}
            <div className="lg:col-span-5 space-y-4">
              {[
                { title: "Dynamic Skill Profile", desc: "Live multi-dimensional competency vector that updates whenever you code or test." },
                { title: "Career Readiness Analytics", desc: "Real-time computed readiness score (0-100%) against verified corporate benchmarks." },
                { title: "Skill Gap Identification", desc: "Instantly flags algorithmic, architectural, or communication deficiencies." },
                { title: "Personalized Action Guidance", desc: "Pinpoints exactly which projects or test modules will boost your hiring tier." },
                { title: "Job-Role Compatibility", desc: "Direct matching to FAANG, high-growth unicorn, and enterprise hiring rubrics." },
                { title: "Evidence-Backed Portfolio", desc: "Replaces unverified resume buzzwords with verified GitHub and test proof." }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#08BFD0]/40 transition-colors">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#08BFD0]" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 pl-3.5">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Interactive Career Twin UI Simulation */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-black/60 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative">
                
                {/* Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7553E8] to-[#08BFD0] flex items-center justify-center font-black text-white text-base">
                      CT
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">Career Twin Preview</h4>
                      <span className="text-[11px] text-gray-400 font-mono">Target: {careerPath}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#00B987] font-mono">78%</span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Readiness</span>
                  </div>
                </div>

                {/* Interactive Competency Bars */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-bold uppercase tracking-wider">Assessed Competencies</span>
                    <span className="font-mono text-[11px]">Click to analyze</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Problem Solving', pct: 85, color: '#08BFD0' },
                      { name: 'Programming', pct: 76, color: '#7553E8' },
                      { name: 'Communication', pct: 62, color: '#F59E0B' },
                      { name: 'Projects', pct: 72, color: '#00B987' }
                    ].map(comp => (
                      <div
                        key={comp.name}
                        onClick={() => setActiveCompetency(comp.name)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          activeCompetency === comp.name 
                            ? 'bg-white/10 border-white/30 scale-[1.02]' 
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-gray-200">{comp.name}</span>
                          <span style={{ color: comp.color }} className="font-mono">{comp.pct}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div style={{ width: `${comp.pct}%`, backgroundColor: comp.color }} className="h-full rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Recommendation Card based on selected competency */}
                <div className="p-4 rounded-2xl bg-[#7553E8]/15 border border-[#7553E8]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-[#08BFD0] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Career Action ({activeCompetency})</span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {activeCompetency === 'Communication' && "Weakness detected in verbal pitch brevity. Practice 1 SpeakVerse daily session and complete your AI Mock Interview."}
                    {activeCompetency === 'Problem Solving' && "Strong logic foundation. Advance from Medium LeetCode tasks into Tree & Graph dynamic programming algorithms."}
                    {activeCompetency === 'Programming' && "Clean syntax structure. Integrate Docker and automated CI/CD pipeline milestones into your Build Studio repository."}
                    {activeCompetency === 'Projects' && "Good progress. Submit your deployed live URL and verified GitHub commit trail for the 'Verified Ship' badge."}
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 05: AI-POWERED MENTORSHIP (Interactive demo)
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#FAFBFF] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#7553E8]">Always-On Intelligence</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101A35]">
              An Intelligent Mentor. Available Throughout Your Journey.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Not just another chatbot. An AI mentor that helps students understand, practice, improve, and progress.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Features Showcase */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { title: "Instant Doubt Resolution", desc: "Break down complex STEM and core engineering topics step-by-step." },
                { title: "Code Debugging & Explanations", desc: "Highlight runtime complexity bugs and syntax errors directly in Monaco editor." },
                { title: "Personalized Learning Paths", desc: "Adapts to your current pace and recommends targeted sessional study notes." },
                { title: "AI-Generated Practice Questions", desc: "Company-aligned MCQs and coding challenges refreshed daily." },
                { title: "Academic Assistance", desc: "Syllabus tracking across engineering departments (CSE, ECE, Mech, Civil)." },
                { title: "Interview Preparation", desc: "Real-time speech evaluation and behavioral interview feedback." }
              ].map((f, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:border-[#7553E8]/40 transition-colors">
                  <h4 className="text-sm font-black text-[#101A35] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#7553E8] shrink-0" />
                    <span>{f.title}</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 pl-6">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Interactive Live Chat Simulation */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col h-[480px]">
                
                {/* Chat Header */}
                <div className="p-4 bg-[#0A0F1D] text-white flex items-center justify-between border-b border-white/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Realistic3DLogo size="sm" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00B987] border-2 border-[#0A0F1D] animate-pulse z-20" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold tracking-normal font-sans flex items-center gap-2">
                        <span>Lumixora AI Career Mentor</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#7553E8]/20 text-[#08BFD0] font-mono font-medium border border-[#7553E8]/30">v2.5</span>
                      </h4>
                      <span className="text-[11px] text-[#00B987] flex items-center gap-1 font-medium font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00B987]" /> Autonomous Career Twin Agent
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      Live Simulation
                    </span>
                  </div>
                </div>

                {/* Chat Log */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-[#F8FAFD] font-sans">
                  {mentorHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex items-end gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {m.sender !== 'user' && (
                        <Realistic3DLogo size="xs" interactive={false} showGlow={false} />
                      )}
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl text-[13px] sm:text-sm font-normal font-sans leading-relaxed tracking-normal break-words ${
                          m.sender === 'user'
                            ? 'bg-[#101A35] text-white rounded-br-none shadow-sm font-medium'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs'
                        }`}
                        style={{ letterSpacing: 'normal', fontFeatureSettings: '"kern" 1' }}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isMentorTyping && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-bl-none text-xs text-gray-500 flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-[#7553E8] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#08BFD0] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-[#00B987] animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleMentorSend} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    placeholder="Ask about your Career Twin, algorithms, or interview tips..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#7553E8]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-[#7553E8] hover:bg-[#5f3fd6] text-white cursor-pointer transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 06: GAMIFIED LEARNING ECOSYSTEM (Make Progress Feel Like Progress)
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00B987]">Gamified Engagement</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101A35]">
              Make Progress Feel Like Progress.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Encourage consistent improvement, not meaningless points collection. Rewards in Lumixora are tied directly to genuine skill mastery and placement readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-[#101A35]">Daily & Weekly Missions</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Structured quests like "Solve 2 Code Arena problems" or "Review 1 Sessional paper" that build daily habits.
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                +45 to +120 AP
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-[#7553E8]/10 text-[#7553E8] flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-[#101A35]">XP, Levels & Streaks</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Earn Aura Points (AP) and Synaptic Coins (SC) that unlock placement masterclasses and premium AI interview simulations.
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-[#7553E8] bg-[#7553E8]/10 px-2 py-0.5 rounded-md">
                Tier Progression
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-[#08BFD0]/10 text-[#08BFD0] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-[#101A35]">17 Verifiable Badges</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Milestones like "Verified Ship", "Clean Proctor", and "Algorithm Master" that can be verified by employers.
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-[#08BFD0] bg-[#08BFD0]/10 px-2 py-0.5 rounded-md">
                Cryptographic Proof
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-[#00B987]/10 text-[#00B987] flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-[#101A35]">Campus Leaderboards</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Healthy peer benchmarking across colleges (GPREC, Ashoka) filtered by department, year, and test speed.
              </p>
              <span className="inline-block text-[10px] font-mono font-bold text-[#00B987] bg-[#00B987]/10 px-2 py-0.5 rounded-md">
                Institutional Rank
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 07: PLACEMENT INTELLIGENCE (Preparation that knows where you're headed)
      ───────────────────────────────────────────────────────────────── */}
      <section id="placement-intelligence" className="py-20 md:py-32 bg-[#101A35] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#08BFD0]">Corporate Readiness</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Preparation That Knows Where You're Headed.
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              Lumixora brings every important component of placement preparation into one connected environment.
            </p>
          </div>

          {/* 7 Components Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { component: "Aptitude Drills", experience: "Quantitative, logical, and verbal practice tests with detailed time analysis." },
              { component: "Coding Practice", experience: "DSA, programming languages, and live execution in the Monaco compiler." },
              { component: "Core Technical", experience: "OS, DBMS, Computer Networks, and System Design subject preparation." },
              { component: "Communication", experience: "English fluency, pronunciation, and pitch clarity via SpeakVerse audio engine." },
              { component: "AI Mock Interviews", experience: "Realistic video & voice simulations with automated transcript scoring." },
              { component: "Resume Intelligence", experience: "ATS resume scoring, bullet point optimization, and job-match benchmarking." },
              { component: "Company Tracks", experience: "TCS, Infosys, Amazon, and Google specific past interview papers and patterns." }
            ].map((c, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#08BFD0]/50 transition-all space-y-2">
                <span className="text-xs font-mono font-bold text-[#08BFD0]">0{idx + 1}. COMPONENT</span>
                <h4 className="text-lg font-black text-white">{c.component}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{c.experience}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 08: BUILD-TO-PROVE STUDIO (Don't Just Complete Courses. Build Something That Matters)
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#7553E8]">Practical Mastery</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101A35]">
              Don't Just Complete Courses. Build Something That Matters.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Students convert theoretical knowledge into demonstrable evidence that employers can actually evaluate.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 text-center">
            {[
              { icon: Compass, title: "Project Roadmaps" },
              { icon: Target, title: "Milestone Tracking" },
              { icon: Terminal, title: "Coding Workspaces" },
              { icon: Code, title: "GitHub Integration" },
              { icon: Users, title: "Peer Collaboration" },
              { icon: Activity, title: "Project Reviews" },
              { icon: Globe, title: "Portfolio Generation" }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAFBFF] border border-gray-200/80 space-y-2 hover:border-[#7553E8] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto text-[#7553E8] shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#101A35]">{p.title}</h4>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION: CAMPUS AMBASSADOR SHOWCASE (Key Previous Feature Preserved)
      ───────────────────────────────────────────────────────────────── */}
      <section id="campus-ambassador" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-[#181524] via-[#10101b] to-[#1c1410] rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden text-white">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#08BFD0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cohort 1 Recruitment Active · No Login Needed</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Lead Lumixora at Your Campus 🌟
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Join the official Lumixora Campus Ambassador Program 2026. Represent your college, drive AI innovation, gain direct 1-on-1 founder mentorship, and earn verified leadership credentials from Vyomra.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => setShowAmbassadorModal(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-black" />
                  <span>Apply Now (Free · 2 Mins)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 hover:border-amber-400/50 transition-all space-y-1.5">
                <span className="text-2xl">📜</span>
                <h4 className="font-extrabold text-white text-xs sm:text-sm">Official Experience Letter</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">Verified certificate & leadership credentials from Lumixora (by Vyomra).</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#08BFD0]/20 hover:border-[#08BFD0]/50 transition-all space-y-1.5">
                <span className="text-2xl">🌟</span>
                <h4 className="font-extrabold text-white text-xs sm:text-sm">Founder Mentorship</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">Direct weekly sessions with Founder Shaik Sowban on AI & engineering.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-500/20 hover:border-purple-400/50 transition-all space-y-1.5">
                <span className="text-2xl">🤝</span>
                <h4 className="font-extrabold text-white text-xs sm:text-sm">Inter-College Network</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">Connect across GPREC, VIT-AP, Ashoka & expanding national campuses.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#00B987]/20 hover:border-[#00B987]/50 transition-all space-y-1.5">
                <span className="text-2xl">💎</span>
                <h4 className="font-extrabold text-white text-xs sm:text-sm">LOR & Free AI Pro</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">Letter of Recommendation for top 10% + 10,000 Synaptic Coins.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 09: THREE CONNECTED ECOSYSTEMS (One Ecosystem. Three Powerful Perspectives)
      ───────────────────────────────────────────────────────────────── */}
      <section id="ecosystems" className="py-20 md:py-32 bg-[#F4F6FB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#08BFD0]">Unified Platform</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101A35]">
              One Ecosystem. Three Powerful Perspectives.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Transforming potential into proof for students, colleges, and hiring partners.
            </p>
          </div>

          {/* 3 Audience Perspective Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* For Students */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#7553E8] transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7553E8]/10 text-[#7553E8] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#101A35]">For Students</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Build demonstrable skills, develop verified projects, track readiness with your Career Twin, prepare for placements, and showcase capabilities directly to companies.
                </p>
              </div>
              <button
                onClick={() => handleAuth('student')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#08BFD0]" />
              </button>
            </div>

            {/* For Colleges */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#08BFD0] transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#08BFD0]/10 text-[#08BFD0] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#101A35]">For Colleges</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monitor student skill progression, identify departmental bottlenecks, conduct automated proctored assessments, and boost institution placement metrics with granular analytics.
                </p>
              </div>
              <button
                onClick={() => handleAuth('faculty')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FAFBFF] border border-gray-300 hover:border-[#08BFD0] text-[#101A35] font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Explore Institutional Solutions</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#08BFD0]" />
              </button>
            </div>

            {/* For Employers */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#00B987] transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00B987]/10 text-[#00B987] flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#101A35]">For Employers</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Discover pre-vetted campus talent through actual code submissions, test marks, and verified project evidence rather than filtering fabricated resumes.
                </p>
              </div>
              <button
                onClick={() => handleAuth('student')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#00B987] hover:bg-[#009e73] text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Discover Talent</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 10: PRODUCT ECOSYSTEM SHOWCASE (Learnverse, Codeverse, etc.)
      ───────────────────────────────────────────────────────────────── */}
      <section id="ecosystem-modules" className="py-20 md:py-32 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#7553E8]">Interconnected Modules</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101A35]">
              The Lumixora Ecosystem.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Seamlessly connecting each stage of preparation into one cohesive experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#7553E8] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7553E8] block">Module 01</span>
                <h4 className="text-lg font-black text-[#101A35]">LEARNVERSE</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Learning resources, AI mentorship, academic support, and personalized study journeys.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#7553E8]">Academic Intelligence</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#08BFD0] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#08BFD0] block">Module 02</span>
                <h4 className="text-lg font-black text-[#101A35]">CODEVERSE</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Interactive coding practice, programming challenges, and live Monaco execution.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#08BFD0]">Code Arena Engine</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#00B987] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00B987] block">Module 03</span>
                <h4 className="text-lg font-black text-[#101A35]">BUILDVERSE</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Real projects, practical implementation, milestone tasks, and portfolio development.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#00B987]">Build Studio</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">Module 04</span>
                <h4 className="text-lg font-black text-[#101A35]">CAREERVERSE</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Target career paths, AI interview preparation, and placement intelligence dashboards.
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-500">Career Twin Engine</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAFBFF] border border-gray-200 hover:border-[#7553E8] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7553E8] block">Module 05</span>
                <h4 className="text-lg font-black text-[#101A35]">CONNECTVERSE</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Verified internships, multi-campus hackathons, squad recruitment, and employer connections.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#7553E8]">Talent Network</span>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 11: TRUST AND CREDIBILITY (Built Around Real Progress)
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F4F6FB] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#00B987]">Authentic Evidence</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#101A35]">
              Built Around Real Progress. Designed for Real Opportunities.
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              No invented placement statistics or fabricated testimonials. Every metric reflects authentic student achievements and institutional milestones.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
              <span className="text-4xl font-black text-[#101A35] font-mono block tracking-tight">
                {liveStats.usersCount ? `${liveStats.usersCount}+` : '450+'}
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                Live Registered Scholars
              </span>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
              <span className="text-4xl font-black text-[#7553E8] font-mono block tracking-tight">
                {liveStats.notesCount ? `${liveStats.notesCount.toLocaleString()}+` : '1,195+'}
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                Verified Notes & Units
              </span>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
              <span className="text-4xl font-black text-[#08BFD0] font-mono block tracking-tight">
                24/7
              </span>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                AI Career Copilot & Compiler
              </span>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#00B987] font-mono block tracking-tight">
                {liveStats.collegesCount ? `${liveStats.collegesCount}+` : '7+'}
              </span>
              <span className="text-xs font-black text-[#00B987] uppercase tracking-wider mt-0.5 block">
                Campuses
              </span>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-1.5 block">
                {liveStats.campusesLabel}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 12: FOUNDER AND MISSION (A short, authentic founder story)
      ───────────────────────────────────────────────────────────────── */}
      <section id="founder" className="py-20 md:py-28 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#101A35] text-white border border-white/10 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            
            <div className="w-52 h-52 sm:w-64 sm:h-64 shrink-0 relative group flex items-center justify-center">
              {/* Soft ambient glowing aura perfectly matching the neon ring */}
              <div className="absolute inset-4 bg-gradient-to-tr from-[#7553E8]/50 via-[#08BFD0]/40 to-[#00B987]/40 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 pointer-events-none" />
              <img
                src="/founder.png"
                alt="Shaik Sowban - Founder"
                className="w-full h-full object-contain relative z-10 select-none transform transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_20px_40px_rgba(8,191,208,0.4)]"
                onError={(e) => { e.target.src = '/favicon.png'; }}
              />
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#08BFD0]">
                <span>Founder & Mission</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                A Vision to Transform How Students Become Industry-Ready.
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Lumixora is built on a simple belief: every student deserves the opportunity to develop their capabilities, demonstrate their potential, and access meaningful career opportunities without being held back by credential bias.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-400 font-mono">
                <span className="font-bold text-white">Shaik Sowban</span>
                <span>•</span>
                <span>Founder & Chief Architect</span>
                <span>•</span>
                <span className="text-[#08BFD0]">A Product of VYOMRA</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowTeamPortal(true)}
                  className="text-xs font-extrabold text-[#7553E8] hover:text-[#08BFD0] transition-colors underline cursor-pointer"
                >
                  Meet our Full Engineering & Research Team &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION: FREQUENTLY ASKED QUESTIONS (Preserved from previous version)
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F4F6FB] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#7553E8]">Got Questions?</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#101A35]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl bg-white border border-gray-200/80 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-black text-sm text-[#101A35] flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[#7553E8]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#FAFBFF]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Institutional Contact Bar */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center text-xs text-gray-600">
            <span>Want your college or engineering campus onboarded? Email our founders directly at </span>
            <a href="mailto:lumixora.team@gmail.com" className="font-bold text-[#7553E8] hover:underline font-mono">
              lumixora.team@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 13: FINAL CONVERSION & CALL TO ACTION
      ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-[#FAFBFF] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#7553E8]/20 shadow-xs text-xs font-black uppercase tracking-wider text-[#7553E8]">
            <Sparkle className="w-3.5 h-3.5" />
            <span>Your Future Starts Here</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-black text-[#101A35] tracking-tight">
            Your Future Won't Build Itself.
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start building the skills, evidence and confidence that move your career forward. Your journey starts with Lumixora.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleAuth('student')}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#101A35] hover:bg-[#1E2E5D] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 text-[#08BFD0]" />
            </button>
            <button
              onClick={() => handleAuth('faculty')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-300 text-[#101A35] font-extrabold text-sm transition-colors cursor-pointer"
            >
              For Institutions & Colleges
            </button>
          </div>

          <p className="text-xs text-gray-500 font-semibold pt-2">
            Learn. Build. Prove. Prepare. Connect.
          </p>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          FOOTER DESIGN
      ───────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#101A35] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Col 1 & 2: Brand & Mission */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Realistic3DLogo size="md" />
                <div>
                  <span className="text-xl font-black text-white font-sora block">LUMIXORA</span>
                  <span className="text-[9px] font-bold tracking-widest text-[#08BFD0] uppercase block -mt-0.5">A Product of VYOMRA</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
                An intelligent career development ecosystem transforming learning into capabilities and capabilities into opportunities.
              </p>
              <span className="text-xs text-[#08BFD0] font-mono block">Connecting the future.</span>
            </div>

            {/* Col 3: Platform Modules */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">Platform</h5>
              <ul className="space-y-2 text-xs text-gray-300 font-medium">
                <li><a href="#ecosystem-modules" className="hover:text-white transition-colors">Learnverse</a></li>
                <li><a href="#ecosystem-modules" className="hover:text-white transition-colors">Codeverse</a></li>
                <li><a href="#ecosystem-modules" className="hover:text-white transition-colors">Buildverse</a></li>
                <li><a href="#career-twin" className="hover:text-white transition-colors">Careerverse</a></li>
                <li><a href="#ecosystems" className="hover:text-white transition-colors">Connectverse</a></li>
              </ul>
            </div>

            {/* Col 4: Explore */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">Explore</h5>
              <ul className="space-y-2 text-xs text-gray-300 font-medium">
                <li><button onClick={() => handleAuth('student')} className="hover:text-white transition-colors cursor-pointer">For Students</button></li>
                <li><button onClick={() => handleAuth('faculty')} className="hover:text-white transition-colors cursor-pointer">For Colleges</button></li>
                <li><a href="https://tpo.lumixora.in" className="hover:text-amber-300 text-amber-200 transition-colors">TPO & Faculty Portal (tpo.lumixora.in)</a></li>
                <li><button onClick={() => handleAuth('student')} className="hover:text-white transition-colors cursor-pointer">For Employers</button></li>
                <li><button onClick={() => setShowAmbassadorModal(true)} className="hover:text-amber-400 transition-colors cursor-pointer text-amber-300">Campus Ambassador</button></li>
                <li><button onClick={() => setShowTeamPortal(true)} className="hover:text-white transition-colors cursor-pointer">Our Team</button></li>
                <li><a href="mailto:lumixora.team@gmail.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Col 5: Legal & College Access */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400">Institutional Access</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                Add your engineering college or university workspace to Lumixora.
              </p>
              <a
                href="mailto:lumixora.team@gmail.com?subject=College%20Partnership%20Inquiry%20-%20Lumixora"
                className="inline-block text-xs font-bold text-[#08BFD0] hover:underline"
              >
                lumixora.team@gmail.com &rarr;
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
            <p>LUMIXORA — A product of VYOMRA</p>
            <p>© 2026 Lumixora. All rights reserved.</p>
          </div>

        </div>
      </footer>

      {/* Campus Ambassador Modal if URL hash trigger or button click */}
      {showAmbassadorModal && (
        <CampusAmbassadorModal onClose={() => setShowAmbassadorModal(false)} />
      )}

    </div>
  );
}

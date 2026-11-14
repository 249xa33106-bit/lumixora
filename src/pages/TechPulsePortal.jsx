import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, Newspaper, Briefcase, TrendingUp, Flame, DollarSign, 
  ExternalLink, Bookmark, BookmarkCheck, Search, Filter, Clock, 
  Sparkles, Share2, Building2, MapPin, Award, CheckCircle2, Code2, 
  Cpu, Globe, RefreshCw, SlidersHorizontal, Layers, ArrowUpRight, 
  ChevronRight, AlertCircle, Check, Users, ShieldCheck, Zap,
  Copy, Terminal, Calculator, ArrowRight, Star, Target, Compass, X,
  Radio, Rocket, ChevronDown, CheckSquare, Info, BarChart2, Play,
  Calendar, Lock, Shield, Send, BellRing, Bell, Atom, CheckCheck, Trophy
} from 'lucide-react';
import { 
  INITIAL_TECH_JOBS, 
  INITIAL_TECH_NEWS, 
  SALARY_HIKES_RADAR, 
  TRENDING_TECH_STACKS, 
  LAYOFFS_VS_HIRING_STATS,
  MARQUEE_ALERTS
} from '../data/techPulseData';
import { ALL_TECH_JOBS_DIRECTORY } from '../data/techJobsDirectory';
import { getSavedBookmarks, saveBookmarkItem } from '../services/techNewsService';
import { useToast } from '../context/ToastContext';

export default function TechPulsePortal({ user, setActiveTab, onNavigate }) {
  const { addToast } = useToast();

  // Navigation views: 'overview' | 'news' | 'jobs' | 'salary' | 'stacks' | 'trends' | 'companies'
  const [activeView, setActiveView] = useState('overview');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpFilter, setSelectedExpFilter] = useState('ALL');
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedStackFilter, setSelectedStackFilter] = useState(null);

  // Live data state
  const [liveNews, setLiveNews] = useState(INITIAL_TECH_NEWS);
  const [jobsList, setJobsList] = useState(ALL_TECH_JOBS_DIRECTORY);
  const [bookmarks, setBookmarks] = useState(getSavedBookmarks);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('2 min ago');

  // Carousel dot state
  const [activeSlide, setActiveSlide] = useState(0);

  // Modals state
  const [selectedNewsArticle, setSelectedNewsArticle] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [showCareerScoreModal, setShowCareerScoreModal] = useState(false);

  // Salary Calculator State
  const [calcSourceRole, setCalcSourceRole] = useState('fresher_services');
  const [calcTargetRole, setCalcTargetRole] = useState('product_sde1');

  // Handle refresh / sync
  const handleSyncData = () => {
    setIsSyncing(true);
    addToast({ message: 'Syncing live tech intelligence & campus recruitment radar...', type: 'info' });
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime('Just now');
      addToast({ message: 'TechPulse observatory synchronized with live market feeds.', type: 'success' });
    }, 800);
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (item, e) => {
    if (e) e.stopPropagation();
    const updated = saveBookmarkItem(item);
    setBookmarks(updated);
    const isSaved = updated.some(b => b.id === item.id);
    addToast({ 
      message: isSaved ? `Saved "${item.title || item.company}" to bookmarks` : `Removed "${item.title || item.company}" from bookmarks`, 
      type: isSaved ? 'success' : 'info' 
    });
  };

  const isItemBookmarked = (id) => bookmarks.some(b => b.id === id);

  // Top featured jobs strictly matching the reference layout
  const topFeaturedJobs = useMemo(() => [
    {
      id: 'job_google_featured',
      company: 'Google',
      logo: 'https://www.google.com/favicon.ico',
      role: 'Software Engineer',
      isVerified: true,
      tag: 'Full Time',
      location: 'Bengaluru, Karnataka • Full Time',
      ctc: '₹20 – 40 LPA',
      batch: '2025 Batch',
      deadline: 'Apr 25, 2025',
      applyUrl: 'https://careers.google.com/jobs/results/?q=software%20engineer%20university%20graduate'
    },
    {
      id: 'job_microsoft_featured',
      company: 'Microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      role: 'SDE Intern',
      isVerified: true,
      tag: 'Internship',
      location: 'Hyderabad, Telangana • Internship',
      ctc: '₹1 – 2 LPA',
      batch: '2026 Batch',
      deadline: 'Apr 28, 2025',
      applyUrl: 'https://careers.microsoft.com/professionals/us/en/search-results?keywords=software%20engineer%20intern'
    },
    {
      id: 'job_amazon_featured',
      company: 'Amazon',
      logo: 'https://www.amazon.com/favicon.ico',
      role: 'Software Development Engineer',
      isVerified: true,
      tag: 'Full Time',
      location: 'Bengaluru, Karnataka • Full Time',
      ctc: '₹28 – 45 LPA',
      batch: '2025 Batch',
      deadline: 'Apr 30, 2025',
      applyUrl: 'https://amazon.jobs/en/job_categories/software-development'
    }
  ], []);

  // Filtered jobs directory
  const filteredJobs = useMemo(() => {
    return jobsList.filter(job => {
      const matchSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchTier = selectedTierFilter === 'ALL' || (job.salaryTier && job.salaryTier.includes(selectedTierFilter));
      const matchBatch = selectedBatchFilter === 'ALL' || (job.batch && job.batch.includes(selectedBatchFilter));
      const matchStack = !selectedStackFilter || (job.tags && job.tags.some(t => t.toLowerCase().includes(selectedStackFilter.toLowerCase())));

      return matchSearch && matchTier && matchBatch && matchStack;
    });
  }, [jobsList, searchQuery, selectedTierFilter, selectedBatchFilter, selectedStackFilter]);

  return (
    <div className="w-full flex flex-col gap-6 font-sans">

      {/* ========================================================= */}
      {/* 1. ASYMMETRIC TOP ROW: EDITORIAL HERO (70%) + MARKET PULSE (30%) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ======================================================= */}
        {/* HERO CARD (LG COL-SPAN 8)                               */}
        {/* ======================================================= */}
        <div className="lg:col-span-8 bg-gradient-to-r from-blue-50/90 via-sky-50/40 to-white border border-blue-100/90 rounded-3xl p-6 md:p-7 shadow-xs relative overflow-hidden flex flex-col justify-between">
          
          {/* Top Row: TechPulse Badge + Subtitle & Live Status */}
          <div className="flex items-center justify-between gap-3 z-10">
            {/* TechPulse Brand Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  TechPulse<span className="text-blue-600 font-bold">™</span>
                </h2>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Intelligence • Opportunities • Insights
                </span>
              </div>
            </div>

            {/* Live Updates & Sync Status */}
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Updates</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Last synced: {lastSyncedTime}
              </span>
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="w-7 h-7 rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-2xs"
                title="Refresh live intelligence"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              </button>
            </div>
          </div>

          {/* Center Copy: Explore • Grow • Get Hired + Headline + CTAs */}
          <div className="max-w-md z-10 flex flex-col gap-2.5 my-5">
            {/* Pill Tag */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-600/10 text-blue-700 border border-blue-200/80 rounded-full text-[11px] font-bold w-fit">
              Explore • Grow • Get Hired
            </div>

            {/* Headline */}
            <h1 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Exploring Tomorrow,<br />
              <span className="text-blue-600">Together.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-sm">
              Real-time tech insights, career opportunities and industry trends — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const el = document.getElementById('techpulse-news-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore TechPulse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowOverviewModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs md:text-sm border border-slate-200/90 shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-slate-600" />
                <span>Watch Overview</span>
              </button>
            </div>
          </div>

          {/* Architectural Campus Building & Student Image (Right Side - cleanly positioned below header) */}
          <div className="mt-4 md:mt-0 md:absolute md:right-4 md:bottom-3 md:top-24 md:w-5/12 flex items-end justify-end pointer-events-none opacity-90 md:opacity-100 z-0">
            <div className="relative w-full h-full flex items-end justify-end overflow-hidden">
              <img
                src="/techpulse-architectural-hero.png"
                alt="Tech campus building"
                className="max-h-40 md:max-h-48 object-contain object-right-bottom drop-shadow-sm"
              />
            </div>
          </div>

          {/* Interactive Carousel Slider Dots at Bottom */}
          <div className="flex items-center gap-1.5 z-10 pt-1">
            {[0, 1, 2, 3, 4].map(idx => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx ? 'bg-blue-600 w-4' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ======================================================= */}
        {/* TECH MARKET PULSE PANEL (LG COL-SPAN 4)                 */}
        {/* ======================================================= */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            {/* Header: Icon + Title + View Details */}
            <div className="flex items-center justify-between text-slate-900 font-bold text-sm">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600 stroke-2.5" />
                <span>Tech Market Pulse</span>
              </div>
              <button 
                onClick={() => setActiveView('trends')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Growth Stat + Tooltip at peak */}
            <div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight leading-none">
                  +28%
                </div>
                <div className="bg-[#0B1528] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                  +28%
                </div>
              </div>
              <div className="text-xs font-medium text-slate-500 mt-1">
                Growth in Campus Tech Hires
              </div>
            </div>

            {/* Wave Trend Curve with Peak Tooltip & Dots */}
            <div className="relative h-22 w-full my-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 65">
                <defs>
                  <linearGradient id="marketCurveGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 5,55 Q 35,50 65,38 T 120,20 T 175,10 T 195,5 L 195,65 L 5,65 Z"
                  fill="url(#marketCurveGrad2)"
                />
                <path
                  d="M 5,55 Q 35,50 65,38 T 120,20 T 175,10 T 195,5"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                {[
                  { x: 5, y: 55 },
                  { x: 45, y: 48 },
                  { x: 90, y: 32 },
                  { x: 135, y: 18 },
                  { x: 175, y: 10 },
                  { x: 195, y: 5 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r={i === 5 ? 4 : 2.5} fill="#2563EB" stroke="#FFFFFF" strokeWidth={1.5} />
                ))}
              </svg>
            </div>
          </div>

          {/* Top Hiring Companies Row */}
          <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
            <span className="font-bold text-slate-800 text-xs">Top Hiring Companies</span>

            {/* Logos Row: Google, Microsoft, Amazon, Meta, Apple */}
            <div className="flex items-center justify-between gap-2">
              {/* Google */}
              <div 
                onClick={() => setActiveView('companies')}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs group"
                title="Google • 45 Campus Openings"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>

              {/* Microsoft */}
              <div 
                onClick={() => setActiveView('companies')}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs group"
                title="Microsoft • 38 Campus Openings"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                  <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                  <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                  <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                </svg>
              </div>

              {/* Amazon */}
              <div 
                onClick={() => setActiveView('companies')}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs group font-black text-slate-800 text-sm"
                title="Amazon • 52 Campus Openings"
              >
                <span className="group-hover:scale-110 transition-transform font-mono">a</span>
              </div>

              {/* Meta */}
              <div 
                onClick={() => setActiveView('companies')}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs group text-[#0081FB]"
                title="Meta • 24 Campus Openings"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.021C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </div>

              {/* Apple */}
              <div 
                onClick={() => setActiveView('companies')}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs group text-slate-900"
                title="Apple • 18 Campus Openings"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.98 1.7-0.86 2.72 1.01.08 2.03-.51 2.56-1.22z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HORIZONTAL NAVIGATION PILL BAR                          */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Tech News', icon: Newspaper },
          { id: 'jobs', label: 'Job Drives', icon: Briefcase },
          { id: 'salary', label: 'Salary Insights', icon: TrendingUp },
          { id: 'stacks', label: 'Trending Stacks', icon: Code2 },
          { id: 'trends', label: 'Hiring Trends', icon: Users },
          { id: 'companies', label: 'Company Insights', icon: Building2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN ASYMMETRIC CONTENT AREA (OVERVIEW MODE)            */}
      {/* ========================================================= */}
      {activeView === 'overview' && (
        <div id="techpulse-news-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: News Editorial + Compact Job Rows (65%)    */}
          {/* ======================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* SECTION A: Latest Tech News (Visual Storytelling) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Latest Tech News
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('news')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All News</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Asymmetric Editorial News Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                
                {/* 1. Large Featured Article (Left 60% - Col 7) with Dark Circuit + Glowing OpenAI Logo */}
                <div
                  onClick={() => setSelectedNewsArticle({
                    title: 'OpenAI Unveils GPT-5: A New Era of AI Reasoning',
                    category: 'Artificial Intelligence',
                    source: 'TechCrunch',
                    time: '2h ago',
                    image: '/techpulse-openai-feature.png',
                    content: 'OpenAI has officially launched GPT-5, bringing significant improvements in reasoning, autonomous software synthesis, and system verification. Smarter, more helpful, and more reliable — GPT-5 sets a new benchmark in artificial intelligence.'
                  })}
                  className="md:col-span-7 bg-[#0B1528] text-white border border-slate-800 hover:border-blue-500/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group min-h-[190px]"
                >
                  {/* Glowing Flower Logo on Right */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-32 h-32 opacity-90 group-hover:scale-105 transition-transform duration-300 pointer-events-none">
                    <img
                      src="/techpulse-openai-feature.png"
                      alt="OpenAI Glowing Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Top Badge */}
                  <div className="z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                      <Star className="w-2.5 h-2.5 fill-purple-300" />
                      <span>Artificial Intelligence</span>
                    </span>
                  </div>

                  {/* Headline & Description */}
                  <div className="z-10 max-w-[270px] space-y-1.5 my-2">
                    <h4 className="text-base font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                      OpenAI Unveils GPT-5:<br />A New Era of AI Reasoning
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      Smarter, more helpful, and more reliable — GPT-5 sets a new benchmark in AI.
                    </p>
                  </div>

                  {/* Bottom Meta & Arrow */}
                  <div className="z-10 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-medium">
                      2h ago • TechCrunch
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-2xs">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* 2. Two Stacked Supporting Stories (Right 40% - Col 5) */}
                <div className="md:col-span-5 flex flex-col justify-between gap-3">
                  
                  {/* Supporting Story 1: Google */}
                  <div
                    onClick={() => setSelectedNewsArticle({
                      title: 'Google Expands Gemini Ecosystem with New Tools',
                      category: 'Tech Industry',
                      source: 'The Verge',
                      time: '3h ago',
                      image: '/techpulse-google-new.png',
                      content: 'Google announced major tooling expansions across the Gemini AI developer ecosystem, introducing high-speed multimodal context caching and subsidized Vertex AI credits for university computer science engineering students in India.'
                    })}
                    className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-3 group flex-1"
                  >
                    <div className="w-16 h-15 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src="/techpulse-google-new.png"
                        alt="Google campus"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Tech Industry
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors leading-tight mt-1">
                        Google Expands Gemini Ecosystem with New Tools
                      </h5>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        3h ago • The Verge
                      </div>
                    </div>
                  </div>

                  {/* Supporting Story 2: Microsoft */}
                  <div
                    onClick={() => setSelectedNewsArticle({
                      title: 'Microsoft Boosts AI Hiring in 2025',
                      category: 'Microsoft',
                      source: 'Business Insider',
                      time: '5h ago',
                      image: '/techpulse-msft-new.png',
                      content: 'Microsoft reported an acceleration in campus hiring for cloud infrastructure, security, and AI Copilot engineering teams across its Hyderabad and Bengaluru R&D campuses.'
                    })}
                    className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-3 group flex-1"
                  >
                    <div className="w-16 h-15 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src="/techpulse-msft-new.png"
                        alt="Microsoft campus"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Microsoft
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors leading-tight mt-1">
                        Microsoft Boosts AI Hiring in 2025
                      </h5>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        5h ago • Business Insider
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SECTION B: Verified Tech Jobs & Off-Campus Drives (Compact Data Rows) */}
            <div className="flex flex-col gap-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Verified Tech Jobs & Off-Campus Drives</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      1.2k+ Live Opportunities
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('jobs')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Jobs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Compact Premium Data Rows */}
              <div className="flex flex-col gap-2.5">
                {topFeaturedJobs.map(job => {
                  const bookmarked = isItemBookmarked(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobDetail(job)}
                      className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-3 md:px-4.5 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group"
                    >
                      {/* Left: Logo + Role + Location + Badges */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Company Logo Container */}
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 p-2 shadow-2xs">
                          {job.company === 'Google' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                          )}
                          {job.company === 'Microsoft' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                              <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                              <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                              <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                            </svg>
                          )}
                          {job.company === 'Amazon' && (
                            <span className="font-mono font-bold text-slate-800 text-base">a</span>
                          )}
                        </div>

                        {/* Title, Badges & Location */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {job.role}
                            </h4>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: CTC & Batch */}
                      <div className="flex items-center gap-6 justify-between md:justify-end text-xs">
                        <div className="text-left md:text-right">
                          <div className="font-extrabold text-slate-900 text-xs md:text-sm">
                            {job.ctc}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {job.batch}
                          </div>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          <span>{job.deadline}</span>
                        </div>

                        {/* Actions: Apply Now + Bookmark */}
                        <div className="flex items-center gap-2">
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <span>Apply Now</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>

                          <button
                            onClick={(e) => handleToggleBookmark(job, e)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              bookmarked 
                                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                            title={bookmarked ? 'Saved' : 'Bookmark'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: Career Intelligence + Trending Stacks (35%)*/}
          {/* ======================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* CARD 1: Your Tech Career Score (with Recommendations & Rocket) */}
            <div className="bg-[#0B1528] text-white border border-slate-800 rounded-3xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
              
              {/* Rocket graphic on bottom right */}
              <div className="absolute -bottom-2 -right-2 w-28 h-28 pointer-events-none opacity-85">
                <img
                  src="/techpulse-career-rocket.png"
                  alt="Rocket Launch"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                {/* Header */}
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="tracking-tight text-white font-bold">Your Tech Career Score</span>
                </div>

                {/* Score & Circular Gauge Layout */}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3.5xl font-black text-white tracking-tight">
                        92
                      </span>
                      <span className="text-slate-400 text-base font-bold">/100</span>
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ↑ +5%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      You're in the top 10% of placement-ready students!
                    </p>
                  </div>

                  {/* Circular Radial Gauge with Star */}
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        strokeDasharray="92, 100"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* View Full Report Button */}
                <button
                  onClick={() => setShowCareerScoreModal(true)}
                  className="mt-3.5 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {/* Personalized Recommendations Section */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 z-10 relative">
                  <div className="text-[11px] font-bold text-slate-300 mb-2">
                    Personalized Recommendations
                  </div>
                  <div className="space-y-1.5 max-w-[210px]">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Apply for Google Summer Internship</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Boost your DSA skills</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Explore AI & ML roles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Trending Technologies (4x2 Grid matching reference) */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    Trending Technologies
                  </h4>
                </div>
                <button
                  onClick={() => setActiveView('stacks')}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Explore More</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* 8 Tech Badges Grid (4 x 2) */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Generative AI', icon: Sparkles, color: 'text-purple-600' },
                  { name: 'Python', icon: Terminal, color: 'text-amber-600' },
                  { name: 'React', icon: Atom, color: 'text-cyan-600' },
                  { name: 'AWS', icon: Globe, color: 'text-amber-500' },
                  { name: 'Data Science', icon: BarChart2, color: 'text-blue-600' },
                  { name: 'Cloud Computing', icon: Cpu, color: 'text-sky-600' },
                  { name: 'Blockchain', icon: Layers, color: 'text-emerald-600' },
                  { name: 'Cybersecurity', icon: Shield, color: 'text-rose-600' }
                ].map((tech, i) => {
                  const Icon = tech.icon;
                  const isFiltered = selectedStackFilter === tech.name;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedStackFilter(isFiltered ? null : tech.name);
                        setActiveView('jobs');
                        addToast({ message: `Filtered verified jobs matching "${tech.name}"`, type: 'info' });
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isFiltered
                          ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-100 hover:border-slate-200'
                      }`}
                      title={`Filter by ${tech.name}`}
                    >
                      <Icon className={`w-4 h-4 ${tech.color}`} />
                      <span className="text-[9px] font-bold text-slate-700 tracking-tight text-center truncate w-full">
                        {tech.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. FULL-WIDTH BOTTOM BANNER: STAY AHEAD IN TECH            */}
      {/* ========================================================= */}
      {activeView === 'overview' && (
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#0E2044] to-[#0B1528] border border-slate-800 p-4 md:px-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          {/* Left Text */}
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Stay Ahead in Tech
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Get personalized insights, salary benchmarks and hiring trends.
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3 z-10 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setActiveView('salary');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Explore Insights</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EXPANDED VIEW: ALL JOB DRIVES DIRECTORY                 */}
      {/* ========================================================= */}
      {activeView === 'jobs' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('overview')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>← Back to Overview</span>
                </button>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Verified Tech Opportunities & Campus Drives
              </h3>
              <p className="text-xs text-slate-500">
                Displaying {filteredJobs.length} real-time verified hiring drives with confirmed application deadlines.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company, role or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Salary Tier & Batch Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Filter Tier:</span>
            {['ALL', 'Tier 1', 'Tier 2', 'Tier 3'].map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTierFilter(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTierFilter === tier
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier === 'ALL' ? 'All Packages' : tier}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-200 mx-2 hidden sm:block" />

            <span className="text-xs font-semibold text-slate-400 mr-2">Batch:</span>
            {['ALL', '2025', '2026', '2027'].map(batch => (
              <button
                key={batch}
                onClick={() => setSelectedBatchFilter(batch)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedBatchFilter === batch
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {batch === 'ALL' ? 'All Batches' : `${batch} Batch`}
              </button>
            ))}

            {selectedStackFilter && (
              <button
                onClick={() => setSelectedStackFilter(null)}
                className="ml-auto px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Clear stack filter: {selectedStackFilter}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Directory Listings */}
          <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredJobs.slice(0, 30).map(job => {
              const bookmarked = isItemBookmarked(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobDetail(job)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs bg-slate-50/40 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-2xs flex-shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {job.company}
                        </span>
                        {job.salaryTier && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {job.salaryTier}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{job.batch || '2025/2026 Batch'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <div className="text-sm font-extrabold text-blue-600">{job.ctc}</div>
                      <div className="text-[10px] text-slate-400">Fixed CTC + Stocks</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={(e) => handleToggleBookmark(job, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          bookmarked 
                            ? 'bg-blue-50 border-blue-200 text-blue-600' 
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. EXPANDED VIEW: ALL TECH NEWS FEED                       */}
      {/* ========================================================= */}
      {activeView === 'news' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <button
                onClick={() => setActiveView('overview')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>← Back to Overview</span>
              </button>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Technology Intelligence & Engineering Feed
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {liveNews.length} verified news dispatches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveNews.map(article => (
              <div
                key={article.id}
                onClick={() => setSelectedNewsArticle(article)}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/30 hover:bg-white hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {article.category}
                    </span>
                    <span className="text-slate-400 text-[10px]">{article.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Source: {article.source}</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. EXPANDED VIEW: SALARY INSIGHTS & BENCHMARKS             */}
      {/* ========================================================= */}
      {activeView === 'salary' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <button
                onClick={() => setActiveView('overview')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>← Back to Overview</span>
              </button>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Campus Salary Benchmarks & Compensation Radar
              </h3>
            </div>
            <div className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
              Updated for 2025/2026 Batch
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SALARY_HIKES_RADAR.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.role}</span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{item.title}</h4>
                  <div className="text-2xl font-black text-blue-600 mt-2">{item.avgPackage}</div>
                  <div className="text-xs text-emerald-600 font-bold mt-0.5">{item.hike} YoY Growth</div>
                </div>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                  Top Employers: <span className="font-semibold text-slate-700">{item.companies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. EXPANDED VIEW: TRENDING STACKS & SKILL DEMAND           */}
      {/* ========================================================= */}
      {activeView === 'stacks' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <button
                onClick={() => setActiveView('overview')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>← Back to Overview</span>
              </button>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Industry Skill Demand & Technology Stacks
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING_TECH_STACKS.map((stack, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{stack.name}</span>
                    <span className="text-xs font-extrabold text-blue-600">{stack.demand}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 mt-2 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: stack.demand }} />
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  {stack.openings} verified openings active
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. EXPANDED VIEW: HIRING TRENDS & CAMPUS METRICS           */}
      {/* ========================================================= */}
      {activeView === 'trends' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <button
                onClick={() => setActiveView('overview')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>← Back to Overview</span>
              </button>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Tech Hiring Growth & Market Dynamics
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Campus Tech Hiring Rate</span>
              <div className="text-3xl font-black text-blue-900">+28.4%</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Campus recruitment offers in product and fintech sectors rose significantly over the previous fiscal quarter.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">AI Engineering Demand</span>
              <div className="text-3xl font-black text-emerald-900">+42%</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Roles asking for Generative AI, LLM orchestration, and vector databases expanded faster than traditional web roles.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col gap-2">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Average Tier-1 CTC</span>
              <div className="text-3xl font-black text-purple-900">₹24.8 LPA</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Benchmark CTC for top 10% graduating software engineering students across premier tech campuses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. EXPANDED VIEW: COMPANY INSIGHTS                        */}
      {/* ========================================================= */}
      {activeView === 'companies' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <button
                onClick={() => setActiveView('overview')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>← Back to Overview</span>
              </button>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Top Hiring Companies & Campus Patterns
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Google', roles: 'Software Engineer, Data Engineer', ctc: '₹32 – 50 LPA', pattern: 'Online Assessment (DSA) + 3 Technical Viva + Googliness' },
              { name: 'Microsoft', roles: 'SDE-1, Cloud Solution Architect', ctc: '₹26 – 45 LPA', pattern: 'Codility OA + 2 DSA Rounds + System Design + HR' },
              { name: 'Amazon', roles: 'Software Development Engineer', ctc: '₹28 – 45 LPA', pattern: 'Online Assessment (Debugging + DSA) + 3 Bar Raiser Vivas' },
              { name: 'Meta', roles: 'Production Engineer, SWE', ctc: '₹35 – 55 LPA', pattern: 'Technical Phone Screen + 2 Coding + 1 Architecture' },
              { name: 'Apple', roles: 'Software Systems Engineer', ctc: '₹30 – 48 LPA', pattern: 'Take-home assignment + Core OS & Concurrency interviews' },
              { name: 'Goldman Sachs', roles: 'Quantitative Analyst, SDE', ctc: '₹24 – 38 LPA', pattern: 'HackerRank Aptitude + Advanced Math + 2 Tech Viva' }
            ].map((comp, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{comp.name}</h4>
                  <div className="text-xs font-semibold text-blue-600 mt-1">{comp.roles}</div>
                  <div className="text-xs font-extrabold text-slate-800 mt-1.5">Package: {comp.ctc}</div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    <span className="font-bold text-slate-700">Interview Pattern:</span> {comp.pattern}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery(comp.name);
                    setActiveView('jobs');
                  }}
                  className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer text-center"
                >
                  View Openings for {comp.name} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: WATCH OVERVIEW VIDEO WALKTHROUGH                 */}
      {/* ========================================================= */}
      {showOverviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowOverviewModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900">TechPulse™ Platform Overview</h3>
            </div>
            <div className="rounded-2xl bg-[#0B1528] aspect-video flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg text-white mb-3">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
              <h4 className="text-sm font-bold">Technology Opportunity Observatory</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Real-time tracking of 1,120+ verified hiring drives, compensation intelligence, and skill demand matrices.
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              TechPulse connects you directly to verified campus recruitment opportunities at Google, Microsoft, Amazon, and 150+ tech leaders with automated salary benchmarks and skill matching.
            </p>
            <button
              onClick={() => setShowOverviewModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Got it, Close Overview
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CAREER READINESS SCORE BREAKDOWN (92/100)        */}
      {/* ========================================================= */}
      {showCareerScoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowCareerScoreModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Tech Career Score Breakdown</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-blue-600">92/100</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Placement Tier-1 Ready
              </span>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { label: 'Data Structures & Algorithms', score: '94%', bar: '94%' },
                { label: 'System Design & Architecture', score: '88%', bar: '88%' },
                { label: 'Core CS (OS, DBMS, Networks)', score: '90%', bar: '90%' },
                { label: 'Quantitative Aptitude', score: '92%', bar: '92%' },
                { label: 'Resume ATS Benchmark', score: '95%', bar: '95%' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-blue-600 font-bold">{item.score}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: item.bar }} />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowCareerScoreModal(false);
                if (onNavigate) onNavigate('skill_hub', 'daily_mission');
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Open Skill Hub Practice →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ARTICLE READER MODAL                              */}
      {/* ========================================================= */}
      {selectedNewsArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedNewsArticle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold shadow-2xs">
                {selectedNewsArticle.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedNewsArticle.time} • Source: {selectedNewsArticle.source}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug mb-4">
              {selectedNewsArticle.title}
            </h2>
            {selectedNewsArticle.image && (
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                <img
                  src={selectedNewsArticle.image}
                  alt={selectedNewsArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-3 mb-6">
              <p>{selectedNewsArticle.content}</p>
              <p>
                Industry analysts anticipate that technical recruiters will increasingly evaluate candidates based on their mastery of foundational computer science principles paired with modern AI-augmented developer workflows.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleToggleBookmark(selectedNewsArticle)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isItemBookmarked(selectedNewsArticle.id || selectedNewsArticle.title) ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>Bookmark Article</span>
              </button>
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: JOB DETAILS & APPLICATION MODAL                   */}
      {/* ========================================================= */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedJobDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-lg shadow-2xs">
                {selectedJobDetail.company.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {selectedJobDetail.role || selectedJobDetail.title}
                </h3>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedJobDetail.company} • {selectedJobDetail.location}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation Package</span>
                <span className="text-sm font-extrabold text-blue-600">{selectedJobDetail.ctc}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligible Batch</span>
                <span className="text-sm font-bold text-slate-800">{selectedJobDetail.batch || '2025/2026 Batch'}</span>
              </div>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed mb-6 space-y-2">
              <div className="font-semibold text-slate-800">Requirements & Candidate Profile:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>B.Tech / M.Tech in Computer Science, IT, or related engineering discipline.</li>
                <li>Strong foundation in Data Structures, Algorithms, Object-Oriented Design, and Database Systems.</li>
                <li>Proficiency in at least one modern language: Java, Python, C++, or JavaScript/TypeScript.</li>
              </ul>
            </div>
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={(e) => handleToggleBookmark(selectedJobDetail, e)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className={`w-4 h-4 ${isItemBookmarked(selectedJobDetail.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>{isItemBookmarked(selectedJobDetail.id) ? 'Saved' : 'Save'}</span>
              </button>
              <a
                href={selectedJobDetail.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

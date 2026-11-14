import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, Newspaper, Briefcase, TrendingUp, Flame, DollarSign, 
  ExternalLink, Bookmark, BookmarkCheck, Search, Filter, Clock, 
  Sparkles, Share2, Building2, MapPin, Award, CheckCircle2, Code2, 
  Cpu, Globe, RefreshCw, SlidersHorizontal, Layers, ArrowUpRight, 
  ChevronRight, AlertCircle, Check, Users, ShieldCheck, Zap,
  Copy, Terminal, Calculator, ArrowRight, Star, Target, Compass, X,
  Radio, Rocket, ChevronDown, CheckSquare, Info, BarChart2
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

  // Navigation mode: 'overview' | 'news' | 'jobs' | 'salary' | 'stacks' | 'bookmarks'
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

  // Modals state
  const [selectedNewsArticle, setSelectedNewsArticle] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Salary Calculator State
  const [calcSourceRole, setCalcSourceRole] = useState('fresher_services');
  const [calcTargetRole, setCalcTargetRole] = useState('product_sde1');

  // Handle refresh / sync
  const handleSyncData = () => {
    setIsSyncing(true);
    addToast({ message: 'Syncing live tech news & campus drives radar...', type: 'info' });
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime('Just now');
      addToast({ message: 'TechPulse feed synchronized with live market data.', type: 'success' });
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

  // Top featured jobs matching the screenshot
  const topFeaturedJobs = useMemo(() => [
    {
      id: 'job_google_featured',
      company: 'Google',
      logo: 'https://www.google.com/favicon.ico',
      role: 'Software Engineer',
      isVerified: true,
      tag: 'On-Campus',
      location: 'Google • Bengaluru, Karnataka',
      ctc: '₹20 – 40 LPA',
      batch: '2025 Batch',
      applyUrl: 'https://careers.google.com/jobs/results/?q=software%20engineer%20university%20graduate'
    },
    {
      id: 'job_microsoft_featured',
      company: 'Microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      role: 'SDE Intern',
      isVerified: true,
      tag: 'Internship',
      location: 'Microsoft • Hyderabad',
      ctc: '₹1 – 2 LPA',
      batch: '2026 Batch',
      applyUrl: 'https://careers.microsoft.com/professionals/us/en/search-results?keywords=software%20engineer%20intern'
    },
    {
      id: 'job_amazon_featured',
      company: 'Amazon',
      logo: 'https://www.amazon.com/favicon.ico',
      role: 'Software Development Engineer',
      isVerified: true,
      tag: null,
      location: 'Amazon • Bengaluru',
      ctc: '₹28 – 45 LPA',
      batch: '2025 Batch',
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
      {/* 1. TECHPULSE SUB-HEADER                                    */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
            {/* Heartbeat / Pulse Wave Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                TechPulse<span className="text-blue-600 text-sm align-super font-bold">™</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-tight mt-0.5">
              Intelligence • Opportunities • Insights
            </p>
          </div>
        </div>

        {/* Live Status & Sync Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Live Updates Green Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Updates</span>
          </div>

          {/* Last Synced Text */}
          <span className="text-xs font-medium text-slate-400">
            Last synced: {lastSyncedTime}
          </span>

          {/* Refresh Button */}
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Sync latest live opportunities"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TECHPULSE HERO BANNER                                   */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white border border-blue-100/90 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="max-w-xl z-10 flex flex-col gap-3">
          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Where Technology<br />Meets <span className="text-blue-600">Opportunity</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
            Stay ahead with the latest tech news, high-value job drives, and industry insights tailored for you.
          </p>

          {/* Navigation Pills (Tech News, Job Drives, Salary Insights, Trending Stacks) */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'overview', label: 'Tech News', icon: Newspaper },
              { id: 'jobs', label: 'Job Drives', icon: Briefcase },
              { id: 'salary', label: 'Salary Insights', icon: TrendingUp },
              { id: 'stacks', label: 'Trending Stacks', icon: Code2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Workspace Laptop Image */}
        <div className="mt-4 md:mt-0 md:absolute md:right-0 md:bottom-0 md:top-0 md:w-5/12 flex items-center justify-end pointer-events-none opacity-90 md:opacity-100">
          <img
            src="/techpulse-hero-laptop.png"
            alt="Tech workspace"
            className="max-h-56 md:max-h-full object-contain object-right-bottom drop-shadow-sm rounded-lg md:rounded-none"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT (OVERVIEW MODE)                  */}
      {/* ========================================================= */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: Latest Tech News & Top Job Opportunities (65%) */}
          {/* ======================================================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* SECTION A: Latest Tech News */}
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
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Editorial News Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* News Card 1 */}
                <div
                  onClick={() => setSelectedNewsArticle({
                    title: 'OpenAI Unveils GPT-5: A New Era of Reasoning',
                    category: 'AI',
                    source: 'TechCrunch',
                    time: '2h ago',
                    image: '/techpulse-news-1.png',
                    content: 'OpenAI has officially unveiled its next-generation foundation model GPT-5, incorporating autonomous iterative reasoning loops, native multi-modal verification, and 10x cost reductions for developers. The update marks a monumental leap in software engineering automation.'
                  })}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  <div className="h-32 bg-slate-900 overflow-hidden relative">
                    <img
                      src="/techpulse-news-1.png"
                      alt="OpenAI"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                      AI
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 gap-2">
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      OpenAI Unveils GPT-5: A New Era of Reasoning
                    </h4>
                    <div className="text-[11px] text-slate-400 font-medium">
                      2h ago • TechCrunch
                    </div>
                  </div>
                </div>

                {/* News Card 2 */}
                <div
                  onClick={() => setSelectedNewsArticle({
                    title: 'Google Expands Gemini Ecosystem with New Tools',
                    category: 'Google',
                    source: 'The Verge',
                    time: '3h ago',
                    image: '/techpulse-news-2.png',
                    content: 'Google announced massive updates across Gemini 2.0 and Vertex AI, delivering low-latency structured output APIs, deep coding assistant extensions for VS Code, and generous enterprise credit grants for graduating college developers.'
                  })}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                    <img
                      src="/techpulse-news-2.png"
                      alt="Google"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                      Google
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 gap-2">
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      Google Expands Gemini Ecosystem with New Tools
                    </h4>
                    <div className="text-[11px] text-slate-400 font-medium">
                      3h ago • The Verge
                    </div>
                  </div>
                </div>

                {/* News Card 3 */}
                <div
                  onClick={() => setSelectedNewsArticle({
                    title: 'Microsoft Boosts AI Hiring in 2025',
                    category: 'Microsoft',
                    source: 'Business Insider',
                    time: '5h ago',
                    image: '/techpulse-news-3.png',
                    content: 'Microsoft CEO Satya Nadella confirmed aggressive headcount expansion across AI engineering, Copilot platforms, and Azure Infrastructure. University early-career engineering programs in India are expected to recruit 2,000+ SDE graduates.'
                  })}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                    <img
                      src="/techpulse-news-3.png"
                      alt="Microsoft"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-xs">
                      Microsoft
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 gap-2">
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      Microsoft Boosts AI Hiring in 2025
                    </h4>
                    <div className="text-[11px] text-slate-400 font-medium">
                      5h ago • Business Insider
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: Top Tech Job Opportunities */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Top Tech Job Opportunities
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('jobs')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal Job Listings */}
              <div className="flex flex-col gap-3">
                {topFeaturedJobs.map(job => {
                  const bookmarked = isItemBookmarked(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJobDetail(job)}
                      className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-4 md:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    >
                      {/* Left: Company Logo + Title + Badges */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        {/* Company Logo Container */}
                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 p-2 shadow-2xs">
                          {job.company === 'Google' && (
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                            <span className="font-extrabold text-slate-900 text-sm tracking-tighter">
                              amaza
                            </span>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {job.role}
                            </h4>
                            {job.isVerified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-2.5 h-2.5 stroke-3" />
                                <span>Verified</span>
                              </span>
                            )}
                            {job.tag && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {job.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {job.location}
                          </div>
                        </div>
                      </div>

                      {/* Right: CTC, Batch, Apply & Bookmark Buttons */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                            {job.ctc}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {job.batch}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>Apply Now</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>

                          <button
                            onClick={(e) => handleToggleBookmark(job, e)}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              bookmarked 
                                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                            title={bookmarked ? 'Saved to bookmarks' : 'Bookmark job'}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
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
          {/* RIGHT COLUMN: Insights, Stacks & Promo Banner (35%)     */}
          {/* ======================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* SECTION A: TechPulse Insights */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    TechPulse Insights
                  </h3>
                </div>
                <BarChart2 className="w-4 h-4 text-blue-600" />
              </div>

              {/* Big Growth Metric */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-blue-600 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-1 stroke-3 text-emerald-500" />
                    22%
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  Rise in Tech Hiring Compared to Last Year
                </div>
              </div>

              {/* 6-Month Hiring Curve */}
              <div className="relative h-28 w-full mt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80">
                  <defs>
                    <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 5,68 Q 40,65 75,50 T 145,28 T 195,12 L 195,80 L 5,80 Z"
                    fill="url(#hiringGrad)"
                  />
                  <path
                    d="M 5,68 Q 40,65 75,50 T 145,28 T 195,12"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  {[
                    { x: 5, y: 68 },
                    { x: 42, y: 64 },
                    { x: 80, y: 48 },
                    { x: 120, y: 35 },
                    { x: 160, y: 22 },
                    { x: 195, y: 12 }
                  ].map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={i === 5 ? 4 : 3} fill="#2563EB" stroke="#FFFFFF" strokeWidth={1.5} />
                  ))}
                </svg>

                {/* +22% Tooltip Badge */}
                <div className="absolute right-0 top-0 transform translate-x-1 -translate-y-2">
                  <span className="bg-[#0B1528] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                    +22%
                  </span>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>

              {/* 3 Stat Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-900">1.2K+</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Active Tech Drives</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-900">150+</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Hiring Companies</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-amber-600 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>₹12-25 LPA</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Avg Package</div>
                </div>
              </div>
            </div>

            {/* SECTION B: Trending Technology Stacks */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Trending Technology Stacks
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('stacks')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* 8 Tech Badges Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { name: 'React', icon: Code2, color: 'text-sky-500 bg-sky-50' },
                  { name: 'Python', icon: Terminal, color: 'text-amber-500 bg-amber-50' },
                  { name: 'Java', icon: Cpu, color: 'text-rose-500 bg-rose-50' },
                  { name: 'AWS', icon: Globe, color: 'text-orange-500 bg-orange-50' },
                  { name: 'Node.js', icon: Layers, color: 'text-emerald-500 bg-emerald-50' },
                  { name: 'Data Science', icon: TrendingUp, color: 'text-purple-500 bg-purple-50' },
                  { name: 'Cloud', icon: ShieldCheck, color: 'text-blue-500 bg-blue-50' },
                  { name: 'System Design', icon: Target, color: 'text-indigo-500 bg-indigo-50' }
                ].map((stack, idx) => {
                  const Icon = stack.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedStackFilter(stack.name);
                        setActiveView('jobs');
                      }}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-2xs bg-slate-50/50 hover:bg-white flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                      title={`Filter drives requiring ${stack.name}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${stack.color} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 truncate w-full">
                        {stack.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION C: "Build Your Career with TechPulse" Dark Banner */}
            <div className="bg-[#0B1528] rounded-2xl p-6 text-white shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="z-10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Build Your Career with TechPulse
                  </h4>
                  <p className="text-xs text-slate-300 font-normal mt-1 leading-relaxed">
                    Explore opportunities, Enhance skills, Stay ahead.
                  </p>
                </div>
              </div>

              <div className="z-10 mt-5">
                <button
                  onClick={() => setActiveView('jobs')}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                </button>
              </div>

              {/* Decorative Blue Upward Swoosh Arrow Graphic */}
              <div className="absolute right-0 bottom-0 pointer-events-none transform translate-x-2 translate-y-2 opacity-80">
                <svg className="w-24 h-24 text-blue-600" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M 10 90 Q 50 80 80 20 M 80 20 L 50 25 M 80 20 L 75 50"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. EXPANDED VIEW: ALL JOBS DIRECTORY                       */}
      {/* ========================================================= */}
      {activeView === 'jobs' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('overview')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  ← Back to Overview
                </button>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Verified Campus & Off-Campus Tech Drives ({filteredJobs.length} opportunities)
              </h3>
            </div>

            {/* Bookmarks Toggle Pill */}
            <button
              onClick={() => setActiveView(activeView === 'bookmarks' ? 'jobs' : 'bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeView === 'bookmarks'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Bookmarks ({bookmarks.length})</span>
            </button>
          </div>

          {/* Search & Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search role, company, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Tier Filter */}
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="ALL">All Compensation Tiers</option>
              <option value="Tier 1 Product">Tier 1 Product Elite (15+ LPA)</option>
              <option value="FinTech">FinTech & Quant Firms</option>
              <option value="Unicorn">High-Growth Unicorns</option>
              <option value="Service">Service MNCs (Digital/Power)</option>
            </select>

            {/* Batch Filter */}
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="ALL">All Eligible Batches</option>
              <option value="2025">2025 Batch Graduates</option>
              <option value="2026">2026 Batch Graduates</option>
              <option value="Internship">Internship Only</option>
            </select>

            {/* Clear stack filter if set */}
            {selectedStackFilter && (
              <div className="flex items-center justify-between px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                <span>Filter: {selectedStackFilter}</span>
                <button onClick={() => setSelectedStackFilter(null)} className="text-blue-500 hover:text-blue-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Job Listings Grid */}
          <div className="flex flex-col gap-3">
            {filteredJobs.slice(0, 30).map(job => {
              const bookmarked = isItemBookmarked(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobDetail(job)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 flex-shrink-0 text-sm">
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{job.title}</h4>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{job.company} • {job.location}</div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {job.tags?.slice(0, 4).map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pl-14 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-extrabold text-slate-900">{job.salaryRange}</div>
                      <div className="text-[11px] text-slate-400">{job.batch}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Apply</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <button
                        onClick={(e) => handleToggleBookmark(job, e)}
                        className={`p-2 rounded-xl border ${bookmarked ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
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
      {/* 5. EXPANDED VIEW: SALARY BENCHMARKS & CALCULATOR           */}
      {/* ========================================================= */}
      {activeView === 'salary' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div>
            <button
              onClick={() => setActiveView('overview')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
            >
              ← Back to Overview
            </button>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Interactive Tech Salary Benchmark Radar
            </h3>
            <p className="text-xs text-slate-500 mt-1">Real-world compensation telemetry across Tier 1, FinTech, Unicorns, and Service MNCs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SALARY_HIKES_RADAR.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    {item.tier}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{item.role}</h4>
                  <div className="text-xl font-black text-blue-600 mt-1">{item.medianCtc}</div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">High-growth skill:</span>
                  <span className="font-bold text-slate-800">{item.topSkills?.[0] || 'System Design'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. EXPANDED VIEW: ALL TECH NEWS FEED                      */}
      {/* ========================================================= */}
      {activeView === 'news' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div>
            <button
              onClick={() => setActiveView('overview')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
            >
              ← Back to Overview
            </button>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Developer News & Engineering Intelligence
            </h3>
            <p className="text-xs text-slate-500 mt-1">Curated real-time updates from Hacker News, TechCrunch, The Verge, and institutional feeds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_TECH_NEWS.map(news => (
              <div
                key={news.id}
                onClick={() => setSelectedNewsArticle({
                  title: news.title,
                  category: news.category,
                  source: news.source,
                  time: news.publishedAt,
                  image: '/techpulse-news-1.png',
                  content: news.snippet
                })}
                className="p-5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer bg-white flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {news.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{news.publishedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{news.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{news.snippet}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-400">{news.source}</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1">Read Brief →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. EXPANDED VIEW: TRENDING STACKS                         */}
      {/* ========================================================= */}
      {activeView === 'stacks' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
          <div>
            <button
              onClick={() => setActiveView('overview')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
            >
              ← Back to Overview
            </button>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              In-Demand Technology Stacks & Hiring Ratios
            </h3>
            <p className="text-xs text-slate-500 mt-1">High-value skills commanding 30%+ premium CTC in campus & off-campus drives.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING_TECH_STACKS.map((stack, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{stack.name}</span>
                    <span className="text-xs font-extrabold text-emerald-600">{stack.growth}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{stack.demand} Demand</div>
                  <p className="text-[11px] text-slate-400 mt-2">{stack.recommendedFor}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedStackFilter(stack.name);
                    setActiveView('jobs');
                  }}
                  className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  View Matching Jobs →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: News Article Reader                                 */}
      {/* ========================================================= */}
      {selectedNewsArticle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedNewsArticle.category}</span>
              <button onClick={() => setSelectedNewsArticle(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {selectedNewsArticle.title}
            </h3>
            <div className="text-xs text-slate-400">{selectedNewsArticle.source} • {selectedNewsArticle.time}</div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {selectedNewsArticle.content}
            </p>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: Job Detail & Application View                       */}
      {/* ========================================================= */}
      {selectedJobDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600">✓ Verified Institutional Opportunity</span>
              <button onClick={() => setSelectedJobDetail(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{selectedJobDetail.role || selectedJobDetail.title}</h3>
              <div className="text-xs text-slate-500 mt-0.5">{selectedJobDetail.company} • {selectedJobDetail.location}</div>
              <div className="text-base font-extrabold text-blue-600 mt-2">{selectedJobDetail.ctc || selectedJobDetail.salaryRange}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-700">
              <div><span className="font-bold">Batch:</span> {selectedJobDetail.batch || '2025 / 2026 Batch'}</div>
              <div><span className="font-bold">Eligibility:</span> B.Tech CSE, IT, ECE, EEE (60%+ recommended)</div>
              <div><span className="font-bold">Assessment:</span> Online Coding + Technical Viva + HR Round</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={(e) => handleToggleBookmark(selectedJobDetail, e)}
                className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className={`w-4 h-4 ${isItemBookmarked(selectedJobDetail.id) ? 'fill-current text-blue-600' : ''}`} />
                <span>{isItemBookmarked(selectedJobDetail.id) ? 'Bookmarked' : 'Save Opportunity'}</span>
              </button>

              <a
                href={selectedJobDetail.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
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

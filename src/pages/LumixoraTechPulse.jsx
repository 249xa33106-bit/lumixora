import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Radio, Newspaper, Briefcase, TrendingUp, Flame, DollarSign, 
  ExternalLink, Bookmark, BookmarkCheck, Search, Filter, Clock, 
  Sparkles, Share2, Building2, MapPin, Award, CheckCircle2, Code2, 
  Cpu, Globe, RefreshCw, SlidersHorizontal, Layers, ArrowUpRight, 
  ChevronRight, AlertCircle, Check, Users, ShieldCheck, Zap,
  Copy, Terminal, Calculator, ArrowRight, Star, Target, Compass, X
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
import { fetchLiveTechFeed, getSavedBookmarks, saveBookmarkItem } from '../services/techNewsService';
import { useToast } from '../context/ToastContext';

export default function TechPulsePortal({ user, setActiveTab }) {
  const { addToast } = useToast();

  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'jobs' | 'news' | 'hikes' | 'trending' | 'layoffs' | 'bookmarks'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpFilter, setSelectedExpFilter] = useState('ALL');
  const [selectedTierFilter, setSelectedTierFilter] = useState('ALL');
  const [selectedTagChip, setSelectedTagChip] = useState(null);
  const [visibleJobsLimit, setVisibleJobsLimit] = useState(24);

  // Live Data States - Initialized with 1,000+ verified tech jobs
  const [liveNews, setLiveNews] = useState(INITIAL_TECH_NEWS);
  const [jobsList, setJobsList] = useState(ALL_TECH_JOBS_DIRECTORY);
  const [hikesList, setHikesList] = useState(SALARY_HIKES_RADAR);
  const [trendingList, setTrendingList] = useState(TRENDING_TECH_STACKS);
  const [bookmarks, setBookmarks] = useState(getSavedBookmarks);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [copiedCommandId, setCopiedCommandId] = useState(null);

  // Interactive Salary Hike Calculator State
  const [calcSourceRole, setCalcSourceRole] = useState('fresher_services');
  const [calcTargetRole, setCalcTargetRole] = useState('product_sde1');

  // Fetch real-time live tech feed
  const loadLiveFeed = useCallback(async (showNotice = false) => {
    setIsRefreshing(true);
    try {
      const feed = await fetchLiveTechFeed();
      if (feed && feed.length > 0) {
        setLiveNews(feed);
      }
      setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      if (showNotice) {
        addToast({ message: 'Live Tech Pulse synchronized successfully!', type: 'success' });
      }
    } catch (e) {
      console.warn('Live feed notice:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadLiveFeed();
  }, [loadLiveFeed]);

  // Bookmark Toggle
  const handleToggleBookmark = (item) => {
    const updated = saveBookmarkItem(item);
    setBookmarks(updated);
    const isSaved = updated.some(b => b.id === item.id);
    addToast({ 
      message: isSaved ? `Saved "${item.title || item.name}" to bookmarks!` : `Removed from bookmarks.`, 
      type: 'info' 
    });
  };

  const isItemBookmarked = (id) => bookmarks.some(b => b.id === id);

  // Copy / Share
  const handleShareItem = (item) => {
    const text = `${item.title || item.name} - ${item.company || item.category || 'Tech Pulse'}\n${item.applyUrl || item.sourceUrl || item.githubUrl || window.location.href}`;
    navigator.clipboard.writeText(text);
    addToast({ message: 'Item link copied to clipboard!', type: 'success' });
  };

  // Copy command to clipboard
  const handleCopyCommand = (id, command) => {
    navigator.clipboard.writeText(command);
    setCopiedCommandId(id);
    addToast({ message: `Copied "${command}" to clipboard!`, type: 'success' });
    setTimeout(() => setCopiedCommandId(null), 2500);
  };

  // Copy Referral Pitch for LinkedIn
  const handleCopyReferralPitch = (job) => {
    const pitch = `Hi! I came across the ${job.title} role at ${job.company}. I am a passionate engineer with hands-on experience in ${job.tags.slice(0, 3).join(', ')}. Given my alignment with the job requirements, I would be grateful if you could consider referring my profile for this opening! Resume and work samples can be shared right away. Thank you!`;
    navigator.clipboard.writeText(pitch);
    addToast({ message: 'Referral message copied! Ready to paste into LinkedIn DM.', type: 'success' });
  };

  // Filtered Job Listings
  const filteredJobs = useMemo(() => {
    return jobsList.filter(job => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesComp = job.company.toLowerCase().includes(q);
        const matchesTags = job.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesLoc = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesComp && !matchesTags && !matchesDesc && !matchesLoc) return false;
      }

      if (selectedTagChip) {
        const chip = selectedTagChip.toLowerCase();
        if (chip === 'fresher' && !job.experience.toLowerCase().includes('fresher') && !job.experience.includes('2025') && !job.experience.includes('2026')) return false;
        if (chip === 'tier1' && !job.salaryTier.includes('Tier 1')) return false;
        if (chip === 'remote' && job.workMode !== 'Remote' && !job.location.toLowerCase().includes('remote')) return false;
        if (chip === 'java' && !job.tags.some(t => t.toLowerCase().includes('java'))) return false;
        if (chip === 'ai' && !job.tags.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('python'))) return false;
        if (chip === 'go' && !job.tags.some(t => t.toLowerCase().includes('golang') || t.toLowerCase().includes('go'))) return false;
      }

      if (selectedExpFilter !== 'ALL') {
        if (selectedExpFilter === 'FRESHER' && !job.experience.toLowerCase().includes('fresher') && !job.experience.includes('2025') && !job.experience.includes('2026')) {
          return false;
        }
        if (selectedExpFilter === 'EXPERIENCED' && job.experience.toLowerCase().includes('fresher')) {
          return false;
        }
      }

      if (selectedTierFilter !== 'ALL') {
        if (selectedTierFilter === 'TIER1' && !job.salaryTier.includes('Tier 1')) return false;
        if (selectedTierFilter === 'TIER2' && !job.salaryTier.includes('Tier 2')) return false;
      }

      return true;
    });
  }, [jobsList, searchQuery, selectedExpFilter, selectedTierFilter, selectedTagChip]);

  // Filtered News
  const filteredNews = useMemo(() => {
    return liveNews.filter(news => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesTitle = news.title.toLowerCase().includes(q);
      const matchesSnippet = news.snippet.toLowerCase().includes(q);
      const matchesCategory = news.category.toLowerCase().includes(q);
      const matchesTags = news.tags && news.tags.some(t => t.toLowerCase().includes(q));
      return matchesTitle || matchesSnippet || matchesCategory || matchesTags;
    });
  }, [liveNews, searchQuery]);

  // Filtered Salary Hikes
  const filteredHikes = useMemo(() => {
    return hikesList.filter(hike => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesTrans = hike.transition.toLowerCase().includes(q);
      const matchesDrivers = hike.keyDrivers.some(d => d.toLowerCase().includes(q));
      const matchesComps = hike.topRecruiters.some(c => c.toLowerCase().includes(q));
      return matchesTrans || matchesDrivers || matchesComps;
    });
  }, [hikesList, searchQuery]);

  // Filtered Trending
  const filteredTrending = useMemo(() => {
    return trendingList.filter(item => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      const matchesCat = item.category.toLowerCase().includes(q);
      const matchesUses = item.topUses.some(u => u.toLowerCase().includes(q));
      return matchesName || matchesDesc || matchesCat || matchesUses;
    });
  }, [trendingList, searchQuery]);

  // Stream counts
  const allStreamCount = filteredJobs.length + filteredNews.length + filteredHikes.length + filteredTrending.length;

  // Interactive Salary Transition Calculator Data
  const salaryCalcProfiles = {
    fresher_services: { label: 'College Graduate / Mass IT Recruits', currentLpa: '₹3.6 - 4.5 LPA' },
    services_dev: { label: 'IT Services Developer (1-2 yrs exp)', currentLpa: '₹4.5 - 6.5 LPA' },
    qa_support: { label: 'QA / Tech Support Engineer', currentLpa: '₹3.5 - 5.0 LPA' },
    junior_web: { label: 'Junior Fullstack / Frontend Dev', currentLpa: '₹5.0 - 8.0 LPA' }
  };

  const salaryCalcTargets = {
    product_sde1: { 
      label: 'Tier-1 Product SDE-1 (Amazon/Swiggy/Flipkart)', 
      targetLpa: '₹18.0 - 28.0 LPA', 
      hikePct: '+250% to +380%',
      timeline: '4 - 6 Months',
      skills: ['LeetCode Medium/Hard (Trees, Graphs, DP)', 'Low Level Design (Design Patterns & OOP)', 'Concurrency & Threading', 'SQL & Indexing Fundamentals'],
      firms: ['Amazon', 'Swiggy', 'PhonePe', 'Meesho', 'Razorpay']
    },
    genai_engineer: { 
      label: 'GenAI & Autonomous Agent Engineer', 
      targetLpa: '₹20.0 - 35.0 LPA', 
      hikePct: '+300% to +450%',
      timeline: '3 - 5 Months',
      skills: ['LangGraph / CrewAI multi-agent orchestration', 'RAG Pipelines & pgvector embeddings', 'FastAPI & Async Python', 'Model Quantization & vLLM'],
      firms: ['Microsoft IDC', 'Scale AI', 'Fractal', 'Postman', 'Google']
    },
    tcs_prime: { 
      label: 'TCS Prime / Infosys Specialist Programmer', 
      targetLpa: '₹9.0 - 15.0 LPA', 
      hikePct: '+100% to +160%',
      timeline: '2 - 3 Months',
      skills: ['NQT Advanced DSA Coding', 'Clean Java/Python Implementation', 'Core CS (OS, DBMS, Networks)'],
      firms: ['TCS Prime', 'Infosys Power Programmer', 'Cognizant GenC Next']
    },
    devops_cloud: { 
      label: 'Cloud Platform & SRE Specialist', 
      targetLpa: '₹14.0 - 22.0 LPA', 
      hikePct: '+180% to +260%',
      timeline: '3 - 5 Months',
      skills: ['Docker & Kubernetes (K8s)', 'Terraform (IaC)', 'CI/CD Pipelines (GitHub Actions)', 'Prometheus / Grafana Observability'],
      firms: ['Cisco', 'Red Hat', 'Walmart Tech', 'JPMorgan Chase']
    }
  };

  const activeCalcResult = salaryCalcTargets[calcTargetRole] || salaryCalcTargets.product_sde1;
  const activeCalcSource = salaryCalcProfiles[calcSourceRole] || salaryCalcProfiles.fresher_services;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-fade-in text-white">
      {/* ─── LIVE BREAKING MARQUEE / TICKER TAPE ────────────────────────────── */}
      <div className="rounded-2xl bg-[#080d19]/90 border border-cyan-500/20 backdrop-blur-md overflow-hidden relative shadow-lg">
        <div className="flex items-center">
          <div className="px-3.5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-r border-cyan-500/30 flex items-center gap-2 shrink-0 z-10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              LIVE RADAR
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 py-2 text-xs">
            <div className="animate-marquee gap-8 items-center">
              {[...MARQUEE_ALERTS, ...MARQUEE_ALERTS].map((alert, idx) => (
                <button
                  key={`${alert.id}_${idx}`}
                  onClick={() => {
                    if (alert.linkCategory) setActiveCategory(alert.linkCategory);
                  }}
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group shrink-0 mr-8"
                >
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono ${
                    alert.type === 'cyan' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' :
                    alert.type === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                    alert.type === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' :
                    alert.type === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                    alert.type === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' :
                    'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  }`}>
                    {alert.badge}
                  </span>
                  <span className="text-xs font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">
                    {alert.text}
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 inline" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TOP COMMAND HERO HEADER ────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#070b14] via-[#0d1527] to-[#120d24] border border-cyan-500/30 shadow-2xl relative overflow-hidden group">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            {/* Live Indicator Pills */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 flex items-center gap-2 shadow-sm shadow-cyan-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span>Active Radar Stream</span>
              </div>

              <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Synced ({lastSynced})</span>
              </div>

              <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Q4 Campus Hiring Wave</span>
              </div>
            </div>

            {/* Main Title with Shimmer Gradient */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sora tracking-tight text-white flex items-center gap-2.5">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                TechPulse™ Intelligence & Opportunities
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-normal leading-relaxed">
              Real-time developer breakthroughs, verified fresher & off-campus hiring drives with direct apply links, salary hike benchmarks, and viral GitHub stacks.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => loadLiveFeed(true)}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/40 text-cyan-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
              title="Refresh live stream from Dev.to, Hacker News, and Job Feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing Feeds...' : 'Sync Live Radar'}</span>
            </button>
          </div>
        </div>

        {/* ─── REAL-TIME INTERACTIVE 4-METRIC TICKER CARDS ─────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          {/* Card 1: Active Tech Drives */}
          <div 
            onClick={() => { setActiveCategory('jobs'); setSelectedTierFilter('ALL'); }}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-cyan-500/[0.08] to-white/[0.02] border border-cyan-400/30 hover:border-cyan-400/70 transition-all cursor-pointer group/card shadow-sm hover:shadow-cyan-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Tech Drives</span>
              <Briefcase className="w-3.5 h-3.5 text-cyan-400 group-hover/card:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
              {filteredJobs.length.toLocaleString()}+ Verified
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
              <span className="text-[10px] text-emerald-400 font-semibold truncate">Google, Amazon, TCS, 150+ MNCs</span>
              <span className="text-[9px] text-cyan-400 font-mono group-hover/card:underline">Filter ➔</span>
            </div>
          </div>

          {/* Card 2: Avg Switch Hike */}
          <div 
            onClick={() => setActiveCategory('hikes')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-500/[0.08] to-white/[0.02] border border-purple-400/30 hover:border-purple-400/70 transition-all cursor-pointer group/card shadow-sm hover:shadow-purple-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg Switch Hike</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-400 group-hover/card:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-purple-300">
              +55% to +90%
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
              <span className="text-[10px] text-purple-300 font-semibold truncate">Services ➔ Product</span>
              <span className="text-[9px] text-purple-400 font-mono group-hover/card:underline">Calc ➔</span>
            </div>
          </div>

          {/* Card 3: Top In-Demand Stack */}
          <div 
            onClick={() => setActiveCategory('trending')}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/[0.08] to-white/[0.02] border border-amber-400/30 hover:border-amber-400/70 transition-all cursor-pointer group/card shadow-sm hover:shadow-amber-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Top In-Demand Stack</span>
              <Flame className="w-3.5 h-3.5 text-amber-400 group-hover/card:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
              GenAI / Rust / Go
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
              <span className="text-[10px] text-amber-400 font-semibold truncate">+140% Hiring Vol</span>
              <span className="text-[9px] text-amber-400 font-mono group-hover/card:underline">Explore ➔</span>
            </div>
          </div>

          {/* Card 4: Fresher Package Band */}
          <div 
            onClick={() => { setActiveCategory('jobs'); setSelectedTierFilter('TIER1'); }}
            className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-500/[0.08] to-white/[0.02] border border-emerald-400/30 hover:border-emerald-400/70 transition-all cursor-pointer group/card shadow-sm hover:shadow-emerald-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fresher Package Band</span>
              <Award className="w-3.5 h-3.5 text-emerald-400 group-hover/card:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
              ₹7.0 - ₹54.0 LPA
            </div>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
              <span className="text-[10px] text-emerald-400 font-semibold truncate">2025 & 2026 Batch</span>
              <span className="text-[9px] text-emerald-400 font-mono group-hover/card:underline">Tier-1 ➔</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CATEGORY NAVIGATION TABS ───────────────────────────────────────── */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0c1220]/90 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar shadow-lg">
        <div className="flex items-center gap-1.5 flex-nowrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Radar</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">{allStreamCount.toLocaleString()}</span>
          </button>

          <button
            onClick={() => setActiveCategory('jobs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'jobs'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Jobs & Drives</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
              {filteredJobs.length.toLocaleString()}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('news')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'news'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50 shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Tech & AI News</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
              {filteredNews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('hikes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'hikes'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Salary Hikes & Comp</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
              {filteredHikes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('trending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'trending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Trending Stacks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
              {filteredTrending.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('layoffs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'layoffs'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/50 shadow-md shadow-rose-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hiring Health Tracker</span>
          </button>

          <button
            onClick={() => setActiveCategory('bookmarks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'bookmarks'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({bookmarks.length})</span>
          </button>
        </div>
      </div>

      {/* ─── SEARCH & SMART QUICK-FILTER CHIPS BAR ─────────────────────────── */}
      <div className="p-4 rounded-2xl bg-[#0e1424] border border-white/10 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Google, Amazon, Go, React, LPA, 2026 Batch..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Experience & Tier Toggles */}
          {(activeCategory === 'all' || activeCategory === 'jobs') && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-gray-400 text-[10px] font-bold uppercase mr-1">Exp:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'FRESHER', label: 'Freshers / 2026' },
                { id: 'EXPERIENCED', label: '1+ Years' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedExpFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedExpFilter === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              <span className="text-gray-400 text-[10px] font-bold uppercase ml-2 mr-1">Package:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'TIER1', label: '15+ LPA' },
                { id: 'TIER2', label: '7-14 LPA' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedTierFilter(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTierFilter === p.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 1-Click Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5 text-[11px]">
          <span className="text-gray-500 text-[10px] font-mono mr-1">Quick Filter:</span>
          {[
            { id: 'fresher', label: '🎓 Freshers / 2026 Batch' },
            { id: 'tier1', label: '💎 15+ LPA Elite Tier' },
            { id: 'java', label: '☕ Java / Spring Boot' },
            { id: 'ai', label: '🤖 GenAI & LLMs' },
            { id: 'go', label: '⚡ Golang Microservices' },
            { id: 'remote', label: '🌐 Remote Friendly' }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setSelectedTagChip(selectedTagChip === chip.id ? null : chip.id)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedTagChip === chip.id
                  ? 'bg-cyan-500 text-black font-black shadow-md shadow-cyan-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{chip.label}</span>
              {selectedTagChip === chip.id && <X className="w-2.5 h-2.5 ml-0.5" />}
            </button>
          ))}

          {(selectedTagChip || searchQuery || selectedExpFilter !== 'ALL' || selectedTierFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSelectedTagChip(null);
                setSearchQuery('');
                setSelectedExpFilter('ALL');
                setSelectedTierFilter('ALL');
              }}
              className="px-2 py-0.5 rounded-md text-[10px] text-rose-400 hover:bg-rose-500/10 cursor-pointer font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ─── VIEW 1: TECH JOBS & HIRING DRIVES ────────────────────────────── */}
      {(activeCategory === 'all' || activeCategory === 'jobs') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black font-sora text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Verified Tech Jobs & Off-Campus Drives</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                {filteredJobs.length.toLocaleString()} Available
              </span>
            </h2>
            {activeCategory === 'all' && (
              <button
                onClick={() => setActiveCategory('jobs')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>View All {filteredJobs.length.toLocaleString()}+ Jobs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeCategory === 'all' ? filteredJobs.slice(0, 8) : filteredJobs.slice(0, visibleJobsLimit)).map(job => (
              <div 
                key={job.id}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#0c1220] to-[#12192d] border border-white/10 hover:border-emerald-400/40 transition-all shadow-lg hover:shadow-emerald-500/5 group relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${job.brandColor || 'from-emerald-500 to-cyan-600'} p-0.5 shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                        <div className="w-full h-full rounded-[14px] bg-[#0b101b] flex items-center justify-center overflow-hidden">
                          {job.companyLogo ? (
                            <img 
                              src={job.companyLogo} 
                              alt={job.company} 
                              className="w-6 h-6 object-contain"
                              onError={(e) => { 
                                e.target.style.display = 'none'; 
                                e.target.nextSibling.style.display = 'block'; 
                              }}
                            />
                          ) : null}
                          <span 
                            className="font-black text-xs text-white" 
                            style={{ display: job.companyLogo ? 'none' : 'block' }}
                          >
                            {job.company.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-white text-sm group-hover:text-emerald-300 transition-colors">
                            {job.company}
                          </span>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                            Verified
                          </span>
                          {job.urgency && (
                            <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[9px] font-black uppercase tracking-wider">
                              {job.urgency}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {job.location} • <span className="text-gray-300 font-medium">{job.workMode || 'Hybrid'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleBookmark(job)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isItemBookmarked(job.id)
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                        title={isItemBookmarked(job.id) ? 'Remove Bookmark' : 'Save Job'}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShareItem(job)}
                        className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Share / Copy Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black font-sora text-white leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Compensation & Batch Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono font-black text-xs">
                      {job.salaryRange}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-bold font-mono">
                      {job.batch || job.experience}
                    </span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Rounds Preview if available */}
                  {job.rounds && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400 space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Hiring Stages:</span>
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-gray-300">
                        {job.rounds.map((r, idx) => (
                          <span key={r} className="flex items-center gap-1">
                            <span className="text-cyan-400 font-bold">{idx + 1}.</span> {r}
                            {idx < job.rounds.length - 1 && <span className="text-gray-600">➔</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Apply CTA */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {job.postedDate}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetailItem({ ...job, itemType: 'job' })}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Details & Prep
                    </button>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All category "View All 1,000+ Jobs" banner */}
          {activeCategory === 'all' && filteredJobs.length > 8 && (
            <div className="pt-3 text-center">
              <button
                onClick={() => setActiveCategory('jobs')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-2 mx-auto transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Explore All {filteredJobs.length.toLocaleString()}+ Verified Tech Opportunities</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          )}

          {/* Jobs Tab Pagination Controls for 1,000+ items */}
          {activeCategory === 'jobs' && visibleJobsLimit < filteredJobs.length && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-xs text-gray-400 font-mono">
                Showing <strong className="text-white">{Math.min(visibleJobsLimit, filteredJobs.length)}</strong> of <strong className="text-emerald-400">{filteredJobs.length.toLocaleString()}</strong> verified drives
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setVisibleJobsLimit(prev => Math.min(prev + 24, filteredJobs.length))}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Load Next 24 Jobs (+24)
                </button>
                <button
                  onClick={() => setVisibleJobsLimit(prev => Math.min(prev + 100, filteredJobs.length))}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Load 100 More (+100)
                </button>
                <button
                  onClick={() => setVisibleJobsLimit(filteredJobs.length)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
                >
                  Show All ({filteredJobs.length.toLocaleString()})
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── VIEW 2: TECH & AI NEWS ───────────────────────────────────────── */}
      {(activeCategory === 'all' || activeCategory === 'news') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black font-sora text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-400" />
              <span>Live Tech & AI News Stream</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono">
                {filteredNews.length} Stories
              </span>
            </h2>
            {activeCategory === 'all' && (
              <button
                onClick={() => setActiveCategory('news')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>View All News</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map(news => (
              <div
                key={news.id}
                className="p-5 rounded-3xl bg-[#0c1220] border border-white/10 hover:border-blue-400/40 transition-all shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-400/30">
                      {news.category}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(news)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isItemBookmarked(news.id)
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={isItemBookmarked(news.id) ? 'Remove Bookmark' : 'Save Story'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-black font-sora text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {news.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {news.snippet}
                  </p>

                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {news.tags && news.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-gray-300 block">{news.source}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{news.publishedAt} • {news.readTime}</span>
                  </div>

                  <a
                    href={news.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Read Original Article"
                  >
                    <span>Read</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VIEW 3: SALARY HIKES & COMPENSATION RADAR + CALCULATOR ──────── */}
      {(activeCategory === 'all' || activeCategory === 'hikes') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black font-sora text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Salary Hikes & Tech Market Compensation Radar</span>
            </h2>
          </div>

          {/* Interactive Salary Hike Jump Calculator Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#120f26] via-[#16122d] to-[#0c1224] border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-sora text-white">
                    Interactive Tech Appraisal & Switch Multiplier Calculator
                  </h3>
                  <p className="text-xs text-gray-400">
                    Model your projected compensation jump based on 2025-2026 hiring telemetry.
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-mono font-bold">
                Live Comp Model
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
              {/* Selector Inputs */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-bold uppercase tracking-wider block">
                    1. Current Profile / Standing:
                  </label>
                  <select
                    value={calcSourceRole}
                    onChange={(e) => setCalcSourceRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {Object.entries(salaryCalcProfiles).map(([key, val]) => (
                      <option key={key} value={key} className="bg-[#12192d] text-white">
                        {val.label} ({val.currentLpa})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-bold uppercase tracking-wider block">
                    2. Desired Target Transition:
                  </label>
                  <select
                    value={calcTargetRole}
                    onChange={(e) => setCalcTargetRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {Object.entries(salaryCalcTargets).map(([key, val]) => (
                      <option key={key} value={key} className="bg-[#12192d] text-white">
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Projection Results */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Projected Target Compensation Band:
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                    {activeCalcResult.targetLpa}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
                      {activeCalcResult.hikePct} Jump
                    </span>
                    <span className="text-xs text-gray-400">
                      Est. Timeline: <strong className="text-gray-200">{activeCalcResult.timeline}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-xs">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Top Hiring Firms for this Jump:</span>
                  <span className="font-bold text-white truncate block mt-0.5">
                    {activeCalcResult.firms.join(', ')}
                  </span>
                </div>
              </div>

              {/* Required Key Levers */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] text-cyan-300 uppercase font-black tracking-wider block">
                  Must-Unlock Skills & Levers:
                </span>
                <div className="space-y-1.5">
                  {activeCalcResult.skills.map((s) => (
                    <div key={s} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHikes.map(hike => (
              <div
                key={hike.id}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#111226] to-[#18122d] border border-purple-500/20 shadow-lg space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
                      Market Transition Benchmark
                    </span>
                    <h3 className="text-sm font-black font-sora text-white mt-1.5 leading-snug">
                      {hike.transition}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black font-mono text-purple-300 block">
                      {hike.avgHike}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold block">{hike.demandTrend}</span>
                  </div>
                </div>

                {/* Compensation Bar Comparison */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Current Base Avg:</span>
                    <span className="font-mono font-bold text-gray-300">{hike.currentBaseAvg}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-300 font-bold">Post-Switch / Target Base:</span>
                    <span className="font-mono font-black text-emerald-400">{hike.targetBaseAvg}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mt-1">
                    <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full w-4/5" />
                  </div>
                </div>

                {/* Key Levers */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Key Unlocking Skills & Levers:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {hike.keyDrivers.map(d => (
                      <span key={d} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono text-[10px]">
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Hiring Companies */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Top Recruiters:</span>
                  <span className="font-bold text-white truncate max-w-xs">{hike.topRecruiters.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VIEW 4: TRENDING TECH STACKS & REPOSITORIES ─────────────────── */}
      {(activeCategory === 'all' || activeCategory === 'trending') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black font-sora text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Trending Developer Stacks & Open-Source Tools</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrending.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-[#0c1220] border border-white/10 hover:border-amber-400/40 transition-all shadow-md flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      {item.category}
                    </span>
                    <span className="font-mono font-bold text-xs text-amber-300 flex items-center gap-1">
                      {item.stars}
                    </span>
                  </div>

                  <h3 className="text-sm font-black font-sora text-white group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {item.topUses.map(u => (
                      <span key={u} className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        {u}
                      </span>
                    ))}
                  </div>

                  {/* 1-Click Install Command if available */}
                  {item.command && (
                    <div className="mt-2 p-2 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-gray-400 truncate text-[11px]">$ {item.command}</span>
                      <button
                        onClick={() => handleCopyCommand(item.id, item.command)}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        title="Copy command"
                      >
                        {copiedCommandId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCommandId === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{item.growthRate}</span>
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── VIEW 5: HIRING HEALTH & MACRO PULSE ─────────────────────────── */}
      {activeCategory === 'layoffs' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-[#0c1220] border border-white/10 space-y-4">
            <h2 className="text-lg font-black font-sora text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>Tech Industry Macro Hiring Health Radar</span>
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl">
              Real-time monitoring of corporate intake, campus quotas, and talent expansion across Big Tech and Indian Unicorn ecosystems.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {LAYOFFS_VS_HIRING_STATS.macroInsights.map(m => (
                <div key={m.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider block">{m.title}</span>
                  <p className="text-xs text-gray-300">{m.stat}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black font-sora text-white uppercase tracking-wider">
              Corporate Hiring Velocity Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {LAYOFFS_VS_HIRING_STATS.activeHiringCompanies.map(c => (
                <div key={c.name} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {c.hiringHealth}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    <strong className="text-gray-300">Target Tech Stacks:</strong> {c.domains}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW 6: SAVED BOOKMARKS ──────────────────────────────────────── */}
      {activeCategory === 'bookmarks' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black font-sora text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-yellow-400" />
              <span>Your Saved Tech Pulse Bookmarks</span>
            </h2>
          </div>

          {bookmarks.length === 0 ? (
            <div className="p-12 text-center text-gray-400 bg-white/5 border border-white/10 rounded-3xl space-y-2">
              <Bookmark className="w-10 h-10 text-yellow-400/50 mx-auto" />
              <h3 className="font-bold text-white text-base">No Saved Bookmarks Yet</h3>
              <p className="text-xs text-gray-400">
                Click the bookmark icon on any job drive, news story, or tech stack to pin it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map(item => (
                <div key={item.id} className="p-5 rounded-3xl bg-[#0c1220] border border-white/10 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      {item.company || item.category || 'Tech Pulse'}
                    </span>
                    <h4 className="font-bold text-white text-sm">{item.title || item.name}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{item.description || item.snippet}</p>
                    {item.salaryRange && (
                      <span className="inline-block mt-2 font-mono font-bold text-emerald-300 text-xs">
                        {item.salaryRange}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleBookmark(item)}
                      className="p-2 rounded-xl bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                    {(item.applyUrl || item.sourceUrl || item.githubUrl) && (
                      <a
                        href={item.applyUrl || item.sourceUrl || item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                        title="Open Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── DETAIL & INTERVIEW PREP MODAL ─────────────────────────────────── */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b101b] border border-cyan-500/30 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 relative custom-scrollbar shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                  {selectedDetailItem.company || selectedDetailItem.category}
                </span>
                <h3 className="text-lg font-black font-sora text-white mt-1">
                  {selectedDetailItem.title || selectedDetailItem.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDetailItem(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedDetailItem.salaryRange && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Estimated Package</span>
                  <span className="text-base font-black font-mono text-emerald-300">{selectedDetailItem.salaryRange}</span>
                </div>
                <span className="text-xs text-gray-300 font-bold">{selectedDetailItem.location}</span>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <span className="font-bold text-gray-300 block uppercase tracking-wider text-[10px]">Role Overview:</span>
              <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl">
                {selectedDetailItem.description || selectedDetailItem.snippet}
              </p>
            </div>

            {selectedDetailItem.requirements && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-gray-300 block uppercase tracking-wider text-[10px]">Eligibility & Criteria:</span>
                <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl">
                  {selectedDetailItem.requirements}
                </p>
              </div>
            )}

            {selectedDetailItem.rounds && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-cyan-300 block uppercase tracking-wider text-[10px]">Interview Selection Blueprint:</span>
                <div className="bg-white/5 p-3 rounded-xl space-y-1.5">
                  {selectedDetailItem.rounds.map((r, i) => (
                    <div key={r} className="flex items-center gap-2 text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LinkedIn Referral Pitch Generator */}
            {selectedDetailItem.itemType === 'job' && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-purple-300 block text-[11px]">Looking for a Referral?</span>
                  <span className="text-gray-400 text-[10px]">Generate a ready-to-send LinkedIn DM message for employees.</span>
                </div>
                <button
                  onClick={() => handleCopyReferralPitch(selectedDetailItem)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Pitch</span>
                </button>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {(selectedDetailItem.applyUrl || selectedDetailItem.sourceUrl || selectedDetailItem.githubUrl) && (
                <a
                  href={selectedDetailItem.applyUrl || selectedDetailItem.sourceUrl || selectedDetailItem.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 text-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>Open Official Application / Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
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
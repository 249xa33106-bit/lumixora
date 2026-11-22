import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Search, ExternalLink, Bookmark, 
  CheckCircle2, Info, ArrowUpRight, Copy, Check, Gift, Code2, 
  Bot, Cloud, Palette, Zap, Globe, ShieldCheck, 
  PlusCircle, X, RefreshCw, Star, Wallet, CheckCircle
} from 'lucide-react';
import { 
  STUDENT_CATEGORIES, 
  STUDENT_OFFERS, 
  TOTAL_CLAIMABLE_SAVINGS 
} from '../data/studentOffersData';
import { useToast } from '../context/ToastContext';

const CATEGORY_ICONS = {
  'all': Sparkles,
  'dev-tools': Code2,
  'ai-ml': Bot,
  'cloud-devops': Cloud,
  'design-3d': Palette,
  'productivity': Zap,
  'domains-web': Globe
};

export default function StudentOffersPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDealType, setSelectedDealType] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'instant-gprec' | 'claimed' | 'saved'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeModalOffer, setActiveModalOffer] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Student Email Helper
  const studentEmail = user?.email || 'student@gprec.ac.in';

  // 1. Saved Perks (LocalStorage)
  const [savedOffers, setSavedOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_saved_student_offers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Claimed Perks / Wallet (LocalStorage)
  const [claimedOffers, setClaimedOffers] = useState(() => {
    try {
      const claimed = localStorage.getItem('lumixora_claimed_student_offers');
      return claimed ? JSON.parse(claimed) : [];
    } catch {
      return [];
    }
  });

  const handleCopyEmail = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(studentEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
      if (addToast) addToast({ message: `Copied ${studentEmail} to clipboard!`, type: 'success' });
    }
  };

  const toggleBookmark = (offerId) => {
    let updated;
    if (savedOffers.includes(offerId)) {
      updated = savedOffers.filter(id => id !== offerId);
      if (addToast) addToast({ message: 'Removed from saved perks', type: 'info' });
    } else {
      updated = [...savedOffers, offerId];
      if (addToast) addToast({ message: 'Saved to your perks!', type: 'success' });
    }
    setSavedOffers(updated);
    try {
      localStorage.setItem('lumixora_saved_student_offers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleClaim = (offer) => {
    let updated;
    const isClaimed = claimedOffers.includes(offer.id);
    if (isClaimed) {
      updated = claimedOffers.filter(id => id !== offer.id);
      if (addToast) addToast({ message: `Unmarked ${offer.title}`, type: 'info' });
    } else {
      updated = [...claimedOffers, offer.id];
      if (addToast) addToast({ 
        message: `🎉 Claimed ${offer.title}! Wallet updated: +$${offer.numericValue || 50}`, 
        type: 'success' 
      });
    }
    setClaimedOffers(updated);
    try {
      localStorage.setItem('lumixora_claimed_student_offers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Wallet Calculations
  const totalEcosystemValue = useMemo(() => {
    return STUDENT_OFFERS.reduce((acc, o) => acc + (o.numericValue || 50), 0);
  }, []);

  const claimedTotalValue = useMemo(() => {
    return STUDENT_OFFERS
      .filter(o => claimedOffers.includes(o.id))
      .reduce((acc, o) => acc + (o.numericValue || 50), 0);
  }, [claimedOffers]);

  const claimedPercentage = totalEcosystemValue > 0
    ? Math.min(100, Math.round((claimedTotalValue / totalEcosystemValue) * 100))
    : 0;

  const instantGprecCount = useMemo(() => {
    return STUDENT_OFFERS.filter(o => o.instantGprec).length;
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: STUDENT_OFFERS.length };
    STUDENT_OFFERS.forEach(o => {
      counts[o.category] = (counts[o.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered Offers Calculation
  const filteredOffers = useMemo(() => {
    return STUDENT_OFFERS.filter(offer => {
      // Quick Filters
      if (quickFilter === 'saved' && !savedOffers.includes(offer.id)) return false;
      if (quickFilter === 'claimed' && !claimedOffers.includes(offer.id)) return false;
      if (quickFilter === 'instant-gprec' && !offer.instantGprec) return false;

      // Category filter
      if (selectedCategory !== 'all' && offer.category !== selectedCategory) return false;

      // Deal type filter
      if (selectedDealType !== 'all') {
        if (selectedDealType === 'free-pro' && offer.dealType !== 'free-pro') return false;
        if (selectedDealType === 'credits' && offer.dealType !== 'credits') return false;
        if (selectedDealType === 'free-forever' && offer.dealType !== 'free-forever' && offer.dealType !== 'pack') return false;
        if (selectedDealType === 'discount' && offer.dealType !== 'discount') return false;
      }

      // Verification filter
      if (selectedVerification !== 'all') {
        const vLower = (offer.verification || '').toLowerCase();
        if (selectedVerification === 'email' && !vLower.includes('email') && !vLower.includes('@gprec')) return false;
        if (selectedVerification === 'github' && !vLower.includes('github')) return false;
        if (selectedVerification === 'id' && !vLower.includes('id') && !vLower.includes('sheerid')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = offer.title.toLowerCase().includes(q);
        const matchesCompany = offer.company.toLowerCase().includes(q);
        const matchesDesc = offer.description.toLowerCase().includes(q);
        const matchesPerks = (offer.highlights || []).some(h => h.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesPerks) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDealType, selectedVerification, quickFilter, savedOffers, claimedOffers]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedDealType !== 'all' || selectedVerification !== 'all' || quickFilter !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDealType('all');
    setSelectedVerification('all');
    setQuickFilter('all');
  };

  return (
    <div className="w-full min-h-screen text-slate-100 pb-20 animate-fade-in relative z-10">
      
      {/* ─── 1. COMPACT OBSIDIAN HEADER & GAMIFIED WALLET (ZERO-SCROLL) ─── */}
      <div className="w-full rounded-2xl md:rounded-3xl bg-[#0b0f19] border border-slate-800/80 p-5 md:p-6 mb-5 shadow-xl relative overflow-hidden text-left">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-36 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-36 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Left Column: Brand & College Pass */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                <Gift className="w-3 h-3 text-cyan-400" />
                <span>Student Perks & Developer Packs</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {STUDENT_OFFERS.length} Verified Deals
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>Verified Student Benefits</span>
              <span className="text-xs font-mono font-bold text-slate-400 py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800">
                {TOTAL_CLAIMABLE_SAVINGS} Value
              </span>
            </h1>

            {/* College Pass 1-Click Copy */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <span className="text-[11px] text-slate-400">College Pass:</span>
                <span className="font-mono font-bold text-cyan-300">{studentEmail}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="ml-1 p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                  title="Copy college email for verification"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className={copiedEmail ? 'text-emerald-400' : ''}>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Submit Perk</span>
              </button>
            </div>
          </div>

          {/* Right Column: Gamified "My Claimed Savings" Wallet */}
          <div className="w-full lg:w-80 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                <span>My Unlocked Wallet</span>
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ${claimedTotalValue.toLocaleString()} <span className="text-slate-500 text-xs">/ ${totalEcosystemValue.toLocaleString()}</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800/60">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(claimedPercentage, claimedOffers.length > 0 ? 5 : 0)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{claimedOffers.length} of {STUDENT_OFFERS.length} perks claimed</span>
              <button
                onClick={() => setQuickFilter(quickFilter === 'claimed' ? 'all' : 'claimed')}
                className={`font-semibold transition-colors cursor-pointer ${
                  quickFilter === 'claimed' ? 'text-emerald-400 underline' : 'text-cyan-400 hover:underline'
                }`}
              >
                {quickFilter === 'claimed' ? 'Show All' : 'View Claimed →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. FAST ACTION FILTER ROW (ALL / INSTANT GPREC / CLAIMED / SAVED) ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none text-left">
        <button
          type="button"
          onClick={() => setQuickFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            quickFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>All Perks</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${quickFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {STUDENT_OFFERS.length}
          </span>
        </button>

        {/* 1-Click Instant @gprec.ac.in Filter */}
        <button
          type="button"
          onClick={() => setQuickFilter(quickFilter === 'instant-gprec' ? 'all' : 'instant-gprec')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            quickFilter === 'instant-gprec'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400'
              : 'bg-cyan-950/40 text-cyan-300 hover:bg-cyan-950/70 border border-cyan-800/50'
          }`}
          title="Filter offers that approve instantly with @gprec.ac.in email"
        >
          <span className="text-amber-400">⚡</span>
          <span>Instant @gprec.ac.in Pass</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${quickFilter === 'instant-gprec' ? 'bg-white/20 text-white' : 'bg-cyan-900/60 text-cyan-300'}`}>
            {instantGprecCount}
          </span>
        </button>

        {/* Claimed Perks Filter */}
        <button
          type="button"
          onClick={() => setQuickFilter(quickFilter === 'claimed' ? 'all' : 'claimed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            quickFilter === 'claimed'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
              : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>My Claimed Perks</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${quickFilter === 'claimed' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {claimedOffers.length}
          </span>
        </button>

        {/* Saved / Bookmarked Filter */}
        <button
          type="button"
          onClick={() => setQuickFilter(quickFilter === 'saved' ? 'all' : 'saved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            quickFilter === 'saved'
              ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400'
              : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Saved</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${quickFilter === 'saved' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
            {savedOffers.length}
          </span>
        </button>
      </div>

      {/* ─── 3. CATEGORY TABS RAIL ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none text-left">
        {STUDENT_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const IconComp = CATEGORY_ICONS[cat.id] || Sparkles;
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/60'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-400 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── 4. SEARCH & SECONDARY FILTERS TOOLBAR ─── */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-left">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search perks by tool, company, or value (e.g. GitHub, JetBrains, Azure, AI, Cloud)..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & View Toggle */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Deal Type Dropdown */}
          <select
            value={selectedDealType}
            onChange={(e) => setSelectedDealType(e.target.value)}
            className="bg-slate-950/90 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
          >
            <option value="all">All Deal Types</option>
            <option value="free-pro">Free Pro Subscription</option>
            <option value="credits">Cloud Credits</option>
            <option value="free-forever">Free Forever</option>
            <option value="discount">Student Discount</option>
          </select>

          {/* Verification Dropdown */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="bg-slate-950/90 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
          >
            <option value="all">All Verification</option>
            <option value="email">College Email (@gprec.ac.in)</option>
            <option value="github">GitHub Student Pack</option>
            <option value="id">Student ID / SheerID</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-xs" />
                <div className="bg-current rounded-xs" />
                <div className="bg-current rounded-xs" />
                <div className="bg-current rounded-xs" />
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <div className="w-3.5 h-3.5 flex flex-col justify-between py-0.5">
                <div className="h-0.5 w-full bg-current rounded-xs" />
                <div className="h-0.5 w-full bg-current rounded-xs" />
                <div className="h-0.5 w-full bg-current rounded-xs" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5. ACTIVE FILTERS STATUS & RESULTS HEADER ─── */}
      <div className="flex items-center justify-between mb-4 text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white font-bold">{filteredOffers.length}</strong> student perks
          </span>
          {quickFilter === 'instant-gprec' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
              ⚡ Instant @gprec.ac.in Deals
            </span>
          )}
          {quickFilter === 'claimed' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              ✓ Claimed Deals
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetAllFilters}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* ─── 6. OFFERS RESULTS (GRID / LIST) ─── */}
      {filteredOffers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-left">
          <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1 text-center">No matching student perks found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 text-center">
            Try adjusting your search terms or reset the filters to browse all verified developer perks.
          </p>
          <div className="text-center">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 transition-all cursor-pointer"
            >
              View All {STUDENT_OFFERS.length} Offers
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 text-left">
          {filteredOffers.map((offer) => {
            const isSaved = savedOffers.includes(offer.id);
            const isClaimed = claimedOffers.includes(offer.id);
            return (
              <div
                key={offer.id}
                className={`p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                  isClaimed 
                    ? 'border-emerald-500/40 shadow-emerald-950/20 shadow-lg' 
                    : 'border-slate-800/80 hover:border-cyan-500/40 shadow-lg'
                }`}
              >
                {/* Claimed Indicator Ribbon */}
                {isClaimed && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="absolute transform rotate-45 bg-emerald-500 text-slate-950 text-[8px] font-black py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow-sm">
                      CLAIMED
                    </div>
                  </div>
                )}

                <div>
                  {/* Top Tool Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${offer.iconColor || 'from-indigo-600 to-purple-600'} p-2 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0`}>
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {offer.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 block">{offer.company}</span>
                      </div>
                    </div>

                    {/* Bookmark & Claim Actions */}
                    <div className="flex items-center gap-1 shrink-0 z-10">
                      <button
                        type="button"
                        onClick={() => toggleClaim(offer)}
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isClaimed
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300 hover:bg-slate-800'
                        }`}
                        title={isClaimed ? "Click to unmark as claimed" : "Mark as Claimed"}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isClaimed ? 'text-emerald-400 fill-emerald-400/20' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleBookmark(offer.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        title={isSaved ? "Remove from saved" : "Save this perk"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Value Badges & Instant GPREC Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                      {offer.deal}
                    </span>
                    {offer.value && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-800/40">
                        {offer.value}
                      </span>
                    )}
                    {offer.instantGprec && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
                        <span>⚡</span>
                        <span>Instant @gprec</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {offer.description}
                  </p>

                  {/* Verification Requirement */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-4 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Requires: <strong className="text-slate-300 font-semibold">{offer.verification}</strong></span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setActiveModalOffer(offer)}
                    className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Claim Guide</span>
                  </button>
                  <a
                    href={offer.claimUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
                  >
                    <span>Claim Offer</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3 text-left">
          {filteredOffers.map((offer) => {
            const isSaved = savedOffers.includes(offer.id);
            const isClaimed = claimedOffers.includes(offer.id);
            return (
              <div
                key={offer.id}
                className={`p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isClaimed ? 'border-emerald-500/40 shadow-emerald-950/20' : 'border-slate-800/80 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${offer.iconColor || 'from-indigo-600 to-purple-600'} p-2 flex items-center justify-center text-white shrink-0`}>
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                        {offer.title}
                      </h4>
                      <span className="text-xs text-slate-400">• {offer.company}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {offer.deal}
                      </span>
                      {offer.instantGprec && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          ⚡ Instant @gprec
                        </span>
                      )}
                      {isClaimed && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                          ✓ Claimed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                      {offer.description}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Requires: <strong className="text-slate-300">{offer.verification}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleClaim(offer)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      isClaimed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                        : 'bg-slate-800 text-slate-400 hover:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isClaimed ? 'Claimed' : 'Mark Claimed'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(offer.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    title={isSaved ? "Remove from saved" : "Save this perk"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalOffer(offer)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Claim Guide
                  </button>
                  <a
                    href={offer.claimUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <span>Claim ↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── 7. FAST-CLAIM MODAL WITH 1-CLICK EMAIL COPY (UPGRADE 4) ─── */}
      {activeModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col text-left">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModalOffer.iconColor || 'from-indigo-600 to-purple-600'} p-2.5 flex items-center justify-center text-white shrink-0 shadow-lg`}>
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeModalOffer.title}</h3>
                  <span className="text-xs text-cyan-400 font-semibold">{activeModalOffer.company} • {activeModalOffer.value}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalOffer(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* College Pass 1-Click Copy Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-800/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Step 1: Your University Email Credential
                </span>
                <p className="text-xs text-slate-300 mb-2.5">
                  Use your official college email address on the student verification page to unlock this deal.
                </p>
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-mono text-xs font-bold text-cyan-300 pl-1">{studentEmail}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Requirements</h4>
                <div className="space-y-1.5">
                  {(activeModalOffer.requirements || ['College Email (@gprec.ac.in)', 'Current Student Status']).map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Activation Guide */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Step-by-Step Activation Guide
                </h4>
                <div className="space-y-3">
                  {(activeModalOffer.howToClaim || [
                    'Open the official education portal using the button below.',
                    'Register or log in using your official @gprec.ac.in college email.',
                    'Verify the activation link sent to your college inbox.',
                    'Enjoy 100% free student access!'
                  ]).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleClaim(activeModalOffer)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  claimedOffers.includes(activeModalOffer.id)
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{claimedOffers.includes(activeModalOffer.id) ? 'Claimed ✓' : 'Mark as Claimed'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalOffer(null)}
                  className="px-4 py-2.5 rounded-xl hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={activeModalOffer.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  <span>Open Verification Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 8. "SUBMIT A STUDENT OFFER" MODAL ─── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>Submit a Student Perk</span>
              </h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Discovered a new free developer tool, cloud credits, or software discount for scholars? Submit it for the community.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitModalOpen(false);
                if (addToast) addToast({ message: 'Thank you! Offer submitted for verification.', type: 'success' });
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Tool / Service Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Cursor Pro, Claude Credits, Warp Terminal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Student Deal / Perk</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Free Pro for 1 year, $100 Cloud Credits"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Official Student URL</label>
                <input
                  required
                  type="url"
                  placeholder="https://company.com/students"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Verification Method</label>
                <input
                  type="text"
                  placeholder="e.g. College email (@gprec.ac.in) or GitHub Pack"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

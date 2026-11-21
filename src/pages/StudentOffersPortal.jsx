import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, Search, Filter, ExternalLink, Bookmark, BookmarkCheck, 
  CheckCircle2, Info, ArrowUpRight, Copy, Check, Gift, Code2, 
  Bot, Cloud, Palette, Zap, Globe, ShieldCheck, ChevronRight, 
  HelpCircle, PlusCircle, X, SlidersHorizontal, RefreshCw, Star
} from 'lucide-react';
import { 
  STUDENT_CATEGORIES, 
  STUDENT_OFFERS, 
  TOTAL_CLAIMABLE_SAVINGS, 
  TOTAL_VERIFIED_OFFERS_COUNT 
} from '../data/studentOffersData';
import { useToast } from '../context/ToastContext';

export default function StudentOffersPortal({ user, setActiveTab }) {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDealType, setSelectedDealType] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [activeModalOffer, setActiveModalOffer] = useState(null); // 'howToClaim' modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Bookmarked Offers (Stored in LocalStorage)
  const [savedOffers, setSavedOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('lumixora_saved_student_offers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [onlySaved, setOnlySaved] = useState(false);

  // Student Email Helper
  const studentEmail = user?.email || 'student@gprec.ac.in';

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

  // Filtered Offers Calculation
  const filteredOffers = useMemo(() => {
    return STUDENT_OFFERS.filter(offer => {
      // Saved filter
      if (onlySaved && !savedOffers.includes(offer.id)) return false;

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
  }, [searchQuery, selectedCategory, selectedDealType, selectedVerification, onlySaved, savedOffers]);

  // Spotlight Trinity
  const spotlightOffers = useMemo(() => {
    return STUDENT_OFFERS.filter(o => o.spotlight);
  }, []);

  return (
    <div className="w-full min-h-screen text-slate-100 pb-20 animate-fade-in relative z-10">
      
      {/* ─── 1. HERO BANNER: UNLOCK $14,500+ IN STUDENT PRO TOOLS ─── */}
      <div className="w-full relative overflow-hidden rounded-3xl md:rounded-[36px] bg-gradient-to-br from-[#0c1222] via-[#090e1a] to-[#050811] border border-white/10 shadow-2xl p-6 sm:p-8 md:p-12 mb-8">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide mb-4 shadow-sm backdrop-blur-md">
            <Gift className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>VERIFIED STUDENT DEVELOPER BENEFITS & PERKS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-mono">590+ ACTIVE</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
            Unlock <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">{TOTAL_CLAIMABLE_SAVINGS}</span> in Pro Tools & Cloud Credits
          </h1>

          {/* Subtext */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-6">
            Your university student status and college email (<code className="text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 font-mono text-xs">@gprec.ac.in</code>) qualify you for 100% free Pro subscriptions, AI coding copilots, and cloud compute.
          </p>

          {/* Quick College Email Action Helper */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-md">
              <span className="text-xs text-slate-400">Your College Pass:</span>
              <span className="font-mono text-xs font-bold text-cyan-300">{studentEmail}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="ml-1 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                title="Copy college email for student verification forms"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Submit a Student Offer</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Student Value</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{TOTAL_CLAIMABLE_SAVINGS}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Annual student savings</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Featured Offers</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400">45+ Handpicked</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">590+ in global network</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">GPREC College Pass</span>
            <span className="text-xl sm:text-2xl font-black text-purple-400">Active</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Instant @gprec verification</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">My Saved Perks</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">{savedOffers.length} Saved</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Saved for activation</span>
          </div>
        </div>
      </div>

      {/* ─── 2. THE ESSENTIAL TRINITY (SPOTLIGHT HERO CARDS) ─── */}
      <div className="mb-10 text-left">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>The Essential Student Trinity</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The three non-negotiable student packs every computer science and engineering scholar should claim first.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {spotlightOffers.map((offer) => (
            <div 
              key={offer.id} 
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${offer.iconColor} p-2.5 flex items-center justify-center shadow-lg shrink-0`}>
                    <Code2 className="w-full h-full text-white" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {offer.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(offer.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title={savedOffers.includes(offer.id) ? "Remove from saved" : "Save this perk"}
                    >
                      <Bookmark className={`w-4 h-4 ${savedOffers.includes(offer.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {offer.title}
                </h3>
                <span className="text-xs text-indigo-400 font-semibold block mb-2">{offer.company}</span>
                
                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {offer.description}
                </p>

                {/* Micro Highlights */}
                <div className="space-y-1 mb-4 pt-2 border-t border-slate-800/80">
                  {offer.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveModalOffer(offer)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>How to Claim</span>
                </button>
                <a
                  href={offer.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
                >
                  <span>Claim Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. INTERACTIVE CATEGORY SELECTOR RAIL ─── */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none text-left">
        <div className="flex items-center gap-2 min-w-max">
          {STUDENT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id && !onlySaved;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOnlySaved(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}

          {/* Bookmarked Filter Pill */}
          <button
            type="button"
            onClick={() => setOnlySaved(!onlySaved)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              onlySaved
                ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Saved Perks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {savedOffers.length}
            </span>
          </button>
        </div>
      </div>

      {/* ─── 4. SEARCH & ADVANCED FILTER TOOLBAR ─── */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-left">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, company, or deal (e.g. GitHub, JetBrains, AI, Cloud, $200)..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-all font-medium"
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

        {/* Secondary Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Deal Type Dropdown */}
          <select
            value={selectedDealType}
            onChange={(e) => setSelectedDealType(e.target.value)}
            className="bg-slate-950/90 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
          >
            <option value="all">All Deal Types</option>
            <option value="free-pro">Free Pro Subscription</option>
            <option value="credits">Cloud Credits ($50-$200)</option>
            <option value="free-forever">100% Free Forever</option>
            <option value="discount">Student Discount (50-80%)</option>
          </select>

          {/* Verification Dropdown */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="bg-slate-950/90 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
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
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
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
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
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

      {/* ─── 5. OFFERS RESULTS (GRID / LIST) ─── */}
      <div className="text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white font-bold">{filteredOffers.length}</strong> verified offers
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedDealType !== 'all' || selectedVerification !== 'all' || onlySaved) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDealType('all');
                setSelectedVerification('all');
                setOnlySaved(false);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {filteredOffers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
            <Gift className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No matching student perks found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              Try tweaking your search keywords or clear the category and deal filters to browse the complete directory.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDealType('all');
                setSelectedVerification('all');
                setOnlySaved(false);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all cursor-pointer"
            >
              View All 45+ Offers
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredOffers.map((offer) => {
              const isSaved = savedOffers.includes(offer.id);
              return (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Tag Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
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

                      <button
                        type="button"
                        onClick={() => toggleBookmark(offer.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        title={isSaved ? "Remove from saved" : "Save this perk"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Value Badge & Deal Tag */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                        {offer.deal}
                      </span>
                      {offer.value && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-800/40">
                          {offer.value}
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

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setActiveModalOffer(offer)}
                      className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>How to Claim</span>
                    </button>
                    <a
                      href={offer.claimUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer"
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
          /* List View */
          <div className="space-y-3">
            {filteredOffers.map((offer) => {
              const isSaved = savedOffers.includes(offer.id);
              return (
                <div
                  key={offer.id}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
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
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                        {offer.description}
                      </p>
                      <span className="text-[10px] text-cyan-400 mt-1 block">
                        Requires: {offer.verification}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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
                      How to Claim
                    </button>
                    <a
                      href={offer.claimUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer"
                    >
                      <span>Claim ↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 6. STEP-BY-STEP "HOW TO CLAIM" MODAL ─── */}
      {activeModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col text-left">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModalOffer.iconColor || 'from-indigo-600 to-purple-600'} p-2.5 flex items-center justify-center text-white shrink-0`}>
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeModalOffer.title}</h3>
                  <span className="text-xs text-indigo-400 font-semibold">{activeModalOffer.company} • {activeModalOffer.value}</span>
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
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">Active Deal</span>
                <p className="text-xs text-white font-semibold">{activeModalOffer.deal}</p>
                <p className="text-[11px] text-slate-300 mt-1">{activeModalOffer.description}</p>
              </div>

              {/* Requirements Box */}
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

              {/* Step by Step Activation Instructions */}
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
                      <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy College Email'}</span>
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  <span>Go to Official Offer Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. "SUBMIT A STUDENT OFFER" MODAL ─── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                <span>Submit a New Student Offer</span>
              </h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Discovered a new free software discount, AI credit, or developer tool for university scholars? Submit it to share with the entire Lumixora community.
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Student Deal / Perk</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Free Pro for 1 year, $100 Cloud Credits"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Official Student URL</label>
                <input
                  required
                  type="url"
                  placeholder="https://company.com/students"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Verification Method</label>
                <input
                  type="text"
                  placeholder="e.g. College email (@gprec.ac.in) or GitHub Pack"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
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

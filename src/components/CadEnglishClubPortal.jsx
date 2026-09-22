import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { 
  Shield, Users, Sparkles, QrCode, CheckCircle2, AlertCircle, Edit3, 
  Search, Filter, ExternalLink, Calendar, MapPin, Award, BookOpen, 
  Cpu, FileText, Megaphone, Mic, Plus, Trash2, Check, X, Download, 
  Copy, Eye, RefreshCw, Key, Star, Heart, Lock, Unlock, Phone, Mail, 
  Globe, ArrowRight, ChevronRight, Layers, UserCheck
} from 'lucide-react';
import { 
  CAD_CLUB_META, 
  CAD_TEAMS_LIST, 
  INITIAL_CAD_MEMBERS, 
  CAD_EVENTS_CALENDAR 
} from '../data/cadEnglishClubData';
import { useToast } from '../context/ToastContext';

export default function CadEnglishClubPortal({ user, isFounder = false, onClose }) {
  const toastContext = useToast();
  const addToast = toastContext?.addToast || toastContext?.showToast || (({ message }) => console.log(message));
  const showToast = (msg, type = 'info') => {
    if (typeof msg === 'string') {
      addToast({ message: msg, type });
    } else {
      addToast(msg);
    }
  };
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [qrModalMember, setQrModalMember] = useState(null);
  const [qrModalDataUrl, setQrModalDataUrl] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [qrScanView, setQrScanView] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'hierarchy' | 'events' | 'verification'

  // Persisted members in localStorage with fallback to INITIAL_CAD_MEMBERS
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('cad_english_club_members_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(m => {
            const initMatch = INITIAL_CAD_MEMBERS.find(im => im.id === m.id);
            return {
              ...m,
              avatar: `/cad_club_photos/${m.id}.jpg?v=3`
            };
          });
        }
      }
    } catch (e) {}
    return INITIAL_CAD_MEMBERS.map(m => ({
      ...m,
      avatar: `/cad_club_photos/${m.id}.jpg?v=3`
    }));
  });

  // Pending Verification Requests
  const [verificationRequests, setVerificationRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('cad_verification_requests_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Save members whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('cad_english_club_members_v3', JSON.stringify(members));
    } catch (e) {}
  }, [members]);

  // Save verification requests
  useEffect(() => {
    try {
      localStorage.setItem('cad_verification_requests_v1', JSON.stringify(verificationRequests));
    } catch (e) {}
  }, [verificationRequests]);

  // Current logged in user's matching member profile (if any)
  const userEmail = (user?.email || '').toLowerCase().trim();
  const currentMember = useMemo(() => {
    if (!userEmail) return null;
    return members.find(m => m.email.toLowerCase() === userEmail) || null;
  }, [members, userEmail]);

  const canEdit = (member) => {
    if (!member) return false;
    if (isFounder) return true;
    if (currentMember && currentMember.id === member.id && currentMember.isVerified) return true;
    return false;
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesTab = activeTab === 'all' 
        || m.teamId === activeTab 
        || m.secondaryTeamId === activeTab;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q 
        || m.name.toLowerCase().includes(q)
        || m.role.toLowerCase().includes(q)
        || m.wing.toLowerCase().includes(q)
        || m.branch.toLowerCase().includes(q)
        || m.id.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [members, activeTab, searchQuery]);

  // Handle founder approval / verification
  const handleVerifyMember = (memberId, grant = true) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          isVerified: grant,
          verifiedBy: grant ? (user?.name || "Founder Shaik Sowban") : null,
          verifiedAt: grant ? new Date().toISOString().split('T')[0] : null
        };
      }
      return m;
    }));

    setVerificationRequests(prev => prev.filter(r => r.memberId !== memberId));
    
    if (showToast) {
      showToast(grant ? `✅ Member ${memberId} successfully verified & granted edit rights!` : `❌ Member ${memberId} verification revoked.`, grant ? 'success' : 'info');
    }
  };

  // Handle member requesting verification
  const handleRequestVerification = (member) => {
    const existing = verificationRequests.find(r => r.memberId === member.id);
    if (existing) {
      if (showToast) showToast("Your verification request is already pending with the Founder.", "info");
      return;
    }
    const newReq = {
      memberId: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      wing: member.wing,
      requestedAt: new Date().toLocaleString()
    };
    setVerificationRequests(prev => [newReq, ...prev]);
    if (showToast) showToast("🚀 Verification request submitted to Founder Shaik Sowban! You will get edit rights once approved.", "success");
  };

  // Save profile edits
  const handleSaveMemberEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembers(prev => prev.map(m => m.id === editingMember.id ? editingMember : m));
    setEditingMember(null);
    if (showToast) showToast("✨ Club profile updated successfully!", "success");
  };

  // Add new member
  const handleAddNewMember = (newMem) => {
    setMembers(prev => [newMem, ...prev]);
    setShowAddModal(false);
    if (showToast) showToast(`🎉 New member ${newMem.name} added to CAD & English Club!`, "success");
  };

  // Generate real scannable QR Code whenever qrModalMember is set
  useEffect(() => {
    if (!qrModalMember) {
      setQrModalDataUrl('');
      return;
    }
    const origin = typeof window !== 'undefined' ? (window.location.origin || 'http://localhost:5173') : 'http://localhost:5173';
    const verifyUrl = `${origin}/#cad-verify/${qrModalMember.id}`;

    QRCode.toDataURL(verifyUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#031024',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(url => {
      setQrModalDataUrl(url);
    }).catch(err => {
      console.warn("QR generation err:", err);
    });
  }, [qrModalMember]);

  // Copy QR info / direct public link
  const handleCopyQRData = (member) => {
    const origin = typeof window !== 'undefined' ? (window.location.origin || 'http://localhost:5173') : 'http://localhost:5173';
    const verifyUrl = `${origin}/#cad-verify/${member.id}`;

    navigator.clipboard.writeText(verifyUrl).then(() => {
      setCopiedId(member.id);
      setTimeout(() => setCopiedId(null), 2500);
      if (showToast) showToast("📋 Public Verification Pass link copied to clipboard!", "success");
    });
  };

  return (
    <div className="space-y-8 text-gray-100 font-sans pb-12 animate-fade-in">
      {/* ================= HERO SHOWCASE ================= */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0c1322] via-[#09101d] to-[#0d0d18] shadow-[0_20px_50px_rgba(6,182,212,0.15)]">
        {/* Background glow auras */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {CAD_CLUB_META.institution}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-extrabold tracking-wider">
                {CAD_CLUB_META.motto}
              </span>
              {isFounder && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Founder Super-Admin Access
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {CAD_CLUB_META.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
              <span className="text-cyan-400 font-bold">"{CAD_CLUB_META.tagline}"</span> — {CAD_CLUB_META.subMotto} {CAD_CLUB_META.about}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
                <span className="text-2xl font-black text-cyan-400">{members.length}</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total Members</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
                <span className="text-2xl font-black text-blue-400">{CAD_CLUB_META.wingsCount}</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Execution Wings</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
                <span className="text-2xl font-black text-purple-400">{CAD_CLUB_META.leadershipCount}</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Office Bearers</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
                <span className="text-2xl font-black text-emerald-400">100%</span>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Verified Badges</p>
              </div>
            </div>
            {/* Official Domain & Live Portal Banner */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/50 border border-cyan-500/30 text-xs text-gray-300 backdrop-blur-md">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portal Route:</span>
                <strong className="text-cyan-300 font-mono">lumixora.in#cad&englishclub</strong>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://lumixora.in/#cad&englishclub");
                    if (showToast) showToast("📋 Copied https://lumixora.in/#cad&englishclub to clipboard!", "success");
                  }}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-colors cursor-pointer ml-1"
                >
                  Copy Link
                </button>
              </div>

              <a
                href="https://cad-english-club-gprec.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-500/30 hover:from-blue-600/50 hover:to-cyan-500/50 border border-cyan-400/40 text-xs font-black text-cyan-300 transition-all shadow-md"
              >
                <span>Live Site: cad-english-club-gprec.web.app</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <a
              href="https://cad-english-club-gprec.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:opacity-95 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" /> Open Official Web App
            </a>

            <button
              onClick={() => setViewMode(viewMode === 'live_site' ? 'cards' : 'live_site')}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer border ${
                viewMode === 'live_site' 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{viewMode === 'live_site' ? 'Switch to Native Roster' : 'Embed Live Web App'}</span>
            </button>

            {isFounder && (
              <>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Club Member
                </button>

                <button
                  onClick={() => {
                    const fresh = INITIAL_CAD_MEMBERS.map(m => ({
                      ...m,
                      avatar: `/cad_club_photos/${m.id}.jpg?v=${Date.now()}`
                    }));
                    setMembers(fresh);
                    localStorage.setItem('cad_english_club_members_v3', JSON.stringify(fresh));
                    if (showToast) showToast("✨ All 44 authentic member photos synchronized!", "success");
                  }}
                  className="px-4 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  title="Synchronize all 44 high-res photos from the slide presentation"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Sync Official Photos
                </button>
              </>
            )}

            <button
              onClick={() => setQrScanView(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-400" /> Test QR Badge Scanner
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/5"
              >
                &larr; Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= MEMBER VERIFICATION CALLOUT (IF LOGGED IN) ================= */}
      {currentMember && (
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md ${
          currentMember.isVerified 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              currentMember.isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {currentMember.isVerified ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase text-white">{currentMember.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  {currentMember.id}
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  currentMember.isVerified ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'
                }`}>
                  {currentMember.isVerified ? 'Verified Active Member' : 'Verification Required'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {currentMember.role} • {currentMember.wing} • {currentMember.batch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {currentMember.isVerified ? (
              <button
                onClick={() => setEditingMember(currentMember)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit My Profile
              </button>
            ) : (
              <button
                onClick={() => handleRequestVerification(currentMember)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" /> Request Founder Verification
              </button>
            )}
            <button
              onClick={() => setQrModalMember(currentMember)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" /> My QR Pass
            </button>
          </div>
        </div>
      )}

      {/* ================= FOUNDER APPROVAL QUEUE (FOUNDER ONLY) ================= */}
      {isFounder && verificationRequests.length > 0 && (
        <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-blue-950/40 border-2 border-purple-500/40 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Pending Member Verification Queue ({verificationRequests.length})
              </h3>
            </div>
            <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
              Founder Review Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {verificationRequests.map(req => (
              <div key={req.memberId} className="bg-black/50 border border-purple-500/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white">{req.name}</h4>
                    <p className="text-xs text-purple-300">{req.role}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{req.memberId} • {req.email}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {req.requestedAt.split(',')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleVerifyMember(req.memberId, true)}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve & Verify
                  </button>
                  <button
                    onClick={() => handleVerifyMember(req.memberId, false)}
                    className="py-1.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs cursor-pointer border border-red-500/30"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIEW NAVIGATION & SEARCH ================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'cards' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Member Directory
          </button>
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'hierarchy' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Team Structure (Hierarchy)
          </button>
          <button
            onClick={() => setViewMode('events')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'events' ? 'bg-cyan-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Flagship Events
          </button>
          <button
            onClick={() => setViewMode('live_site')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'live_site' ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/20' : 'text-cyan-300 hover:text-white bg-cyan-500/10 border border-cyan-500/30'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-current" /> Live Web App
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member, role, branch, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ================= VIEW 1: DIRECTORY CARDS ================= */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {/* Wings Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CAD_TEAMS_LIST.map(team => (
              <button
                key={team.id}
                onClick={() => setActiveTab(team.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === team.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{team.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeTab === team.id ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                }`}>
                  {team.id === 'all' 
                    ? members.length 
                    : members.filter(m => m.teamId === team.id || m.secondaryTeamId === team.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMembers.map(member => (
              <div 
                key={member.id}
                className="bg-gradient-to-b from-[#111928]/90 to-[#0b101c]/90 rounded-3xl p-5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
              >
                {/* Decorative glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>

                <div>
                  {/* Top Badge & ID */}
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                      {member.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {member.isVerified ? (
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avatar / Initials Aesthetic */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {/* Wreath circle halo */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover relative z-10 border-2 border-white/20 group-hover:scale-105 transition-transform shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a2538] to-[#0d1422] border-2 border-cyan-400/40 relative z-10 flex items-center justify-center font-black text-xl text-cyan-300 group-hover:scale-105 transition-transform shadow-lg select-none">
                        {member.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
                      </div>
                    )}
                  </div>

                  {/* Member Name & Role */}
                  <div className="text-center space-y-1 mb-3">
                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-gray-400 line-clamp-1 font-medium">
                      {member.branch} • {member.batch}
                    </p>
                  </div>

                  {/* Skills tags */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 mb-4">
                      {member.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => setQrModalMember(member)}
                    className="flex-1 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:border-cyan-400"
                  >
                    <QrCode className="w-3.5 h-3.5" /> View QR
                  </button>

                  <button
                    onClick={() => setSelectedMember(member)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
                    title="View Bio & Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {canEdit(member) && (
                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs transition-all cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl p-8 space-y-3">
              <Users className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No club members found</h3>
              <p className="text-xs text-gray-400">Try adjusting your search or wing filter category.</p>
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: TEAM STRUCTURE & HIERARCHY ================= */}
      {viewMode === 'hierarchy' && (
        <div className="space-y-8 bg-gradient-to-b from-[#0c1220] to-[#070b14] p-6 sm:p-10 rounded-3xl border border-white/10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black text-cyan-400 tracking-widest uppercase">One Connected Organization</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Complete Team Hierarchy</h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Clear reporting lines, executive direction, and multi-wing delivery governance across CAD & English Club.
            </p>
          </div>

          {/* Level 1: President & Vice President */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-950/60 p-4 rounded-3xl text-center shadow-xl border border-purple-400/40 backdrop-blur-md flex items-center justify-between gap-4">
              <img 
                src="/cad_club_photos/CAD-2026-001.jpg" 
                alt="M. Bharani Kumar Reddy" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shadow-md shrink-0" 
              />
              <div className="text-left flex-1">
                <span className="text-[10px] font-black uppercase text-purple-300 tracking-widest block">Executive Head</span>
                <h3 className="text-base font-black text-white">M. BHARANI KUMAR REDDY</h3>
                <p className="text-xs text-cyan-400 font-extrabold">PRESIDENT (CAD & English Club)</p>
              </div>
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-200 px-2 py-1 rounded-lg border border-purple-400/30">CAD-001</span>
            </div>

            <div className="w-0.5 h-6 bg-cyan-400"></div>

            <div className="w-full max-w-md bg-gradient-to-r from-blue-900/60 via-cyan-900/60 to-blue-950/60 p-4 rounded-3xl text-center shadow-xl border border-cyan-400/40 backdrop-blur-md flex items-center justify-between gap-4">
              <img 
                src="/cad_club_photos/CAD-2026-002.jpg" 
                alt="Shaik Sowban" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0" 
              />
              <div className="text-left flex-1">
                <span className="text-[10px] font-black uppercase text-cyan-300 tracking-widest block">Executive Operations</span>
                <h3 className="text-base font-black text-white">SHAIK SOWBAN</h3>
                <p className="text-xs text-cyan-300 font-extrabold">VICE PRESIDENT (CAD & English Club)</p>
              </div>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-200 px-2 py-1 rounded-lg border border-cyan-400/30">CAD-002</span>
            </div>
          </div>

          {/* Branching Lines */}
          <div className="relative border-t-2 border-cyan-500/40 pt-8 mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Branch: Office Bearers */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Shield className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Office Bearers (Direction & Governance)</h4>
              </div>
              <p className="text-xs text-gray-400">Finance • Creative • Documentation • Executive Coordination</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {members.filter(m => m.teamId === 'office_bearers' && m.id !== 'CAD-2026-001' && m.id !== 'CAD-2026-002').map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/40 border border-white/5 text-xs hover:border-cyan-500/30 transition-all">
                    <img 
                      src={m.avatar || `/cad_club_photos/${m.id}.jpg`} 
                      alt={m.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                    />
                    <div className="truncate flex-1">
                      <span className="font-bold text-white block truncate text-[11px]">{m.name}</span>
                      <span className="text-[10px] text-cyan-400 font-extrabold block truncate">{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Branch: Execution Teams */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Execution Teams (Ideas & Delivery)</h4>
              </div>
              <p className="text-xs text-gray-400">Content • Designing • PR & Logistics • Technical • Hosting</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {CAD_TEAMS_LIST.filter(t => t.id !== 'all' && t.id !== 'office_bearers').map(t => {
                  const lead = members.find(m => (m.teamId === t.id || m.secondaryTeamId === t.id) && m.role.toLowerCase().includes('lead'));
                  const count = members.filter(m => m.teamId === t.id || m.secondaryTeamId === t.id).length;
                  return (
                    <div key={t.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center gap-2">
                        {lead && (
                          <img 
                            src={lead.avatar || `/cad_club_photos/${lead.id}.jpg`} 
                            alt={lead.name}
                            className="w-9 h-9 rounded-xl object-cover border border-cyan-400 shrink-0"
                          />
                        )}
                        <div className="truncate flex-1">
                          <span className="text-[11px] font-black text-white block truncate">{t.name}</span>
                          <span className="text-[10px] text-cyan-400 font-bold block truncate">Lead: {lead ? lead.name : 'Assigned'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-400 border-t border-white/5 pt-1.5">
                        <span>Active Team Members</span>
                        <span className="font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.2 rounded">{count} members</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: EVENTS CALENDAR ================= */}
      {viewMode === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CAD_EVENTS_CALENDAR.map(evt => (
              <div key={evt.id} className="bg-gradient-to-br from-[#111928] to-[#0a0f1d] p-6 rounded-3xl border border-cyan-500/20 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                    {evt.badge}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{evt.id}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white leading-snug">{evt.title}</h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">{evt.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{evt.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIEW 4: EMBEDDED LIVE WEB APP ================= */}
      {viewMode === 'live_site' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#0b1322] border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>CAD & English Club Official Web App</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    LIVE
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Origin: <span className="text-cyan-300 font-mono">lumixora.in#cad&englishclub</span> • Host: <span className="font-mono text-gray-300">cad-english-club-gprec.web.app</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://cad-english-club-gprec.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
              >
                <span>Open Full Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setViewMode('cards')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Show Directory
              </button>
            </div>
          </div>

          <div className="w-full h-[82vh] rounded-3xl overflow-hidden border border-cyan-500/30 bg-black/80 shadow-2xl relative">
            <iframe
              src="https://cad-english-club-gprec.web.app/"
              title="CAD & English Club Portal"
              className="w-full h-full border-0"
              allow="camera; microphone; clipboard-read; clipboard-write; fullscreen"
            />
          </div>
        </div>
      )}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e1626] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img 
                src={selectedMember.avatar || `/cad_club_photos/${selectedMember.id}.jpg`} 
                alt={selectedMember.name} 
                className="w-18 h-18 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl shrink-0" 
              />
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {selectedMember.id}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{selectedMember.name}</h3>
                <p className="text-xs font-extrabold text-cyan-400 uppercase">{selectedMember.role}</p>
              </div>
            </div>

            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Wing / Division:</span>
                <span className="font-bold text-white">{selectedMember.wing}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Batch & Year:</span>
                <span className="font-bold text-white">{selectedMember.batch}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Branch & Dept:</span>
                <span className="font-bold text-white">{selectedMember.branch}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Institutional Email:</span>
                <span className="font-mono text-cyan-300">{selectedMember.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Verification Seal:</span>
                <span className="font-bold text-emerald-400">Verified by {selectedMember.verifiedBy || "Founder"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-gray-300">About & Bio</h4>
              <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
                {selectedMember.bio}
              </p>
            </div>

            {selectedMember.responsibilities && selectedMember.responsibilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-300">Key Responsibilities</h4>
                <ul className="space-y-1.5">
                  {selectedMember.responsibilities.map((r, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => { setSelectedMember(null); setQrModalMember(selectedMember); }}
                className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <QrCode className="w-4 h-4" /> Open Digital QR Badge
              </button>
              {canEdit(selectedMember) && (
                <button
                  onClick={() => { setSelectedMember(null); setEditingMember(selectedMember); }}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/10 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DIGITAL QR BADGE PASS MODAL ================= */}
      {qrModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b1322] border-2 border-cyan-500/40 rounded-3xl max-w-sm w-full p-6 space-y-5 text-center relative shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <button
              onClick={() => setQrModalMember(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Club Header in Badge */}
            <div className="space-y-1 border-b border-white/10 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest block">
                {CAD_CLUB_META.institution}
              </span>
              <h3 className="text-lg font-black text-white tracking-tight">{CAD_CLUB_META.name}</h3>
              <p className="text-xs text-blue-300 font-extrabold">{CAD_CLUB_META.motto}</p>
            </div>

            {/* Member Photo Header */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-left">
              <img 
                src={qrModalMember.avatar || `/cad_club_photos/${qrModalMember.id}.jpg`} 
                alt={qrModalMember.name} 
                className="w-14 h-14 rounded-xl object-cover border-2 border-cyan-400 shrink-0 shadow-md"
              />
              <div className="truncate flex-1">
                <h4 className="font-black text-white text-sm truncate">{qrModalMember.name}</h4>
                <p className="text-xs text-cyan-300 font-extrabold truncate">{qrModalMember.role}</p>
                <p className="text-[10px] text-gray-400 truncate">{qrModalMember.wing}</p>
              </div>
            </div>

            {/* Real High-Resolution Live Scannable QR Code */}
            <div className="bg-white p-3 rounded-3xl mx-auto w-56 h-56 shadow-2xl flex flex-col items-center justify-center relative group border-4 border-cyan-400/40">
              {qrModalDataUrl ? (
                <img 
                  src={qrModalDataUrl} 
                  alt={`QR Code for ${qrModalMember.name}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
              )}
            </div>

            <p className="text-[11px] text-center text-cyan-300 font-bold">
              ⚡ Real Scannable QR • Opens Public Pass (No Login Required)
            </p>

            <div className="space-y-1.5 text-left bg-black/60 p-4 rounded-2xl border border-white/10 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Member ID:</span>
                <span className="font-mono font-black text-cyan-400">{qrModalMember.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Full Name:</span>
                <span className="font-bold text-white">{qrModalMember.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Designation:</span>
                <span className="font-bold text-cyan-300">{qrModalMember.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Batch & Branch:</span>
                <span className="font-medium text-gray-300">{qrModalMember.batch} ({qrModalMember.branch})</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10">
                <span className="text-gray-400">Founder Auth:</span>
                <span className="font-black text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Verified by Shaik Sowban
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopyQRData(qrModalMember)}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 cursor-pointer transition-colors"
              >
                {copiedId === qrModalMember.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === qrModalMember.id ? 'Copied Data!' : 'Copy Pass'}</span>
              </button>

              <button
                onClick={() => {
                  if (showToast) showToast("📥 Downloaded CAD & English Club Verified Credential Badge!", "success");
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <Download className="w-4 h-4" /> Save Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TEST QR SCANNER / DECODER SIMULATOR ================= */}
      {qrScanView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0b1322] border-2 border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => { setQrScanView(false); setScannedData(null); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Digital Scanner Simulator</span>
              <h3 className="text-xl font-black text-white">Scan Member QR Badge</h3>
              <p className="text-xs text-gray-300">Select any member to simulate live QR decoding and official credential retrieval.</p>
            </div>

            {/* Quick Member Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Select Member to Scan:</label>
              <select
                onChange={(e) => {
                  const m = members.find(mem => mem.id === e.target.value);
                  if (m) setScannedData(m);
                }}
                className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                defaultValue=""
              >
                <option value="" disabled>-- Choose a Club Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role} • {m.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Decoded Output */}
            {scannedData && (
              <div className="bg-gradient-to-br from-emerald-950/40 via-cyan-950/40 to-blue-950/40 p-5 rounded-2xl border border-emerald-500/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={scannedData.avatar || `/cad_club_photos/${scannedData.id}.jpg`} 
                      alt={scannedData.name} 
                      className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-400 shadow-md shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase">
                        <CheckCircle2 className="w-4 h-4" /> Official Credential Decoded
                      </div>
                      <h4 className="text-sm font-black text-white">{scannedData.name}</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-black/40 text-cyan-300 px-2 py-1 rounded border border-white/10">{scannedData.id}</span>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  <p><span className="text-gray-400">Organization:</span> <span className="font-bold text-white">CAD & ENGLISH CLUB (GPREC)</span></p>
                  <p><span className="text-gray-400">Role:</span> <span className="font-extrabold text-cyan-400">{scannedData.role}</span></p>
                  <p><span className="text-gray-400">Team Wing:</span> <span className="text-gray-200">{scannedData.wing}</span></p>
                  <p><span className="text-gray-400">Batch & Branch:</span> <span className="text-gray-200">{scannedData.batch} ({scannedData.branch})</span></p>
                  <p><span className="text-gray-400">Motto:</span> <span className="text-blue-300 font-bold">{CAD_CLUB_META.motto}</span></p>
                  <p><span className="text-gray-400">Founder Signature:</span> <span className="text-emerald-300 font-black">Verified by Shaik Sowban</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT MEMBER PROFILE MODAL ================= */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e1626] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {editingMember.id}
              </span>
              <h3 className="text-xl font-black text-white mt-1">Edit Club Portfolio Profile</h3>
              <p className="text-xs text-gray-400">Modify your bio, skills, and club responsibilities.</p>
            </div>

            <form onSubmit={handleSaveMemberEdit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Full Name</label>
                <input
                  type="text"
                  disabled={!isFounder}
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Role & Designation</label>
                <input
                  type="text"
                  disabled={!isFounder}
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Bio & Statement</label>
                <textarea
                  rows="3"
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Share your background, passions, and contributions to the club..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Skills (comma separated)</label>
                <input
                  type="text"
                  value={(editingMember.skills || []).join(', ')}
                  onChange={(e) => setEditingMember({ 
                    ...editingMember, 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                  })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. CAD Modeling, Public Speaking, Figma, Python"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold">Avatar Image URL</label>
                <input
                  type="text"
                  value={editingMember.avatar || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://example.com/photo.jpg or /images/..."
                />
              </div>

              {isFounder && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-gray-300 font-bold">Verification Status:</span>
                  <button
                    type="button"
                    onClick={() => setEditingMember({ ...editingMember, isVerified: !editingMember.isVerified })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${
                      editingMember.isVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {editingMember.isVerified ? '✅ Verified (Edit Allowed)' : '❌ Revoked / Pending'}
                  </button>
                </div>
              )}

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-gray-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs cursor-pointer shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD NEW MEMBER MODAL (FOUNDER ONLY) ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e1626] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Founder Management</span>
              <h3 className="text-xl font-black text-white">Add New CAD & English Club Member</h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newMem = {
                  id: `CAD-2026-${String(members.length + 1).padStart(3, '0')}`,
                  name: form.name.value.toUpperCase().trim(),
                  role: form.role.value.trim(),
                  level: "Team Member",
                  teamId: form.teamId.value,
                  wing: CAD_TEAMS_LIST.find(t => t.id === form.teamId.value)?.name || "General Team",
                  batch: form.batch.value,
                  branch: form.branch.value,
                  email: form.email.value.toLowerCase().trim(),
                  avatar: "",
                  gender: form.gender.value,
                  isHead: false,
                  isVerified: true,
                  verifiedBy: "Founder Shaik Sowban",
                  verifiedAt: new Date().toISOString().split('T')[0],
                  skills: form.skills.value.split(',').map(s => s.trim()).filter(Boolean),
                  bio: form.bio.value.trim() || "Active member of CAD & English Club contributing to campus initiatives.",
                  responsibilities: ["Participates in regular club workshops and execution sprints."]
                };
                handleAddNewMember(newMem);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Full Name *</label>
                <input name="name" required placeholder="e.g. JOHN DOE" className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Role / Designation *</label>
                  <input name="role" required placeholder="e.g. Technical Member" className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Team Wing *</label>
                  <select name="teamId" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white">
                    {CAD_TEAMS_LIST.filter(t => t.id !== 'all').map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Batch & Year *</label>
                  <input name="batch" defaultValue="2024 - 2028 (2nd Year)" className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Branch / Dept *</label>
                  <input name="branch" defaultValue="Computer Science & Engineering" className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Official Email *</label>
                  <input name="email" type="email" required placeholder="roll.cad@gprec.ac.in" className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold">Gender</label>
                  <select name="gender" className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Skills (comma separated)</label>
                <input name="skills" placeholder="e.g. AutoCAD, Public Speaking, React" className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Bio</label>
                <textarea name="bio" rows="2" placeholder="Brief introduction..." className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white" />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-gray-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs"
                >
                  Add to Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

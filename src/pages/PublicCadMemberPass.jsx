import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Shield, CheckCircle2, Award, Calendar, Sparkles, Download, 
  Share2, ArrowLeft, ExternalLink, Mail, Phone, Cpu, UserCheck, 
  MapPin, Check, Layers, Users, BookOpen, QrCode, Copy, ShieldCheck,
  Compass, Zap, Lock
} from 'lucide-react';
import { CAD_CLUB_META, INITIAL_CAD_MEMBERS, CAD_TEAMS_LIST } from '../data/cadEnglishClubData';

export default function PublicCadMemberPass({ memberId: propMemberId, onBack }) {
  const [member, setMember] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('pass'); // 'pass' | 'about' | 'hierarchy'

  // Extract member ID from props, hash, or pathname
  useEffect(() => {
    let targetId = propMemberId;
    if (!targetId) {
      const hash = window.location.hash || '';
      if (hash.includes('cad-verify/')) {
        targetId = hash.split('cad-verify/')[1]?.split('?')[0]?.split('/')[0];
      } else if (hash.includes('cad-pass/')) {
        targetId = hash.split('cad-pass/')[1]?.split('?')[0]?.split('/')[0];
      } else if (hash.includes('verify/')) {
        targetId = hash.split('verify/')[1]?.split('?')[0]?.split('/')[0];
      }
    }

    if (!targetId) {
      targetId = 'CAD-2026-002'; // Default Sowban
    }

    // Try finding from localStorage first, else fallback to INITIAL_CAD_MEMBERS
    let found = null;
    try {
      const localData = localStorage.getItem('cad_english_club_members_v3') || localStorage.getItem('cad_english_club_members_v2') || localStorage.getItem('cad_english_club_members_v1');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          found = parsed.find(m => 
            m.id.toLowerCase() === targetId.toLowerCase() || 
            (m.name && m.name.toLowerCase().includes(targetId.toLowerCase()))
          );
        }
      }
    } catch (e) {}

    if (!found) {
      found = INITIAL_CAD_MEMBERS.find(m => 
        m.id.toLowerCase() === targetId.toLowerCase() ||
        (m.name && m.name.toLowerCase().includes(targetId.toLowerCase()))
      ) || INITIAL_CAD_MEMBERS[1]; // default Sowban
    }

    setMember(found);
  }, [propMemberId]);

  // Generate real scannable QR Code Data URL with optimal contrast and density
  useEffect(() => {
    if (!member) return;
    const origin = typeof window !== 'undefined' ? (window.location.origin || 'http://localhost:5173') : 'http://localhost:5173';
    const verifyUrl = `${origin}/#cad-verify/${member.id}`;

    QRCode.toDataURL(verifyUrl, {
      width: 400,
      margin: 1.5,
      color: {
        dark: '#030d1a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.warn("QR generation err:", err);
    });
  }, [member]);

  const handleShare = () => {
    const origin = typeof window !== 'undefined' ? (window.location.origin || 'http://localhost:5173') : 'http://localhost:5173';
    const verifyUrl = `${origin}/#cad-verify/${member?.id}`;
    if (navigator.share) {
      navigator.share({
        title: `${member?.name} - Verified CAD & English Club Pass`,
        text: `Official verified identity pass for ${member?.name} (${member?.role}) at CAD & English Club, GPREC.`,
        url: verifyUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(verifyUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleCopyEmail = () => {
    if (!member?.email) return;
    navigator.clipboard.writeText(member.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full"></div>
          <p className="text-xs text-cyan-300 font-mono tracking-widest uppercase animate-pulse">Loading Verified Pass...</p>
        </div>
      </div>
    );
  }

  const avatarSrc = member.avatar || `/cad_club_photos/${member.id}.jpg`;
  const isPresident = member.role.toLowerCase().includes('president') && !member.role.toLowerCase().includes('vice');
  const isVicePresident = member.role.toLowerCase().includes('vice president');

  return (
    <div className="min-h-screen bg-[#04070e] text-gray-100 font-sans p-3 sm:p-6 md:p-10 flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic Animated Ambient Glows & Mesh Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed top-1/3 -left-48 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl space-y-5 animate-fade-in">
        
        {/* Top Floating App Bar */}
        <header className="flex items-center justify-between bg-[#0a1120]/80 border border-white/10 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-xl">
          <button
            onClick={() => {
              if (onBack) onBack();
              else window.location.hash = '#dashboard';
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Portal Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Verified
            </span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav aria-label="Pass Navigation" className="flex items-center p-1.5 bg-[#090f1d]/90 border border-white/10 rounded-2xl gap-1.5 backdrop-blur-xl shadow-lg">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pass' 
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Digital ID Card</span>
          </button>
          
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'about' 
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Profile & Bio</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'hierarchy' 
                ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Org Chart</span>
          </button>
        </nav>

        {/* ================= TAB 1: LUXURY DIGITAL SMART PASS ================= */}
        {activeTab === 'pass' && (
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-cyan-500/40 via-blue-500/20 to-purple-600/30 shadow-[0_25px_70px_rgba(6,182,212,0.25)]">
            
            {/* Card Body with Glassmorphism */}
            <div className="bg-gradient-to-b from-[#0b1324] via-[#070e1b] to-[#050914] rounded-[22px] p-5 sm:p-8 space-y-6 relative overflow-hidden backdrop-blur-2xl">
              
              {/* Subtle metallic sheen watermark */}
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* CARD TOP BRANDING HEADER */}
              <div className="relative border-b border-white/10 pb-5 text-center space-y-2">
                {/* Institution & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{CAD_CLUB_META.institution}</span>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>SMART ID</span>
                  </div>
                </div>

                {/* Club Title & Motto */}
                <div className="pt-1">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                    {CAD_CLUB_META.name}
                  </h1>
                  <p className="text-xs font-black tracking-wider text-cyan-400 mt-1 uppercase">
                    {CAD_CLUB_META.motto}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {CAD_CLUB_META.tagline} • Official Vyomra Verified Pass
                  </p>
                </div>
              </div>

              {/* MEMBER HERO SHOWCASE */}
              <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-5 shadow-inner">
                {/* Avatar with luxury holographic circular ring */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black">
                      <img
                        src={avatarSrc}
                        alt={member.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/cad_club_photos/CAD-2026-002.jpg';
                        }}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  
                  {/* Verified floating badge */}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-1.5 rounded-full shadow-lg border-2 border-[#070e1b]" title="Verified Authentic Credentials">
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                  </div>
                </div>

                {/* Name, Designation & Wing */}
                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-500/40 shadow-sm">
                      {member.id}
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                      Officially Verified
                    </span>
                    {isPresident && (
                      <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/40">
                        President
                      </span>
                    )}
                    {isVicePresident && (
                      <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-500/40">
                        Vice President
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase truncate">
                    {member.name}
                  </h2>

                  <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                    {member.role}
                  </p>

                  <p className="text-xs text-gray-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{member.wing}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{member.batch}</span>
                  </p>
                </div>
              </div>

              {/* SCANNABLE QR CODE BADGE SECTION */}
              <div className="space-y-3">
                <div className="relative mx-auto w-64 h-64 p-3.5 rounded-3xl bg-gradient-to-b from-white via-gray-100 to-white shadow-[0_15px_40px_rgba(0,0,0,0.6)] border-4 border-cyan-400/40 flex flex-col items-center justify-center group">
                  
                  {/* Cyber Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-600"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-600"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-600"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-600"></div>

                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt={`QR Code for ${member.name}`}
                      className="w-full h-full object-contain rounded-xl transition-transform group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full"></div>
                      <span className="text-[10px] text-gray-700 font-bold">Generating Pass...</span>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs text-cyan-300 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Scan with any smartphone camera for instant verification</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium">
                    No login or authentication required for guest verification
                  </p>
                </div>
              </div>

              {/* DETAILED CREDENTIAL SPECIFICATION GRID */}
              <div className="bg-[#050811]/90 rounded-2xl border border-white/10 p-4 sm:p-5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Credential Attributes</span>
                  <span className="text-[10px] font-mono text-cyan-400">ID: {member.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Department */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-cyan-400" /> Department / Branch
                    </span>
                    <p className="font-bold text-white leading-snug">{member.branch}</p>
                  </div>

                  {/* Institutional Email */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-400" /> Institutional Email
                    </span>
                    <button 
                      onClick={handleCopyEmail}
                      className="font-mono text-cyan-300 hover:text-white truncate block text-left cursor-pointer transition-colors w-full"
                      title="Click to copy email"
                    >
                      {member.email}
                    </button>
                  </div>

                  {/* Leadership Wing */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <Layers className="w-3 h-3 text-purple-400" /> Executive Wing
                    </span>
                    <p className="font-bold text-cyan-300 leading-snug">{member.wing}</p>
                  </div>

                  {/* Governance Tier */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Governance Tier
                    </span>
                    <p className="font-bold text-purple-300 leading-snug">{member.level || 'Executive Leadership'}</p>
                  </div>
                </div>

                {/* Founder Endorsement Seal */}
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Official Authentication</span>
                      <span className="text-xs font-black text-emerald-300">Verified by Shaik Sowban (Founder)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 self-start sm:self-auto">
                    SEAL-2026-OK
                  </span>
                </div>
              </div>

              {/* ACTION TOOLBAR */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  onClick={handleShare}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer shadow-md"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Verification Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span>Share Verified Pass</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Badge</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: DETAILED PROFILE & BIO ================= */}
        {activeTab === 'about' && (
          <div className="bg-[#0b1324]/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-2xl shadow-xl animate-fade-in">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <img
                src={avatarSrc}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
              <div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {member.id}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{member.name}</h3>
                <p className="text-xs font-bold text-cyan-400">{member.role}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">Executive Statement</span>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                {member.bio}
              </p>
            </div>

            {member.skills && member.skills.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">Core Competencies & Skills</span>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.responsibilities && member.responsibilities.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">Key Responsibilities</span>
                <ul className="space-y-2">
                  {member.responsibilities.map((r, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: COMPLETE TEAM HIERARCHY ================= */}
        {activeTab === 'hierarchy' && (
          <div className="bg-[#0b1324]/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-2xl shadow-xl animate-fade-in">
            <div className="text-center space-y-1 border-b border-white/10 pb-4">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Leadership Chart</span>
              <h3 className="text-xl font-black text-white">CAD & English Club Hierarchy</h3>
              <p className="text-xs text-gray-400">G. Pulla Reddy Engineering College (Autonomous)</p>
            </div>

            <div className="space-y-3">
              {/* President */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="/cad_club_photos/CAD-2026-001.jpg" alt="President" className="w-12 h-12 rounded-full object-cover border-2 border-purple-400 shadow-md" />
                  <div>
                    <span className="text-xs font-black text-white block">M. BHARANI KUMAR REDDY</span>
                    <span className="text-[10px] text-purple-300 font-extrabold uppercase">PRESIDENT (Executive Head)</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-200 px-2 py-1 rounded border border-purple-400/30">CAD-001</span>
              </div>

              {/* Vice President */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="/cad_club_photos/CAD-2026-002.jpg" alt="Vice President" className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-md" />
                  <div>
                    <span className="text-xs font-black text-white block">SHAIK SOWBAN</span>
                    <span className="text-[10px] text-cyan-300 font-extrabold uppercase">VICE PRESIDENT (Platform Architect)</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-200 px-2 py-1 rounded border border-cyan-400/30">CAD-002</span>
              </div>

              {/* All Execution Teams */}
              <div className="pt-2">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider block mb-2.5">
                  Execution Wings & Member Count
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {CAD_TEAMS_LIST.filter(t => t.id !== 'all').map(t => {
                    const count = INITIAL_CAD_MEMBERS.filter(m => m.teamId === t.id || m.secondaryTeamId === t.id).length;
                    return (
                      <div key={t.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs hover:border-cyan-500/30 transition-all">
                        <span className="font-bold text-white block text-[11px] truncate">{t.name}</span>
                        <span className="text-[10px] text-cyan-400 font-semibold">{count} Active Members</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Credit & Authentication Note */}
        <footer className="text-center text-[11px] text-gray-500 pt-2 space-y-1 pb-6">
          <p>© 2026 CAD & ENGLISH CLUB • G. Pulla Reddy Engineering College (Autonomous)</p>
          <p className="text-[10px] text-cyan-400/80 font-bold flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Vyomra Autonomous Identity & Verification Protocol</span>
          </p>
        </footer>

      </div>
    </div>
  );
}

